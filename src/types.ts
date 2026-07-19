export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  E_LEARNING_MANAGER = 'E_LEARNING_MANAGER',
  SUPPORT_AGENT = 'SUPPORT_AGENT'
}

export enum StudentStatus {
  CONTINUING = 'مستمر',
  TRANSFERRED = 'منقول',
  GRADUATED = 'متخرج',
  SUSPENDED = 'مفصول',
  WITHDRAWN = 'منسحب'
}

export enum AdmissionStatus {
  PENDING = 'قيد المراجعة',
  APPROVED = 'مقبول',
  REJECTED = 'مرفوض'
}

export interface School {
  id: string;
  name: string;
  nameEn: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  studentCount: number;
  teacherCount: number;
  classCount: number;
}

export interface AcademicYear {
  id: string;
  name: string; // e.g. "2025/2026"
  isCurrent: boolean;
}

export interface Level {
  id: string; // e.g., "elementary", "middle", "high"
  name: string; // e.g., "المرحلة الابتدائية"
}

export interface GradeLevel {
  id: string;
  levelId: string; // reference to Level
  name: string; // e.g., "الصف الأول"
}

export interface Section {
  id: string;
  gradeLevelId: string;
  name: string; // e.g., "أ", "ب", "الشعبة الأولى"
}

export interface Subject {
  id: string;
  name: string; // e.g., "الرياضيات"
  nameEn: string;
  gradeLevelId: string;
}

export interface Student {
  id: string;
  studentIdNo: string; // الرقم التعريفي
  examNo?: string; // الرقم الامتحاني
  fullName: string;
  fullNameEn: string;
  avatar: string;
  gender: 'ذكر' | 'أنثى';
  birthDate: string;
  schoolId: string;
  gradeLevelId: string;
  sectionId: string;
  academicYearId: string;
  address: string;
  phone: string;
  parentPhone: string;
  parentName: string;
  parentRelation: string;
  email: string;
  studyStatus: StudentStatus; // مستمر، منقول...
  isRegistered: boolean;
  documents: { name: string; url: string; size: string }[];
  notes?: string;
  isActive: boolean;
}

export interface Parent {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  childrenIds: string[]; // references to Student
  isActive: boolean;
}

export interface Teacher {
  id: string;
  fullName: string;
  fullNameEn: string;
  phone: string;
  email: string;
  schoolId: string;
  subjectsIds: string[]; // references to Subject
  sectionsIds: string[]; // references to Section
  schedule: string; // text description or hours
  documents: string[];
  notes?: string;
  isActive: boolean;
}

export interface LessonQuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

export interface PopupQuiz {
  timeInSeconds: number;
  question: LessonQuizQuestion;
}

export interface Lesson {
  id: string;
  schoolId: string;
  gradeLevelId: string;
  sectionId: string;
  subjectId: string;
  unitName: string; // e.g., "الوحدة الأولى: الجبر"
  title: string;
  description: string;
  videoUrl?: string; // local or external
  videoDurationSeconds?: number;
  allowDownloadVideo: boolean;
  popupQuizzes: PopupQuiz[];
  pdfUrl?: string;
  pdfName?: string;
  wordUrl?: string;
  wordName?: string;
  externalLinks?: { title: string; url: string }[];
  publishDate: string;
  allowedStudentIds?: string[]; // empty means all students in section
  viewCount: number;
  completionRate?: number; // visual representation
}

export interface Assignment {
  id: string;
  schoolId: string;
  gradeLevelId: string;
  sectionId: string;
  subjectId: string;
  title: string;
  description: string;
  attachmentUrl?: string;
  attachmentName?: string;
  dueDate: string;
  maxScore: number;
  allowMultipleAttempts: boolean;
  isActive: boolean;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submitDate: string;
  answerText?: string;
  fileUrl?: string;
  fileName?: string;
  score?: number;
  teacherFeedback?: string;
  status: 'submitted' | 'graded' | 'late';
}

export interface Quiz {
  id: string;
  schoolId: string;
  gradeLevelId: string;
  sectionId: string;
  subjectId: string;
  title: string;
  description: string;
  durationMinutes: number;
  questions: LessonQuizQuestion[];
  isActive: boolean;
  dueDate: string;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  studentId: string;
  submitDate: string;
  answers: { questionId: string; selectedOptionIndex: number }[];
  score: number;
  totalQuestions: number;
  correctAnswersCount: number;
}

export interface StudentGradeRecord {
  id: string;
  studentId: string;
  subjectId: string;
  academicYearId: string;
  homeworksAvg: number; // درجات الواجبات
  quizzesAvg: number; // درجات الاختبارات القصيرة
  monthlyExam1: number; // الشهر الأول
  monthlyExam2: number; // الشهر الثاني
  midYearExam: number; // نصف السنة
  finalExam: number; // نهاية السنة
  activityScore: number; // النشاط والمشاركة
  yearlyTotal: number; // المجموع النهائي أو السعي
  percentage: number; // النسبة المئوية
  gradeLetter: string; // التقدير (امتياز، جيد جداً...)
  isPassed: boolean; // ناجح أو راسب
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused'; // حاضر، غائب، متأخر، غائب بعذر
  reason?: string;
  markedByTeacherId: string;
}

export interface ScheduleSlot {
  id: string;
  schoolId: string;
  gradeLevelId: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number; // 0 for Sunday, 1 for Monday... 4 for Thursday
  period: number; // 1 to 6 (حصص)
  timeRange: string; // e.g., "8:00 - 8:45"
  roomName: string; // القاعة
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  schoolId?: string;
  category: 'إداري' | 'تقني' | 'مالي' | 'تعليمي';
  title: string;
  description: string;
  attachmentUrl?: string;
  attachmentName?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'assigned' | 'replied' | 'closed';
  assignedToAgentId?: string;
  createdAt: string;
  replies: {
    id: string;
    senderName: string;
    senderRole: UserRole;
    message: string;
    createdAt: string;
    attachmentUrl?: string;
  }[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  schoolId?: string;
  operation: 'إضافة' | 'تعديل' | 'حذف' | 'تسجيل دخول' | 'تصدير' | 'ترحيل';
  targetTable: string; // e.g., "الطلاب", "الدروس", "الدرجات"
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface RegistrationRequest {
  id: string;
  fullName: string;
  gender: 'ذكر' | 'أنثى';
  birthDate: string;
  schoolId: string;
  levelId: string;
  gradeLevelId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  documents: { name: string; url: string; size: string }[];
  status: AdmissionStatus;
  requestDate: string;
  adminNotes?: string;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  amount: number;
  currency: string; // e.g. "IQD" or "USD"
  title: string; // e.g., "القسط الأول - الفصل الدراسي الأول"
  paymentDate: string;
  receiptNo: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'lesson' | 'assignment' | 'quiz' | 'grade' | 'attendance' | 'schedule' | 'general';
  targetType: 'all' | 'school' | 'section' | 'student' | 'teacher' | 'parent';
  targetSchoolId?: string;
  targetSectionId?: string;
  targetUserId?: string;
  createdAt: string;
  isRead: boolean;
}
