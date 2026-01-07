import { Link } from "../components/Router";

export function Privacy() {
  return (
    <div className="max-w-[700px]">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-text-muted mb-8">Last updated: January 7, 2025</p>

      <p className="mb-4 text-text-secondary">
        Flame Lab LLC ("we," "our," or "us") operates the Force Focus browser extension. This
        Privacy Policy explains how we handle information when you use our extension.
      </p>

      <Section title="Information We Collect">
        <p>
          Force Focus does not collect, store, or transmit any personal information. All data
          created by the extension—including your focus goals, whitelist patterns, and
          settings—is stored locally on your device using the browser's built-in storage APIs.
        </p>
      </Section>

      <Section title="Data Storage">
        <p>The following data is stored locally on your device:</p>
        <ul className="list-disc ml-6 mb-4 text-text-secondary">
          <li className="mb-2">
            <strong className="text-text">Focus Goals:</strong> The daily goals you set for yourself
          </li>
          <li className="mb-2">
            <strong className="text-text">Whitelist Patterns:</strong> The URL patterns you create to allow
            specific websites
          </li>
          <li className="mb-2">
            <strong className="text-text">Settings:</strong> Your preferences such as the daily reset time
          </li>
        </ul>
        <p>
          This data never leaves your device unless you explicitly export it using the extension's
          export feature.
        </p>
      </Section>

      <Section title="Data We Do Not Collect">
        <p>We do not collect:</p>
        <ul className="list-disc ml-6 mb-4 text-text-secondary">
          <li className="mb-2">Your browsing history</li>
          <li className="mb-2">URLs of websites you visit (blocked or allowed)</li>
          <li className="mb-2">Personal identification information</li>
          <li className="mb-2">Usage analytics or telemetry</li>
          <li className="mb-2">Device identifiers or fingerprints</li>
        </ul>
      </Section>

      <Section title="Third-Party Services">
        <p>
          Force Focus does not integrate with any third-party services, analytics platforms, or
          advertising networks. The extension operates entirely offline and locally.
        </p>
      </Section>

      <Section title="Data Sync">
        <p>
          If you use Chrome's sync feature, some extension settings may sync across your devices
          through your Google account. This sync is handled entirely by your browser and Google's
          infrastructure, not by us. We have no access to this synced data.
        </p>
      </Section>

      <Section title="Children's Privacy">
        <p>
          Force Focus does not knowingly collect any information from children under 13 years of
          age. Since we do not collect any personal information from any users, there is no special
          risk to children using this extension.
        </p>
      </Section>

      <Section title="Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify users of any material
          changes by updating the "Last updated" date at the top of this policy. Your continued use
          of the extension after any changes constitutes acceptance of the updated policy.
        </p>
      </Section>

      <Section title="Open Source">
        <p>
          Force Focus is open source software. You can review the complete source code to verify
          our privacy practices at any time.
        </p>
      </Section>

      <Section title="Contact Us">
        <p>
          If you have any questions about this Privacy Policy, please contact us through our{" "}
          <Link href="/support">support page</Link>.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h2 className="text-xl font-semibold mt-8 mb-3 text-text">{title}</h2>
      <div className="text-text-secondary [&>p]:mb-4">{children}</div>
    </>
  );
}
