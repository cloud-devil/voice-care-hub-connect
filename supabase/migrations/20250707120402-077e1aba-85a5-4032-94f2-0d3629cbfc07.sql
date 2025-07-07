
-- Add nurses table
CREATE TABLE public.nurses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  department text NOT NULL,
  shift_start time,
  shift_end time,
  is_present boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(user_id)
);

-- Add operations table for doctors
CREATE TABLE public.operations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  operation_name text NOT NULL,
  operation_date date NOT NULL,
  operation_time time NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Add duty schedules table
CREATE TABLE public.duty_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  duty_date date NOT NULL,
  shift_start time NOT NULL,
  shift_end time NOT NULL,
  ward text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS on new tables
ALTER TABLE public.nurses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duty_schedules ENABLE ROW LEVEL SECURITY;

-- RLS policies for nurses
CREATE POLICY "Anyone can view nurses" ON public.nurses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Nurses can update their own info" ON public.nurses
  FOR UPDATE USING (user_id = auth.uid());

-- RLS policies for operations
CREATE POLICY "Users can view their operations" ON public.operations
  FOR SELECT USING (
    patient_id = auth.uid() OR 
    doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "Doctors can manage operations" ON public.operations
  FOR ALL USING (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

-- RLS policies for duty schedules
CREATE POLICY "Doctors can view their duty schedules" ON public.duty_schedules
  FOR SELECT USING (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

CREATE POLICY "Administrators can view all duty schedules" ON public.duty_schedules
  FOR SELECT TO authenticated USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'administrator')
  );

-- Update profiles RLS to allow administrators to see all profiles
CREATE POLICY "Administrators can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'administrator') OR
    auth.uid() = id OR
    role = 'doctor'
  );

-- Allow patients to create appointments and update appointment policies
DROP POLICY IF EXISTS "Patients can create appointments" ON public.appointments;
CREATE POLICY "Patients can create appointments" ON public.appointments
  FOR INSERT WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Users can update their appointments" ON public.appointments
  FOR UPDATE USING (
    patient_id = auth.uid() OR 
    doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
  );
