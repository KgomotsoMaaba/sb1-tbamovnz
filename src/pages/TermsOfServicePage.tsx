import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto pt-8 px-4">
      <h1 className="text-3xl font-heading font-semibold mb-2">Terms of Service</h1>
      <p className="text-textSecondary dark:text-gray-400 mb-8">
        Last updated: {new Date().toLocaleDateString('en-ZA')}
      </p>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-heading font-semibold mb-4">Agreement to Terms</h2>
          <p className="mb-4">
            By accessing or using OpenCalendar, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-heading font-semibold mb-4">Use License</h2>
          <p className="mb-4">
            OpenCalendar grants you a limited license to access and use our platform for:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Viewing and managing directory listings</li>
            <li>Accessing public holiday and school term information</li>
            <li>Creating and managing your business listings</li>
            <li>Interacting with other users through our platform</li>
          </ul>
          <p className="mb-4">
            This license is subject to these Terms of Service and may be revoked at any time for violations of these terms.
          </p>
          <p className="mb-4">
            You may not:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Use our platform for any unlawful purpose</li>
            <li>Post false or misleading information</li>
            <li>Attempt to gain unauthorized access to any part of the service</li>
            <li>Copy or redistribute platform content without explicit permission</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-heading font-semibold mb-4">User Accounts</h2>
          <p className="mb-4">When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>
          <p className="mb-4">You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-heading font-semibold mb-4">User Responsibilities</h2>
          <p className="mb-4">When using our website, you agree to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Use our services only for lawful purposes and in accordance with these Terms</li>
            <li>Not use our services in any way that could damage, disable, overburden, or impair our servers or networks</li>
            <li>Not attempt to gain unauthorized access to any part of our website, other accounts, computer systems, or networks connected to our server</li>
            <li>Not use our services for any commercial purposes without our express written consent</li>
            <li>Verify critical dates with official government sources for important planning purposes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-heading font-semibold mb-4">Business Listings</h2>
          <p className="mb-4">Business owners are responsible for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Providing accurate business information</li>
            <li>Maintaining and updating their listings</li>
            <li>Ensuring compliance with local laws and regulations</li>
            <li>Responding to customer inquiries and feedback</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-heading font-semibold mb-4">Limitations</h2>
          <p className="mb-4">In no event shall OpenCalendar or its suppliers be liable for any damages arising out of the use or inability to use the materials on OpenCalendar's website, even if OpenCalendar or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-heading font-semibold mb-4">Changes to These Terms</h2>
          <p className="mb-4">We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
          <p className="mb-4">By continuing to access or use our website after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use our website.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-heading font-semibold mb-4">Governing Law</h2>
          <p className="mb-4">
            These terms and conditions are governed by and construed in accordance with the laws of South Africa, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-heading font-semibold mb-4">Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us via our{' '}
            <Link to="/contact" className="text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300">
              Contact page
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;