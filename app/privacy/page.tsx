import Image from 'next/image';
import Link from 'next/link';
import '../styles/privacy.css';

export default function Privacy() {
  return (
    <div className="privacy-container">
      <div className="privacy-content">
        <div className="privacy-header">
          <Image
            src="/greenleaf.png"
            alt="Green Leaf Logo"
            width={60}
            height={60}
            className="privacy-logo"
            priority
          />
          <h1 className="privacy-title">
            Privacy Policy
          </h1>
          <h2 className="privacy-subtitle">
            Project Green Leaf
          </h2>
        </div>

        <div className="privacy-prose">
          <section className="privacy-section">
            <h3 className="privacy-section-title">Information Collection and Use</h3>
            <p className="privacy-text">
              Project Green Leaf collects personal information solely for research recruitment purposes. 
              When you submit an application through our recruiting page, we collect:
            </p>
            <ul className="privacy-list">
              <li>Your full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Date and time of submission</li>
              <li>IP address (for security purposes)</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3 className="privacy-section-title">How We Use Your Information</h3>
            <p className="privacy-text">
              Your personal information is used exclusively for the following purposes:
            </p>
            <ul className="privacy-list">
              <li>Contacting you about Project Green Leaf research opportunities</li>
              <li>Evaluating your eligibility for participation in our research studies</li>
              <li>Scheduling interviews or research sessions</li>
              <li>Providing updates about the project status</li>
              <li>Maintaining records for research compliance purposes</li>
            </ul>
            <p className="privacy-text">
              <strong>We will never use your information for marketing, advertising, or any commercial purposes unrelated to Project Green Leaf research.</strong>
            </p>
          </section>

          <section className="privacy-section">
            <h3 className="privacy-section-title">Information Sharing</h3>
            <p className="privacy-text">
              We are committed to protecting your privacy. Your personal information will:
            </p>
            <ul className="privacy-list">
              <li><strong>Never be sold</strong> to third parties</li>
              <li><strong>Never be shared</strong> with external organizations for their own purposes</li>
              <li><strong>Never be used</strong> for unsolicited communications</li>
              <li>Only be accessed by authorized Project Green Leaf research team members</li>
              <li>Only be shared with institutional review boards or ethics committees as required for research oversight</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3 className="privacy-section-title">Data Security</h3>
            <p className="privacy-text">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="privacy-list">
              <li>Encrypted data transmission and storage</li>
              <li>Secure database with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Limited access on a need-to-know basis</li>
              <li>Phone numbers are hashed for additional security</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3 className="privacy-section-title">Data Retention</h3>
            <p className="privacy-text">
              Your personal information will be retained only as long as necessary for Project Green Leaf research purposes. 
              Typically, this means your information will be kept for the duration of the active recruitment period and 
              any ongoing research studies you may participate in, plus any additional time required by institutional 
              record-keeping policies or legal requirements.
            </p>
          </section>

          <section className="privacy-section">
            <h3 className="privacy-section-title">Your Rights</h3>
            <p className="privacy-text">You have the right to:</p>
            <ul className="privacy-list">
              <li>Request access to your personal information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to research requirements)</li>
              <li>Withdraw from consideration for Project Green Leaf at any time</li>
              <li>Ask questions about how your information is used</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3 className="privacy-section-title">Contact Information</h3>
            <p className="privacy-text">
              If you have questions about this privacy policy or how your information is handled, 
              please contact the Project Green Leaf research team:
            </p>
            <div className="privacy-contact-box">
              <p><strong>Project Green Leaf Research Contact</strong></p>
              <p>matt@thevertexfoundation.com</p>
            </div>
          </section>

          <section className="privacy-section">
            <h3 className="privacy-section-title">Changes to This Policy</h3>
            <p className="privacy-text">
              This privacy policy may be updated periodically to reflect changes in our research practices 
              or legal requirements. Any significant changes will be communicated to participants who have 
              provided their contact information. The effective date of this policy is displayed below.
            </p>
          </section>

          <div className="privacy-divider">
            <p className="privacy-date">
              <strong>Effective Date:</strong> September 14, 2025
            </p>
          </div>
        </div>

        <div className="privacy-back-button">
          <Link 
            href="/recruiting"
            className="privacy-back-link"
          >
            ← Back to Application
          </Link>
        </div>
      </div>
    </div>
  );
}
