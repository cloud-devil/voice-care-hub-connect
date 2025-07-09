
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Calendar, 
  Clock, 
  User,
  Activity,
  Plus,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const PatientDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch available doctors
  const { data: doctorsData, isLoading: doctorsLoading } = useQuery({
    queryKey: ['available-doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `)
        .eq('availability_status', 'available')
        .eq('is_present', true);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch patient's appointments
  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['patient-appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctors:doctor_id (
            specialization,
            department,
            profiles:user_id (
              name
            )
          )
        `)
        .eq('patient_id', user?.id)
        .order('appointment_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Book appointment mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: user?.id,
          doctor_id: appointmentData.doctor_id,
          appointment_date: appointmentData.date,
          appointment_time: appointmentData.time,
          notes: appointmentData.notes,
          status: 'scheduled'
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Appointment booked successfully!');
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
      setIsBookingOpen(false);
      setSelectedDoctor('pavani,krishna, murali');
      setAppointmentDate('');
      setAppointmentTime('');
      setNotes('');
    },
    onError: (error) => {
      toast.error('Failed to book appointment');
      console.error('Booking error:', error);
    },
  });

  const handleBookAppointment = () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    bookAppointmentMutation.mutate({
      doctor_id: selectedDoctor,
      date: appointmentDate,
      time: appointmentTime,
      notes
    });
  };

  const availableDoctors = doctorsData?.length || 0;
  const totalAppointments = appointmentsData?.length || 0;
  const upcomingAppointments = appointmentsData?.filter(apt => 
    new Date(apt.appointment_date) >= new Date()
  ).length || 0;

  const stats = [
    { title: 'Available Doctors', value: availableDoctors.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Appointments', value: totalAppointments.toString(), icon: Calendar, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Upcoming Appointments', value: upcomingAppointments.toString(), icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Dashboard</h1>
        <p className="text-gray-600">Manage your appointments and find available doctors.</p>
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
        {/* Available Doctors */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Available Doctors
                </CardTitle>
                <CardDescription>Doctors currently available for appointments</CardDescription>
              </div>
              <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Book New Appointment</DialogTitle>
                    <DialogDescription>
                      Select a doctor and schedule your appointment.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="doctor">Select Doctor</Label>
                      <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctorsData?.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              Dr. {doctor.profiles?.name} - {doctor.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional information..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handleBookAppointment}
                      disabled={bookAppointmentMutation.isPending}
                      className="w-full"
                    >
                      {bookAppointmentMutation.isPending ? 'Booking...' : 'Book Appointment'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
                        <p className="font-medium">Dr. {doctor.profiles?.name}</p>
                        <p className="text-sm text-gray-600">{doctor.specialization} - {doctor.department}</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Available
                    </Badge>
                  </div>
                ))}
                {doctorsData?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No doctors currently available.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              My Appointments
            </CardTitle>
            <CardDescription>Your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <div className="text-center py-4">Loading appointments...</div>
            ) : (
              <div className="space-y-4">
                {appointmentsData?.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Dr. {appointment.doctors?.profiles?.name}</p>
                        <p className="text-sm text-gray-600">
                          {appointment.doctors?.specialization} - {appointment.doctors?.department}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.appointment_date} at {appointment.appointment_time}
                        </p>
                      </div>
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
      </div>
    </div>
  );
};

export default PatientDashboard;
