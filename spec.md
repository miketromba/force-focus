# Force Focus - Product Specification

## Product Vision

Force Focus is a Chrome extension that enforces deep work by blocking all web activities except those matching whitelisted patterns, based on your daily focus goal.

## Core Concept

The extension operates on a simple principle: **Nothing is accessible until you commit to a focused goal for the day, and once committed, only activities matching your whitelist patterns are permitted.**

## Key Features

### 1. Daily Focus Lock
- **Initial State**: Browser is completely blocked upon starting a new day
- **Unlock Mechanism**: User must set a clear, specific focus goal for the day
- **Goal Persistence**: Focus goal remains active for the entire day (resets at midnight or configurable time)
- **Goal Display**: Current focus goal is always visible in the extension interface

### 2. Pattern-Based Filtering

#### Whitelist System
- **Glob Pattern Matching**: Support for flexible URL patterns
- **Pattern Examples**:
  - Full domain: `github.com`
  - Subdomain wildcards: `*.stackoverflow.com`
  - Path patterns: `github.com/myusername/*`
  - Protocol specific: `https://secure-site.com/*`
  - Port specifications: `localhost:3000`, `localhost:*`
  - File extensions: `*.pdf`, `file://*.html`
- **Instant Decisions**: All filtering done via pattern matching
- **Default Patterns**: Pre-configured patterns for common developer tools

### 3. Smart Blocking Interface

When a blocked resource is accessed, the user sees:
- **Clear blocking message** with current focus goal reminder
- **Three action options**:
  1. "I've completed my focus task" → Unlocks browser for free browsing
  2. "This is actually relevant" → Option to add current URL/domain to whitelist
  3. "You're right, back to work" → Returns to previous page or new tab

### 4. Configuration System

#### Whitelist Pattern Management
- **Add/Remove Patterns**: Easy management through extension popup
- **Pattern Testing**: Tool to test if a URL matches existing patterns
- **Import/Export**: Share configurations between devices
- **Quick Actions**:
  - "Add current domain" button
  - "Add current page" button
  - "Add domain with all subdomains" button

### 5. Progress Tracking

- **Daily focus time**: Track time spent on whitelisted activities
- **Blocked attempts**: Count and list of blocked URLs attempted
- **Goal completion**: Self-reported completion status
- **Streak tracking**: Consecutive days of completing focus goals
- **Weekly summary**: Review of focus patterns and achievements

## User Flows

### Initial Setup Flow
1. Install extension
2. Extension blocks all browser activity
3. Prompt: "Set your focus goal for today"
4. User enters specific, measurable goal
5. Configuration wizard:
   - Add essential domains to whitelist
   - Test pattern configuration with sample URLs
6. Browser unlocks with restrictions active

### Daily Usage Flow
1. **Morning Start**
   - Browser blocked until daily goal is set
   - Previous day's goal shown for reference
   - Option to continue yesterday's goal or set new one

2. **During Focus Time**
   - Whitelisted sites work normally
   - Non-whitelisted sites immediately blocked
   - Extension icon shows active/blocked status

3. **Handling Blocks**
   - User attempts to visit blocked site
   - Intervention screen appears with:
     - Current focus goal
     - URL being blocked
     - Options to proceed
   - User makes conscious choice

4. **Task Completion**
   - User indicates task completion
   - Browser enters unrestricted mode
   - Option to set new focus goal
   - Progress acknowledgment

### Configuration Update Flow
1. Click extension icon in toolbar
2. Access pattern configuration
3. Add/modify/remove patterns
4. Test patterns with URL tester
5. Changes take effect immediately

## Blocking Interface Details

### Overlay System
- **Implementation**: Full-screen overlay at maximum z-index that covers entire page content
- **Behavior**: Page loads underneath but is completely inaccessible
- **Visual Design**: Semi-transparent dark background with centered blocking message
- **Content**:
  - Current focus goal prominently displayed
  - URL that triggered the block
  - Action buttons for user response
  - Today's statistics (focus time, blocked attempts)

### Whitelist Addition Interface
When user chooses to add to whitelist:
1. **Pattern Options**:
   - Exact URL: `https://example.com/specific/page`
   - Current domain: `example.com`
   - Domain with subdomains: `*.example.com`
   - Custom pattern: User-defined glob
2. **Scope Options**:
   - Just for today
   - Permanent addition
3. **Confirmation**: Show what will be allowed with this pattern

## Edge Cases & Considerations

1. **Emergency Override**: Panic button for urgent situations (with friction to prevent abuse)
2. **New Tab Behavior**: Decide if new tab page should be blocked or show focus dashboard
3. **Multi-goal Days**: Support for switching between different focus contexts
4. **Research Tasks**: More permissive pattern set for exploration-heavy work
5. **Meeting/Call Exceptions**: Quick pause button for video calls
6. **Incognito Mode**: Configuration for whether rules apply in private browsing
7. **Multiple Windows**: Consistent blocking across all browser windows
8. **Developer Tools**: Allow localhost and development servers by default