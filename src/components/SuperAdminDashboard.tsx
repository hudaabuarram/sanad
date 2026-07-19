import React, { useState } from 'react';
import { School, UserRole, AuditLog, AcademicYear, Level, GradeLevel, Subject, Section } from '../types';
import { initialLevels, initialGradeLevels, initialSections, initialSubjects } from '../data/initialData';
import { formatDate } from '../utils';
import { 
  Building2, Users, FileBarChart2, ShieldCheck, History, Settings2, Plus, 
  Trash2, ToggleLeft, ToggleRight, CheckCircle2, XCircle, Search, Filter, 
  ArrowLeft, Edit, BookOpen, Clock, Layers
} from 'lucide-react';

interface SuperAdminDashboardProps {
  schools: School[];
  onAddSchool: (school: Omit<School, 'studentCount' | 'teacherCount' | 'classCount'>) => void;
  onToggleSchool: (id: string) => void;
  onLogout: () => void;
  auditLogs: AuditLog[];
  academicYears: AcademicYear[];
  onAddAcademicYear: (year: AcademicYear) => void;
  onSetCurrentYear: (id: string) => void;
}

export default function SuperAdminDashboard({
  schools,
  onAddSchool,
  onToggleSchool,
  onLogout,
  auditLogs,
  academicYears,
  onAddAcademicYear,
  onSetCurrentYear
}: SuperAdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'schools' | 'academic' | 'logs' | 'users'>('overview');
  
  // Search / Filter states
  const [logSearch, setLogSearch] = useState('');
  const [logOpFilter, setLogOpFilter] = useState<string>('all');
  
  // Add School form state
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchool, setNewSchool] = useState({
    id: '',
    name: '',
    nameEn: '',
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150',
    address: '',
    phone: '',
    email: '',
    isActive: true
  });

  // Academic Configuration state
  const [levels, setLevels] = useState<Level[]>(initialLevels);
  const [grades, setGrades] = useState<GradeLevel[]>(initialGradeLevels);
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);

  const [newYear, setNewYear] = useState('');
  const [newSubject, setNewSubject] = useState({ name: '', nameEn: '', gradeId: 'gr_7' });

  const handleAddSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchool.name || !newSchool.address || !newSchool.phone) {
      alert('الرجاء تعبئة البيانات الأساسية للمدرسة الجديدة.');
      return;
    }
    const generatedId = 'sch_' + Math.random().toString(36).substr(2, 5);
    onAddSchool({
      ...newSchool,
      id: generatedId
    });
    setShowAddSchool(false);
    setNewSchool({
      id: '',
      name: '',
      nameEn: '',
      logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150',
      address: '',
      phone: '',
      email: '',
      isActive: true
    });
    alert('تمت إضافة المدرسة الجديدة بنجاح للمنظومة المركزية.');
  };

  const handleAddYear = () => {
    if (!newYear) return;
    onAddAcademicYear({
      id: `yr_${Date.now()}`,
      name: newYear,
      isCurrent: false
    });
    setNewYear('');
    alert('تم إدخال سنة دراسية جديدة.');
  };

  const handleAddSubject = () => {
    if (!newSubject.name) return;
    const generatedSubId = `sub_${Date.now()}`;
    const added: Subject = {
      id: generatedSubId,
      name: newSubject.name,
      nameEn: newSubject.nameEn,
      gradeLevelId: newSubject.gradeId
    };
    setSubjects([...subjects, added]);
    setNewSubject({ name: '', nameEn: '', gradeId: 'gr_7' });
    alert('تمت إضافة مادة دراسية جديدة بنجاح.');
  };

  // Filter logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(logSearch.toLowerCase()) || 
                          log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
                          log.targetTable.toLowerCase().includes(logSearch.toLowerCase());
    const matchesOp = logOpFilter === 'all' || log.operation === logOpFilter;
    return matchesSearch && matchesOp;
  });

  // Comparative analytical stats
  const totalStudents = schools.reduce((acc, s) => acc + (s.isActive ? s.studentCount : 0), 0);
  const totalTeachers = schools.reduce((acc, s) => acc + (s.isActive ? s.teacherCount : 0), 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-right" dir="rtl" id="super-admin-root">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-l border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <ShieldCheck className="text-amber-400 shrink-0" size={28} />
          <div>
            <h2 className="text-sm font-bold text-slate-100">المسؤول العام</h2>
            <p className="text-[10px] text-slate-400 font-mono">Super Admin Account</p>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1.5">
          {[
            { id: 'overview', label: 'لوحة التحكم والمقارنات', icon: FileBarChart2 },
            { id: 'schools', label: 'إدارة الفروع والمدارس', icon: Building2 },
            { id: 'academic', label: 'إعدادات الهيكل الأكاديمي', icon: Layers },
            { id: 'logs', label: 'سجلات العمليات الأمنية', icon: History },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`sa-tab-${item.id}`}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeSubTab === item.id 
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold' 
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={onLogout}
            id="sa-logout-btn"
            className="w-full bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-400 font-bold py-2.5 rounded-lg text-xs transition flex justify-center items-center gap-2 border border-slate-700/50"
          >
            تسجيل الخروج من البوابة
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-grow p-4 sm:p-8 space-y-6 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">بوابة الإشراف والتحكم المركزي الفائق</h2>
            <p className="text-slate-500 text-xs mt-1">أنت الآن تقوم بإدارة {schools.length} مدارس تابعة للمجموعة التعليمية بشكل متزامن.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs px-3 py-1.5 rounded-full font-bold">
              العام الدراسي الحالي: {academicYears.find(y => y.isCurrent)?.name || '2025/2026'}
            </span>
          </div>
        </div>

        {/* TAB content: OVERVIEW */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[11px] font-bold">إجمالي المدارس</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{schools.length}</p>
                </div>
                <div className="bg-amber-50 text-amber-600 p-3 rounded-xl"><Building2 size={24} /></div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[11px] font-bold">إجمالي الطلاب الفعالين</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{totalStudents}</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><Users size={24} /></div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[11px] font-bold">إجمالي الكادر التدريسي</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{totalTeachers}</p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl"><Users size={24} /></div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[11px] font-bold">سجلات العمليات اليومية</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{auditLogs.length}</p>
                </div>
                <div className="bg-purple-50 text-purple-600 p-3 rounded-xl"><History size={24} /></div>
              </div>
            </div>

            {/* Platform Comparison Matrix */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">تقرير مقارنة الفروع والمدارس الأربعة</h3>
                <p className="text-slate-400 text-[11px] mt-0.5">مقارنة تحليلية لأعداد الطلاب والنشاط الأكاديمي الكلي.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-2">
                {/* School metrics comparison list */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-600">توزيع الكثافة الطلابية بين المدارس</h4>
                  <div className="space-y-3">
                    {schools.map(school => {
                      const percentage = totalStudents > 0 ? (school.studentCount / totalStudents) * 100 : 0;
                      return (
                        <div key={school.id} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold text-slate-700">
                            <span>{school.name}</span>
                            <span className="font-mono">{school.studentCount} طالب ({Math.round(percentage)}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                school.id === 'sch_noor' ? 'bg-amber-500' : 
                                school.id === 'sch_resalah' ? 'bg-sky-500' : 
                                school.id === 'sch_rowad' ? 'bg-emerald-500' : 'bg-indigo-500'
                              }`} 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Platform performance card */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">مؤشرات النشاط الكلي على منصة التعليم</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed mt-2">
                      تم تسجيل نسب استخدام تفاعلية عالية للأشهر الثلاثة الأخيرة. تم رفع إجمالي 145 درساً تفاعلياً مدعوماً بكويزات منبثقة، وتسليم 284 واجب مدرسي بنسبة رصد درجات إجمالية بلغت 98.7% عبر المنصة.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/80 text-center text-xs">
                    <div>
                      <p className="text-slate-400 text-[10px]">الدروس النشطة</p>
                      <p className="font-black text-slate-800 font-mono">145 درس</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">نسبة التفاعل الكلية</p>
                      <p className="font-black text-emerald-600 font-mono">92.4%</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">تذاكر الدعم المحلولة</p>
                      <p className="font-black text-slate-800 font-mono">99.1%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic System Audit logs preview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">سجل العمليات الأخير (Audit Log)</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">تتبع فوري لكافة محاولات الإضافة والتعديل عبر مدارس المنظومة.</p>
                </div>
                <button 
                  onClick={() => setActiveSubTab('logs')}
                  className="text-xs text-amber-600 hover:text-amber-700 font-bold underline"
                >
                  عرض السجلات كاملة
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="p-3">المستخدم والمنصب</th>
                      <th className="p-3">العملية</th>
                      <th className="p-3">الجدول المستهدف</th>
                      <th className="p-3">تفاصيل الإجراء</th>
                      <th className="p-3">الوقت والجرية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {auditLogs.slice(0, 3).map(log => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <p className="font-bold">{log.userName}</p>
                          <p className="text-[10px] text-slate-400">{log.userRole === 'SUPER_ADMIN' ? 'مسؤول عام' : 'كادر المدرسة'}</p>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            log.operation === 'إضافة' ? 'bg-emerald-50 text-emerald-700' : 
                            log.operation === 'تعديل' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {log.operation}
                          </span>
                        </td>
                        <td className="p-3 font-semibold">{log.targetTable}</td>
                        <td className="p-3 text-slate-500 max-w-xs truncate">{log.details}</td>
                        <td className="p-3 text-slate-400 font-mono">{formatDate(log.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB content: SCHOOLS */}
        {activeSubTab === 'schools' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800">إدارة المدارس والمنشآت التابعة</h3>
              <button
                id="add-school-toggle-btn"
                onClick={() => setShowAddSchool(!showAddSchool)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition"
              >
                <Plus size={14} /> إضافة فرع مدرسة جديد
              </button>
            </div>

            {/* Add school form */}
            {showAddSchool && (
              <form onSubmit={handleAddSchoolSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-4 animate-fade-in">
                <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">تفاصيل المدرسة الجديدة</h4>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">اسم المدرسة باللغة العربية *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: مدرسة بابل النموذجية"
                      value={newSchool.name}
                      onChange={e => setNewSchool({ ...newSchool, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">اسم المدرسة باللغة الإنجليزية</label>
                    <input
                      type="text"
                      placeholder="e.g. Babylon Model School"
                      value={newSchool.nameEn}
                      onChange={e => setNewSchool({ ...newSchool, nameEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">العنوان والموقع الكروكي *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: بغداد، حي الحارثية"
                      value={newSchool.address}
                      onChange={e => setNewSchool({ ...newSchool, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">رقم هاتف الاتصال والخط الساخن *</label>
                    <input
                      type="text"
                      required
                      placeholder="077XXXXXXXX"
                      value={newSchool.phone}
                      onChange={e => setNewSchool({ ...newSchool, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">البريد الإلكتروني الرسمي للمدرسة *</label>
                    <input
                      type="email"
                      required
                      placeholder="school@edu.iq"
                      value={newSchool.email}
                      onChange={e => setNewSchool({ ...newSchool, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">صورة وشعار المدرسة (رابط)</label>
                    <input
                      type="text"
                      value={newSchool.logo}
                      onChange={e => setNewSchool({ ...newSchool, logo: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right ltr"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setShowAddSchool(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    إلغاء الأمر
                  </button>
                  <button 
                    type="submit" 
                    id="submit-new-school-btn"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    حفظ وتأكيد الإضافة
                  </button>
                </div>
              </form>
            )}

            {/* Schools catalog */}
            <div className="grid md:grid-cols-2 gap-6">
              {schools.map(school => (
                <div key={school.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div className="p-5 flex gap-4">
                    <img src={school.logo} alt={school.name} className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-inner" />
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900">{school.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono" dir="ltr">{school.nameEn}</p>
                      <p className="text-xs text-slate-500">{school.address}</p>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>الطلاب: <strong className="text-slate-800">{school.studentCount}</strong></span>
                      <span>الهيئة التدريسية: <strong className="text-slate-800">{school.teacherCount}</strong></span>
                    </div>
                    
                    <button
                      onClick={() => onToggleSchool(school.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                        school.isActive 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {school.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      {school.isActive ? 'نشطة' : 'معطلة مؤقتاً'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB content: ACADEMIC CONFIGURATION */}
        {activeSubTab === 'academic' && (
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* 1. Academic Years */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900">إدارة السنوات والأعوام الدراسية</h4>
                <p className="text-slate-400 text-[10px]">تعديل العام الدراسي الجاري أو ترحيل الدفعات.</p>
              </div>

              <div className="space-y-2">
                {academicYears.map(year => (
                  <div key={year.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold font-mono text-slate-800">{year.name}</span>
                    <div className="flex items-center gap-1.5">
                      {year.isCurrent ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-bold">الحالي</span>
                      ) : (
                        <button 
                          onClick={() => onSetCurrentYear(year.id)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[9px] px-2 py-0.5 rounded-full font-semibold transition"
                        >
                          تحديد كحالي
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="مثال: 2026/2027"
                  value={newYear}
                  onChange={e => setNewYear(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-right font-mono"
                />
                <button
                  onClick={handleAddYear}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs shrink-0"
                >
                  إضافة
                </button>
              </div>
            </div>

            {/* 2. Curricula and Subjects */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:col-span-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900">إدارة المواد والمناهج الدراسية العامة</h4>
                <p className="text-slate-400 text-[10px]">تعديل المناهج الموحدة والمواد لكل صف دراسي في مدارس المنظومة.</p>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {subjects.map(sub => (
                  <div key={sub.id} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{sub.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{sub.nameEn}</p>
                    </div>
                    <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-[10px] font-semibold">
                      {grades.find(g => g.id === sub.gradeLevelId)?.name || 'الصف الأول'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <p className="text-[10px] font-bold text-slate-500">إضافة مادة دراسية جديدة للمنظومة</p>
                <div className="grid sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="اسم المادة بالعربية"
                    value={newSubject.name}
                    onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-right"
                  />
                  <input
                    type="text"
                    placeholder="Subject in English"
                    value={newSubject.nameEn}
                    onChange={e => setNewSubject({ ...newSubject, nameEn: e.target.value })}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-right ltr"
                  />
                  <select
                    value={newSubject.gradeId}
                    onChange={e => setNewSubject({ ...newSubject, gradeId: e.target.value })}
                    className="px-2 py-1.5 rounded-lg border border-slate-300 text-xs text-right"
                  >
                    {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <button
                  onClick={handleAddSubject}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs"
                >
                  تأكيد وحفظ المادة الجديدة
                </button>
              </div>
            </div>

            {/* 3. General Academic Structuring Explanation Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 lg:col-span-3">
              <h4 className="text-xs font-bold text-slate-800">هيكلية التعليم الموحد الموزع (Multi-School Curricula Integration)</h4>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                تعتمد منصة سند نظاماً ذكياً لمشاركة المناهج الدراسية، مما يتيح للمسؤول العام تعريف المواد والمقاييس لمرة واحدة (مثل مواد الصف السابع أو الثالث المتوسط)، ومن ثم تتمكن كودار المدارس من تطبيق هذه المناهج في فروعهم المستقلة، وتعيين معلمين وحصص دراسية لكل شعبة، وهو ما يضمن الجودة التعليمية وعدم التضارب.
              </p>
            </div>
          </div>
        )}

        {/* TAB content: LOGS & SECURITY */}
        {activeSubTab === 'logs' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">سجل عمليات التدقيق والمراقبة الأمنية (Audit Logs)</h3>
                <p className="text-slate-400 text-[11px] mt-0.5">سجل مفصل وغير قابل للتلاعب لتتبع حركة المستخدمين وإجراءات الإضافة والتعديل والحذف.</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Op filter */}
                <select
                  value={logOpFilter}
                  onChange={e => setLogOpFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-right"
                >
                  <option value="all">كل العمليات الإدارية</option>
                  <option value="إضافة">عمليات الإضافة</option>
                  <option value="تعديل">عمليات التعديل</option>
                  <option value="حذف">عمليات الحذف</option>
                  <option value="تسجيل دخول">عمليات تسجيل الدخول</option>
                </select>

                <div className="relative w-full sm:w-48">
                  <Search size={14} className="absolute right-2.5 top-2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ابحث باسم المستخدم..."
                    value={logSearch}
                    onChange={e => setLogSearch(e.target.value)}
                    className="w-full pr-8 pl-3 py-1.5 rounded-lg border border-slate-300 text-xs text-right focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="p-3">رقم العملية</th>
                    <th className="p-3">المستخدم</th>
                    <th className="p-3">الصفة</th>
                    <th className="p-3">الإجراء والمحطة</th>
                    <th className="p-3">التفاصيل</th>
                    <th className="p-3">عنوان الـ IP</th>
                    <th className="p-3">الوقت والتاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-[10px] text-slate-400">{log.id}</td>
                      <td className="p-3 font-bold">{log.userName}</td>
                      <td className="p-3 text-[10px] text-slate-500 font-semibold">{log.userRole}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          log.operation === 'إضافة' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                          log.operation === 'تعديل' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                          log.operation === 'تسجيل دخول' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {log.operation} - {log.targetTable}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 max-w-sm whitespace-normal leading-relaxed">{log.details}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">{log.ipAddress}</td>
                      <td className="p-3 text-slate-400 font-mono">{formatDate(log.timestamp)}</td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">لا توجد عمليات تدقيق مطابقة لبحثك الحالي.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
