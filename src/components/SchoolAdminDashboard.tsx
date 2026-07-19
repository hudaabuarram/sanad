import React, { useState, useRef } from 'react';
import { 
  School, Student, Parent, Teacher, RegistrationRequest, 
  StudentStatus, AdmissionStatus, Subject, Section, GradeLevel, ScheduleSlot 
} from '../types';
import { initialGradeLevels, initialSections } from '../data/initialData';
import { formatDate, exportToCSV, printStudentCard } from '../utils';
import { 
  Users, UserCheck, UserMinus, UserX, UserPlus, Search, Filter, Mail, Phone, 
  MapPin, CheckCircle, XCircle, FileSpreadsheet, Printer, ArrowRightLeft, 
  Calendar, Clock, BookOpen, AlertCircle, RefreshCw, Layers, Plus, Trash
} from 'lucide-react';

interface SchoolAdminDashboardProps {
  school: School;
  schools: School[];
  students: Student[];
  parents: Parent[];
  teachers: Teacher[];
  subjects: Subject[];
  registrationRequests: RegistrationRequest[];
  scheduleSlots: ScheduleSlot[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (id: string, updated: Partial<Student>) => void;
  onTransferStudent: (id: string, targetSchoolId: string) => void;
  onProcessRegistration: (requestId: string, status: AdmissionStatus, notes?: string) => void;
  onAddScheduleSlot: (slot: Omit<ScheduleSlot, 'id'>) => void;
  onDeleteScheduleSlot: (id: string) => void;
  onLogout: () => void;
}

export default function SchoolAdminDashboard({
  school,
  schools,
  students,
  parents,
  teachers,
  subjects,
  registrationRequests,
  scheduleSlots,
  onAddStudent,
  onUpdateStudent,
  onTransferStudent,
  onProcessRegistration,
  onAddScheduleSlot,
  onDeleteScheduleSlot,
  onLogout
}: SchoolAdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'students' | 'admissions' | 'schedule' | 'reports'>('students');
  
  // Student view states
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Add/Edit student modals
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferSchoolId, setTransferSchoolId] = useState('');

  // Excel simulation state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [excelImporting, setExcelImporting] = useState(false);

  // New Student state
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    fullNameEn: '',
    examNo: '',
    gender: 'ذكر' as 'ذكر' | 'أنثى',
    birthDate: '',
    gradeLevelId: 'gr_7',
    sectionId: 'sec_7_a',
    address: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    parentRelation: 'أب',
    email: '',
    notes: ''
  });

  // Schedule Slot state
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [newSlot, setNewSlot] = useState({
    gradeLevelId: 'gr_7',
    sectionId: 'sec_7_a',
    subjectId: '',
    teacherId: '',
    dayOfWeek: 0,
    period: 1,
    timeRange: '08:00 - 08:45',
    roomName: ''
  });

  // Filter students for THIS school only
  const schoolStudents = students.filter(std => std.schoolId === school.id);
  
  const filteredStudents = schoolStudents.filter(std => {
    const matchesSearch = std.fullName.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          std.studentIdNo.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || std.gradeLevelId === selectedGrade;
    const matchesStatus = selectedStatus === 'all' || std.studyStatus === selectedStatus;
    return matchesSearch && matchesGrade && matchesStatus;
  });

  // Filter admissions for this school
  const schoolAdmissions = registrationRequests.filter(req => req.schoolId === school.id);

  // Filter schedule slots for this school
  const schoolSchedules = scheduleSlots.filter(sc => sc.schoolId === school.id);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.fullName || !newStudent.parentPhone) {
      alert('يرجى ملء جميع الحقول الضرورية.');
      return;
    }
    const studentIdNo = 'STD-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 9000 + 1000);
    const mockStudent: Student = {
      id: `std_${Date.now()}`,
      studentIdNo,
      examNo: newStudent.examNo || undefined,
      fullName: newStudent.fullName,
      fullNameEn: newStudent.fullNameEn,
      avatar: newStudent.gender === 'ذكر' 
        ? 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' 
        : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      gender: newStudent.gender,
      birthDate: newStudent.birthDate || '2012-01-01',
      schoolId: school.id,
      gradeLevelId: newStudent.gradeLevelId,
      sectionId: newStudent.sectionId,
      academicYearId: '2025_2026',
      address: newStudent.address,
      phone: newStudent.phone,
      parentPhone: newStudent.parentPhone,
      parentName: newStudent.parentName,
      parentRelation: newStudent.parentRelation,
      email: newStudent.email || `${studentIdNo.toLowerCase()}@student.edu.iq`,
      studyStatus: StudentStatus.CONTINUING,
      isRegistered: true,
      documents: [],
      notes: newStudent.notes,
      isActive: true
    };

    onAddStudent(mockStudent);
    setShowAddStudent(false);
    // Reset
    setNewStudent({
      fullName: '',
      fullNameEn: '',
      examNo: '',
      gender: 'ذكر',
      birthDate: '',
      gradeLevelId: 'gr_7',
      sectionId: 'sec_7_a',
      address: '',
      phone: '',
      parentName: '',
      parentPhone: '',
      parentRelation: 'أب',
      email: '',
      notes: ''
    });
    alert('تم تسجيل وإصدار الرقم الدراسي للطالب الجديد بنجاح.');
  };

  const handleExportStudents = () => {
    const formattedData = schoolStudents.map(s => ({
      'الرقم التعريفي': s.studentIdNo,
      'الاسم الكامل': s.fullName,
      'الجنس': s.gender,
      'الصف': s.gradeLevelId === 'gr_7' ? 'الأول المتوسط' : s.gradeLevelId === 'gr_9' ? 'الثالث المتوسط' : 'السادس الإعدادي',
      'الشعبة': s.sectionId === 'sec_7_a' || s.sectionId === 'sec_9_a' || s.sectionId === 'sec_12_a' ? 'أ' : 'ب',
      'حالة الطالب': s.studyStatus,
      'اسم ولي الأمر': s.parentName,
      'هاتف ولي الأمر': s.parentPhone,
      'العنوان': s.address
    }));
    exportToCSV(formattedData, `دليل_طلاب_${school.name}`);
  };

  const handleSimulateExcelImport = () => {
    setExcelImporting(true);
    setTimeout(() => {
      // Simulate adding 2 imported students
      const imp1: Student = {
        id: `std_imp_${Date.now()}_1`,
        studentIdNo: 'STD-2026-EX77',
        fullName: 'منتظر عمار ميثم التميمي',
        fullNameEn: 'Muntadhar Ammar Al-Tamimi',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
        gender: 'ذكر',
        birthDate: '2012-04-10',
        schoolId: school.id,
        gradeLevelId: 'gr_7',
        sectionId: 'sec_7_a',
        academicYearId: '2025_2026',
        address: 'بغداد، المنصور، قرب مطعم حبايبنا',
        phone: '07714521234',
        parentPhone: '07702581234',
        parentName: 'عمار ميثم التميمي',
        parentRelation: 'أب',
        email: 'munt@student.edu.iq',
        studyStatus: StudentStatus.CONTINUING,
        isRegistered: true,
        documents: [],
        isActive: true
      };
      
      const imp2: Student = {
        id: `std_imp_${Date.now()}_2`,
        studentIdNo: 'STD-2026-EX88',
        fullName: 'ميسم عادل فاروق الحيالي',
        fullNameEn: 'Maisam Adel Al-Hayali',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        gender: 'أنثى',
        birthDate: '2012-11-20',
        schoolId: school.id,
        gradeLevelId: 'gr_7',
        sectionId: 'sec_7_b',
        academicYearId: '2025_2026',
        address: 'بغداد، الكندي، قرب مول النخيل',
        phone: '07801235544',
        parentPhone: '07804561122',
        parentName: 'عادل فاروق الحيالي',
        parentRelation: 'أب',
        email: 'mais@student.edu.iq',
        studyStatus: StudentStatus.CONTINUING,
        isRegistered: true,
        documents: [],
        isActive: true
      };

      onAddStudent(imp1);
      onAddStudent(imp2);
      setExcelImporting(false);
      alert('نجاح الاستيراد! تم العثور على طالبين جديدين في ملف Excel وتمت مطابقتهم وإضافتهم لقاعدة البيانات بنجاح.');
    }, 1200);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !transferSchoolId) return;
    onTransferStudent(selectedStudent.id, transferSchoolId);
    setShowTransfer(false);
    setSelectedStudent(null);
    alert('تم نقل ملف الطالب وسجلاته المالية والأكاديمية للمدرسة المستهدفة بنجاح.');
  };

  const handleAddScheduleSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.subjectId || !newSlot.teacherId || !newSlot.roomName) {
      alert('الرجاء تعبئة حقول المادة والمعلم والقاعة الدراسية.');
      return;
    }

    // Double booking verification
    const doubleBooked = schoolSchedules.find(sc => 
      sc.teacherId === newSlot.teacherId && 
      sc.dayOfWeek === Number(newSlot.dayOfWeek) && 
      sc.period === Number(newSlot.period)
    );

    if (doubleBooked) {
      alert(`⚠️ خطأ تعارض في الجداول! المدرس المعين لديه حصة دراسية بالفعل في نفس اليوم (الحصة ${newSlot.period}) مع صف آخر.`);
      return;
    }

    onAddScheduleSlot({
      schoolId: school.id,
      gradeLevelId: newSlot.gradeLevelId,
      sectionId: newSlot.sectionId,
      subjectId: newSlot.subjectId,
      teacherId: newSlot.teacherId,
      dayOfWeek: Number(newSlot.dayOfWeek),
      period: Number(newSlot.period),
      timeRange: newSlot.period === 1 ? '08:00 - 08:45' : newSlot.period === 2 ? '08:45 - 09:30' : newSlot.period === 3 ? '09:45 - 10:30' : '10:30 - 11:15',
      roomName: newSlot.roomName
    });

    setShowAddSchedule(false);
    alert('تمت إضافة الحصة الأسبوعية لجدول الصف بنجاح وبدون تعارض.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-right" dir="rtl" id="school-admin-root">
      
      {/* Sidebar Layout */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-l border-slate-800">
        <div className="p-6 border-b border-slate-800 flex gap-3 items-center bg-slate-950">
          <img src={school.logo} className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-md" />
          <div>
            <h2 className="text-xs font-bold text-slate-100">{school.name}</h2>
            <p className="text-[10px] text-slate-400 font-mono">School Administrator</p>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1.5">
          {[
            { id: 'students', label: 'دليل وحسابات الطلاب', icon: Users },
            { id: 'admissions', label: 'طلبات القبول والتسجيل', icon: UserCheck, count: schoolAdmissions.filter(a => a.status === 'قيد المراجعة').length },
            { id: 'schedule', label: 'الجداول الدراسية الأسبوعية', icon: Calendar },
            { id: 'reports', label: 'التقارير وسير حضور الغياب', icon: AlertCircle }
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`sch-tab-${item.id}`}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeSubTab === item.id 
                    ? 'bg-slate-100 text-slate-950 shadow font-bold' 
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.count ? (
                  <span className="bg-rose-500 text-white font-black text-[10px] px-1.5 py-0.5 rounded-full animate-bounce">{item.count}</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={onLogout}
            id="sch-logout-btn"
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-lg text-xs transition"
          >
            الخروج من لوحة المدرسة
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-grow p-4 sm:p-8 space-y-6 overflow-y-auto">
        
        {/* Statistics Banner */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">إدارة الفرع: {school.name}</h2>
            <p className="text-slate-500 text-xs mt-1">البوابة الإدارية الموزعة للتحكم بملفات طلاب المدرسة، القاعات الدراسية، والقبول المباشر.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">طلاب الفرع</span>
              <span className="text-sm font-black text-slate-800 font-mono">{schoolStudents.length}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">المعلمون الكفلاء</span>
              <span className="text-sm font-black text-slate-800 font-mono">{teachers.filter(t => t.schoolId === school.id).length}</span>
            </div>
          </div>
        </div>

        {/* SUBTAB 1: STUDENTS DIRECTORY */}
        {activeSubTab === 'students' && (
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              {/* Actions & Filters */}
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                <button
                  id="add-student-btn"
                  onClick={() => setShowAddStudent(!showAddStudent)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition"
                >
                  <UserPlus size={14} /> تسجيل طالب جديد
                </button>

                <button
                  onClick={handleExportStudents}
                  className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition"
                >
                  <FileSpreadsheet size={14} /> تصدير Excel
                </button>

                <button
                  onClick={handleSimulateExcelImport}
                  disabled={excelImporting}
                  className="bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <RefreshCw size={14} className={excelImporting ? 'animate-spin' : ''} />
                  {excelImporting ? 'جاري الاستيراد...' : 'استيراد من Excel'}
                </button>
              </div>

              {/* Advanced search filters */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <select
                  value={selectedGrade}
                  onChange={e => setSelectedGrade(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-right"
                >
                  <option value="all">كل الصفوف والمستويات</option>
                  <option value="gr_7">الأول المتوسط</option>
                  <option value="gr_9">الثالث المتوسط</option>
                  <option value="gr_12">السادس الإعدادي</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-right"
                >
                  <option value="all">كل الحالات الدراسية</option>
                  <option value="مستمر">مستمر</option>
                  <option value="منقول">منقول</option>
                  <option value="مفصل">مفصول</option>
                  <option value="متخرج">متخرج</option>
                </select>

                <div className="relative w-full sm:w-48 lg:w-56">
                  <Search size={14} className="absolute right-2.5 top-2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ابحث بالاسم أو الرقم الدراسي..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    className="w-full pr-8 pl-3 py-1.5 rounded-lg border border-slate-300 text-xs text-right focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Registration Student form */}
            {showAddStudent && (
              <form onSubmit={handleCreateStudent} className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-4 animate-fade-in">
                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">تفاصيل الملف الدراسي للطالب الجديد</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">الاسم الرباعي الكامل *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: مصطفى عادل فاروق الجبوري"
                      value={newStudent.fullName}
                      onChange={e => setNewStudent({ ...newStudent, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">الاسم باللغة الإنجليزية</label>
                    <input
                      type="text"
                      placeholder="e.g. Mustafa Adel Farooq"
                      value={newStudent.fullNameEn}
                      onChange={e => setNewStudent({ ...newStudent, fullNameEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">الرقم الامتحاني (إن وجد)</label>
                    <input
                      type="text"
                      placeholder="EXM-XXXXXX"
                      value={newStudent.examNo}
                      onChange={e => setNewStudent({ ...newStudent, examNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">الجنس *</label>
                    <select
                      value={newStudent.gender}
                      onChange={e => setNewStudent({ ...newStudent, gender: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    >
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">تاريخ الميلاد *</label>
                    <input
                      type="date"
                      required
                      value={newStudent.birthDate}
                      onChange={e => setNewStudent({ ...newStudent, birthDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">الصف الدراسي *</label>
                    <select
                      value={newStudent.gradeLevelId}
                      onChange={e => setNewStudent({ ...newStudent, gradeLevelId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    >
                      {initialGradeLevels.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">الشعبة الدراسية المعينة *</label>
                    <select
                      value={newStudent.sectionId}
                      onChange={e => setNewStudent({ ...newStudent, sectionId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    >
                      {initialSections.filter(s => s.gradeLevelId === newStudent.gradeLevelId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">اسم ولي الأمر الثلاثي *</label>
                    <input
                      type="text"
                      required
                      placeholder="عادل فاروق الجبوري"
                      value={newStudent.parentName}
                      onChange={e => setNewStudent({ ...newStudent, parentName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">رقم هاتف ولي الأمر (لإشعارات الطوارئ) *</label>
                    <input
                      type="text"
                      required
                      placeholder="077XXXXXXXX"
                      value={newStudent.parentPhone}
                      onChange={e => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right ltr"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-600 mb-1">عنوان السكن الدائم *</label>
                    <input
                      type="text"
                      required
                      placeholder="المحافظة، المنطقة، أقرب نقطة دالة"
                      value={newStudent.address}
                      onChange={e => setNewStudent({ ...newStudent, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">ملاحظات إدارية ملحقة</label>
                    <input
                      type="text"
                      placeholder="أي معلومات صحية أو دراسية مهمة"
                      value={newStudent.notes}
                      onChange={e => setNewStudent({ ...newStudent, notes: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setShowAddStudent(false)}
                    className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    إلغاء الأمر
                  </button>
                  <button 
                    type="submit" 
                    id="submit-student-form-btn"
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    تسجيل وحفظ ملف الطالب
                  </button>
                </div>
              </form>
            )}

            {/* Students directory table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="p-3">الطالب ورقمه الدراسي</th>
                      <th className="p-3">الجنس والصف الدراسية</th>
                      <th className="p-3">ولي الأمر والاتصال</th>
                      <th className="p-3">حالة الطالب الدراسية</th>
                      <th className="p-3 text-center">خيارات التحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredStudents.map(std => (
                      <tr key={std.id} className="hover:bg-slate-50/50">
                        <td className="p-3 flex items-center gap-3">
                          <img src={std.avatar} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                          <div>
                            <p className="font-bold text-slate-900">{std.fullName}</p>
                            <p className="text-[10px] text-slate-400 font-mono" dir="ltr">{std.studentIdNo}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-slate-800">
                            {std.gradeLevelId === 'gr_7' ? 'الأول المتوسط' : std.gradeLevelId === 'gr_9' ? 'الثالث المتوسط' : 'السادس الإعدادي'}
                          </p>
                          <p className="text-[10px] text-slate-400">الجنس: {std.gender} | الشعبة: {std.sectionId === 'sec_7_a' || std.sectionId === 'sec_9_a' || std.sectionId === 'sec_12_a' ? 'أ' : 'ب'}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-slate-700">{std.parentName} ({std.parentRelation})</p>
                          <p className="text-[10px] text-slate-400 font-mono">{std.parentPhone}</p>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            std.studyStatus === StudentStatus.CONTINUING ? 'bg-emerald-50 text-emerald-700' : 
                            std.studyStatus === StudentStatus.TRANSFERRED ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {std.studyStatus}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="inline-flex gap-1.5 justify-center">
                            {/* Card print */}
                            <button
                              title="طباعة بطاقة الطالب"
                              onClick={() => printStudentCard(std, school.name)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                            >
                              <Printer size={14} />
                            </button>

                            {/* Transfer Student */}
                            <button
                              title="نقل الطالب لفرع آخر"
                              onClick={() => { setSelectedStudent(std); setShowTransfer(true); }}
                              className="p-1.5 text-slate-500 hover:text-amber-700 bg-slate-100 hover:bg-amber-50 rounded-lg transition"
                            >
                              <ArrowRightLeft size={14} />
                            </button>

                            {/* Archive student / suspend */}
                            <button
                              title="إيقاف حساب الطالب"
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من تغيير حالة الحساب للطالب ${std.fullName}؟`)) {
                                  onUpdateStudent(std.id, {
                                    studyStatus: std.studyStatus === StudentStatus.SUSPENDED ? StudentStatus.CONTINUING : StudentStatus.SUSPENDED
                                  });
                                }
                              }}
                              className={`p-1.5 rounded-lg transition ${
                                std.studyStatus === StudentStatus.SUSPENDED 
                                  ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' 
                                  : 'text-rose-500 bg-rose-50 hover:bg-rose-100'
                              }`}
                            >
                              {std.studyStatus === StudentStatus.SUSPENDED ? <UserCheck size={14} /> : <UserMinus size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">لا توجد سجلات طلاب مطابقة لبحثك في هذا الفرع.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transfer student Modal */}
            {showTransfer && selectedStudent && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                <form onSubmit={handleTransferSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
                  <h4 className="text-sm font-bold text-slate-900">نقل ملف الطالب خارج الفرع</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">أنت الآن تقوم بإجراء ترحيل ونقل لملف الطالب <strong>{selectedStudent.fullName}</strong> إلى مدرسة أخرى ضمن المنظومة المركزية.</p>
                  
                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">المدرسة المستهدفة للنقل *</label>
                    <select
                      required
                      value={transferSchoolId}
                      onChange={e => setTransferSchoolId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    >
                      <option value="">اختر مدرسة للترحيل...</option>
                      {schools.filter(s => s.id !== school.id).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => { setShowTransfer(false); setSelectedStudent(null); }}
                      className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold"
                    >
                      إلغاء
                    </button>
                    <button 
                      type="submit" 
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-xs font-bold"
                    >
                      نقل ملف الطالب
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 2: REGISTRATION & ADMISSIONS REQUESTS */}
        {activeSubTab === 'admissions' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">طلبات القبول والتسجيل الإلكتروني المرفوعة</h3>
              <p className="text-slate-400 text-[11px] mt-0.5">قائمة بجميع الطلبات الإلكترونية التي رفعها أولياء الأمور عبر الموقع الإلكتروني.</p>
            </div>

            <div className="space-y-4">
              {schoolAdmissions.map(req => (
                <div key={req.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-500 text-slate-950 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">REQ</span>
                        <h4 className="text-sm font-bold text-slate-900">{req.fullName}</h4>
                      </div>
                      <p className="text-xs text-slate-500">ولي الأمر: {req.parentName} | الهاتف: {req.parentPhone} | عنوان السكن: {req.address}</p>
                      <p className="text-[10px] text-slate-400">تاريخ رفع الطلب: {formatDate(req.requestDate)}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      req.status === 'قيد المراجعة' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                      req.status === 'مقبول' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  {/* Documents attachment simulation */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-500">المستمسكات والملفات المرفوعة للتدقيق:</p>
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                      {req.documents?.map((doc, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 px-2 py-1 rounded flex items-center gap-1">
                          <BookOpen size={10} className="text-slate-400" />
                          {doc.name} ({doc.size})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Admin actions */}
                  {req.status === 'قيد المراجعة' && (
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                      <button
                        onClick={() => {
                          const note = prompt('اكتب سبب الرفض (اختياري):');
                          onProcessRegistration(req.id, AdmissionStatus.REJECTED, note || undefined);
                        }}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        رفض الطلب
                      </button>

                      <button
                        onClick={() => {
                          onProcessRegistration(req.id, AdmissionStatus.APPROVED, 'تم مطابقة مستنداته والتصديق على قبوله كطالب فعال.');
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        قبول الطلب وتعديله لطالب فعال
                      </button>
                    </div>
                  )}

                  {req.adminNotes && (
                    <p className="text-xs text-slate-500 bg-slate-50/50 p-2 rounded border border-slate-100">
                      <strong>ملاحظة الإدارة:</strong> {req.adminNotes}
                    </p>
                  )}
                </div>
              ))}

              {schoolAdmissions.length === 0 && (
                <div className="bg-white p-8 rounded-2xl text-center text-slate-400">لا توجد طلبات تسجيل إلكترونية مرفوعة لهذا الفرع بعد.</div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 3: TIMETABLES & SCHEDULING */}
        {activeSubTab === 'schedule' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-slate-900">إدارة الجداول والحصص الدراسية الأسبوعية</h3>
                <p className="text-slate-400 text-[11px]">جدولة حصص المعلمين والمواد لمنع أي تعارض في الساعات أو القاعات.</p>
              </div>
              <button
                id="add-schedule-slot-btn"
                onClick={() => setShowAddSchedule(!showAddSchedule)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 transition"
              >
                <Plus size={14} /> إضافة حصة دراسية جديدة
              </button>
            </div>

            {/* Add schedule form */}
            {showAddSchedule && (
              <form onSubmit={handleAddScheduleSlot} className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">جدولة حصة دراسية أسبوعية جديدة</h4>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">الصف المستهدف *</label>
                    <select
                      value={newSlot.gradeLevelId}
                      onChange={e => setNewSlot({ ...newSlot, gradeLevelId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    >
                      {initialGradeLevels.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">الشعبة المعنية *</label>
                    <select
                      value={newSlot.sectionId}
                      onChange={e => setNewSlot({ ...newSlot, sectionId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    >
                      {initialSections.filter(s => s.gradeLevelId === newSlot.gradeLevelId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">المادة المنهجية *</label>
                    <select
                      value={newSlot.subjectId}
                      onChange={e => setNewSlot({ ...newSlot, subjectId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    >
                      <option value="">اختر مادة منهجية...</option>
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">المعلم الكفيل *</label>
                    <select
                      value={newSlot.teacherId}
                      onChange={e => setNewSlot({ ...newSlot, teacherId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    >
                      <option value="">اختر معلماً للجدول...</option>
                      {teachers.filter(t => t.schoolId === school.id).map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">اليوم الدراسي *</label>
                    <select
                      value={newSlot.dayOfWeek}
                      onChange={e => setNewSlot({ ...newSlot, dayOfWeek: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    >
                      <option value={0}>الأحد</option>
                      <option value={1}>الإثنين</option>
                      <option value={2}>الثلاثاء</option>
                      <option value={3}>الأربعاء</option>
                      <option value={4}>الخميس</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">الحصة الدراسية (الوقت) *</label>
                    <select
                      value={newSlot.period}
                      onChange={e => setNewSlot({ ...newSlot, period: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right font-mono"
                    >
                      <option value={1}>الحصة الأولى (08:00 - 08:45)</option>
                      <option value={2}>الحصة الثانية (08:45 - 09:30)</option>
                      <option value={3}>الحصة الثالثة (09:45 - 10:30)</option>
                      <option value={4}>الحصة الرابعة (10:30 - 11:15)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-600 mb-1">اسم القاعة أو الفصل المدرسي *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: قاعة الفارابي، الطابق الأول"
                      value={newSlot.roomName}
                      onChange={e => setNewSlot({ ...newSlot, roomName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setShowAddSchedule(false)}
                    className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    إلغاء الأمر
                  </button>
                  <button 
                    type="submit" 
                    id="submit-schedule-btn"
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    جدولة وإدراج الحصة
                  </button>
                </div>
              </form>
            )}

            {/* Timetable schedule grid visualization */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-700">الجدول الدراسي العام النشط لفرع المدرسة</h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {schoolSchedules.map(slot => (
                  <div key={slot.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 relative">
                    <button 
                      onClick={() => {
                        if (confirm('هل ترغب في حذف وإلغاء هذه الحصة من الجدول؟')) onDeleteScheduleSlot(slot.id);
                      }}
                      className="absolute left-2.5 top-2.5 text-slate-400 hover:text-rose-600 transition"
                      title="حذف الحصة"
                    >
                      <Trash size={14} />
                    </button>
                    <div>
                      <span className="bg-slate-200 text-slate-700 text-[9px] px-2 py-0.5 rounded font-bold">
                        {slot.dayOfWeek === 0 ? 'الأحد' : slot.dayOfWeek === 1 ? 'الإثنين' : slot.dayOfWeek === 2 ? 'الثلاثاء' : slot.dayOfWeek === 3 ? 'الأربعاء' : 'الخميس'} - الحصة {slot.period}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{subjects.find(s => s.id === slot.subjectId)?.name || 'مادة منهجية'}</p>
                    <div className="text-xs text-slate-500 space-y-1">
                      <p>المدرس: {teachers.find(t => t.id === slot.teacherId)?.fullName || 'المدرس الكفيل'}</p>
                      <p>الصف: {slot.gradeLevelId === 'gr_7' ? 'الأول المتوسط' : 'الثاني عشر'}</p>
                      <p>القاعة: {slot.roomName}</p>
                    </div>
                  </div>
                ))}

                {schoolSchedules.length === 0 && (
                  <div className="col-span-full p-8 text-center text-slate-400">لا توجد حصص دراسية مجدولة لهذا الفرع بعد.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: REPORTS & ATTENDANCE AT SCHOOL LEVEL */}
        {activeSubTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900">سجل إحصائيات الغياب والحضور المدرسي للفرع</h3>
              <p className="text-slate-400 text-[11px]">متابعة لنسب الانضباط والحد من الغيابات عبر مدارس المنصة.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Absentees alert card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><AlertCircle size={16} className="text-rose-500" /> تنبيه الغيابات وحالات الانضباط الحرجة</h4>
                <p className="text-slate-500 text-xs">قائمة بالطلاب الذين لديهم تكرار غياب لأكثر من 3 أيام متتالية أو متقطعة دون أعذار رسمية.</p>

                <div className="space-y-3.5 pt-2">
                  {[
                    { name: 'فاطمة محمد العبيدي', class: 'الصف الأول المتوسط (ب)', absCount: '3 أيام غياب متقطعة', risk: 'مرتفع' },
                    { name: 'علي أحمد حامد السعدي', class: 'الصف الأول المتوسط (أ)', absCount: 'يوم واحد متأخر', risk: 'منخفض' }
                  ].map((std, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-800">{std.name}</p>
                        <p className="text-[10px] text-slate-400">{std.class}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-rose-600 font-bold block">{std.absCount}</span>
                        <span className="text-[9px] text-slate-400">مستوى الخطر: {std.risk}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance metrics */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-700">تقرير الالتزام الكلي والانضباط لشهر تموز</h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">بناءً على السجلات اليومية المرفوعة من قبل معلمي المواد والشعب الدراسية، بلغت نسبة الحضور الكلي الفعال في مدرسة النور النموذجية لهذا الأسبوع 96.1%، وهو ما يعكس التزام الطلاب وأولياء أمورهم بمتابعة التحصيل العلمي.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-center">
                  <div>
                    <span className="text-2xl font-black text-slate-800 font-mono">96.1%</span>
                    <span className="text-[10px] text-slate-400 block mt-1">نسبة الحضور الحالية</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-rose-500 font-mono">3.9%</span>
                    <span className="text-[10px] text-slate-400 block mt-1">نسبة غياب الفرع الإجمالية</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
