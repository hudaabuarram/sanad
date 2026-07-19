import React, { useState } from 'react';
import { 
  School, Student, Teacher, Parent, Lesson, Assignment, AssignmentSubmission, 
  StudentGradeRecord, AttendanceRecord, RegistrationRequest, ScheduleSlot, AuditLog, Subject, 
  AdmissionStatus, StudentStatus, UserRole, AcademicYear 
} from './types';
import { 
  initialSchools, initialStudents, initialTeachers, initialParents, 
  initialLessons, initialAssignments, initialAssignmentSubmissions, initialStudentGrades, 
  initialAttendance, initialRegistrationRequests, initialSchedules, initialSubjects, 
  initialAuditLogs, initialAcademicYears 
} from './data/initialData';
import { createAuditLog } from './utils';

// UI components
import LandingPage from './components/LandingPage';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import SchoolAdminDashboard from './components/SchoolAdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentPortal from './components/StudentPortal';
import ParentPortal from './components/ParentPortal';

export default function App() {
  // Master Database States (Reactivity across all entities)
  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(initialAcademicYears);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [parents, setParents] = useState<Parent[]>(initialParents);
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(initialAssignmentSubmissions);
  const [grades, setGrades] = useState<StudentGradeRecord[]>(initialStudentGrades);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>(initialRegistrationRequests);
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>(initialSchedules);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<{
    role: UserRole;
    id: string;
    details: any;
    activeSchoolId?: string; // For school admins
  } | null>(null);

  // LOGGING HELPER
  const logAction = (user: string, role: UserRole, targetTable: string, details: string) => {
    let operation: 'إضافة' | 'تعديل' | 'حذف' | 'تسجيل دخول' | 'تصدير' | 'ترحيل' = 'إضافة';
    if (details.includes('تحديث') || details.includes('تعديل') || details.includes('تغيير') || details.includes('تصحيح') || details.includes('رصد') || details.includes('تسوية')) {
      operation = 'تعديل';
    } else if (details.includes('حذف') || details.includes('إلغاء')) {
      operation = 'حذف';
    } else if (details.includes('نقل') || details.includes('ترحيل')) {
      operation = 'ترحيل';
    } else if (details.includes('تصدير')) {
      operation = 'تصدير';
    } else if (details.includes('دخول')) {
      operation = 'تسجيل دخول';
    }

    const newLog = createAuditLog(
      role === UserRole.SUPER_ADMIN ? 'sys_admin' : 'usr_id',
      user,
      role,
      operation,
      targetTable,
      details
    );
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // --- ACTIONS HANDLERS (PASSED DOWN) ---

  // Super Admin handlers
  const handleAddSchool = (newSchool: School) => {
    setSchools(prev => [...prev, newSchool]);
    logAction('Super Admin', UserRole.SUPER_ADMIN, 'إضافة مدرسة جديدة', `تم تسجيل مدرسة ${newSchool.name} بنجاح.`);
  };

  const handleUpdateSchoolStatus = (schoolId: string, isActive: boolean) => {
    setSchools(prev => prev.map(s => s.id === schoolId ? { ...s, isActive } : s));
    const schoolName = schools.find(s => s.id === schoolId)?.name || '';
    logAction('Super Admin', UserRole.SUPER_ADMIN, 'تعديل حالة ترخيص مدرسة', `تم تغيير رخص مدرسة ${schoolName} إلى: ${isActive ? 'نشط' : 'موقف'}`);
  };

  const handleAddSubject = (newSub: Subject) => {
    setSubjects(prev => [...prev, newSub]);
    logAction('Super Admin', UserRole.SUPER_ADMIN, 'إضافة مادة تعليمية جديدة', `تم إدراج مادة ${newSub.name} في المنهج.`);
  };

  // School Admin handlers
  const handleAddStudent = (newStd: Student) => {
    setStudents(prev => [...prev, newStd]);
    // Create their grade record matrix automatically for all subjects to prevent empty tables
    const newGradeRecords: StudentGradeRecord[] = subjects.map(sub => ({
      id: `grd_${newStd.id}_${sub.id}`,
      studentId: newStd.id,
      subjectId: sub.id,
      academicYearId: '2025_2026',
      homeworksAvg: 0,
      quizzesAvg: 0,
      monthlyExam1: 0,
      monthlyExam2: 0,
      midYearExam: 0,
      finalExam: 0,
      activityScore: 0,
      yearlyTotal: 0,
      percentage: 0,
      gradeLetter: 'غير مرصود',
      isPassed: false
    }));
    setGrades(prev => [...prev, ...newGradeRecords]);

    logAction('مدير المدرسة', UserRole.SCHOOL_ADMIN, 'تسجيل وإصدار ملف طالب جديد', `تم رصد الطالب ${newStd.fullName} وإصدار رقم دراسي له.`);
  };

  const handleUpdateStudent = (id: string, updated: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    const name = students.find(s => s.id === id)?.fullName || '';
    logAction('مدير المدرسة', UserRole.SCHOOL_ADMIN, 'تحديث تفاصيل ملف طالب', `تم تحديث حقول الطالب ${name}.`);
  };

  const handleTransferStudent = (studentId: string, targetSchoolId: string) => {
    const student = students.find(s => s.id === studentId);
    const targetSchool = schools.find(s => s.id === targetSchoolId);
    if (!student || !targetSchool) return;

    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, schoolId: targetSchoolId, studyStatus: StudentStatus.TRANSFERRED } : s));
    logAction('مدير المدرسة', UserRole.SCHOOL_ADMIN, 'ترحيل طالب بين الفروع', `تم نقل ملف الطالب ${student.fullName} من فرعه السابق إلى ${targetSchool.name} بنجاح.`);
  };

  const handleProcessRegistration = (requestId: string, status: AdmissionStatus, notes?: string) => {
    setRegistrationRequests(prev => prev.map(r => r.id === requestId ? { ...r, status, adminNotes: notes } : r));
    const request = registrationRequests.find(r => r.id === requestId);
    if (!request) return;

    if (status === AdmissionStatus.APPROVED) {
      // Auto convert approved registration into active student record
      const studentIdNo = 'STD-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 9000 + 1000);
      const newActiveStd: Student = {
        id: `std_reg_${request.id}`,
        studentIdNo,
        fullName: request.fullName,
        fullNameEn: request.fullName.split(' ').slice(0, 2).join(' '), // Simple guess
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
        gender: 'ذكر',
        birthDate: '2012-01-01',
        schoolId: request.schoolId,
        gradeLevelId: 'gr_7', // Default first intermediate
        sectionId: 'sec_7_a',
        academicYearId: '2025_2026',
        address: request.address,
        phone: request.parentPhone,
        parentPhone: request.parentPhone,
        parentName: request.parentName,
        parentRelation: 'أب',
        email: `${studentIdNo.toLowerCase()}@student.edu.iq`,
        studyStatus: StudentStatus.CONTINUING,
        isRegistered: true,
        documents: [],
        isActive: true
      };

      handleAddStudent(newActiveStd);
    }

    logAction('مدير المدرسة', UserRole.SCHOOL_ADMIN, 'البت في طلب قبول وتأشير', `تم وضع طلب الطالب ${request.fullName} في حالة: ${status}`);
  };

  const handleAddScheduleSlot = (newSlot: Omit<ScheduleSlot, 'id'>) => {
    const slot: ScheduleSlot = {
      ...newSlot,
      id: `sch_${Date.now()}`
    };
    setScheduleSlots(prev => [...prev, slot]);
    logAction('إدارة الجداول', UserRole.SCHOOL_ADMIN, 'إضافة حصة دراسية أسبوعية', `تم جدولة مادة في القاعة ${newSlot.roomName}`);
  };

  const handleDeleteScheduleSlot = (id: string) => {
    setScheduleSlots(prev => prev.filter(s => s.id !== id));
    logAction('إدارة الجداول', UserRole.SCHOOL_ADMIN, 'حذف حصة دراسية', `تم إلغاء حصة من جدول الصف الدراسي.`);
  };

  // Teacher handlers
  const handleAddLesson = (newLesson: Lesson) => {
    setLessons(prev => [newLesson, ...prev]);
    logAction('المعلم', UserRole.TEACHER, 'نشر درس ذكي تفاعلي', `تم نشر الدرس: ${newLesson.title} مع كويزات فيديو منبثقة.`);
  };

  const handleAddAssignment = (newAsn: Assignment) => {
    setAssignments(prev => [newAsn, ...prev]);
    logAction('المعلم', UserRole.TEACHER, 'إدراج واجب بيتي جديد', `تم تعميم واجب ${newAsn.title} بموعد نهائي.`);
  };

  const handleGradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, score, teacherFeedback: feedback, status: 'graded' } : s));
    const sub = submissions.find(s => s.id === submissionId);
    if (sub) {
      const studentName = students.find(st => st.id === sub.studentId)?.fullName || '';
      logAction('المعلم', UserRole.TEACHER, 'تصحيح واجب دراسي', `تم تصحيح واجب الطالب ${studentName} ومنحه درجة ${score}`);
    }
  };

  const handleUpdateGradeRecord = (record: StudentGradeRecord) => {
    setGrades(prev => prev.map(g => g.id === record.id ? record : g));
    const studentName = students.find(s => s.id === record.studentId)?.fullName || '';
    logAction('المعلم', UserRole.TEACHER, 'رصد درجات السعي السنوي', `تم تحديث درجات السعي والامتحان النهائي للطالب ${studentName}`);
  };

  const handleMarkAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const processed = records.map(r => ({
      ...r,
      id: `att_${Date.now()}_${r.studentId}`
    }));
    setAttendance(prev => [...processed, ...prev]);
    logAction('المعلم', UserRole.TEACHER, 'رصد الحضور والغياب اليومي', `تم رصد حضور وغياب الشعبة وإرسال التنبيهات المباشرة.`);
  };

  // Student handlers
  const handleAddSubmission = (newSub: Omit<AssignmentSubmission, 'id' | 'submitDate' | 'status'>) => {
    const sub: AssignmentSubmission = {
      ...newSub,
      id: `sub_${Date.now()}`,
      submitDate: new Date().toISOString(),
      status: 'submitted'
    };
    setSubmissions(prev => [...prev, sub]);
    logAction('الطالب', UserRole.STUDENT, 'رفع وتسليم واجب مدرسي', `تم تقديم إجابة الواجب الدراسي.`);
  };

  // Parent handlers
  const handleAddRegistrationRequest = (newReq: RegistrationRequest) => {
    setRegistrationRequests(prev => [newReq, ...prev]);
    logAction('ولي الأمر', UserRole.PARENT, 'تقديم طلب قبول مباشر إلكتروني', `تم رفع مستندات القبول للابن ${newReq.fullName}.`);
  };

  const handleUpdateStudentTuition = (studentId: string, paidAmount: number) => {
    // Reduce balance / record payment simulation
    // Since we're using a simplified static mock for billing, we'll log it as a transaction
    const studentName = students.find(s => s.id === studentId)?.fullName || '';
    logAction('ولي الأمر', UserRole.PARENT, 'تسديد قسط مالي مدرسي', `تم تسديد قسط بقيمة ${paidAmount.toLocaleString()} دينار عراقي للطالب ${studentName}`);
  };

  const handleLogin = (role: string, selectedId?: string) => {
    if (role === 'SUPER_ADMIN') {
      setCurrentUser({
        role: UserRole.SUPER_ADMIN,
        id: 'super_admin_id',
        details: { fullName: 'مسؤول عام الوزارة' }
      });
      logAction('المسؤول العام', UserRole.SUPER_ADMIN, 'المدارس', 'تم تسجيل دخول المسؤول العام بنجاح للوحة التحكم المركزية.');
    } else if (role === 'SCHOOL_ADMIN') {
      const schoolId = selectedId || 'sch_noor';
      const sch = schools.find(s => s.id === schoolId) || schools[0];
      setCurrentUser({
        role: UserRole.SCHOOL_ADMIN,
        id: 'school_admin_id',
        details: { fullName: `مدير فرع مدرسة ${sch.name}` },
        activeSchoolId: schoolId
      });
      logAction(`مدير مدرسة ${sch.name}`, UserRole.SCHOOL_ADMIN, 'المدارس', `تم تسجيل دخول مدير مدرسة ${sch.name} بنجاح.`);
    } else if (role === 'TEACHER') {
      const found = teachers.find(t => t.id === selectedId);
      if (found) {
        setCurrentUser({
          role: UserRole.TEACHER,
          id: found.id,
          details: found
        });
        logAction(found.fullName, UserRole.TEACHER, 'الدروس', `تم تسجيل دخول المدرس ${found.fullName} للمنصة التعليمية.`);
      }
    } else if (role === 'STUDENT') {
      const found = students.find(s => s.id === selectedId);
      if (found) {
        setCurrentUser({
          role: UserRole.STUDENT,
          id: found.id,
          details: found
        });
        logAction(found.fullName, UserRole.STUDENT, 'الدروس', `تم تسجيل دخول الطالب ${found.fullName} لبوابة الطالب الإلكترونية.`);
      }
    } else if (role === 'PARENT') {
      const found = parents.find(p => p.id === selectedId);
      if (found) {
        setCurrentUser({
          role: UserRole.PARENT,
          id: found.id,
          details: found
        });
        logAction(found.fullName, UserRole.PARENT, 'الطلاب', `تم تسجيل دخول ولي الأمر ${found.fullName} لبوابة العائلة والمتابعة.`);
      }
    }
  };

  const handleAddSupportTicket = (ticket: any) => {
    logAction('زائر / مستخدم', UserRole.STUDENT, 'تذاكر الدعم', `تم إرسال تذكرة دعم فني جديدة بعنوان: [${ticket.title}] بتصنيف [${ticket.category}]`);
  };

  const handleLandingPageRegistration = (req: Omit<RegistrationRequest, 'id' | 'status' | 'requestDate'>) => {
    const fullReq: RegistrationRequest = {
      ...req,
      id: `req_${Date.now()}`,
      status: AdmissionStatus.PENDING,
      requestDate: new Date().toISOString()
    };
    handleAddRegistrationRequest(fullReq);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="app-viewport">
      
      {/* Dynamic Dashboard Router */}
      {!currentUser ? (
        <LandingPage
          schools={schools}
          onLogin={handleLogin}
          onAddRegistrationRequest={handleLandingPageRegistration}
          onAddSupportTicket={handleAddSupportTicket}
        />
      ) : (
        <>
          {currentUser.role === UserRole.SUPER_ADMIN && (
            <SuperAdminDashboard
              schools={schools}
              auditLogs={auditLogs}
              academicYears={academicYears}
              onAddSchool={handleAddSchool}
              onToggleSchool={(id) => {
                const sch = schools.find(s => s.id === id);
                if (sch) handleUpdateSchoolStatus(id, !sch.isActive);
              }}
              onAddAcademicYear={(year) => setAcademicYears(prev => [...prev, year])}
              onSetCurrentYear={(id) => setAcademicYears(prev => prev.map(y => ({ ...y, isCurrent: y.id === id })))}
              onLogout={handleLogout}
            />
          )}

          {currentUser.role === UserRole.SCHOOL_ADMIN && (() => {
            const sch = schools.find(s => s.id === currentUser.activeSchoolId) || schools[0];
            return (
              <SchoolAdminDashboard
                school={sch}
                schools={schools}
                students={students}
                parents={parents}
                teachers={teachers}
                subjects={subjects}
                registrationRequests={registrationRequests}
                scheduleSlots={scheduleSlots}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onTransferStudent={handleTransferStudent}
                onProcessRegistration={handleProcessRegistration}
                onAddScheduleSlot={handleAddScheduleSlot}
                onDeleteScheduleSlot={handleDeleteScheduleSlot}
                onLogout={handleLogout}
              />
            );
          })()}

          {currentUser.role === UserRole.TEACHER && (
            <TeacherDashboard
              teacher={currentUser.details}
              students={students}
              lessons={lessons}
              assignments={assignments}
              submissions={submissions}
              grades={grades}
              attendance={attendance}
              scheduleSlots={scheduleSlots}
              subjects={subjects}
              onAddLesson={handleAddLesson}
              onAddAssignment={handleAddAssignment}
              onGradeSubmission={handleGradeSubmission}
              onUpdateGradeRecord={handleUpdateGradeRecord}
              onMarkAttendance={handleMarkAttendance}
              onLogout={handleLogout}
            />
          )}

          {currentUser.role === UserRole.STUDENT && (
            <StudentPortal
              student={currentUser.details}
              lessons={lessons}
              assignments={assignments}
              submissions={submissions}
              grades={grades}
              attendance={attendance}
              scheduleSlots={scheduleSlots}
              subjects={subjects}
              quizzes={[]} // Simulating empty external quizzes
              onAddSubmission={handleAddSubmission}
              onLogout={handleLogout}
            />
          )}

          {currentUser.role === UserRole.PARENT && (
            <ParentPortal
              parent={currentUser.details}
              students={students}
              grades={grades}
              attendance={attendance}
              subjects={subjects}
              schools={schools}
              onAddRegistrationRequest={handleAddRegistrationRequest}
              onUpdateStudentTuition={handleUpdateStudentTuition}
              onLogout={handleLogout}
            />
          )}
        </>
      )}

    </div>
  );
}
