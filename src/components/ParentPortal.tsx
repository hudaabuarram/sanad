import React, { useState } from 'react';
import { 
  Parent, Student, Lesson, Assignment, AssignmentSubmission, 
  StudentGradeRecord, AttendanceRecord, Subject, RegistrationRequest, School, AdmissionStatus 
} from '../types';
import { initialGradeLevels } from '../data/initialData';
import { formatDate } from '../utils';
import { 
  CreditCard, DollarSign, Users, Award, Clock, MessageSquare, 
  Send, UserPlus, CheckCircle, Paperclip, Printer, Sparkles, BookOpen 
} from 'lucide-react';

interface ParentPortalProps {
  parent: Parent;
  students: Student[];
  grades: StudentGradeRecord[];
  attendance: AttendanceRecord[];
  subjects: Subject[];
  schools: School[];
  onAddRegistrationRequest: (req: RegistrationRequest) => void;
  onUpdateStudentTuition: (studentId: string, paidAmount: number) => void;
  onLogout: () => void;
}

export default function ParentPortal({
  parent,
  students,
  grades,
  attendance,
  subjects,
  schools,
  onAddRegistrationRequest,
  onUpdateStudentTuition,
  onLogout
}: ParentPortalProps) {
  const [activeSubTab, setActiveSubTab] = useState<'children' | 'tuition' | 'admission' | 'contact'>('children');
  
  // Active child toggle state
  const parentChildren = students.filter(s => s.parentPhone === parent.phone);
  const [selectedChildId, setSelectedChildId] = useState<string>(parentChildren[0]?.id || '');
  
  // Payment modal state
  const [paymentAmount, setPaymentAmount] = useState<number>(500);
  const [payingChildId, setPayingChildId] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  // Support / Message state
  const [supportMessage, setSupportMessage] = useState({
    subject: '',
    message: ''
  });

  // New Admission request form state
  const [admissionForm, setAdmissionForm] = useState({
    fullName: '',
    fullNameEn: '',
    gender: 'ذكر' as 'ذكر' | 'أنثى',
    birthDate: '',
    schoolId: schools[0]?.id || '',
    gradeLevelId: 'gr_7',
    address: '',
    phone: '',
    notes: ''
  });

  const activeChild = parentChildren.find(c => c.id === selectedChildId);
  const activeChildGrades = activeChild ? grades.filter(g => g.studentId === activeChild.id) : [];
  const activeChildAttendance = activeChild ? attendance.filter(a => a.studentId === activeChild.id) : [];

  // Total balance calculations
  const calculateTotalTuitionStats = () => {
    // Each student has tuition details
    let totalRequired = 0;
    let totalPaid = 0;
    parentChildren.forEach(child => {
      // Let's assume standard tuition is 3,000,000 IQD per year
      const total = 3000000;
      // Filter custom tuition paid
      const paid = 1800000; // Mock paid
      totalRequired += total;
      totalPaid += paid;
    });

    return {
      required: totalRequired,
      paid: totalPaid,
      remaining: totalRequired - totalPaid
    };
  };

  const handleSimulatedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingChildId || paymentAmount <= 0) {
      alert('الرجاء التأكد من قيمة القسط المراد دفعه.');
      return;
    }
    if (!cardNumber || cardNumber.length < 16) {
      alert('يرجى كتابة رقم بطاقة الائتمان بصورة صحيحة (16 رقم).');
      return;
    }

    onUpdateStudentTuition(payingChildId, Number(paymentAmount));
    setPayingChildId(null);
    setCardNumber('');
    setCardHolder('');
    setCardExpiry('');
    setCardCVV('');
    alert('💸 تم الدفع والتسوية المالية للمصرف بنجاح! تم قيد القسط المدفوع في سجل الطالب وتحديث رصيد المدرسة مع إرسال إيصال فوري لهاتفك.');
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.subject || !supportMessage.message) return;
    alert('📧 تم إرسال رسالتك وقيد التذكرة بنجاح في نظام إدارة المدرسة المعنية. سيتم الرد عليك عبر رسالة نصية قريباً.');
    setSupportMessage({ subject: '', message: '' });
  };

  const handleAdmissionRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionForm.fullName || !admissionForm.birthDate) {
      alert('الرجاء تعبئة جميع الحقول المطلوبة للتسجيل.');
      return;
    }

    const mockRequest: RegistrationRequest = {
      id: `req_${Date.now()}`,
      schoolId: admissionForm.schoolId,
      fullName: admissionForm.fullName,
      gender: admissionForm.gender,
      birthDate: admissionForm.birthDate,
      levelId: 'lvl_middle',
      gradeLevelId: admissionForm.gradeLevelId,
      parentName: parent.fullName,
      parentPhone: parent.phone,
      parentEmail: parent.email || 'parent@edu.iq',
      address: admissionForm.address || 'بغداد، العراق',
      requestDate: new Date().toISOString(),
      status: AdmissionStatus.PENDING,
      documents: [
        { name: 'هوية الأحوال المدنية.pdf', url: '#', size: '1.2 MB' },
        { name: 'شهادة الجنسية العراقية.pdf', url: '#', size: '940 KB' },
        { name: 'البطاقة السكنية الموحدة.pdf', url: '#', size: '1.4 MB' }
      ]
    };

    onAddRegistrationRequest(mockRequest);
    
    // Reset form
    setAdmissionForm({
      fullName: '',
      fullNameEn: '',
      gender: 'ذكر',
      birthDate: '',
      schoolId: schools[0]?.id || '',
      gradeLevelId: 'gr_7',
      address: '',
      phone: '',
      notes: ''
    });

    alert('📝 تم رفع طلب القبول والتسجيل بنجاح في قاعدة البيانات المركزية لفرع المدرسة! سيتم تدقيق المستندات من قبل الإدارة وسيظهر إشعار النتيجة في لوحة التحكم الخاصة بك.');
  };

  const stats = calculateTotalTuitionStats();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-right" dir="rtl" id="parent-root">
      
      {/* Sidebar Layout */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-l border-slate-800">
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex gap-3 items-center">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">P</div>
          <div>
            <h2 className="text-xs font-bold text-slate-100">{parent.fullName}</h2>
            <p className="text-[10px] text-slate-400 font-mono">Parent Account</p>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1.5">
          {[
            { id: 'children', label: 'متابعة أداء الأبناء الدراسي', icon: Users },
            { id: 'tuition', label: 'الأقساط والمدفوعات المدرسية', icon: CreditCard },
            { id: 'admission', label: 'تسجيل قبول طفل جديد', icon: UserPlus },
            { id: 'contact', label: 'تواصل مع إدارة فروع المدارس', icon: MessageSquare },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`par-tab-${item.id}`}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeSubTab === item.id 
                    ? 'bg-teal-600 text-white shadow font-bold' 
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={onLogout}
            id="par-logout-btn"
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-lg text-xs transition"
          >
            تسجيل الخروج من البوابة
          </button>
        </div>
      </aside>

      {/* Main Workspace Workspace */}
      <main className="flex-grow p-4 sm:p-8 space-y-6 overflow-y-auto">
        
        {/* Portal introductory banner */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">أهلاً بك، {parent.fullName}</h2>
            <p className="text-slate-500 text-xs mt-1">بوابة أولياء الأمور الموحدة لمتابعة الغيابات والدرجات، وتأمين الأقساط المدرسية بنظام إلكتروني مؤمن.</p>
          </div>
          <div className="bg-teal-50 text-teal-800 border border-teal-200 px-4 py-1.5 rounded-full text-xs font-bold font-mono">
            عدد الأبناء المسجلين: {parentChildren.length}
          </div>
        </div>

        {/* TAB 1: ACADEMIC & ATTENDANCE TRACKING */}
        {activeSubTab === 'children' && (
          <div className="space-y-6">
            
            {/* Child switching tab */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-600 ml-2">اختر أحد الأبناء للمتابعة:</span>
              {parentChildren.map(child => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedChildId === child.id 
                      ? 'bg-teal-600 text-white shadow' 
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {child.fullName}
                </button>
              ))}
            </div>

            {activeChild ? (
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Child info & attendance overview */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="text-center space-y-2">
                    <img src={activeChild.avatar} className="w-16 h-16 rounded-full mx-auto object-cover border border-slate-200" />
                    <h4 className="text-sm font-bold text-slate-900">{activeChild.fullName}</h4>
                    <p className="text-xs text-slate-400">الرقم الدراسي: {activeChild.studentIdNo}</p>
                    <p className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full inline-block">
                      الصف {activeChild.gradeLevelId === 'gr_7' ? 'الأول المتوسط' : 'السادس الإعدادي'}
                    </p>
                  </div>

                  {/* Attendance records micro list */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Clock size={14} /> سجل الغياب والحضور الأسبوعي</h5>
                    <div className="space-y-2">
                      {activeChildAttendance.map(att => (
                        <div key={att.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 rounded-lg">
                          <span className="text-slate-400 font-mono">{att.date}</span>
                          <span className={`font-bold ${
                            att.status === 'present' ? 'text-emerald-600' : 'text-rose-500'
                          }`}>
                            {att.status === 'present' ? 'حاضر ✅' : att.status === 'absent' ? 'غائب ❌' : 'متأخر ⚠️'}
                          </span>
                        </div>
                      ))}
                      {activeChildAttendance.length === 0 && (
                        <p className="text-center text-slate-400 text-[11px]">لا توجد غيابات مسجلة لهذا الطالب.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Grades and report cards detail */}
                <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-1.5"><Award size={16} /> درجات التقييم الأكاديمي للامتحانات</h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-right border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                          <th className="p-2.5">المادة المنهجية</th>
                          <th className="p-2.5 text-center">الواجبات والأنشطة</th>
                          <th className="p-2.5 text-center">الشهر الأول</th>
                          <th className="p-2.5 text-center">الشهر الثاني</th>
                          <th className="p-2.5 text-center">امتحان السعي الكلي</th>
                          <th className="p-2.5 text-center">التقدير الكلي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeChildGrades.map(g => (
                          <tr key={g.id} className="hover:bg-slate-50/40">
                            <td className="p-2.5 font-bold text-slate-900">{subjects.find(s => s.id === g.subjectId)?.name || 'مادة منهجية'}</td>
                            <td className="p-2.5 text-center font-mono">{g.homeworksAvg}</td>
                            <td className="p-2.5 text-center font-mono">{g.monthlyExam1}</td>
                            <td className="p-2.5 text-center font-mono">{g.monthlyExam2}</td>
                            <td className="p-2.5 text-center font-bold text-slate-800 font-mono">{g.yearlyTotal}</td>
                            <td className="p-2.5 text-center font-bold">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${
                                g.isPassed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }`}>
                                {g.isPassed ? `ناجح (${g.gradeLetter})` : `راسب`}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {activeChildGrades.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-6 text-center text-slate-400">لم يتم رصد نتائج درجات الفصل الدراسي بعد.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl text-center text-slate-400">لا يوجد أبناء مسجلين بحسابك لمتابعة درجاتهم.</div>
            )}
          </div>
        )}

        {/* TAB 2: TUITION BALANCES & PAYMENT SYSTEM */}
        {activeSubTab === 'tuition' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Balances summary panels */}
              {[
                { title: 'إجمالي الرسوم الدراسية المطلوبة', amount: `${stats.required.toLocaleString()} دينار عراقي`, color: 'bg-slate-900 text-white border-slate-900' },
                { title: 'مجموع الأقساط المسددة', amount: `${stats.paid.toLocaleString()} دينار عراقي`, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                { title: 'الأقساط والذمم المتبقية', amount: `${stats.remaining.toLocaleString()} دينار عراقي`, color: 'bg-rose-50 text-rose-800 border-rose-200' }
              ].map((panel, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border ${panel.color} shadow-sm space-y-1.5`}>
                  <span className="text-[10px] block opacity-90">{panel.title}</span>
                  <span className="text-base sm:text-lg font-black block font-mono">{panel.amount}</span>
                </div>
              ))}

            </div>

            {/* Students school tuition bills detail */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">سجلات الأقساط والذمم المالية لكل طفل</h4>
              
              <div className="divide-y divide-slate-100">
                {parentChildren.map(child => {
                  const required = 3000000;
                  const paid = 1800000;
                  const remaining = required - paid;
                  
                  return (
                    <div key={child.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <p className="font-bold text-slate-900">{child.fullName}</p>
                        <p className="text-[10px] text-slate-400">الفرع الدراسي: {schools.find(s => s.id === child.schoolId)?.name || 'الفرع النموذجي'}</p>
                        <div className="text-[11px] text-slate-600 mt-1 space-x-3 space-x-reverse">
                          <span>المطلوب: <strong className="font-mono">{required.toLocaleString()} د.ع</strong></span>
                          <span>المسدد: <strong className="font-mono text-emerald-600">{paid.toLocaleString()} د.ع</strong></span>
                          <span>المتبقي: <strong className="font-mono text-rose-600">{remaining.toLocaleString()} د.ع</strong></span>
                        </div>
                      </div>

                      {remaining > 0 ? (
                        <button
                          onClick={() => {
                            setPayingChildId(child.id);
                            setPaymentAmount(Math.min(500000, remaining));
                            setCardNumber('');
                            setCardHolder('');
                            setCardExpiry('');
                            setCardCVV('');
                          }}
                          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md"
                        >
                          تسديد قسط مالي
                        </button>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-xl text-[11px] font-bold">تم الإبراء المالي الكلي</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive simulated credit card payment modal */}
            {payingChildId && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                <form onSubmit={handleSimulatedPayment} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-scale-up">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-black text-slate-900">بوابة الدفع الإلكتروني المصرفية المؤمنة</h4>
                    <span className="bg-teal-50 text-teal-800 text-[9px] px-2 py-0.5 rounded font-black">PCI-DSS Secure</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">أنت الآن تقوم بدفع قسط دراسي لحساب الطالب: <strong>{parentChildren.find(c => c.id === payingChildId)?.fullName}</strong>.</p>
                  
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1 font-bold">قيمة القسط المطلوب تسديده (دينار عراقي) *</label>
                    <input
                      type="number"
                      required
                      min={10000}
                      value={paymentAmount}
                      onChange={e => setPaymentAmount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-right font-mono text-slate-800 font-bold"
                    />
                  </div>

                  {/* Mock Credit Card Graphics */}
                  <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white p-5 rounded-2xl space-y-4 shadow-lg font-mono relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold tracking-widest text-teal-400">E-IRAQ DEBIT CARD</span>
                      <CreditCard size={20} className="text-teal-400" />
                    </div>
                    <div>
                      <span className="text-[10px] block opacity-50">CARD NUMBER</span>
                      <span className="text-sm font-black tracking-wider block mt-1">{cardNumber || '•••• •••• •••• ••••'}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <div>
                        <span className="opacity-50 block">CARD HOLDER</span>
                        <span className="font-bold block mt-0.5 uppercase">{cardHolder || 'PARENT FULL NAME'}</span>
                      </div>
                      <div>
                        <span className="opacity-50 block">EXPIRES</span>
                        <span className="font-bold block mt-0.5">{cardExpiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[10px] text-slate-600 mb-1">رقم بطاقة الائتمان (16 رقم) *</label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        placeholder="4215 8800 1234 5678"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[10px] text-slate-600 mb-1">اسم حامل البطاقة *</label>
                        <input
                          type="text"
                          required
                          placeholder="الاسم المسجل على البطاقة"
                          value={cardHolder}
                          onChange={e => setCardHolder(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-600 mb-1">CVV (3 أرقام) *</label>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          placeholder="•••"
                          value={cardCVV}
                          onChange={e => setCardCVV(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setPayingChildId(null)}
                      className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold"
                    >
                      إلغاء العملية
                    </button>
                    <button 
                      type="submit" 
                      className="bg-teal-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md"
                    >
                      إكمال الدفع والتسجيل
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DIRECT ADMISSION REQUEST SUBMISSION */}
        {activeSubTab === 'admission' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">استمارة التقديم والتسجيل الإلكتروني للطلاب الجدد</h3>
              <p className="text-slate-400 text-[11px] mt-0.5">يمكنك تقديم طلب قبول لأي من أبنائك في مدارسنا. يرجى توفير تفاصيل دقيقة وتثبيت المرفقات.</p>
            </div>

            <form onSubmit={handleAdmissionRequestSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">الاسم الرباعي الكامل للطفل الجديد *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: يوسف عادل فاروق الحيالي"
                    value={admissionForm.fullName}
                    onChange={e => setAdmissionForm({ ...admissionForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">الاسم باللغة الإنجليزية</label>
                  <input
                    type="text"
                    placeholder="e.g. Yousif Adel Farooq"
                    value={admissionForm.fullNameEn}
                    onChange={e => setAdmissionForm({ ...admissionForm, fullNameEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">الجنس *</label>
                  <select
                    value={admissionForm.gender}
                    onChange={e => setAdmissionForm({ ...admissionForm, gender: e.target.value as any })}
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
                    value={admissionForm.birthDate}
                    onChange={e => setAdmissionForm({ ...admissionForm, birthDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">المدرسة المطلوب الانتساب إليها *</label>
                  <select
                    value={admissionForm.schoolId}
                    onChange={e => setAdmissionForm({ ...admissionForm, schoolId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                  >
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">الصف والصف المستهدف *</label>
                  <select
                    value={admissionForm.gradeLevelId}
                    onChange={e => setAdmissionForm({ ...admissionForm, gradeLevelId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                  >
                    {initialGradeLevels.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-600 mb-1">عنوان السكن الدائم المعتمد *</label>
                  <input
                    type="text"
                    required
                    placeholder="العنوان ومستمسك أقرب دالة"
                    value={admissionForm.address}
                    onChange={e => setAdmissionForm({ ...admissionForm, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                  />
                </div>
              </div>

              {/* Attachments drag & drop mock UI */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-5 rounded-2xl text-center space-y-2">
                <Paperclip className="mx-auto text-slate-400" size={24} />
                <p className="text-xs font-semibold text-slate-700">اسحب وأفلت الوثائق المرفقة هنا لتأكيد الطلب</p>
                <p className="text-[10px] text-slate-400">يرجى توفير: (البطاقة الموحدة، شهادة الجنسية، بطاقة السكن، صورة شخصية حديثة)</p>
                <button
                  type="button"
                  onClick={() => alert('تم اختيار المستمسكات والوثائق بنجاح وإعدادها للرفع المباشر.')}
                  className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1 text-[11px] rounded font-bold"
                >
                  تصفح الملفات
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  id="submit-admission-req-btn"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2 rounded-xl text-xs shadow flex items-center gap-1.5 transition"
                >
                  <Sparkles size={14} /> إرسال طلب القبول والتدقيق
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: DIRECT SUPPORT CONTACT COMPLAINTS */}
        {activeSubTab === 'contact' && (
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Contact details */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">فريق الاتصال والمدراء للفروع</h4>
              
              <div className="space-y-4 text-xs">
                {schools.map(s => (
                  <div key={s.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <p className="font-bold text-slate-800">{s.name}</p>
                    <p className="text-slate-500 text-[10px]">المدير: د. أزهر جبار التميمي</p>
                    <p className="text-[10px] text-slate-400 font-mono" dir="ltr">{s.phone || '07702580124'}</p>
                    <p className="text-[10px] text-slate-400 font-mono" dir="ltr">{s.email || 'info@school.edu.iq'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Support ticket submission form */}
            <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">صندوق الرسائل والشكاوى والاستفسارات للإدارة</h4>
              <p className="text-slate-400 text-[11px]">يمكنك إرسال أي شكوى، استفسار أو مقترح دراسي مباشرة لمدير الفرع لمتابعته والرد عليه.</p>

              <form onSubmit={handleSupportSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">موضوع الرسالة *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: استفسار حول كورس التقوية الصيفي"
                    value={supportMessage.subject}
                    onChange={e => setSupportMessage({ ...supportMessage, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">نص الشكوى أو المقترح الدراسي *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="يرجى كتابة مقترحك بالتفصيل هنا..."
                    value={supportMessage.message}
                    onChange={e => setSupportMessage({ ...supportMessage, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-right"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow flex items-center gap-1.5 transition"
                  >
                    <Send size={14} /> إرسال الرسالة للإدارة
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
