import { useState } from "react";

export function Support() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Support</h1>
      <p className="text-text-muted mb-8">Need help with Force Focus? Here's how to get assistance.</p>

      <SupportSection title="Report a Bug or Request a Feature">
        <p>
          Force Focus is open source. The best way to report bugs or request features is through
          our GitHub repository.
        </p>
        <a
          href="https://github.com/miketromba/force-focus/issues"
          className="inline-block mt-4 px-4 py-2 rounded-lg text-sm font-semibold bg-surface-elevated text-text-secondary border border-border-light hover:bg-border-light hover:no-underline transition-all"
          target="_blank"
          rel="noopener"
        >
          Open an Issue on GitHub
        </a>
      </SupportSection>

      <SupportSection title="Common Questions">
        <Question question="How do I reset my focus goal?">
          Click the Force Focus icon in your browser toolbar, then click "Complete Session" to end
          your current focus session. The next time you open your browser, you'll be prompted to
          set a new goal.
        </Question>
        <Question question="How do I add a site to my whitelist?">
          When you visit a blocked site, the blocking overlay includes an "Allow this site" option.
          You can choose to allow just the exact page, the entire domain, or the domain including
          subdomains.
        </Question>
        <Question question="When does my focus session reset?">
          By default, your session resets daily at 4 AM. You can change this time in the extension
          settings.
        </Question>
        <Question question="Can I export my whitelist?">
          Yes. Open the extension popup, go to Settings, and click "Export Configuration" to
          download your patterns and settings as a JSON file.
        </Question>
      </SupportSection>

      <SupportSection title="Contact">
        <p className="mb-4">
          For other inquiries, you can reach us via email. Click the button below to reveal the
          email address.
        </p>
        <EmailReveal />
      </SupportSection>
    </div>
  );
}

function SupportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
      <h2 className="text-base font-semibold mb-3 text-text">{title}</h2>
      <div className="text-sm text-text-muted">{children}</div>
    </div>
  );
}

function Question({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <p className="mb-4 last:mb-0">
      <strong className="text-text-secondary">{question}</strong>
      <br />
      {children}
    </p>
  );
}

function EmailReveal() {
  const [revealed, setRevealed] = useState(false);

  // Email is encoded to prevent simple bot scraping
  // Stored as reversed + base64
  const encoded = "b2kuYmFsZW1hbGZAZWtpbQ==";

  const decodeEmail = () => {
    const decoded = atob(encoded).split("").reverse().join("");
    return decoded;
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  if (!revealed) {
    return (
      <button
        onClick={handleReveal}
        className="px-6 py-3 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-hover transition-all cursor-pointer"
      >
        Show Email Address
      </button>
    );
  }

  const email = decodeEmail();
  return (
    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg font-mono text-sm">
      <a href={`mailto:${email}`} className="text-primary">
        {email}
      </a>
    </div>
  );
}
