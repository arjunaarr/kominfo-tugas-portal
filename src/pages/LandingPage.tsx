
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <Layout>
      <section className="bg-primary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Kominfo Intern Task Management Portal
            </h1>
            <p className="text-xl mb-8">
              Effortlessly submit, track, and manage your internship tasks in one central location.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                <Link to="/login">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-primary-700">
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Your Tasks</h3>
              <p className="text-gray-600">
                Submit your daily assignments through our easy-to-use upload interface supporting multiple file types.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Your Progress</h3>
              <p className="text-gray-600">
                Monitor your submission history and stay on top of your internship requirements.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Receive Feedback</h3>
              <p className="text-gray-600">
                Get notifications and status updates on your submitted work from administrators.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Streamline Your Internship Tasks?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join the Kominfo Intern Portal today and make task submission simple and efficient.
            </p>
            <Button asChild size="lg" className="bg-primary-600 hover:bg-primary-700">
              <Link to="/login" className="flex items-center">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
