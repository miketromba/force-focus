import picomatch from 'picomatch';
import type { Pattern } from './types';

// Cache for compiled patterns to improve performance
const patternCache = new Map<string, (input: string) => boolean>();

/**
 * Normalize a URL for pattern matching
 * Returns both full URL (with query/hash) and base URL (without)
 */
export function normalizeUrl(url: string): { full: string; base: string } {
  try {
    const urlObj = new URL(url);
    // Remove trailing slash from pathname if it's just /
    const pathname = urlObj.pathname === '/' ? '' : urlObj.pathname;
    const base = `${urlObj.hostname}${urlObj.port ? ':' + urlObj.port : ''}${pathname}`;
    const full = `${base}${urlObj.search}${urlObj.hash}`;
    return { full, base };
  } catch {
    // If URL parsing fails, return as-is
    return { full: url, base: url };
  }
}

/**
 * Check if a URL matches a pattern
 */
export function matchPattern(url: string, pattern: string): boolean {
  const { full: fullUrl, base: baseUrl } = normalizeUrl(url);

  // Create cache key that includes the pattern
  const cacheKey = `pattern:${pattern}`;

  // Get or create compiled matcher
  let matcher = patternCache.get(cacheKey);
  if (!matcher) {
    try {
      // Convert pattern to work with normalized URLs
      let processedPattern = pattern;

      // Handle patterns with protocol - strip it
      if (processedPattern.includes('://')) {
        const parts = processedPattern.split('://');
        processedPattern = parts[1] || processedPattern;
      }

      // Convert trailing /* to /** for deep path matching
      // This allows github.com/* to match github.com/user/repo/issues
      if (processedPattern.endsWith('/*')) {
        processedPattern = processedPattern.slice(0, -2) + '/**';
      }

      // Create the picomatch matcher
      const picoMatcher = picomatch(processedPattern, {
        bash: false,
        dot: true,
      });

      // Wrap matcher to also match root when pattern ends with /**
      // e.g., github.com/** should also match github.com (no path)
      const basePattern = processedPattern.endsWith('/**')
        ? processedPattern.slice(0, -3)
        : null;

      matcher = (input: string) => {
        if (picoMatcher(input)) return true;
        // Also match the base domain if pattern ends with /**
        if (basePattern && (input === basePattern || input === basePattern + '/')) {
          return true;
        }
        return false;
      };

      patternCache.set(cacheKey, matcher);
    } catch {
      console.error(`Invalid pattern: ${pattern}`);
      return false;
    }
  }

  // Try matching with full URL first, then with base URL (without query params)
  // This allows patterns like "google.com/search/*" to match "google.com/search?q=foo"
  return matcher(fullUrl) || matcher(baseUrl);
}

/**
 * Check if a URL matches any of the enabled patterns
 */
export function isUrlAllowed(url: string, patterns: Pattern[]): boolean {
  // Check if URL matches any enabled pattern
  return patterns.some(p => {
    if (!p.enabled) return false;
    return matchPattern(url, p.pattern);
  });
}

/**
 * Generate pattern suggestions based on a URL
 */
export function generatePatternSuggestions(url: string): string[] {
  const suggestions: string[] = [];

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;

    // Exact URL (without query params for cleaner patterns)
    suggestions.push(normalizeUrl(url).base);

    // Domain only
    suggestions.push(hostname);

    // Domain with all paths
    suggestions.push(`${hostname}/*`);

    // Domain with subdomains
    if (!hostname.startsWith('www.')) {
      suggestions.push(`*.${hostname}`);
      suggestions.push(`*.${hostname}/*`);
    }

    // Current path and subdirectories
    if (pathname && pathname !== '/') {
      const pathParts = pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        let currentPath = hostname;
        pathParts.forEach((part, index) => {
          currentPath += '/' + part;
          if (index === pathParts.length - 1) {
            // Last part - might be a file
            suggestions.push(currentPath);
          } else {
            // Directory - add wildcard for subdirectories
            suggestions.push(`${currentPath}/*`);
          }
        });
      }
    }

    // With port if present
    if (urlObj.port) {
      suggestions.push(`${hostname}:${urlObj.port}`);
      suggestions.push(`${hostname}:${urlObj.port}/*`);
    }
  } catch {
    // If URL parsing fails, just return the original URL
    suggestions.push(url);
  }

  // Remove duplicates and return
  return [...new Set(suggestions)];
}

/**
 * Validate a pattern
 */
export function isValidPattern(pattern: string): boolean {
  if (!pattern || pattern.trim().length === 0) {
    return false;
  }

  try {
    picomatch(pattern);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear the pattern cache (useful when patterns are updated)
 */
export function clearPatternCache(): void {
  patternCache.clear();
}