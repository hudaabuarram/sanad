import React, { useState, useRef, useEffect } from 'react';
import { 
  Student, Lesson, Assignment, AssignmentSubmission, 
  StudentGradeRecord, AttendanceRecord, Subject, Section, GradeLevel, ScheduleSlot, Quiz
} from '../types';
import { formatDate } from '../utils';
import { 
  BookOpen, Video, FileText, CheckCircle2, Award, Calendar, Clock, 
  Bell, CheckCircle, XCircle, Send, Play, Pause, AlertCircle, RefreshCw
} from 'lucide-react';

interface StudentPortalProps {
  student: Student;
  lessons: Lesson[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  grades: StudentGradeRecord[];
  attendance: AttendanceRecord[];
  scheduleSlots: ScheduleSlot[];
  subjects: Subject[];
  quizzes: Quiz[];
  onAddSubmission: (submission: Omit<AssignmentSubmission, 'id' | 'submitDate' | 'status'>) => void;
  onLogout: () => void;
}

export default function StudentPortal({
  student,
  lessons,
  assignments,
  submissions,
  grades,
  attendance,
  scheduleSlots,
  subjects,
  quizzes,
  onAddSubmission,
  onLogout
}: StudentPortalProps) {
  const [activeSubTab, setActiveSubTab] = useState<'lessons' | 'assignments' | 'grades' | 'attendance' | 'schedule'>('lessons');
  
  // E-Learning Video Player states
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(lessons[0] || null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [quizShown, setQuizShown] = useState<string | null>(null); // holds question id of currently popped-up quiz
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  // Homework submitting state
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);
  const [hwAnswerText, setHwAnswerText] = useState('');
  const [hwFileName, setHwFileName] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);

  // Filters
  const studentLessons = lessons.filter(l => l.gradeLevelId === student.gradeLevelId && l.sectionId === student.sectionId);
  const studentAssignments = assignments.filter(a => a.gradeLevelId === student.gradeLevelId && a.sectionId === student.sectionId);
  const studentGrades = grades.filter(g => g.studentId === student.id);
  const studentAttendance = attendance.filter(a => a.studentId === student.id);
  const studentSchedules = scheduleSlots.filter(s => s.gradeLevelId === student.gradeLevelId && s.sectionId === student.sectionId);

  // Video progress ticking
  useEffect(() => {
    let interval: any;
    if (videoPlaying && videoRef.current) {
      interval = setInterval(() => {
        const currentTime = Math.floor(videoRef.current?.currentTime || 0);
        setVideoTime(currentTime);
        setWatchedSeconds(prev => prev + 1);

        // Check if there's a popup quiz at this second
        if (selectedLesson && selectedLesson.popupQuizzes) {
          const matchingQuiz = selectedLesson.popupQuizzes.find(q => q.timeInSeconds === currentTime);
          if (matchingQuiz && quizShown !== matchingQuiz.question.id && !quizFeedback) {
            // Pause video and trigger popup quiz!
            videoRef.current?.pause();
            setVideoPlaying(false);
            setQuizShown(matchingQuiz.question.id);
            setSelectedQuizOption(null);
            setQuizFeedback(null);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [videoPlaying, selectedLesson, quizShown, quizFeedback]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
        setVideoPlaying(false);
      } else {
        // Prevent playing if quiz is currently active and unanswered
        if (quizShown && !quizFeedback) {
          alert('الرجاء الإجابة على الكويز المنبثق أولاً لتكملة الفيديو.');
          return;
        }
        videoRef.current.play().catch(err => console.log('Video play interrupted', err));
        setVideoPlaying(true);
      }
    }
  };

  const handleQuizAnswerSubmit = (correctIdx: number) => {
    if (selectedQuizOption === null) {
      alert('الرجاء اختيار إجابة واحدة.');
      return;
    }

    if (selectedQuizOption === correctIdx) {
      setQuizFeedback('correct');
      alert('🌟 إجابة صحيحة وممتازة! واصل مشاهدة الشرح.');
    } else {
      setQuizFeedback('wrong');
      alert('❌ إجابة خاطئة! الإجابة الصحيحة تم تحديدها باللون الأخضر. حاول التركيز أكثر.');
    }

    // Dismiss quiz after short delay and resume video
    setTimeout(() => {
      setQuizShown(null);
      setQuizFeedback(null);
      setSelectedQuizOption(null);
      if (videoRef.current) {
        videoRef.current.play();
        setVideoPlaying(true);
      }
    }, 4000);
  };

  const handleHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignmentId) return;

    onAddSubmission({
      assignmentId: submittingAssignmentId,
      studentId: student.id,
      answerText: hwAnswerText,
      fileName: hwFileName || 'مرفق_الحل_المدرسي.pdf'
    });

    setSubmittingAssignmentId(null);
    setHwAnswerText('');
    setHwFileName('');
    alert('تم تسجيل وتسليم الواجب بنجاح إلى المعلم المعني للتصحيح.');
  };

  // Check if student has submitted a specific assignment
  const getSubmissionStatus = (assignmentId: string) => {
    const sub = submissions.find(s => s.assignmentId === assignmentId && s.studentId === student.id);
    if (!sub) return { status: 'pending', label: 'لم يتم التسليم', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (sub.status === 'graded') return { status: 'graded', label: `تم التصحيح والتقييم (${sub.score}/${assignmentId === 'asn_math_7_1' ? 10 : 20})`, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', feedback: sub.teacherFeedback };
    return { status: 'submitted', label: 'قيد التصحيح والتدقيق', color: 'text-blue-600 bg-blue-50 border-blue-200' };
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-right" dir="rtl" id="student-root">
      
      {/* Sidebar layout */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-l border-slate-800">
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex gap-3 items-center">
          <img src={student.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-md" />
          <div>
            <h2 className="text-xs font-bold text-slate-100">{student.fullName}</h2>
            <p className="text-[10px] text-slate-400 font-mono">Student Account</p>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1.5">
          {[
            { id: 'lessons', label: 'منصة التعليم الإلكتروني', icon: BookOpen },
            { id: 'assignments', label: 'الواجبات والمهام الحالية', icon: FileText, count: studentAssignments.length - submissions.filter(s => s.studentId === student.id).length },
            { id: 'grades', label: 'كشف الدرجات والشهادة', icon: Award },
            { id: 'attendance', label: 'سجل الحضور والغياب الخاص بي', icon: Clock },
            { id: 'schedule', label: 'الجدول الدراسي الأسبوعي', icon: Calendar },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`std-tab-${item.id}`}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeSubTab === item.id 
                    ? 'bg-emerald-600 text-white shadow font-bold' 
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
            id="std-logout-btn"
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-lg text-xs transition"
          >
            تسجيل الخروج من البوابة
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-grow p-4 sm:p-8 space-y-6 overflow-y-auto">
        
        {/* Student welcome banner */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">أهلاً بك يا بطل، {student.fullName}</h2>
            <p className="text-slate-500 text-xs">
              الصف: {student.gradeLevelId === 'gr_7' ? 'الأول المتوسط' : 'السادس الإعدادي'} - الشعبة ({student.sectionId === 'sec_7_a' || student.sectionId === 'sec_12_a' ? 'أ' : 'ب'})
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">الحضور الكلي</span>
              <span className="text-sm font-black text-emerald-600 font-mono">
                {Math.round(((studentAttendance.filter(a => a.status === 'present').length + studentAttendance.filter(a => a.status === 'late').length) / (studentAttendance.length || 1)) * 100)}%
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">المعدل العام</span>
              <span className="text-sm font-black text-purple-600 font-mono">
                {studentGrades.length > 0 ? `${Math.round(studentGrades.reduce((acc, g) => acc + g.percentage, 0) / studentGrades.length)}%` : 'قيد الرصد'}
              </span>
            </div>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE E-LEARNING CENTER */}
        {activeSubTab === 'lessons' && (
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left Column: Lesson Content List */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
              <div>
                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">فهرس المناهج والدروس المتوفرة</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">منظم هرمياً: المدرسة ← المرحلة ← الصف ← المادة ← الدرس.</p>
              </div>

              <div className="space-y-2 max-h-[450px] overflow-y-auto">
                {studentLessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => { setSelectedLesson(lesson); setVideoPlaying(false); }}
                    className={`w-full text-right p-3 rounded-xl border transition-all text-xs flex gap-3 items-center ${
                      selectedLesson?.id === lesson.id 
                        ? 'bg-emerald-50 border-emerald-300 shadow-sm' 
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="bg-emerald-500 text-white p-2 rounded-lg">
                      <Video size={14} />
                    </div>
                    <div className="flex-grow space-y-1">
                      <p className="font-bold text-slate-800 line-clamp-1">{lesson.title}</p>
                      <p className="text-[10px] text-slate-400">{subjects.find(s => s.id === lesson.subjectId)?.name || 'مادة منهجية'}</p>
                    </div>
                  </button>
                ))}

                {studentLessons.length === 0 && (
                  <p className="text-center text-slate-400 p-6">ليس لديك دروس منشورة بعد لهذا الصف.</p>
                )}
              </div>
            </div>

            {/* Right Column: Video Stream & Quiz Container */}
            <div className="lg:col-span-2 space-y-4">
              {selectedLesson ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">{selectedLesson.unitName}</span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">{selectedLesson.title}</h3>
                    </div>
                  </div>

                  {/* HTML Video player frame */}
                  <div className="bg-slate-950 rounded-2xl relative aspect-video overflow-hidden border border-slate-800 shadow-inner group">
                    <video
                      ref={videoRef}
                      src={selectedLesson.videoUrl}
                      className="w-full h-full object-contain"
                      playsInline
                      referrerPolicy="no-referrer"
                      onPlay={() => setVideoPlaying(true)}
                      onPause={() => setVideoPlaying(false)}
                    />

                    {/* INTERACTIVE VIDEO POPUP QUIZ MODAL LAYER */}
                    {quizShown && (
                      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-30">
                        {(() => {
                          const activeQuiz = selectedLesson.popupQuizzes.find(q => q.question.id === quizShown);
                          if (!activeQuiz) return null;
                          return (
                            <div className="max-w-md w-full bg-slate-900 border border-slate-800 text-slate-200 p-5 rounded-2xl space-y-4 shadow-2xl animate-scale-up">
                              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg w-fit">
                                <AlertCircle size={14} /> كويز منبثق لقياس فهمك الأكاديمي!
                              </div>
                              <h4 className="text-sm font-bold text-slate-100 leading-relaxed">{activeQuiz.question.questionText}</h4>
                              
                              <div className="space-y-2 pt-1">
                                {activeQuiz.question.options.map((opt, oIdx) => (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    onClick={() => {
                                      if (quizFeedback) return;
                                      setSelectedQuizOption(oIdx);
                                    }}
                                    className={`w-full text-right p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                                      quizFeedback && oIdx === activeQuiz.question.correctOptionIndex
                                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                        : quizFeedback && selectedQuizOption === oIdx
                                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                                        : selectedQuizOption === oIdx
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-inner'
                                        : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-slate-300'
                                    }`}
                                  >
                                    <span>{opt}</span>
                                    {quizFeedback && oIdx === activeQuiz.question.correctOptionIndex && (
                                      <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                                    )}
                                  </button>
                                ))}
                              </div>

                              {!quizFeedback && (
                                <button
                                  type="button"
                                  onClick={() => handleQuizAnswerSubmit(activeQuiz.question.correctOptionIndex)}
                                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition shadow-lg"
                                >
                                  تأكيد وإرسال الإجابة
                                </button>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Play Overlay indicator for first loaded state */}
                    {!videoPlaying && !quizShown && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer" onClick={handlePlayPause}>
                        <div className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg transition transform hover:scale-105">
                          <Play size={28} fill="currentColor" />
                        </div>
                      </div>
                    )}

                    {/* Progress details line */}
                    <div className="absolute bottom-4 right-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] text-slate-300 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={handlePlayPause} className="text-emerald-400 font-bold text-xs">
                        {videoPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                      </button>
                      <span className="font-mono">توقيت الفيديو: {videoTime}s / {selectedLesson.videoDurationSeconds}s</span>
                      <span className="text-[9px] text-emerald-400">سجل المشاهدة: {watchedSeconds} ثانية</span>
                    </div>
                  </div>

                  {/* Description details */}
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{selectedLesson.description}</p>

                  {/* Memos / Documents Attached */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <p className="text-xs font-bold text-slate-700">الملفات والمذكرات الملحقة بالدرس:</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {selectedLesson.pdfName && (
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); alert('تم بدء تحميل ملخص المحاضرة الـ PDF بنجاح.'); }}
                          className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs transition"
                        >
                          <span className="flex items-center gap-1.5 font-semibold text-slate-700"><FileText size={14} className="text-rose-500" /> {selectedLesson.pdfName}</span>
                          <span className="text-[10px] text-slate-400">تحميل PDF</span>
                        </a>
                      )}
                      {selectedLesson.wordName && (
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); alert('تم بدء تنزيل أوراق العمل التفاعلية الـ Word بنجاح.'); }}
                          className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs transition"
                        >
                          <span className="flex items-center gap-1.5 font-semibold text-slate-700"><FileText size={14} className="text-blue-500" /> {selectedLesson.wordName}</span>
                          <span className="text-[10px] text-slate-400">تحميل Word</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400">الرجاء اختيار محاضرة دراسية للمشاهدة والدراسة التفاعلية.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ASSIGNMENTS & HOMEWORKS */}
        {activeSubTab === 'assignments' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">الواجبات والمهام المدرسية المطلوبة</h3>
              <p className="text-slate-400 text-[11px] mt-0.5">يرجى متابعة المواعيد ورفع الحلول قبل انتهاء مدة التقديم لتفادي رصد الدرجات المتأخرة.</p>
            </div>

            <div className="space-y-4">
              {studentAssignments.map(asn => {
                const subStatus = getSubmissionStatus(asn.id);
                return (
                  <div key={asn.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div>
                        <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-bold">
                          {subjects.find(s => s.id === asn.subjectId)?.name}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{asn.title}</h4>
                        <p className="text-[10px] text-slate-400">تاريخ الاستحقاق النهائي: {formatDate(asn.dueDate)}</p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${subStatus.color}`}>
                        {subStatus.label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">{asn.description}</p>

                    {/* Solved attachment view or submit button */}
                    {subStatus.status === 'pending' ? (
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => setSubmittingAssignmentId(asn.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow flex items-center gap-1 transition"
                        >
                          <Send size={12} /> تقديم حل الواجب الآن
                        </button>
                      </div>
                    ) : subStatus.feedback ? (
                      <div className="bg-emerald-50/20 border border-emerald-100 p-3 rounded-lg text-xs">
                        <p className="font-bold text-emerald-800">ملاحظات وتقييم المدرس:</p>
                        <p className="text-slate-600 mt-1">{subStatus.feedback}</p>
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {studentAssignments.length === 0 && (
                <div className="bg-white p-8 rounded-2xl text-center text-slate-400">لا توجد واجبات منزلية مطلوبة منك حالياً.</div>
              )}
            </div>

            {/* Submit Homework Form Modal */}
            {submittingAssignmentId && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                <form onSubmit={handleHomeworkSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
                  <h4 className="text-sm font-bold text-slate-900">إرسال وتقديم الحل للمعلم</h4>
                  
                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">كتابة إجابتك أو خطوات الحل *</label>
                    <textarea
                      required
                      rows={4}
                      value={hwAnswerText}
                      onChange={e => setHwAnswerText(e.target.value)}
                      placeholder="اكتب خطوات الحل أو الأجوبة النهائية هنا بالتفصيل..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">اسم ملف الحل المرفق (اختياري)</label>
                    <input
                      type="text"
                      placeholder="مثال: حل_علي_الرياضيات_صفحة12.pdf"
                      value={hwFileName}
                      onChange={e => setHwFileName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setSubmittingAssignmentId(null)}
                      className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold"
                    >
                      إلغاء
                    </button>
                    <button 
                      type="submit" 
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold"
                    >
                      إرسال الحل وتأكيده
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REPORT CARDS & EXAM RESULTS */}
        {activeSubTab === 'grades' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">كشف الدرجات والنتائج والتقدير العام</h3>
              <p className="text-slate-400 text-[11px] mt-0.5">الدرجات الرسمية المسجلة في السجل الأكاديمي الموحد للفصل الدراسي الأول والثاني.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="p-3">المادة الدراسية</th>
                      <th className="p-3 text-center">الواجبات (10)</th>
                      <th className="p-3 text-center">الامتحان الأول</th>
                      <th className="p-3 text-center">الامتحان الثاني</th>
                      <th className="p-3 text-center">نصف السنة</th>
                      <th className="p-3 text-center">نهاية السنة</th>
                      <th className="p-3 text-center">النشاط (10)</th>
                      <th className="p-3 text-center">السعي الكلي (100)</th>
                      <th className="p-3 text-center">التقدير والنتيجة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {studentGrades.map(g => (
                      <tr key={g.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-900">
                          {subjects.find(s => s.id === g.subjectId)?.name || 'مادة منهجية'}
                        </td>
                        <td className="p-3 text-center font-mono">{g.homeworksAvg}</td>
                        <td className="p-3 text-center font-mono">{g.monthlyExam1}</td>
                        <td className="p-3 text-center font-mono">{g.monthlyExam2}</td>
                        <td className="p-3 text-center font-mono">{g.midYearExam}</td>
                        <td className="p-3 text-center font-mono">{g.finalExam}</td>
                        <td className="p-3 text-center font-mono text-purple-700 font-bold">{g.activityScore}</td>
                        <td className="p-3 text-center font-bold text-slate-900 font-mono">
                          {g.yearlyTotal} ({g.gradeLetter})
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            g.isPassed ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {g.isPassed ? 'ناجح' : 'راسب'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {studentGrades.length === 0 && (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-400">لم يتم رصد نتائج أو درجات لك في هذا العام بعد.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ATTENDANCE RECORDS */}
        {activeSubTab === 'attendance' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">سجل الانضباط والغياب اليومي الخاص بي</h3>
              <p className="text-slate-400 text-[11px] mt-0.5">قائمة بكافة أيام الحضور والتأخر أو الإجازات المسجلة من قبل معلمي الفصول.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentAttendance.map(att => (
                <div key={att.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 flex justify-between items-center shadow-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-mono">{att.date}</p>
                    <p className="text-sm font-bold text-slate-800">
                      {att.status === 'present' ? 'حاضر ✅' : att.status === 'absent' ? 'غائب ❌' : att.status === 'late' ? 'متأخر ⚠️' : 'بإجازة رسمية'}
                    </p>
                    {att.reason && <p className="text-[10px] text-slate-500 italic bg-slate-50 p-1.5 rounded">السبب: {att.reason}</p>}
                  </div>

                  <span className={`w-3.5 h-3.5 rounded-full ${
                    att.status === 'present' ? 'bg-emerald-500' : att.status === 'absent' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />
                </div>
              ))}

              {studentAttendance.length === 0 && (
                <div className="col-span-full p-8 text-center text-slate-400">لا توجد غيابات أو سجلات حضور مسجلة لك حالياً.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: CLASS SCHEDULE */}
        {activeSubTab === 'schedule' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">جدول الحصص والمحاضرات الأسبوعي للصف</h3>
              <p className="text-slate-400 text-[11px] mt-0.5">الحصص، المدرسون المعتمدون، وقاعات التدريس لشعبتك الحالية.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentSchedules.map(slot => (
                <div key={slot.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm">
                  <div>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-bold">
                      {slot.dayOfWeek === 0 ? 'الأحد' : slot.dayOfWeek === 1 ? 'الإثنين' : slot.dayOfWeek === 2 ? 'الثلاثاء' : slot.dayOfWeek === 3 ? 'الأربعاء' : 'الخميس'} - الحصة {slot.period}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{subjects.find(s => s.id === slot.subjectId)?.name}</p>
                  <p className="text-xs text-slate-500">القاعة: {slot.roomName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">الوقت: {slot.timeRange}</p>
                </div>
              ))}

              {studentSchedules.length === 0 && (
                <div className="p-8 text-center text-slate-400">لم يتم رصد جدول حصص لشعبتك بعد.</div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
