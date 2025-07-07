
import React, { useState } from 'react';
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
  Phone
} from 'lucide-react';
import VoiceAssistant from '@/components/VoiceAssistant';
import Navigation from '@/components/Navigation';

const Dashboard = () => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const stats = [
    { title: 'Total Patients', value: '1,247', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Today\'s Appointments', value: '28', icon: Calendar, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Active Staff', value: '156', icon: User, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Emergency Cases', value: '3', icon: Activity, color: 'text-red-600', bg: 'bg-red-100' }
  ];

  const recentAppointments = [
    { id: 1, patient: 'John Doe', doctor: 'Dr. Smith', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, patient: 'Jane Wilson', doctor: 'Dr. Johnson', time: '11:30 AM', status: 'Pending' },
    { id: 3, patient: 'Mike Brown', doctor: 'Dr. Davis', time: '2:00 PM', status: 'Confirmed' },
    { id: 4, patient: 'Sarah Lee', doctor: 'Dr. Miller', time: '3:30 PM', status: 'Cancelled' }
  ];

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
          {/* Recent Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Appointments
              </CardTitle>
              <CardDescription>Latest scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-gray-600">{appointment.doctor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                      <Badge 
                        variant={
                          appointment.status === 'Confirmed' ? 'default' :
                          appointment.status === 'Pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
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
