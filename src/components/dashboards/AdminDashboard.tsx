
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Activity,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Fetch all profiles (patients and doctors)
  const { data: profilesData, isLoading: profilesLoading } = useQuery({
    queryKey: ['all-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch all doctors with details
  const { data: doctorsData, isLoading: doctorsLoading } = useQuery({
    queryKey: ['all-doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          profiles:user_id (
            name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch all nurses
  const { data: nursesData, isLoading: nursesLoading } = useQuery({
    queryKey: ['all-nurses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nurses')
        .select(`
          *,
          profiles:user_id (
            name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch all appointments
  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['all-appointments'],
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
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const totalPatients = profilesData?.filter(p => p.role === 'patient').length || 0;
  const totalDoctors = doctorsData?.length || 0;
  const totalNurses = nursesData?.length || 0;
  const totalAppointments = appointmentsData?.length || 0;
  const presentDoctors = doctorsData?.filter(d => d.is_present).length || 0;

  const stats = [
    { title: 'Total Patients', value: totalPatients.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Doctors', value: totalDoctors.toString(), icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Nurses', value: totalNurses.toString(), icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Total Appointments', value: totalAppointments.toString(), icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Administrator Dashboard</h1>
        <p className="text-gray-600">Complete overview of hospital operations and staff management.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Doctors Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Doctors Overview
            </CardTitle>
            <CardDescription>All registered doctors and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {doctorsLoading ? (
              <div className="text-center py-4">Loading doctors...</div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {doctorsData?.map((doctor) => (
                  <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <UserCheck className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Dr. {doctor.profiles?.name}</p>
                        <p className="text-sm text-gray-600">{doctor.specialization} - {doctor.department}</p>
                        <p className="text-xs text-gray-500">{doctor.profiles?.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge 
                        variant={doctor.is_present ? 'default' : 'secondary'}
                        className={doctor.is_present ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {doctor.is_present ? 'Present' : 'Absent'}
                      </Badge>
                      <Badge 
                        variant={doctor.availability_status === 'available' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {doctor.availability_status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {doctorsData?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No doctors registered.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Patients Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Patients Overview
            </CardTitle>
            <CardDescription>All registered patients</CardDescription>
          </CardHeader>
          <CardContent>
            {profilesLoading ? (
              <div className="text-center py-4">Loading patients...</div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {profilesData?.filter(p => p.role === 'patient').map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {patient.email}
                        </p>
                        {patient.phone && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {patient.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline">
                      Patient
                    </Badge>
                  </div>
                ))}
                {profilesData?.filter(p => p.role === 'patient').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No patients registered.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Appointments
          </CardTitle>
          <CardDescription>Latest appointment bookings across the hospital</CardDescription>
        </CardHeader>
        <CardContent>
          {appointmentsLoading ? (
            <div className="text-center py-4">Loading appointments...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointmentsData?.slice(0, 10).map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      {appointment.profiles?.name}
                    </TableCell>
                    <TableCell>
                      Dr. {appointment.doctors?.profiles?.name}
                    </TableCell>
                    <TableCell>{appointment.appointment_date}</TableCell>
                    <TableCell>{appointment.appointment_time}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          appointment.status === 'confirmed' ? 'default' :
                          appointment.status === 'scheduled' ? 'secondary' :
                          appointment.status === 'cancelled' ? 'destructive' : 'secondary'
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {appointmentsData?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No appointments found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
