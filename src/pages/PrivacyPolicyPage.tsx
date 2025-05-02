import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto pt-8 px-4">
      <h1 className="text-3xl font-heading font-semibold mb-2">Privacy Policy</h1>
      <p className="text-textSecondary dark:text-gray-400 mb-8">
        Last updated: {new Date().toLocaleDateString('en-ZA')}
      </p>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-heading font-semibold mb-4">Introduction</h2>
          <p className="mb-4">
            OpenCalendar ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-heading font-semibold mb-4">Information We Collect</h2>
          <h3 className="text-xl font-heading font-medium mb-2">Personal Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Name and contact information</li>
            <li>Email address</li>
            <li>Phone number (optional)</li>
            <li>Business information (if applicable)</li>
          </ul>

          <h3 className="text-xl font-heading font-medium mb-2">Usage Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and features used</li>
            <li>Time and date of visits</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-heading font-semibold mb-4">How We Use Your Information</h2>
          <p className="mb-4">We use the collected information for various purposes, including:</p>
          <ul className="list-disc pl-6">
            <li>Providing and maintaining our services</li>
            <li>Improving user experience</li>
            <li>Communicating with you about updates and changes</li>
            <li>Processing transactions and bookings</li>
            <li>Analyzing usage patterns and trends</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-heading font-semibold mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-heading font-semibold mb-4">Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing of your information</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-heading font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us via our{' '}
            <Link to="/contact" className="text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300">
              Contact page
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;