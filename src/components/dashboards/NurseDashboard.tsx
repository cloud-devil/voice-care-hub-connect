
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  Clock, 
  User,
  Activity,
  Heart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const NurseDashboard = () => {
  const { user } = useAuth();

  // Fetch nurse's information
  const { data: nurseData, isLoading: nurseLoading } = useQuery({
    queryKey: ['nurse-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nurses')
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `)
        .eq('user_id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch today's appointments in nurse's department
  const { data: departmentAppointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['department-appointments'],
    queryFn: async () => {
      if (!nurseData?.department) return [];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          profiles:patient_id (
            name,
            email
          ),
          doctors:doctor_id (
            department,
            profiles:user_id (
              name
            )
          )
        `)
        .eq('appointment_date', new Date().toISOString().split('T')[0]);
      
      if (error) throw error;
      return data?.filter(apt => apt.doctors?.department === nurseData.department) || [];
    },
    enabled: !!nurseData?.department,
  });

  // Fetch department doctors
  const { data: departmentDoctors, isLoading: doctorsLoading } = useQuery({
    queryKey: ['department-doctors'],
    queryFn: async () => {
      if (!nurseData?.department) return [];
      
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `)
        .eq('department', nurseData.department);
      
      if (error) throw error;
      return data;
    },
    enabled: !!nurseData?.department,
  });

  const todaysAppointments = departmentAppointments?.length || 0;
  const presentDoctors = departmentDoctors?.filter(doc => doc.is_present).length || 0;
  const totalDoctors = departmentDoctors?.length || 0;

  const stats = [
    { title: "Today's Appointments", value: todaysAppointments.toString(), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Doctors Present', value: presentDoctors.toString(), icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Doctors', value: totalDoctors.toString(), icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nurse Dashboard</h1>
        <p className="text-gray-600">
          {nurseData?.department ? `${nurseData.department} Department` : 'Hospital Care Management'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Department Appointments
            </CardTitle>
            <CardDescription>Appointments in your department</CardDescription>
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <div className="text-center py-4">Loading appointments...</div>
            ) : (
              <div className="space-y-4">
                {departmentAppointments?.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.profiles?.name}</p>
                        <p className="text-sm text-gray-600">
                          Dr. {appointment.doctors?.profiles?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.appointment_time}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        appointment.status === 'confirmed' ? 'default' :
                        appointment.status === 'scheduled' ? 'secondary' :
                        appointment.status === 'cancelled' ? 'destructive' : 'secondary'
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
                {departmentAppointments?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No appointments scheduled for today.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Department Doctors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Department Doctors
            </CardTitle>
            <CardDescription>Doctors in your department</CardDescription>
          </CardHeader>
          <CardContent>
            {doctorsLoading ? (
              <div className="text-center py-4">Loading doctors...</div>
            ) : (
              <div className="space-y-4">
                {departmentDoctors?.map((doctor) => (
                  <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Dr. {doctor.profiles?.name}</p>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        {doctor.shift_start && doctor.shift_end && (
                          <p className="text-sm text-gray-500">
                            {doctor.shift_start} - {doctor.shift_end}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                {departmentDoctors?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No doctors assigned to this department.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NurseDashboard;
