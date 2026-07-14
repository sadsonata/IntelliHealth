import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Activity, Users, Trophy, Shield, Camera, Target } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900">IntelliHealth</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-secondary-600 hover:text-secondary-900">
                Home
              </Link>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-6">
            About IntelliHealth
          </h1>
          <p className="text-xl text-secondary-600 mb-8">
            We're passionate about helping you achieve your health and fitness goals through intelligent tracking and motivation.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-secondary-600 mb-6">
                At IntelliHealth, we believe that everyone deserves to live their healthiest life. 
                Our mission is to provide the tools, motivation, and support needed to make lasting 
                health changes accessible to everyone.
              </p>
              <p className="text-lg text-secondary-600 mb-6">
                We combine cutting-edge technology with proven fitness principles to create a 
                comprehensive platform that adapts to your unique journey and helps you stay 
                motivated every step of the way.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <span className="text-secondary-700">Privacy First</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary-600" />
                  <span className="text-secondary-700">Community Driven</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-primary-600" />
                  <span className="text-secondary-700">Results Focused</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg p-8 text-center">
              <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                10,000+
              </h3>
              <p className="text-secondary-600">
                Active users transforming their lives
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Why Choose IntelliHealth?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Visual Transformation Tracking
              </h3>
              <p className="text-secondary-600">
                See your progress with our unique photo timeline feature. Document your journey 
                and celebrate every milestone along the way.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Smart Goal Setting
              </h3>
              <p className="text-secondary-600">
                Set achievable goals and track your progress with intelligent insights and 
                personalized recommendations based on your performance.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Comprehensive Exercise Library
              </h3>
              <p className="text-secondary-600">
                Access hundreds of exercises with detailed instructions, proper form guidance, 
                and personalized workout recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Built by Health Enthusiasts
            </h2>
            <p className="text-lg text-secondary-600">
              Our team combines expertise in fitness, technology, and user experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-secondary-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                Fitness Experts
              </h3>
              <p className="text-secondary-600">
                Certified trainers and nutritionists
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-secondary-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                Tech Innovators
              </h3>
              <p className="text-secondary-600">
                Engineers building cutting-edge solutions
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-secondary-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                User Advocates
              </h3>
              <p className="text-secondary-600">
                Designers focused on your experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Your Journey Today
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join our community and take the first step towards a healthier you.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">IntelliHealth</span>
          </div>
          <p className="text-secondary-400">
            &copy; 2024 IntelliHealth. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
