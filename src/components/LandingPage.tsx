import React, { useState } from 'react';
import { School, RegistrationRequest, AdmissionStatus } from '../types';
import { initialSchools, initialLevels, initialGradeLevels } from '../data/initialData';
import { BookOpen, Users, Shield, Phone, MapPin, Mail, ArrowLeft, GraduationCap, CheckCircle2, AlertCircle, FileText, Send } from 'lucide-react';

interface LandingPageProps {
  schools: School[];
  onLogin: (role: string, selectedId?: string) => void;
  onAddRegistrationRequest: (req: Omit<RegistrationRequest, 'id' | 'status' | 'requestDate'>) => void;
  onAddSupportTicket: (ticket: { title: string; description: string; category: 'إداري' | 'تقني' | 'مالي' | 'تعليمي'; priority: 'low' | 'medium' | 'high' }) => void;
}

export default function LandingPage({ schools, onLogin, onAddRegistrationRequest, onAddSupportTicket }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'schools' | 'news' | 'register' | 'support'>('home');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Registration Form State
  const [regForm, setRegForm] = useState({
    fullName: '',
    gender: 'ذكر' as 'ذكر' | 'أنثى',
    birthDate: '',
    schoolId: schools[0]?.id || '',
    levelId: 'lvl_elementary',
    gradeLevelId: 'gr_1',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    documents: [] as { name: string; url: string; size: string }[]
  });

  // Support Ticket Form State
  const [supportForm, setSupportForm] = useState({
    title: '',
    description: '',
    category: 'تقني' as 'إداري' | 'تقني' | 'مالي' | 'تعليمي',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.fullName || !regForm.parentName || !regForm.parentPhone) {
      alert('الرجاء ملء الحقول الأساسية المطلوبة.');
      return;
    }
    
    // Simulate document upload
    const mockDocs = [
      { name: 'البطاقة الموحدة للطفل_مرفق.pdf', url: '#', size: '1.4 MB' },
      { name: 'بطاقة التلقيحات المدرسية.jpg', url: '#', size: '720 KB' }
    ];

    onAddRegistrationRequest({
      ...regForm,
      documents: mockDocs
    });

    setSuccessMsg('تم تقديم طلب التسجيل بنجاح! رقم الطلب الإلكتروني الخاص بك هو REQ-' + Math.floor(Math.random() * 9000 + 1000) + '. ستتلقى إشعاراً قريباً.');
    setRegForm({
      fullName: '',
      gender: 'ذكر',
      birthDate: '',
      schoolId: schools[0]?.id || '',
      levelId: 'lvl_elementary',
      gradeLevelId: 'gr_1',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      address: '',
      documents: []
    });

    setTimeout(() => setSuccessMsg(''), 6000);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportForm.title || !supportForm.description) {
      alert('الرجاء ملء عنوان ووصف تذكرة الدعم.');
      return;
    }

    onAddSupportTicket(supportForm);
    setSuccessMsg('تم إنشاء تذكرة الدعم بنجاح! سيقوم فريق المساعدة الفنية بالرد عليك خلال دقائق.');
    setSupportForm({
      title: '',
      description: '',
      category: 'تقني',
      priority: 'medium'
    });
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-right" dir="rtl" id="landing-container">
      {/* Top Banner with Contacts */}
      <div className="bg-slate-900 text-slate-300 py-2 px-4 text-xs sm:text-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={14} className="text-emerald-400" /> 07701234567</span>
            <span className="flex items-center gap-1"><Mail size={14} className="text-emerald-400" /> info@schoolsystem.edu.iq</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">● خوادم سريعة ونشطة</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-200 font-medium">الجمهورية العراقية - وزارة التربية والتعليم</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white p-2 rounded-xl shadow-md">
              <GraduationCap size={32} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">سَنَد المدرسية</h1>
              <p className="text-xs text-slate-500 font-mono">Integrated Multi-School Platform</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
            {[
              { id: 'home', label: 'الرئيسية' },
              { id: 'schools', label: 'مدارسنا الأربعة' },
              { id: 'news', label: 'الأخبار والإعلانات' },
              { id: 'register', label: 'التسجيل الإلكتروني' },
              { id: 'support', label: 'الدعم الفني والشكاوى' }
            ].map(tab => (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => { setActiveTab(tab.id as any); setSuccessMsg(''); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <a
            href="#login-section"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow transition-all duration-150"
          >
            بوابة تسجيل الدخول
          </a>
        </div>
      </header>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="bg-emerald-50 border-r-4 border-emerald-500 p-4 rounded-lg flex items-start gap-3 shadow-sm">
            <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={20} />
            <div>
              <h4 className="text-emerald-800 font-bold text-sm">عملية ناجحة</h4>
              <p className="text-emerald-700 text-xs mt-1 leading-relaxed">{successMsg}</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Tab Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
              <div className="relative z-10 max-w-3xl">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-bold">
                  جيل جديد من التعليم الذكي والمترابط
                </span>
                <h2 className="text-3xl md:text-5xl font-black mt-4 leading-tight">
                  المنظومة التعليمية المتكاملة لإدارة المدارس والتعليم الإلكتروني
                </h2>
                <p className="text-slate-300 mt-4 leading-relaxed text-sm md:text-base">
                  نظام موحد وذكي يربط أربع مؤسسات تعليمية كبرى ببعضها البعض. يوفر للمسؤولين لوحة تحكم مركزية لمراقبة الأداء، ويمنح الطلاب والمدرسين وأولياء الأمور منصة شاملة للدراسة التفاعلية، الواجبات، الحضور والغياب، مع محاكاة كاملة لتطبيق الهواتف الذكية.
                </p>
                <div className="flex flex-wrap gap-4 mt-8">
                  <button 
                    onClick={() => setActiveTab('register')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition shadow-lg"
                  >
                    تقديم طلب قبول جديد
                  </button>
                  <a 
                    href="#login-section"
                    className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-sm transition border border-white/20"
                  >
                    الدخول إلى حسابك الدراسي
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: 'عدد المدارس المفعلة', value: '4 مدارس', sub: 'نظام مركزي واحد', color: 'border-slate-200' },
                { label: 'إجمالي الطلاب المسجلين', value: '4,040 طالب', sub: 'مستمر ومجدول', color: 'border-emerald-200' },
                { label: 'الطاقم الإداري والتعليمي', value: '209 معلم وإداري', sub: 'صلاحيات موزعة بدقة', color: 'border-blue-200' },
                { label: 'نسبة الإكمال السنوي', value: '94.2%', sub: 'حضور عالي ومتابعة مستمرة', color: 'border-purple-200' }
              ].map((stat, i) => (
                <div key={i} className={`bg-white p-6 rounded-2xl shadow-sm border ${stat.color} hover:shadow-md transition`}>
                  <p className="text-slate-500 text-xs font-semibold">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono">{stat.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Why Choose Our Platform Section */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 text-center">أركان ومميزات منصة سَنَد الرقمية</h3>
              <p className="text-slate-500 text-sm text-center mt-2 max-w-xl mx-auto">
                بنية تحتية متطورة تلبي احتياجات الكادر الإداري والتعليمي ومجتمعات الطلاب وأولياء أمورهم.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl w-fit">
                    <BookOpen size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mt-4">منصة التعليم الإلكتروني الذكية</h4>
                  <p className="text-slate-500 text-xs leading-relaxed mt-2">
                    دروس تفاعلية، تشغيل فيديو ذكي محمي ضد التحميل غير المصرح به، اختبارات مفاجئة منبثقة (Pop-up Quizzes) تظهر أثناء المشاهدة لتقييم انتباه الطالب، مع توفير المذكرات ووثائق الـ PDF والـ Word مباشرة.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl w-fit">
                    <Users size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mt-4">لوحة تحكم مركزية للوزارة والمدراء</h4>
                  <p className="text-slate-500 text-xs leading-relaxed mt-2">
                    شاشة إدارة عليا لمراقبة جميع فروع المدارس وأعداد طلابها، رصد حركة الغياب والحضور الكلية، جدولة المناهج والصفوف، ومطالعة سجل العمليات الحساسة (Audit Log) للتأكد من هوية من أجرى التعديلات الإدارية.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="bg-purple-50 text-purple-600 p-3 rounded-xl w-fit">
                    <Shield size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mt-4">بوابة الطالب وأولياء الأمور</h4>
                  <p className="text-slate-500 text-xs leading-relaxed mt-2">
                    يمكن لأولياء الأمور الإشراف على مسيرة أبنائهم الدراسية، متابعة الحضور والغياب، الدرجات الشهرية والامتحانية، تنزيل إيصالات الأقساط، وفتح تذاكر الدعم والشكاوى للتواصل السريع والآمن مع المدرسة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHOOLS */}
        {activeTab === 'schools' && (
          <div>
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">مدارسنا الأربعة النشطة في المنظومة</h3>
            <p className="text-slate-500 text-sm text-center max-w-xl mx-auto mb-8">
              تدير المنصة حالياً أربعة صروح تعليمية متميزة في مختلف المحافظات العراقية مع إمكانية التوسع لإضافة المزيد من الفروع مستقبلاً.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {schools.map(school => (
                <div key={school.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition">
                  <img src={school.logo} alt={school.name} className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-inner" />
                  <div className="flex-grow space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{school.name}</h4>
                        <p className="text-xs text-slate-400 font-mono" dir="ltr">{school.nameEn}</p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full text-xs font-semibold">نشطة</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-50 text-center">
                      <div>
                        <p className="text-[10px] text-slate-400">الطلاب</p>
                        <p className="text-sm font-bold text-slate-900">{school.studentCount}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">الأساتذة</p>
                        <p className="text-sm font-bold text-slate-900">{school.teacherCount}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">الشعب الدراسية</p>
                        <p className="text-sm font-bold text-slate-900">{school.classCount}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-slate-500 pt-1">
                      <p className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-400" /> {school.address}</p>
                      <p className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> {school.phone}</p>
                      <p className="flex items-center gap-1.5"><Mail size={12} className="text-slate-400" /> {school.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: NEWS */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">الأخبار العاجلة والتعميمات الإدارية</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  date: '18 تموز 2026',
                  tag: 'إداري',
                  school: 'لوحة التحكم المركزية',
                  title: 'إطلاق نظام التسجيل الإلكتروني الموحد للعام الدراسي الجديد 2025/2026',
                  desc: 'تعلن الإدارة العامة للمنصة عن تفعيل بوابة التسجيل الإلكتروني لرفع المستمسكات والوثائق وتسهيل تقديم الطلاب الجدد في الفروع الأربعة.',
                  image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&auto=format&fit=crop&q=60'
                },
                {
                  date: '17 تموز 2026',
                  tag: 'امتحانات',
                  school: 'أكاديمية الحكمة الدولية',
                  title: 'جدول امتحانات الدور الثاني للمرحلة الإعدادية',
                  desc: 'يرجى من جميع طلاب الصف السادس الإعدادي مراجعة جدول الامتحانات النهائي المنشور عبر بواباتهم والالتزام بالضوابط والتعليمات الامتحانية.',
                  image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&auto=format&fit=crop&q=60'
                },
                {
                  date: '15 تموز 2026',
                  tag: 'نشاطات',
                  school: 'مدارس النور النموذجية',
                  title: 'فوز فريق الروبوتات والذكاء الاصطناعي بالمراكز الأولى',
                  desc: 'تتقدم الهيئة التدريسية بأحر التهاني لطاقم نادي التكنولوجيا بمناسبة حصدهم المراتب المتقدمة في المسابقة الوطنية السنوية للمخترعين الصغار.',
                  image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&auto=format&fit=crop&q=60'
                }
              ].map((news, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition">
                  <img src={news.image} alt={news.title} className="w-full h-44 object-cover" />
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{news.date}</span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">{news.tag}</span>
                    </div>
                    <p className="text-xs text-emerald-600 font-semibold">{news.school}</p>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">{news.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{news.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REGISTER */}
        {activeTab === 'register' && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-md p-6 sm:p-8">
            <div className="text-center mb-6">
              <FileText className="text-emerald-500 mx-auto" size={40} />
              <h3 className="text-xl font-bold text-slate-900 mt-2">استمارة التقديم والقبول الإلكتروني الموحد</h3>
              <p className="text-slate-500 text-xs mt-1">يرجى تعبئة كامل حقول الاستمارة بدقة ليتسنى لإدارة المدرسة مراجعة المستندات والتصديق على طلب القبول.</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-200 pb-1.5">معلومات الطالب الأساسية</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">اسم الطالب الرباعي واللقب *</label>
                    <input
                      type="text"
                      required
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                      placeholder="مثال: حسين ميثم جاسم البهادلي"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">تاريخ الميلاد *</label>
                    <input
                      type="date"
                      required
                      value={regForm.birthDate}
                      onChange={(e) => setRegForm({ ...regForm, birthDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">الجنس *</label>
                    <select
                      value={regForm.gender}
                      onChange={(e) => setRegForm({ ...regForm, gender: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                    >
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">المدرسة المستهدفة للتسجيل *</label>
                    <select
                      value={regForm.schoolId}
                      onChange={(e) => setRegForm({ ...regForm, schoolId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                    >
                      {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">المرحلة الدراسية *</label>
                    <select
                      value={regForm.levelId}
                      onChange={(e) => setRegForm({ ...regForm, levelId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                    >
                      {initialLevels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">الصف المستهدف *</label>
                    <select
                      value={regForm.gradeLevelId}
                      onChange={(e) => setRegForm({ ...regForm, gradeLevelId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                    >
                      {initialGradeLevels
                        .filter(g => g.levelId === regForm.levelId)
                        .map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">عنوان سكن العائلة الحالي *</label>
                    <input
                      type="text"
                      required
                      value={regForm.address}
                      onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                      placeholder="المحافظة، المنطقة، أقرب نقطة دالة"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-200 pb-1.5">معلومات ولي الأمر ومستمسكات الاتصال</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">اسم ولي الأمر الثلاثي الكفيل *</label>
                    <input
                      type="text"
                      required
                      value={regForm.parentName}
                      onChange={(e) => setRegForm({ ...regForm, parentName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">رقم هاتف ولي الأمر الفعال *</label>
                    <input
                      type="text"
                      required
                      value={regForm.parentPhone}
                      onChange={(e) => setRegForm({ ...regForm, parentPhone: e.target.value })}
                      placeholder="077XXXXXXXX"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right ltr"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">البريد الإلكتروني للتواصل (اختياري)</label>
                    <input
                      type="email"
                      value={regForm.parentEmail}
                      onChange={(e) => setRegForm({ ...regForm, parentEmail: e.target.value })}
                      placeholder="example@mail.com"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl flex gap-3 text-xs leading-relaxed border border-yellow-100">
                <AlertCircle className="shrink-0 text-yellow-600" size={16} />
                <p>ملاحظة هامة: يجب توفير كارت اللقاحات وهوية الأحوال المدنية أو البطاقة الوطنية الموحدة مصورة بصورة واضحة. سيتم محاكاة إرفاق هذه الوثائق والملفات فور ضغطكم على زر الإرسال وتوجيهها للوحة مديرة المدرسة المعنية فوراً.</p>
              </div>

              <button
                type="submit"
                id="submit-registration-btn"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg flex justify-center items-center gap-2"
              >
                <Send size={16} /> إرسال طلب القبول إلى إدارة المدرسة
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: SUPPORT */}
        {activeTab === 'support' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-md p-6 sm:p-8">
            <div className="text-center mb-6">
              <Phone className="text-slate-900 mx-auto" size={40} />
              <h3 className="text-xl font-bold text-slate-900 mt-2">بوابة الدعم الفني وتلقي البلاغات والشكاوى</h3>
              <p className="text-slate-500 text-xs mt-1">هل تواجه عطلاً تقنياً في تشغيل منصة الدروس، أم ترغب في تقديم طلب مالي لإدارة المدرسة؟ يرجى إرسال التذكرة وسيقوم طاقم الدعم بالتواصل السريع والرد في ثوانٍ معدودة.</p>
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-semibold">عنوان تذكرة الدعم / طبيعة المشكلة *</label>
                <input
                  type="text"
                  required
                  value={supportForm.title}
                  onChange={(e) => setSupportForm({ ...supportForm, title: e.target.value })}
                  placeholder="مثال: خطأ في كلمة مرور الحساب، استعلام عن القسط المالي..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-right"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-semibold">تصنيف المشكلة الرئيسي *</label>
                  <select
                    value={supportForm.category}
                    onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-right"
                  >
                    <option value="تقني">تقني وفني في الموقع</option>
                    <option value="إداري">إداري أو سلوكي</option>
                    <option value="مالي">الأقساط والمدفوعات</option>
                    <option value="تعليمي">منصة الدروس والواجبات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-semibold">درجة الأهمية والأولوية *</label>
                  <select
                    value={supportForm.priority}
                    onChange={(e) => setSupportForm({ ...supportForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-right"
                  >
                    <option value="low">منخفضة (استفسار روتيني)</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">مرتفعة جداً (عطل يمنع الإكمال)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1 font-semibold">تفاصيل المشكلة والوصف الكامل للشكوى *</label>
                <textarea
                  required
                  rows={4}
                  value={supportForm.description}
                  onChange={(e) => setSupportForm({ ...supportForm, description: e.target.value })}
                  placeholder="يرجى كتابة كافة التفاصيل مع اسم الطالب والمدرسة والصف لسرعة الدعم والتواصل الفعال."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-right"
                />
              </div>

              <button
                type="submit"
                id="submit-support-btn"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg flex justify-center items-center gap-2"
              >
                <Send size={16} /> إرسال تذكرة المساعدة فوراً
              </button>
            </form>
          </div>
        )}

        {/* SECTION: SIMULATION GATEWAY / LOGIN CHANNELS */}
        <div id="login-section" className="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl mt-16 border border-slate-800">
          <div className="text-center space-y-2 mb-8">
            <h3 className="text-xl sm:text-2xl font-bold">بوابة التجربة السريعة واختبار الصلاحيات والأدوار</h3>
            <p className="text-xs sm:text-sm text-slate-400">لست بحاجة لإنشاء حسابات أو قواعد بيانات مخصصة! بلمسة واحدة يمكنك التنقل واختبار دور أي مستخدم ومعاينة المنصة بالكامل.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. Super Admin Account */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 hover:border-slate-600 transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded text-[11px] font-bold">المرتبة العليا</span>
                  <span className="text-[11px] text-slate-500 font-mono">Full Privileges</span>
                </div>
                <h4 className="text-sm font-bold text-slate-200">المسؤول العام عن النظام (Super Admin)</h4>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  التحكم المركزي بالمدارس الأربعة، رصد الحضور العام، مطالعة سجلات العمليات والـ Audit Logs، إيقاف/تفعيل المستخدمين، مقارنة المدارس.
                </p>
              </div>
              <button
                onClick={() => onLogin('SUPER_ADMIN')}
                id="login-super-admin-btn"
                className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold py-2 rounded-lg transition-all"
              >
                الدخول كمسؤول عام للوزارة
              </button>
            </div>

            {/* 2. School Admin Account */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 hover:border-slate-600 transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded text-[11px] font-bold">إدارة المدرسة</span>
                  <span className="text-[11px] text-slate-500 font-mono">School Admin</span>
                </div>
                <h4 className="text-sm font-bold text-slate-200">مدير مدرسة النور النموذجية</h4>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  إدارة شؤون الطلاب، معالجة استمارات القبول الجديدة، نقل الطلاب بين الفصول والشعب، تصدير ملفات Excel وPDF، طباعة بطاقات الطلاب الدراسية.
                </p>
              </div>
              <button
                onClick={() => onLogin('SCHOOL_ADMIN', 'sch_noor')}
                id="login-school-admin-btn"
                className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-slate-950 text-xs font-bold py-2 rounded-lg transition-all"
              >
                الدخول كمدير مدرسة (النور)
              </button>
            </div>

            {/* 3. Teacher Account */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 hover:border-slate-600 transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-[11px] font-bold">الهيئة التعليمية</span>
                  <span className="text-[11px] text-slate-500 font-mono">Teacher Role</span>
                </div>
                <h4 className="text-sm font-bold text-slate-200">أ. أحمد حامد السعدي (مدرس رياضيات)</h4>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  معاينة الجدول الأسبوعي، نشر المحاضرات والفيديوهات ومستندات الـ PDF، رصد ورقة الحضور والغياب اليومي للطلاب، إضافة وتقييم الواجبات المنزلية.
                </p>
              </div>
              <button
                onClick={() => onLogin('TEACHER', 'tch_ahmed')}
                id="login-teacher-btn"
                className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-slate-950 text-xs font-bold py-2 rounded-lg transition-all"
              >
                الدخول كمعلم (أ. أحمد)
              </button>
            </div>

            {/* 4. Student Account */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 hover:border-slate-600 transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[11px] font-bold">بوابة الطالب</span>
                  <span className="text-[11px] text-slate-500 font-mono">Student Portal</span>
                </div>
                <h4 className="text-sm font-bold text-slate-200">علي أحمد السعدي (الصف الأول المتوسط)</h4>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  مشاهدة المحاضرات، التفاعل مع الفيديو وحل الكويز المنبثق، تسليم حلول الواجبات المرفقة، الاطلاع على جدول الامتحانات والدرجات والغياب.
                </p>
              </div>
              <button
                onClick={() => onLogin('STUDENT', 'std_ali')}
                id="login-student-btn"
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold py-2 rounded-lg transition-all"
              >
                الدخول كطالب (علي)
              </button>
            </div>

            {/* 5. Parent Account */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 hover:border-slate-600 transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-[11px] font-bold">بوابة العائلة</span>
                  <span className="text-[11px] text-slate-500 font-mono">Parent Portal</span>
                </div>
                <h4 className="text-sm font-bold text-slate-200">ولي الأمر: محمد العبيدي (ربط طفلين)</h4>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  مراقبة ابنتين في مدرستين مختلفتين (زهراء في مدرسة الرسالة، وفاطمة في مدرسة النور)، الاطلاع على جداولهما، الغيابات، رصد الدرجات وتحميل إيصالات الدفع.
                </p>
              </div>
              <button
                onClick={() => onLogin('PARENT', 'pr_mohammed_obaidi')}
                id="login-parent-btn"
                className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-slate-950 text-xs font-bold py-2 rounded-lg transition-all"
              >
                الدخول كولي أمر (أبو زهراء وفاطمة)
              </button>
            </div>

            {/* 6. Technical Support Ticket Agent */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 hover:border-slate-600 transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded text-[11px] font-bold">صيانة النظام</span>
                  <span className="text-[11px] text-slate-500 font-mono">Technical Agent</span>
                </div>
                <h4 className="text-sm font-bold text-slate-200">مسؤول النظام وقاعدة البيانات والدعم الفني</h4>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  معاينة وحل جميع بطاقات وتذاكر الدعم والشكاوى المفتوحة، مطالعة إرشادات السعة، استرجاع النسخ الاحتياطية وتتبع صحة الخادم الفنية.
                </p>
              </div>
              <button
                onClick={() => onLogin('SUPPORT_AGENT')}
                id="login-support-agent-btn"
                className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-slate-950 text-xs font-bold py-2 rounded-lg transition-all"
              >
                الدخول كمسؤول الصيانة والنسخ الاحتياطي
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Footer Area */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            <p className="font-bold text-slate-700 text-sm">منظومة سَنَد المدرسية والتعليم الإلكتروني المتكاملة © 2026</p>
            <p className="mt-1">صُمم وطُوّر لمراعاة أعلى معايير الحماية والأمان (Multi-Tenant School Architecture)</p>
          </div>
          <div className="flex gap-4">
            <a href="#" onClick={(e) => { e.preventDefault(); alert('سياسة الخصوصية للمنصة تمنع استخدام وتداول بيانات الطلاب لأي طرف ثالث، وتعتمد تشفير SSL/HTTPS على كامل الخوادم.'); }} className="hover:text-slate-900 transition underline">سياسة الخصوصية</a>
            <span>•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('الشروط والأحكام تفرض الالتزام الكامل بالقواعد التربوية والضوابط الصادرة عن وزارة التربية والتعليم العراقية.'); }} className="hover:text-slate-900 transition underline">الشروط والأحكام</a>
            <span>•</span>
            <a href="#" onClick={(e) => { setActiveTab('support'); }} className="hover:text-slate-900 transition underline">تواصل معنا</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
