import type { Route } from "./+types/privacy";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy Policy - Lazada Lite" },
    { name: "description", content: "Privacy policy for Lazada Lite platform" },
  ];
}

export default function Privacy() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-gray-900 mb-8'>
          Privacy Policy
        </h1>

        <div className='prose prose-lg max-w-none'>
          <p className='text-lg text-gray-600 mb-8'>
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className='bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8'>
            <h2 className='text-xl font-semibold text-gray-900 mb-2'>
              Educational Project Notice
            </h2>
            <p className='text-gray-700'>
              This is a student project created for educational purposes. This
              privacy policy is provided as an example of what a real e-commerce
              platform would include. No real personal data is collected or
              processed.
            </p>
          </div>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              Information We Collect
            </h2>
            <p className='text-gray-600 mb-4'>
              In a production environment, we would collect the following types
              of information:
            </p>
            <ul className='list-disc list-inside text-gray-600 space-y-2'>
              <li>
                <strong>Account Information:</strong> Username, email, name, and
                business details
              </li>
              <li>
                <strong>Profile Data:</strong> Profile pictures, addresses, and
                hub preferences
              </li>
              <li>
                <strong>Transaction Data:</strong> Order history, payment
                information, and shipping details
              </li>
              <li>
                <strong>Usage Data:</strong> How you interact with our platform
                and services
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, IP address,
                and device identifiers
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              How We Use Your Information
            </h2>
            <p className='text-gray-600 mb-4'>
              In a production environment, collected information would be used
              to:
            </p>
            <ul className='list-disc list-inside text-gray-600 space-y-2'>
              <li>Provide and maintain our e-commerce services</li>
              <li>Process transactions and manage orders</li>
              <li>Communicate with users about their accounts and orders</li>
              <li>Improve our platform and user experience</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              Data Security
            </h2>
            <p className='text-gray-600 mb-4'>
              We would implement appropriate security measures to protect your
              personal information, including:
            </p>
            <ul className='list-disc list-inside text-gray-600 space-y-2'>
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Secure data storage and backup procedures</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              Your Rights
            </h2>
            <p className='text-gray-600 mb-4'>
              In compliance with privacy regulations, users would have the right
              to:
            </p>
            <ul className='list-disc list-inside text-gray-600 space-y-2'>
              <li>Access their personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete their account and associated data</li>
              <li>Port their data to another service</li>
              <li>Object to certain data processing activities</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              Cookies and Tracking
            </h2>
            <p className='text-gray-600 mb-4'>
              We would use cookies and similar technologies to:
            </p>
            <ul className='list-disc list-inside text-gray-600 space-y-2'>
              <li>Remember user preferences and login status</li>
              <li>Analyze platform usage and performance</li>
              <li>Provide personalized content and recommendations</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              Third-Party Services
            </h2>
            <p className='text-gray-600 mb-4'>
              In a production environment, we might integrate with third-party
              services for:
            </p>
            <ul className='list-disc list-inside text-gray-600 space-y-2'>
              <li>Payment processing</li>
              <li>Shipping and logistics</li>
              <li>Analytics and performance monitoring</li>
              <li>Customer support tools</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              Contact Information
            </h2>
            <p className='text-gray-600'>
              For any privacy-related questions or concerns about this
              educational project, please contact your instructor or refer to
              the course materials.
            </p>
          </section>

          <div className='bg-gray-50 border border-gray-200 rounded-lg p-6'>
            <p className='text-sm text-gray-600'>
              This privacy policy is created for educational purposes as part of
              a Full Stack Development course. In a real application, you would
              need to comply with applicable privacy laws such as GDPR, CCPA,
              and local data protection regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
