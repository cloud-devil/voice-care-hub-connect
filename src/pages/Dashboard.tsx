
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import PatientDashboard from '@/components/dashboards/PatientDashboard';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';
import NurseDashboard from '@/components/dashboards/NurseDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  // Fetch user profile to determine role
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  const renderDashboard = () => {
    switch (userProfile.role) {
      case 'patient':
        return <PatientDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'nurse':
        return <NurseDashboard />;
      case 'administrator':
        return <AdminDashboard />;
      default:
        return <PatientDashboard />; // Default to patient dashboard
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
