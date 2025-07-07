
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Hospital, 
  Users, 
  Calendar, 
  FileText, 
  Shield, 
  Clock, 
  Heart,
  Stethoscope,
  UserCheck,
  Activity
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Users,
      title: 'Patient Management',
      description: 'Comprehensive patient records and history tracking'
    },
    {
      icon: Calendar,
      title: 'Appointment Scheduling',
      description: 'Easy scheduling and appointment management system'
    },
    {
      icon: FileText,
      title: 'Medical Records',
      description: 'Secure digital storage of all medical documents'
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Full compliance with healthcare privacy regulations'
    },
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Live patient monitoring and emergency alerts'
    },
    {
      icon: Stethoscope,
      title: 'Clinical Tools',
      description: 'Advanced medical tools and diagnostic support'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-2">
              <Hospital className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">MedCare Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-blue-100 rounded-full">
              <Hospital className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Modern Hospital Management
            <span className="text-blue-600 block">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your healthcare operations with our comprehensive hospital management system. 
            From patient records to appointment scheduling, everything you need in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="px-8 py-3">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Hospital
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools designed specifically for healthcare professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-3 bg-blue-100 rounded-full w-fit">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-200">Patients Managed</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Healthcare Providers</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-200">Uptime Guarantee</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-white">
            <Heart className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Hospital Operations?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of healthcare professionals who trust MedCare Portal
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Hospital className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold">MedCare Portal</span>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 MedCare Portal. All rights reserved.</p>
            <p className="mt-2">Empowering healthcare through technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
