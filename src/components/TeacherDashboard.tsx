import React, { useState } from 'react';
import { 
  Teacher, Student, Lesson, Assignment, AssignmentSubmission, 
  StudentGradeRecord, AttendanceRecord, Subject, Section, GradeLevel, ScheduleSlot, PopupQuiz
} from '../types';
import { initialGradeLevels, initialSections } from '../data/initialData';
import { formatDate } from '../utils';
import { 
  Calendar, BookOpen, FileText, CheckSquare, ClipboardList, Plus, Search, 
  CheckCircle2, AlertTriangle, Send, Eye, Save, Sparkles, AlertCircle, FileSpreadsheet
} from 'lucide-react';

interface TeacherDashboardProps {
  teacher: Teacher;
  students: Student[];
  lessons: Lesson[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  grades: StudentGradeRecord[];
  attendance: AttendanceRecord[];
  scheduleSlots: ScheduleSlot[];
  subjects: Subject[];
  onAddLesson: (lesson: Lesson) => void;
  onAddAssignment: (assignment: Assignment) => void;
  onGradeSubmission: (submissionId: string, score: number, feedback: string) => void;
  onUpdateGradeRecord: (record: StudentGradeRecord) => void;
  onMarkAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  onLogout: () => void;
}

export default function TeacherDashboard({
  teacher,
  students,
  lessons,
  assignments,
  submissions,
  grades,
  attendance,
  scheduleSlots,
  subjects,
  onAddLesson,
  onAddAssignment,
  onGradeSubmission,
  onUpdateGradeRecord,
  onMarkAttendance,
  onLogout
}: TeacherDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'lessons' | 'assignments' | 'grades' | 'attendance'>('lessons');

  // Filter lessons / assignments created for this teacher's schools/subjects
  const teacherLessons = lessons.filter(l => teacher.subjectsIds.includes(l.subjectId));
  const teacherAssignments = assignments.filter(a => teacher.subjectsIds.includes(a.subjectId));
  const teacherSchedules = scheduleSlots.filter(s => s.teacherId === teacher.id);
  
  // Grade book selection states
  const [gradeSubjectId, setGradeSubjectId] = useState(teacher.subjectsIds[0] || '');
  const [gradeSectionId, setGradeSectionId] = useState('sec_7_a');
  const [selectedStudentGrade, setSelectedStudentGrade] = useState<StudentGradeRecord | null>(null);

  // Attendance selection states
  const [attSectionId, setAttSectionId] = useState('sec_7_a');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceList, setAttendanceList] = useState<{ [studentId: string]: { status: 'present' | 'absent' | 'late' | 'excused'; reason?: string } }>({});

  // New Lesson form state
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    unitName: '',
    subjectId: teacher.subjectsIds[0] || '',
    gradeLevelId: 'gr_7',
    sectionId: 'sec_7_a',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-writing-numbers-and-maths-formulas-on-glass-41584-large.mp4',
    videoDurationSeconds: 120,
    allowDownloadVideo: false,
    pdfName: '',
    wordName: '',
    popupQuizTime: 15,
    popupQuizQuestion: '',
    popupQuizOptions: ['', '', '', ''],
    popupQuizCorrect: 0
  });

  // New Assignment form state
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subjectId: teacher.subjectsIds[0] || '',
    gradeLevelId: 'gr_7',
    sectionId: 'sec_7_a',
    dueDate: '',
    maxScore: 10,
    allowMultipleAttempts: false
  });

  // Grading form state
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  const [gradingScore, setGradingScore] = useState<number>(10);
  const [gradingFeedback, setGradingFeedback] = useState('');

  // Handle lesson creation
  const handleAddLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLesson.title || !newLesson.unitName) {
      alert('الرجاء تعبئة العنوان والوحدة الدراسية.');
      return;
    }

    // Populate popup quiz if provided
    const popupQuizzes: PopupQuiz[] = [];
    if (newLesson.popupQuizQuestion) {
      popupQuizzes.push({
        timeInSeconds: Number(newLesson.popupQuizTime),
        question: {
          id: `pop_${Date.now()}`,
          questionText: newLesson.popupQuizQuestion,
          options: newLesson.popupQuizOptions.filter(o => o.trim() !== ''),
          correctOptionIndex: Number(newLesson.popupQuizCorrect)
        }
      });
    }

    onAddLesson({
      id: `les_${Date.now()}`,
      schoolId: teacher.schoolId,
      gradeLevelId: newLesson.gradeLevelId,
      sectionId: newLesson.sectionId,
      subjectId: newLesson.subjectId,
      unitName: newLesson.unitName,
      title: newLesson.title,
      description: newLesson.description,
      videoUrl: newLesson.videoUrl || undefined,
      videoDurationSeconds: Number(newLesson.videoDurationSeconds),
      allowDownloadVideo: newLesson.allowDownloadVideo,
      popupQuizzes,
      pdfUrl: newLesson.pdfName ? '#' : undefined,
      pdfName: newLesson.pdfName || undefined,
      wordUrl: newLesson.wordName ? '#' : undefined,
      wordName: newLesson.wordName || undefined,
      publishDate: new Date().toISOString(),
      viewCount: 0,
      completionRate: 0
    });

    setShowAddLesson(false);
    // Reset form
    setNewLesson({
      title: '',
      description: '',
      unitName: '',
      subjectId: teacher.subjectsIds[0] || '',
      gradeLevelId: 'gr_7',
      sectionId: 'sec_7_a',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-writing-numbers-and-maths-formulas-on-glass-41584-large.mp4',
      videoDurationSeconds: 120,
      allowDownloadVideo: false,
      pdfName: '',
      wordName: '',
      popupQuizTime: 15,
      popupQuizQuestion: '',
      popupQuizOptions: ['', '', '', ''],
      popupQuizCorrect: 0
    });
    alert('تم نشر وتعميم الدرس التفاعلي مع الكويزات المنبثقة بنجاح على الطلاب.');
  };

  // Handle Assignment creation
  const handleAddAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.dueDate) {
      alert('الرجاء تعبئة العنوان وتاريخ الاستحقاق.');
      return;
    }

    onAddAssignment({
      id: `asn_${Date.now()}`,
      schoolId: teacher.schoolId,
      gradeLevelId: newAssignment.gradeLevelId,
      sectionId: newAssignment.sectionId,
      subjectId: newAssignment.subjectId,
      title: newAssignment.title,
      description: newAssignment.description,
      dueDate: newAssignment.dueDate + 'T23:59:59',
      maxScore: Number(newAssignment.maxScore),
      allowMultipleAttempts: newAssignment.allowMultipleAttempts,
      isActive: true
    });

    setShowAddAssignment(false);
    alert('تم إدراج الواجب المدرسي الملحق بنجاح وجدولة التنبيهات للطلاب.');
  };

  // Handle Assignment grading
  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmissionId) return;
    onGradeSubmission(gradingSubmissionId, gradingScore, gradingFeedback);
    
    // Auto sync back to Grade Record matrix
    const sub = submissions.find(s => s.id === gradingSubmissionId);
    if (sub) {
      const studentGr = grades.find(g => g.studentId === sub.studentId && g.subjectId === teacher.subjectsIds[0]);
      if (studentGr) {
        onUpdateGradeRecord({
          ...studentGr,
          homeworksAvg: Number(gradingScore)
        });
      }
    }

    setGradingSubmissionId(null);
    alert('تم رصد وتقييم الواجب وحفظ الملاحظات فوراً.');
  };

  // Handle Attendance marking
  const handleSaveAttendance = () => {
    const classStudents = students.filter(s => s.schoolId === teacher.schoolId && s.sectionId === attSectionId);
    const recordsToMark = classStudents.map(std => {
      const marker = attendanceList[std.id] || { status: 'present' };
      return {
        studentId: std.id,
        date: attDate,
        status: marker.status,
        reason: marker.reason,
        markedByTeacherId: teacher.id
      };
    });

    onMarkAttendance(recordsToMark);

    // Simulate warning alert for absentees/tardiness
    const absentees = recordsToMark.filter(r => r.status === 'absent' || r.status === 'late');
    if (absentees.length > 0) {
      alert(`🔔 تم رصد وتسجيل الحضور الكلي للشعبة. تم إرسال رسائل نصية فورية لـ ${absentees.length} أولياء أمور لتنبيههم بالغياب أو التأخر عبر SMS والبريد.`);
    } else {
      alert('تم رصد وحفظ جدول الحضور بنجاح لجميع طلاب الصف.');
    }
  };

  // Grade Book calculations based on MOE regulations
  const calculateYearlyTotal = (rec: Partial<StudentGradeRecord>) => {
    const hw = rec.homeworksAvg || 0;
    const qz = rec.quizzesAvg || 0;
    const m1 = rec.monthlyExam1 || 0;
    const m2 = rec.monthlyExam2 || 0;
    const mid = rec.midYearExam || 0;
    const fin = rec.finalExam || 0;
    const act = rec.activityScore || 0;

    // Standard school weighting: (Avg HW & Activity: 10% + Monthly Avg: 30% + MidYear: 20% + FinalExam: 40%)
    const monthlyAvg = (m1 + m2) / 2;
    const hwActScore = (hw + act) / 2;
    
    const total = (hwActScore * 0.1) + (monthlyAvg * 0.3) + (mid * 0.2) + (fin * 0.4);
    const percentage = Math.min(100, Math.round(total));
    
    let letter = 'ضعيف';
    if (percentage >= 90) letter = 'امتياز 🌟';
    else if (percentage >= 80) letter = 'جيد جداً';
    else if (percentage >= 70) letter = 'جيد';
    else if (percentage >= 60) letter = 'متوسط';
    else if (percentage >= 50) letter = 'مقبول';

    return {
      total: percentage,
      percentage,
      gradeLetter: letter,
      isPassed: percentage >= 50
    };
  };

  const handleUpdateGradeRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentGrade) return;

    const calcResult = calculateYearlyTotal(selectedStudentGrade);
    onUpdateGradeRecord({
      ...selectedStudentGrade,
      yearlyTotal: calcResult.total,
      percentage: calcResult.percentage,
      gradeLetter: calcResult.gradeLetter,
      isPassed: calcResult.isPassed
    });

    setSelectedStudentGrade(null);
    alert('تم رصد وتحديث درجات الطالب بنجاح، وتعديل التقدير والنتيجة تلقائياً حسب التعليمات الوزارية.');
  };

  const currentClassStudents = students.filter(s => s.schoolId === teacher.schoolId && s.sectionId === attSectionId);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-right" dir="rtl" id="teacher-root">
      
      {/* Sidebar Layout */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-l border-slate-800">
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex gap-3 items-center">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">T</div>
          <div>
            <h2 className="text-xs font-bold text-slate-100">{teacher.fullName}</h2>
            <p className="text-[10px] text-slate-400 font-mono">Senior Instructor</p>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1.5">
          {[
            { id: 'lessons', label: 'المكتبة والدروس المنشورة', icon: BookOpen },
            { id: 'assignments', label: 'الواجبات والتسليمات', icon: CheckSquare, count: submissions.filter(s => s.status === 'submitted').length },
            { id: 'grades', label: 'دفتر الدرجات والامتحانات', icon: ClipboardList },
            { id: 'attendance', label: 'تسجيل الحضور اليومي', icon: Eye },
            { id: 'schedule', label: 'جدول المحاضرات الخاص بي', icon: Calendar },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`tch-tab-${item.id}`}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeSubTab === item.id 
                    ? 'bg-purple-600 text-white shadow-md font-bold' 
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.count ? (
                  <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{item.count}</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={onLogout}
            id="tch-logout-btn"
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-lg text-xs transition"
          >
            تسجيل الخروج من البوابة
          </button>
        </div>
      </aside>

      {/* Main Panel Workspace */}
      <main className="flex-grow p-4 sm:p-8 space-y-6 overflow-y-auto">
        
        {/* Banner with info */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">أهلاً بك أستاذ، {teacher.fullName}</h2>
            <p className="text-slate-500 text-xs mt-1">تتيح لك البوابة نشر الدروس، كويزات الفيديو التفاعلية، تصحيح الواجبات، ورصد السعي السنوي الموحد لطلابك.</p>
          </div>
          <div className="bg-purple-50 text-purple-800 border border-purple-200 px-3 py-1.5 rounded-full text-xs font-bold">
            التخصص: {teacher.subjectsIds.map(sid => subjects.find(s => s.id === sid)?.name).join(' و ')}
          </div>
        </div>

        {/* TAB 1: E-LEARNING LESSONS LIBRARY */}
        {activeSubTab === 'lessons' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800">مجموعت محاضراتي المنشورة ({teacherLessons.length})</h3>
              <button
                id="add-lesson-toggle-btn"
                onClick={() => setShowAddLesson(!showAddLesson)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition"
              >
                <Plus size={14} /> إضافة ونشر درس تفاعلي جديد
              </button>
            </div>

            {/* Add Lesson form */}
            {showAddLesson && (
              <form onSubmit={handleAddLessonSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-4 animate-fade-in">
                <h4 className="text-xs font-bold text-purple-700 border-b border-purple-100 pb-2 flex items-center gap-1"><Sparkles size={14} /> نشر درس إلكتروني ذكي</h4>
                
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">عنوان المحاضرة الرئيسي *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: ضرب الأعداد النسبية والعمليات الكبرى عليها"
                      value={newLesson.title}
                      onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">اسم الوحدة الدراسية *</label>
                    <input
                      type="text"
                      required
                      placeholder="الوحدة الأولى: الجبر"
                      value={newLesson.unitName}
                      onChange={e => setNewLesson({ ...newLesson, unitName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">المادة الدراسية التابعة *</label>
                    <select
                      value={newLesson.subjectId}
                      onChange={e => setNewLesson({ ...newLesson, subjectId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    >
                      {teacher.subjectsIds.map(sid => <option key={sid} value={sid}>{subjects.find(s => s.id === sid)?.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">الصف المستهدف *</label>
                    <select
                      value={newLesson.gradeLevelId}
                      onChange={e => setNewLesson({ ...newLesson, gradeLevelId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    >
                      {initialGradeLevels.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">الشعبة المستهدفة *</label>
                    <select
                      value={newLesson.sectionId}
                      onChange={e => setNewLesson({ ...newLesson, sectionId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    >
                      {initialSections.filter(s => s.gradeLevelId === newLesson.gradeLevelId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-600 mb-1">رابط الفيديو التوضيحي (MP4 أو Youtube) *</label>
                    <input
                      type="text"
                      placeholder="https://assets.mixkit.co/videos/preview/..."
                      value={newLesson.videoUrl}
                      onChange={e => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">مدة الفيديو الكلية (ثانية)</label>
                    <input
                      type="number"
                      value={newLesson.videoDurationSeconds}
                      onChange={e => setNewLesson({ ...newLesson, videoDurationSeconds: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">اسم مذكرة ملخص الدرس الـ PDF المرفق</label>
                    <input
                      type="text"
                      placeholder="مثال: ملخص قوانين الجبر.pdf"
                      value={newLesson.pdfName}
                      onChange={e => setNewLesson({ ...newLesson, pdfName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">اسم ورقة العمل الـ Word الملحقة</label>
                    <input
                      type="text"
                      placeholder="ورقة العمل الأسبوعية.docx"
                      value={newLesson.wordName}
                      onChange={e => setNewLesson({ ...newLesson, wordName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="allow-download-check"
                      checked={newLesson.allowDownloadVideo}
                      onChange={e => setNewLesson({ ...newLesson, allowDownloadVideo: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600 border-slate-300"
                    />
                    <label htmlFor="allow-download-check" className="text-xs text-slate-700 font-bold select-none">منع الطلاب من تحميل هذا الفيديو</label>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs text-slate-600 mb-1">وصف موجز للمحاضرة ومخرجات التعلم</label>
                    <textarea
                      rows={2}
                      placeholder="اكتب توجيهاتك للطلاب حول أهمية هذا الدرس..."
                      value={newLesson.description}
                      onChange={e => setNewLesson({ ...newLesson, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                </div>

                {/* POPUP INTERACTIVE QUIZ DESIGNER FOR VIDEOS */}
                <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200/60 space-y-3">
                  <div>
                    <h5 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-purple-600 animate-pulse" /> مصمم الكويزات التفاعلية المنبثقة خلال الفيديو (Pop-up Video Quiz)
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">قم بوضع سؤال واختياراته وتوقيت ظهوره في الفيديو. سيظهر هذا الكويز ويجبر الطالب على الإجابة لتكملة الشرح!</p>
                  </div>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-600 mb-1">وقت ظهور السؤال (بالثواني) *</label>
                      <input
                        type="number"
                        value={newLesson.popupQuizTime}
                        onChange={e => setNewLesson({ ...newLesson, popupQuizTime: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-right font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-600 mb-1">صيغة السؤال المنبثق *</label>
                      <input
                        type="text"
                        placeholder="مثال: ما قيمة ضرب رقمين سالبين في الجبر؟"
                        value={newLesson.popupQuizQuestion}
                        onChange={e => setNewLesson({ ...newLesson, popupQuizQuestion: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-right"
                      />
                    </div>
                    {newLesson.popupQuizOptions.map((opt, i) => (
                      <div key={i}>
                        <label className="block text-[10px] text-slate-600 mb-1">الاختيار رقم {i + 1} *</label>
                        <input
                          type="text"
                          placeholder={`الاختيار المتاح ${i + 1}`}
                          value={opt}
                          onChange={e => {
                            const updatedOpts = [...newLesson.popupQuizOptions];
                            updatedOpts[i] = e.target.value;
                            setNewLesson({ ...newLesson, popupQuizOptions: updatedOpts });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-right"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-[10px] text-slate-600 mb-1">مؤشر الاختيار الصحيح *</label>
                      <select
                        value={newLesson.popupQuizCorrect}
                        onChange={e => setNewLesson({ ...newLesson, popupQuizCorrect: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs text-right"
                      >
                        <option value={0}>الاختيار الأول</option>
                        <option value={1}>الاختيار الثاني</option>
                        <option value={2}>الاختيار الثالث</option>
                        <option value={3}>الاختيار الرابع</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setShowAddLesson(false)}
                    className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    إلغاء الأمر
                  </button>
                  <button 
                    type="submit" 
                    id="submit-lesson-btn"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    نشر وتعميم الدرس فوراً
                  </button>
                </div>
              </form>
            )}

            {/* Lessons published list */}
            <div className="grid md:grid-cols-2 gap-6">
              {teacherLessons.map(lesson => (
                <div key={lesson.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:shadow-md transition flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-purple-600 bg-purple-50 px-2 py-1 rounded font-bold">
                        {subjects.find(s => s.id === lesson.subjectId)?.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{formatDate(lesson.publishDate)}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">{lesson.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-md line-clamp-2">{lesson.description}</p>
                  </div>

                  {lesson.popupQuizzes.length > 0 && (
                    <div className="bg-amber-50 text-amber-800 p-2 rounded-lg text-[11px] font-semibold border border-amber-100 flex items-center gap-1.5">
                      <Sparkles size={12} className="text-amber-500 shrink-0" />
                      يحتوي على {lesson.popupQuizzes.length} كويز منبثق عند الثانية ({lesson.popupQuizzes.map(q => q.timeInSeconds).join('s، ')}s)
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Eye size={12} /> {lesson.viewCount} مشاهدة طفلية</span>
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded font-semibold text-[10px]">
                      الصف {lesson.gradeLevelId === 'gr_7' ? 'الأول المتوسط' : 'السادس الإعدادي'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ASSIGNMENTS & HOMEWORKS */}
        {activeSubTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 font-sans">إدارة الواجبات وتصحيح تسليمات الطلاب</h3>
              <button
                id="add-assignment-toggle-btn"
                onClick={() => setShowAddAssignment(!showAddAssignment)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition"
              >
                <Plus size={14} /> إنشاء واجب مدرسي جديد
              </button>
            </div>

            {/* Add Assignment form */}
            {showAddAssignment && (
              <form onSubmit={handleAddAssignmentSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">تفاصيل الواجب المدرسي الملحق</h4>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-600 mb-1">عنوان الواجب المطلوب *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: حل صفحة 12 مسائل الأعداد الصحيحة"
                      value={newAssignment.title}
                      onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">تاريخ ووقت الاستحقاق النهائي *</label>
                    <input
                      type="date"
                      required
                      value={newAssignment.dueDate}
                      onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">المادة المنهجية التابعة *</label>
                    <select
                      value={newAssignment.subjectId}
                      onChange={e => setNewAssignment({ ...newAssignment, subjectId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    >
                      {teacher.subjectsIds.map(sid => <option key={sid} value={sid}>{subjects.find(s => s.id === sid)?.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">الصف المستهدف *</label>
                    <select
                      value={newAssignment.gradeLevelId}
                      onChange={e => setNewAssignment({ ...newAssignment, gradeLevelId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    >
                      {initialGradeLevels.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">الدرجة القصوى للاختبار *</label>
                    <input
                      type="number"
                      value={newAssignment.maxScore}
                      onChange={e => setNewAssignment({ ...newAssignment, maxScore: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="allow-mult-check"
                      checked={newAssignment.allowMultipleAttempts}
                      onChange={e => setNewAssignment({ ...newAssignment, allowMultipleAttempts: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600 border-slate-300"
                    />
                    <label htmlFor="allow-mult-check" className="text-xs text-slate-700 font-bold">السماح للطالب بعدة محاولات للتسليم</label>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs text-slate-600 mb-1">وصف الواجب والتوجيهات</label>
                    <textarea
                      rows={2}
                      placeholder="اكتب التوجيهات الرياضية أو اللغوية التي تساعد الطلاب في الحل..."
                      value={newAssignment.description}
                      onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setShowAddAssignment(false)}
                    className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    id="submit-assignment-btn"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    إدراج وجدولة الواجب
                  </button>
                </div>
              </form>
            )}

            {/* Homework submissions grading section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">تسليمات الطلاب المرفوعة والمعدّة للتصحيح</h4>
              
              <div className="space-y-4">
                {submissions.map(sub => {
                  const student = students.find(s => s.id === sub.studentId);
                  const assignment = assignments.find(a => a.id === sub.assignmentId);
                  if (!student || !assignment) return null;
                  return (
                    <div key={sub.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                          <p className="font-bold text-slate-900">{student.fullName}</p>
                          <p className="text-[10px] text-slate-400">الواجب: <strong className="text-purple-700">{assignment.title}</strong> | تاريخ الرفع: {formatDate(sub.submitDate)}</p>
                        </div>

                        {sub.status === 'graded' ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            تم التصحيح والتقييم ({sub.score} / {assignment.maxScore})
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setGradingSubmissionId(sub.id);
                              setGradingScore(assignment.maxScore);
                              setGradingFeedback('');
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition"
                          >
                            تصحيح ورصد الدرجة
                          </button>
                        )}
                      </div>

                      <div className="bg-white p-3 rounded border border-slate-150 text-xs text-slate-600 leading-relaxed">
                        <p className="font-semibold text-[10px] text-slate-400 mb-1">إجابة الطالب النصية والملف المرفق:</p>
                        <p>{sub.answerText || 'لا توجد إجابة نصية مرفقة.'}</p>
                        {sub.fileName && (
                          <p className="mt-2 text-purple-700 underline flex items-center gap-1 font-mono text-[10px]">
                            <FileText size={12} /> {sub.fileName}
                          </p>
                        )}
                      </div>

                      {/* Instructor feedback view */}
                      {sub.status === 'graded' && sub.teacherFeedback && (
                        <p className="text-xs text-slate-500 bg-emerald-50/20 p-2.5 rounded border border-emerald-100">
                          <strong>ملاحظة المصحح:</strong> {sub.teacherFeedback}
                        </p>
                      )}
                    </div>
                  );
                })}

                {submissions.length === 0 && (
                  <p className="text-center text-slate-400 text-xs p-6">لا توجد تسليمات واجبات مرفوعة لطلابك حالياً.</p>
                )}
              </div>
            </div>

            {/* Grading modal */}
            {gradingSubmissionId && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                <form onSubmit={handleGradeSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
                  <h4 className="text-sm font-bold text-slate-900">رصد الدرجة وتصحيح الواجب الدراسي</h4>
                  
                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">الدرجة المستحقة للطالب *</label>
                    <input
                      type="number"
                      required
                      step="0.5"
                      value={gradingScore}
                      onChange={e => setGradingScore(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">ملاحظات وشهادة تشجيعية للطالب</label>
                    <textarea
                      rows={3}
                      placeholder="أحسنت خط جميل وخطوات دقيقة..."
                      value={gradingFeedback}
                      onChange={e => setGradingFeedback(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setGradingSubmissionId(null)}
                      className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold"
                    >
                      إلغاء
                    </button>
                    <button 
                      type="submit" 
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold"
                    >
                      حفظ ورصد الدرجة
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: GRADEBOOK MATRIX */}
        {activeSubTab === 'grades' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-slate-900">دفتر رصد الدرجات والسعي السنوي الموحد</h3>
                <p className="text-slate-400 text-[11px] mt-0.5">رصد درجات الشهرية والنشاط السنوي للطلاب، مع ترحيل البيانات تلقائياً.</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={gradeSubjectId}
                  onChange={e => setGradeSubjectId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-right"
                >
                  {teacher.subjectsIds.map(sid => <option key={sid} value={sid}>{subjects.find(s => s.id === sid)?.name}</option>)}
                </select>

                <select
                  value={gradeSectionId}
                  onChange={e => setGradeSectionId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-right"
                >
                  <option value="sec_7_a">الشعبة أ</option>
                  <option value="sec_7_b">الشعبة ب</option>
                </select>
              </div>
            </div>

            {/* Students Grades Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="p-3">اسم الطالب</th>
                      <th className="p-3 text-center">معدل الواجبات</th>
                      <th className="p-3 text-center">الامتحان الأول</th>
                      <th className="p-3 text-center">الامتحان الثاني</th>
                      <th className="p-3 text-center">نصف السنة</th>
                      <th className="p-3 text-center">نهاية السنة</th>
                      <th className="p-3 text-center">النشاط الكلي</th>
                      <th className="p-3 text-center">السعي والمجموع</th>
                      <th className="p-3 text-center">النتيجة</th>
                      <th className="p-3 text-center">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {students
                      .filter(s => s.schoolId === teacher.schoolId && s.sectionId === gradeSectionId)
                      .map(std => {
                        const rec = grades.find(g => g.studentId === std.id && g.subjectId === gradeSubjectId) || {
                          id: `grd_new_${std.id}`,
                          studentId: std.id,
                          subjectId: gradeSubjectId,
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
                        };

                        return (
                          <tr key={std.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-900">{std.fullName}</td>
                            <td className="p-3 text-center font-mono">{rec.homeworksAvg}</td>
                            <td className="p-3 text-center font-mono">{rec.monthlyExam1}</td>
                            <td className="p-3 text-center font-mono">{rec.monthlyExam2}</td>
                            <td className="p-3 text-center font-mono">{rec.midYearExam}</td>
                            <td className="p-3 text-center font-mono">{rec.finalExam}</td>
                            <td className="p-3 text-center font-mono text-purple-700 font-bold">{rec.activityScore}</td>
                            <td className="p-3 text-center font-bold font-mono text-slate-900">
                              {rec.yearlyTotal} ({rec.gradeLetter})
                            </td>
                            <td className="p-3 text-center">
                              {rec.yearlyTotal > 0 ? (
                                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                  rec.isPassed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                }`}>
                                  {rec.isPassed ? 'ناجح' : 'راسب'}
                                </span>
                              ) : (
                                <span className="text-slate-400">قيد الرصد</span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => setSelectedStudentGrade(rec)}
                                className="p-1 text-purple-600 hover:text-purple-800 bg-purple-50 rounded transition"
                                title="تحديث ورصد درجات الطالب"
                              >
                                <Save size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit Grade Book Modal */}
            {selectedStudentGrade && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                <form onSubmit={handleUpdateGradeRecordSubmit} className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
                  <h4 className="text-sm font-bold text-slate-900">رصد وحساب درجات التقييم الدراسي السنوي</h4>
                  <p className="text-xs text-slate-500">قم بتعديل الدرجات أدناه. سيقوم النظام بحساب النسبة المئوية والتقدير تلقائياً فور الحفظ.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-600 mb-1">معدل الواجبات (من 10) *</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={selectedStudentGrade.homeworksAvg}
                        onChange={e => setSelectedStudentGrade({ ...selectedStudentGrade, homeworksAvg: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-right font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-600 mb-1">الامتحان الشهري الأول *</label>
                      <input
                        type="number"
                        required
                        value={selectedStudentGrade.monthlyExam1}
                        onChange={e => setSelectedStudentGrade({ ...selectedStudentGrade, monthlyExam1: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-right font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-600 mb-1">الامتحان الشهري الثاني *</label>
                      <input
                        type="number"
                        required
                        value={selectedStudentGrade.monthlyExam2}
                        onChange={e => setSelectedStudentGrade({ ...selectedStudentGrade, monthlyExam2: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-right font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-600 mb-1">امتحان نصف السنة *</label>
                      <input
                        type="number"
                        required
                        value={selectedStudentGrade.midYearExam}
                        onChange={e => setSelectedStudentGrade({ ...selectedStudentGrade, midYearExam: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-right font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-600 mb-1">امتحان نهاية السنة *</label>
                      <input
                        type="number"
                        required
                        value={selectedStudentGrade.finalExam}
                        onChange={e => setSelectedStudentGrade({ ...selectedStudentGrade, finalExam: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-right font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-600 mb-1">النشاط والمشاركة (من 10) *</label>
                      <input
                        type="number"
                        required
                        value={selectedStudentGrade.activityScore}
                        onChange={e => setSelectedStudentGrade({ ...selectedStudentGrade, activityScore: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-right font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setSelectedStudentGrade(null)}
                      className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold"
                    >
                      إلغاء الأمر
                    </button>
                    <button 
                      type="submit" 
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold"
                    >
                      حساب وحفظ السجل الدراسي
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DAILY ATTENDANCE MARKER */}
        {activeSubTab === 'attendance' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-slate-900">سجل إثبات الغياب والحضور المدرسي اليومي</h3>
                <p className="text-slate-400 text-[11px] mt-0.5">يرجى تسجيل الحضور للطلاب؛ الغياب بدون عذر يطلق رسالة فورية لولي الأمر.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={attSectionId}
                  onChange={e => setAttSectionId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-right"
                >
                  <option value="sec_7_a">الصف السابع (أ)</option>
                  <option value="sec_7_b">الصف السابع (ب)</option>
                </select>

                <input
                  type="date"
                  value={attDate}
                  onChange={e => setAttDate(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-right"
                />
              </div>
            </div>

            {/* Attendance Matrix List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="divide-y divide-slate-100">
                {currentClassStudents.map(std => {
                  const currentMarker = attendanceList[std.id] || { status: 'present' };
                  return (
                    <div key={std.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <img src={std.avatar} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                        <div>
                          <p className="font-bold text-slate-800">{std.fullName}</p>
                          <p className="text-[10px] text-slate-400">الرقم الدراسي: {std.studentIdNo}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status togglers */}
                        {[
                          { id: 'present', label: 'حاضر', color: 'bg-emerald-50 text-emerald-700 border-emerald-300 active:bg-emerald-500 active:text-white' },
                          { id: 'absent', label: 'غائب', color: 'bg-rose-50 text-rose-700 border-rose-300 active:bg-rose-500 active:text-white' },
                          { id: 'late', label: 'متأخر', color: 'bg-amber-50 text-amber-700 border-amber-300 active:bg-amber-500 active:text-white' },
                          { id: 'excused', label: 'بإجازة', color: 'bg-blue-50 text-blue-700 border-blue-300 active:bg-blue-500 active:text-white' }
                        ].map(statusBtn => (
                          <button
                            key={statusBtn.id}
                            type="button"
                            onClick={() => {
                              setAttendanceList({
                                ...attendanceList,
                                [std.id]: {
                                  status: statusBtn.id as any,
                                  reason: currentMarker.reason
                                }
                              });
                            }}
                            className={`px-3 py-1 rounded-lg border text-[11px] font-bold transition-all ${
                              currentMarker.status === statusBtn.id 
                                ? 'bg-slate-900 text-white border-slate-900 shadow' 
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {statusBtn.label}
                          </button>
                        ))}

                        {/* Optional Reason for absence */}
                        {(currentMarker.status === 'absent' || currentMarker.status === 'excused') && (
                          <input
                            type="text"
                            placeholder="سبب الغياب..."
                            value={currentMarker.reason || ''}
                            onChange={e => {
                              setAttendanceList({
                                ...attendanceList,
                                [std.id]: {
                                  ...currentMarker,
                                  reason: e.target.value
                                }
                              });
                            }}
                            className="px-2 py-1 text-[11px] rounded border border-slate-300 text-right w-36"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}

                {currentClassStudents.length === 0 && (
                  <p className="text-center text-slate-400 text-xs p-6">لا يوجد طلاب مسجلين في هذه الشعبة الدراسية.</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-xl text-xs shadow-lg flex items-center gap-1.5 transition"
                >
                  <Save size={14} /> حفظ ورصد الحضور والغياب اليومي
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TEACHER SCHEDULE */}
        {activeSubTab === 'schedule' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">جدول محاضراتي الأسبوعي</h3>
              <p className="text-slate-400 text-[11px] mt-0.5">الحصص والقاعات الدراسية التي تدرسها في هذا الفرع للعام الحالي.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teacherSchedules.map(slot => (
                <div key={slot.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div>
                    <span className="bg-purple-100 text-purple-800 text-[9px] px-2 py-0.5 rounded-full font-bold">
                      {slot.dayOfWeek === 0 ? 'الأحد' : slot.dayOfWeek === 1 ? 'الإثنين' : slot.dayOfWeek === 2 ? 'الثلاثاء' : slot.dayOfWeek === 3 ? 'الأربعاء' : 'الخميس'} - الحصة {slot.period}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{subjects.find(s => s.id === slot.subjectId)?.name}</p>
                  <p className="text-xs text-slate-500">القاعة: {slot.roomName}</p>
                  <p className="text-[10px] text-slate-400">الوقت المحدد: {slot.timeRange}</p>
                </div>
              ))}

              {teacherSchedules.length === 0 && (
                <div className="p-8 text-center text-slate-400">ليس لديك محاضرات دراسية مجدولة في هذا الفرع.</div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
