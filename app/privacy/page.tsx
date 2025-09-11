import Image from 'next/image';
import Link from 'next/link';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Image
            src="/greenleaf.png"
            alt="Green Leaf Logo"
            width={60}
            height={60}
            className="mx-auto mb-4"
            priority
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Privacy Policy
          </h1>
          <h2 className="text-lg text-gray-600">
            Project Green Leaf
          </h2>
        </div>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Information Collection and Use</h3>
            <p className="text-gray-600 mb-4">
              Project Green Leaf collects personal information solely for research recruitment purposes. 
              When you submit an application through our recruiting page, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Your full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Date and time of submission</li>
              <li>IP address (for security purposes)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">How We Use Your Information</h3>
            <p className="text-gray-600 mb-4">
              Your personal information is used exclusively for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Contacting you about Project Green Leaf research opportunities</li>
              <li>Evaluating your eligibility for participation in our research studies</li>
              <li>Scheduling interviews or research sessions</li>
              <li>Providing updates about the project status</li>
              <li>Maintaining records for research compliance purposes</li>
            </ul>
            <p className="text-gray-600">
              <strong>We will never use your information for marketing, advertising, or any commercial purposes unrelated to Project Green Leaf research.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Information Sharing</h3>
            <p className="text-gray-600 mb-4">
              We are committed to protecting your privacy. Your personal information will:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li><strong>Never be sold</strong> to third parties</li>
              <li><strong>Never be shared</strong> with external organizations for their own purposes</li>
              <li><strong>Never be used</strong> for unsolicited communications</li>
              <li>Only be accessed by authorized Project Green Leaf research team members</li>
              <li>Only be shared with institutional review boards or ethics committees as required for research oversight</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Data Security</h3>
            <p className="text-gray-600 mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Encrypted data transmission and storage</li>
              <li>Secure database with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Limited access on a need-to-know basis</li>
              <li>Phone numbers are hashed for additional security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Data Retention</h3>
            <p className="text-gray-600">
              Your personal information will be retained only as long as necessary for Project Green Leaf research purposes. 
              Typically, this means your information will be kept for the duration of the active recruitment period and 
              any ongoing research studies you may participate in, plus any additional time required by institutional 
              record-keeping policies or legal requirements.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Rights</h3>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Request access to your personal information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to research requirements)</li>
              <li>Withdraw from consideration for Project Green Leaf at any time</li>
              <li>Ask questions about how your information is used</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
            <p className="text-gray-600 mb-4">
              If you have questions about this privacy policy or how your information is handled, 
              please contact the Project Green Leaf research team:
            </p>
            <div className="bg-gray-50 p-4 rounded-md text-gray-600">
              <p><strong>Project Green Leaf Research Team</strong></p>
              <p>Email: [Contact Email]</p>
              <p>Phone: [Contact Phone]</p>
              <p>Address: [Institution Address]</p>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Changes to This Policy</h3>
            <p className="text-gray-600">
              This privacy policy may be updated periodically to reflect changes in our research practices 
              or legal requirements. Any significant changes will be communicated to participants who have 
              provided their contact information. The effective date of this policy is displayed below.
            </p>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500 text-center">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/recruiting"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            ← Back to Application
          </Link>
        </div>
      </div>
    </div>
  );
}
