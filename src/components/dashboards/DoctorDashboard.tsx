
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User,
  Activity,
  Scissors,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const DoctorDashboard = () => {
  const { user } = useAuth();

  // Fetch doctor's appointments
  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['doctor-appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          profiles:patient_id (
            name,
            email,
            phone
          )
        `)
        .eq('doctor_id', (await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user?.id)
          .single()).data?.id)
        .order('appointment_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch doctor's operations
  const { data: operationsData, isLoading: operationsLoading } = useQuery({
    queryKey: ['doctor-operations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operations')
        .select(`
          *,
          profiles:patient_id (
            name,
            email
          )
        `)
        .eq('doctor_id', (await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user?.id)
          .single()).data?.id)
        .order('operation_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch doctor's duty schedule
  const { data: dutyScheduleData, isLoading: dutyLoading } = useQuery({
    queryKey: ['doctor-duty-schedule'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('duty_schedules')
        .select('*')
        .eq('doctor_id', (await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user?.id)
          .single()).data?.id)
        .order('duty_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const todaysAppointments = appointmentsData?.filter(apt => 
    apt.appointment_date === new Date().toISOString().split('T')[0]
  ).length || 0;

  const upcomingOperations = operationsData?.filter(op => 
    new Date(op.operation_date) >= new Date()
  ).length || 0;

  const todaysDuties = dutyScheduleData?.filter(duty => 
    duty.duty_date === new Date().toISOString().split('T')[0]
  ).length || 0;

  const stats = [
    { title: "Today's Appointments", value: todaysAppointments.toString(), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Upcoming Operations', value: upcomingOperations.toString(), icon: Scissors, color: 'text-red-600', bg: 'bg-red-100' },
    { title: "Today's Duties", value: todaysDuties.toString(), icon: Clock, color: 'text-green-600', bg: 'bg-green-100' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
        <p className="text-gray-600">Manage your appointments, operations, and duty schedules.</p>
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
        {/* Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              My Appointments
            </CardTitle>
            <CardDescription>Upcoming patient appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <div className="text-center py-4">Loading appointments...</div>
            ) : (
              <div className="space-y-4">
                {appointmentsData?.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.profiles?.name}</p>
                        <p className="text-sm text-gray-600">
                          {appointment.appointment_date} at {appointment.appointment_time}
                        </p>
                        {appointment.notes && (
                          <p className="text-xs text-gray-500">{appointment.notes}</p>
                        )}
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
                {appointmentsData?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No appointments scheduled.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Operations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              Scheduled Operations
            </CardTitle>
            <CardDescription>Upcoming surgical procedures</CardDescription>
          </CardHeader>
          <CardContent>
            {operationsLoading ? (
              <div className="text-center py-4">Loading operations...</div>
            ) : (
              <div className="space-y-4">
                {operationsData?.slice(0, 5).map((operation) => (
                  <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-red-100 rounded-full">
                        <Scissors className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">{operation.operation_name}</p>
                        <p className="text-sm text-gray-600">
                          Patient: {operation.profiles?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {operation.operation_date} at {operation.operation_time}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        operation.status === 'completed' ? 'default' :
                        operation.status === 'scheduled' ? 'secondary' :
                        operation.status === 'cancelled' ? 'destructive' : 'secondary'
                      }
                    >
                      {operation.status}
                    </Badge>
                  </div>
                ))}
                {operationsData?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No operations scheduled.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Duty Schedule */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Duty Schedule
          </CardTitle>
          <CardDescription>Your upcoming duty assignments</CardDescription>
        </CardHeader>
        <CardContent>
          {dutyLoading ? (
            <div className="text-center py-4">Loading duty schedule...</div>
          ) : (
            <div className="space-y-4">
              {dutyScheduleData?.map((duty) => (
                <div key={duty.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{duty.duty_date}</p>
                      <p className="text-sm text-gray-600">
                        {duty.shift_start} - {duty.shift_end}
                      </p>
                      {duty.ward && (
                        <p className="text-sm text-gray-500">Ward: {duty.ward}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline">
                    Scheduled
                  </Badge>
                </div>
              ))}
              {dutyScheduleData?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No duty schedules assigned.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
