import { Link } from "../components/Router";

export function Terms() {
  return (
    <div className="max-w-[700px]">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-text-muted mb-8">Last updated: January 7, 2025</p>

      <p className="mb-4 text-text-secondary">
        These Terms of Service ("Terms") govern your use of the Force Focus browser extension
        ("Extension") provided by Flame Lab LLC ("we," "our," or "us"). By installing or using the
        Extension, you agree to be bound by these Terms.
      </p>

      <Section title="1. Acceptance of Terms">
        <p>
          By installing, accessing, or using Force Focus, you acknowledge that you have read,
          understood, and agree to be bound by these Terms. If you do not agree to these Terms, do
          not install or use the Extension.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          Force Focus is a browser extension designed to help users improve their productivity by:
        </p>
        <ul className="list-disc ml-6 mb-4 text-text-secondary">
          <li className="mb-2">Requiring users to set daily focus goals</li>
          <li className="mb-2">Blocking access to websites not on a user-defined whitelist</li>
          <li className="mb-2">
            Displaying reminders of the user's stated goals when visiting blocked sites
          </li>
        </ul>
        <p>
          The Extension operates locally on your device and does not require an account or internet
          connection to function.
        </p>
      </Section>

      <Section title="3. License">
        <p>
          Force Focus is provided as open source software. Subject to these Terms, we grant you a
          limited, non-exclusive, non-transferable, revocable license to install and use the
          Extension for personal, non-commercial purposes.
        </p>
      </Section>

      <Section title="4. User Responsibilities">
        <p>You are responsible for:</p>
        <ul className="list-disc ml-6 mb-4 text-text-secondary">
          <li className="mb-2">
            Ensuring the Extension is suitable for your needs before relying on it
          </li>
          <li className="mb-2">
            Maintaining backups of your whitelist patterns and settings if desired
          </li>
          <li className="mb-2">
            Understanding that the Extension may interfere with your normal browsing experience by
            design
          </li>
          <li className="mb-2">
            Any consequences of using the Extension, including inability to access certain websites
            while focus mode is active
          </li>
        </ul>
      </Section>

      <Section title="5. No Warranties">
        <p className="uppercase text-sm">
          The Extension is provided "as is" and "as available" without warranties of any kind,
          either express or implied, including but not limited to implied warranties of
          merchantability, fitness for a particular purpose, and non-infringement.
        </p>
        <p>We do not warrant that:</p>
        <ul className="list-disc ml-6 mb-4 text-text-secondary">
          <li className="mb-2">The Extension will meet your specific requirements</li>
          <li className="mb-2">
            The Extension will be uninterrupted, timely, secure, or error-free
          </li>
          <li className="mb-2">
            The Extension will be compatible with all browsers or browser versions
          </li>
          <li className="mb-2">Any defects in the Extension will be corrected</li>
        </ul>
      </Section>

      <Section title="6. Limitation of Liability">
        <p className="uppercase text-sm">
          To the maximum extent permitted by applicable law, in no event shall Flame Lab LLC, its
          officers, directors, employees, or agents be liable for any indirect, incidental,
          special, consequential, or punitive damages, or any loss of profits or revenues, whether
          incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible
          losses, resulting from:
        </p>
        <ul className="list-disc ml-6 mb-4 text-text-secondary">
          <li className="mb-2">Your use or inability to use the Extension</li>
          <li className="mb-2">Any unauthorized access to or alteration of your data</li>
          <li className="mb-2">Any interruption or cessation of the Extension's functionality</li>
          <li className="mb-2">
            Any bugs, viruses, or other harmful code that may be transmitted through the Extension
          </li>
        </ul>
      </Section>

      <Section title="7. Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless Flame Lab LLC and its officers,
          directors, employees, and agents from and against any claims, liabilities, damages,
          losses, costs, or expenses (including reasonable attorneys' fees) arising out of or in
          any way connected with your use of the Extension or violation of these Terms.
        </p>
      </Section>

      <Section title="8. Modifications to the Extension">
        <p>
          We reserve the right to modify, suspend, or discontinue the Extension at any time without
          notice. We shall not be liable to you or any third party for any modification, suspension,
          or discontinuation of the Extension.
        </p>
      </Section>

      <Section title="9. Changes to Terms">
        <p>
          We may revise these Terms from time to time. The most current version will always be
          posted on this page with the updated "Last updated" date. By continuing to use the
          Extension after any revisions become effective, you agree to be bound by the revised
          Terms.
        </p>
      </Section>

      <Section title="10. Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the United
          States, without regard to its conflict of law provisions.
        </p>
      </Section>

      <Section title="11. Severability">
        <p>
          If any provision of these Terms is found to be unenforceable or invalid, that provision
          shall be limited or eliminated to the minimum extent necessary so that these Terms shall
          otherwise remain in full force and effect.
        </p>
      </Section>

      <Section title="12. Entire Agreement">
        <p>
          These Terms constitute the entire agreement between you and Flame Lab LLC regarding the
          use of the Extension and supersede all prior agreements and understandings.
        </p>
      </Section>

      <Section title="13. Contact">
        <p>
          If you have any questions about these Terms, please contact us through our{" "}
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
