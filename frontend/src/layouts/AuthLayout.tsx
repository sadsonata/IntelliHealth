import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-secondary-900">IntelliHealth</h1>
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-secondary-900">{title}</h2>
            {subtitle && (
              <p className="mt-2 text-sm text-secondary-600">{subtitle}</p>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            {children}
          </div>
          
          <div className="text-center text-sm text-secondary-600">
            <p>
              &copy; 2024 IntelliHealth. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 opacity-90" />
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-white text-center max-w-md">
            <h2 className="text-4xl font-bold mb-6">
              Transform Your Health Journey
            </h2>
            <p className="text-lg mb-8">
              Track workouts, monitor progress, and achieve your fitness goals with our comprehensive health platform.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">Track Your Progress</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">Visual Transformation Gallery</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">Achieve Your Goals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
