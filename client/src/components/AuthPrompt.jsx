import React from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import { Lock } from 'lucide-react';

const AuthPrompt = ({ action = 'continue', message }) => {
  return (
    <Card className="text-center p-8 border-2 border-indigo-100 bg-indigo-50/30">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
        <Lock size={28} />
      </div>
      <h3 className="text-2xl font-bold mb-2">Sign in required</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message || `You need to be signed in to ${action}. Create a free account or sign in to continue.`}
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/register">
          <Button variant="primary" size="lg">
            Create Free Account
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary" size="lg">
            Sign In
          </Button>
        </Link>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        It only takes 30 seconds to get started
      </p>
    </Card>
  );
};

export default AuthPrompt;
