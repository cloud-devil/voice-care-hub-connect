
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Hospital, 
  Users, 
  Calendar, 
  FileText, 
  Mic, 
  MicOff,
  User,
  Activity,
  Clock,
  Phone,
  UserCheck,
  UserX
} from 'lucide-react';
import VoiceAssistant from '@/components/VoiceAssistant';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  // Fetch doctors data
  const { data: doctorsData, isLoading: doctorsLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch appointments data
  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          profiles:patient_id (
            name,
            email
          ),
          doctors:doctor_id (
            profiles:user_id (
              name
            )
          )
        `)
        .eq('appointment_date', new Date().toISOString().split('T')[0]);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const totalDoctors = doctorsData?.length || 0;
  const presentDoctors = doctorsData?.filter(doctor => doctor.is_present).length || 0;
  const availableDoctors = doctorsData?.filter(doctor => doctor.availability_status === 'available').length || 0;
  const todaysAppointments = appointmentsData?.length || 0;

  const stats = [
    { title: 'Total Doctors', value: totalDoctors.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Doctors Present', value: presentDoctors.toString(), icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Available Doctors', value: availableDoctors.toString(), icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Today\'s Appointments', value: todaysAppointments.toString(), icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' }
  ];

  const recentAppointments = appointmentsData?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hospital Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening at your hospital today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor Availability */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Doctor Availability
              </CardTitle>
              <CardDescription>Current status of all doctors</CardDescription>
            </CardHeader>
            <CardContent>
              {doctorsLoading ? (
                <div className="text-center py-4">Loading doctors...</div>
              ) : (
                <div className="space-y-4">
                  {doctorsData?.map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{doctor.profiles?.name || 'Doctor'}</p>
                          <p className="text-sm text-gray-600">{doctor.specialization} - {doctor.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={doctor.is_present ? 'default' : 'secondary'}
                          className={doctor.is_present ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        >
                          {doctor.is_present ? 'Present' : 'Absent'}
                        </Badge>
                        <Badge 
                          variant={doctor.availability_status === 'available' ? 'default' : 'destructive'}
                        >
                          {doctor.availability_status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {doctorsData?.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No doctors found. Add some doctors to see their availability.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Voice Assistant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Voice Assistant
              </CardTitle>
              <CardDescription>AI-powered hospital assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceAssistant />
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Quick Commands:</p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• "Show patient records"</li>
                  <li>• "Schedule appointment"</li>
                  <li>• "Emergency protocols"</li>
                  <li>• "Staff directory"</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Appointments
            </CardTitle>
            <CardDescription>Scheduled appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <div className="text-center py-4">Loading appointments...</div>
            ) : (
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.profiles?.name || 'Patient'}</p>
                        <p className="text-sm text-gray-600">
                          Dr. {appointment.doctors?.profiles?.name || 'Doctor'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{appointment.appointment_time}</span>
                      </div>
                      <Badge 
                        variant={
                          appointment.status === 'scheduled' ? 'default' :
                          appointment.status === 'confirmed' ? 'default' :
                          appointment.status === 'cancelled' ? 'destructive' : 'secondary'
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {recentAppointments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No appointments scheduled for today.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common hospital management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>Add Patient</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Calendar className="h-6 w-6" />
                <span>Schedule</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Records</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Phone className="h-6 w-6" />
                <span>Emergency</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
