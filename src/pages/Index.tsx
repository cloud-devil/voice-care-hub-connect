
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital, Heart, Users, Calendar, Shield, Clock } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  const features = [
    {
      icon: Users,
      title: "Patient Management",
      description: "Comprehensive patient records and history tracking"
    },
    {
      icon: Calendar,
      title: "Appointment Scheduling",
      description: "Easy scheduling and management of appointments"
    },
    {
      icon: Heart,
      title: "Health Monitoring",
      description: "Real-time health metrics and vital signs tracking"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "HIPAA compliant with enterprise-grade security"
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Round-the-clock access to medical information"
    },
    {
      icon: Hospital,
      title: "Multi-facility",
      description: "Manage multiple healthcare facilities from one platform"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <Hospital className="h-10 w-10 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">MedCare Portal</h1>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => navigate("/signin")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/signup")} className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Modern Healthcare
            <span className="text-blue-600"> Management</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your healthcare operations with our comprehensive hospital management system. 
            Manage patients, appointments, and staff efficiently with cutting-edge technology.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/signup")} className="bg-blue-600 hover:bg-blue-700">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/signin")}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Healthcare
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools you need to deliver exceptional patient care 
              while maintaining operational efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
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

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Healthcare Management?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who trust MedCare Portal 
            for their daily operations.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigate("/signup")}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Hospital className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">MedCare Portal</span>
            </div>
            <p className="text-gray-400">
              © 2024 MedCare Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
