import { z } from 'zod';

// Student Status Enum
export const StudentStatus = {
  ACTIVE: 'active',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  INACTIVE: 'inactive',
  GRADUATED: 'graduated',
  ON_LEAVE: 'on_leave'
} as const;

// Student Priority Enum
export const StudentPriority = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const;

// Student Gender Enum
export const StudentGender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
} as const;

// Base Student Schema
export const studentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  registeredOn: z.string().datetime(),
  status: z.enum([StudentStatus.ACTIVE, StudentStatus.PENDING, StudentStatus.SUSPENDED, 
                  StudentStatus.INACTIVE, StudentStatus.GRADUATED, StudentStatus.ON_LEAVE]),
  lastActive: z.string().datetime(),
  photo: z.string().url().optional(),
  idProof: z.string().optional(),
  bookings: z.number().int().min(0),
  violations: z.number().int().min(0),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  address: z.string().min(5).max(200),
  priority: z.enum([StudentPriority.HIGH, StudentPriority.MEDIUM, StudentPriority.LOW]),
  notes: z.string().max(500).optional(),
  seatNo: z.string().max(10).optional(),
  dueDate: z.string().datetime().optional(),
  fatherName: z.string().max(100).optional(),
  studentId: z.string().max(20).optional(),
  shift: z.string().max(20).optional(),
  admissionDate: z.date().optional(),
  idProofFile: z.instanceof(File).optional().nullable(),
  profilePhotoFile: z.instanceof(File).optional().nullable(),
  dob: z.string().datetime().optional(),
  gender: z.enum([StudentGender.MALE, StudentGender.FEMALE, StudentGender.OTHER]).optional(),
  city: z.string().max(50).optional(),
  state: z.string().max(50).optional(),
  pincode: z.string().regex(/^\d{6}$/).optional(),
  whatsapp: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  course: z.string().max(100).optional(),
  idProofType: z.string().max(50).optional(),
  idProofNumber: z.string().max(50).optional(),
  idProofFront: z.string().url().optional(),
  idProofBack: z.string().url().optional()
});

// Type for Student
export type Student = z.infer<typeof studentSchema>;

// Student Stats Schema
export const studentStatsSchema = z.object({
  totalStudents: z.number().int().min(0),
  activeStudents: z.number().int().min(0),
  inactiveStudents: z.number().int().min(0),
  totalBookings: z.number().int().min(0),
  totalViolations: z.number().int().min(0),
  totalDues: z.number().min(0)
});

// Type for StudentStats
export type StudentStats = z.infer<typeof studentStatsSchema>;

// New Student Schema (for creation)
export const newStudentSchema = studentSchema.omit({ 
  id: true, 
  registeredOn: true, 
  lastActive: true,
  bookings: true,
  violations: true
});

// Type for NewStudent
export type NewStudent = z.infer<typeof newStudentSchema>; 