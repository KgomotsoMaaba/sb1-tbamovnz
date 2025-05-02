import React from 'react';
import { Calendar, Users, Globe, Heart, Target, Shield, Sparkles, Zap } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto pt-8 px-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl mb-16">
        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
          alt="Team collaboration"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-accent-900/90 to-accent-800/50 flex items-center">
          <div className="max-w-2xl mx-8">
            <h1 className="text-5xl font-heading font-bold text-white mb-6">
              Discover South Africa's Hidden Gems
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              OpenCalendar connects adventurers with extraordinary experiences across our beautiful country. 
              We're more than just a calendar - we're your gateway to discovery.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <span className="inline-block px-4 py-2 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-300 font-medium text-sm mb-4">
            Our Mission
          </span>
          <h2 className="text-3xl font-heading font-bold mb-6">
            Empowering Local Adventures
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            We believe every corner of South Africa holds incredible opportunities for adventure and connection. 
            Our platform brings these experiences to life, making it easier than ever to discover, plan, and 
            share amazing moments.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-primary-700 dark:text-primary-300" />
              </div>
              <div>
                <h3 className="font-heading font-semibold mb-1">Local Focus</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Showcasing the best of South African businesses and experiences
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-secondary-700 dark:text-secondary-300" />
              </div>
              <div>
                <h3 className="font-heading font-semibold mb-1">Trusted Platform</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Verified listings and authentic community reviews
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg"
            alt="South African landscape"
            className="rounded-2xl shadow-xl"
          />
          <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent-700 dark:text-accent-300" />
              </div>
              <div>
                <h4 className="font-heading font-semibold">1000+</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Local Experiences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300 font-medium text-sm mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl font-heading font-bold mb-4">
            Everything You Need to Plan Your Next Adventure
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our platform combines powerful features with local insights to make your planning seamless and enjoyable.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6 text-primary-700 dark:text-primary-300" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-3">Smart Calendar</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Intelligent scheduling with public holidays and school terms integration for perfect timing.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-secondary-700 dark:text-secondary-300" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-3">Community Driven</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with fellow adventurers and share experiences in our vibrant community.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-accent-700 dark:text-accent-300" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-3">Real-time Updates</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Stay informed with instant notifications about new events and opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent-600 to-accent-500 p-12 mb-16">
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of South Africans discovering amazing experiences every day.
          </p>
          <button className="bg-white text-accent-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Get Started
          </button>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"></div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;