import {
  School,
  Level,
  GradeLevel,
  Section,
  Subject,
  Student,
  Parent,
  Teacher,
  Lesson,
  Assignment,
  AssignmentSubmission,
  Quiz,
  StudentGradeRecord,
  AttendanceRecord,
  ScheduleSlot,
  SupportTicket,
  AuditLog,
  RegistrationRequest,
  PaymentRecord,
  AppNotification,
  StudentStatus,
  AdmissionStatus,
  AcademicYear,
  UserRole
} from '../types';

export const initialAcademicYears: AcademicYear[] = [
  { id: '2025_2026', name: '2025/2026', isCurrent: true },
  { id: '2024_2025', name: '2024/2025', isCurrent: false }
];

export const initialSchools: School[] = [
  {
    id: 'sch_noor',
    name: 'مدارس النور الأهلية النموذجية',
    nameEn: 'Al-Noor Private Model Schools',
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=60',
    address: 'العراق، بغداد، حي المنصور، شارع 14 رمضان',
    phone: '07701234567',
    email: 'noor.schools@edu.iq',
    isActive: true,
    studentCount: 1250,
    teacherCount: 64,
    classCount: 24
  },
  {
    id: 'sch_resalah',
    name: 'ثانوية الرسالة للبنات',
    nameEn: 'Al-Resalah Secondary School for Girls',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=60',
    address: 'العراق، بغداد، الكرادة، قرب ساحة الحرية',
    phone: '07801234567',
    email: 'resalah.girls@edu.iq',
    isActive: true,
    studentCount: 840,
    teacherCount: 45,
    classCount: 16
  },
  {
    id: 'sch_rowad',
    name: 'مدارس رواد الغد الأهلية',
    nameEn: 'Future Pioneers Private Schools',
    logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=150&auto=format&fit=crop&q=60',
    address: 'العراق، أربيل، عينكاوة، الشارع الخدمي الرئيسي',
    phone: '07501234567',
    email: 'pioneers@edu.iq',
    isActive: true,
    studentCount: 950,
    teacherCount: 52,
    classCount: 18
  },
  {
    id: 'sch_hekma',
    name: 'أكاديمية الحكمة الدولية',
    nameEn: 'Al-Hekma International Academy',
    logo: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=150&auto=format&fit=crop&q=60',
    address: 'العراق، البصرة، العشار، قرب الكورنيش',
    phone: '07712345678',
    email: 'hekma.international@edu.iq',
    isActive: true,
    studentCount: 1100,
    teacherCount: 58,
    classCount: 20
  }
];

export const initialLevels: Level[] = [
  { id: 'lvl_elementary', name: 'المرحلة الابتدائية' },
  { id: 'lvl_middle', name: 'المرحلة المتوسطة' },
  { id: 'lvl_high', name: 'المرحلة الإعدادية' }
];

export const initialGradeLevels: GradeLevel[] = [
  { id: 'gr_1', levelId: 'lvl_elementary', name: 'الصف الأول الابتدائي' },
  { id: 'gr_6', levelId: 'lvl_elementary', name: 'الصف السادس الابتدائي' },
  { id: 'gr_7', levelId: 'lvl_middle', name: 'الصف الأول المتوسط (السابع)' },
  { id: 'gr_9', levelId: 'lvl_middle', name: 'الصف الثالث المتوسط (التاسع)' },
  { id: 'gr_12', levelId: 'lvl_high', name: 'الصف السادس الإعدادي (الثاني عشر)' }
];

export const initialSections: Section[] = [
  { id: 'sec_7_a', gradeLevelId: 'gr_7', name: 'أ' },
  { id: 'sec_7_b', gradeLevelId: 'gr_7', name: 'ب' },
  { id: 'sec_9_a', gradeLevelId: 'gr_9', name: 'أ' },
  { id: 'sec_12_a', gradeLevelId: 'gr_12', name: 'أ' },
  { id: 'sec_12_b', gradeLevelId: 'gr_12', name: 'ب' }
];

export const initialSubjects: Subject[] = [
  { id: 'sub_math_7', name: 'الرياضيات', nameEn: 'Mathematics', gradeLevelId: 'gr_7' },
  { id: 'sub_arabic_7', name: 'اللغة العربية', nameEn: 'Arabic Language', gradeLevelId: 'gr_7' },
  { id: 'sub_english_7', name: 'اللغة الإنجليزية', nameEn: 'English Language', gradeLevelId: 'gr_7' },
  { id: 'sub_cs_7', name: 'الحاسوب وتكنولوجيا المعلومات', nameEn: 'Computer Science', gradeLevelId: 'gr_7' },
  
  { id: 'sub_math_9', name: 'الرياضيات المتقدمة', nameEn: 'Advanced Mathematics', gradeLevelId: 'gr_9' },
  { id: 'sub_physics_9', name: 'الفيزياء الكونية', nameEn: 'Cosmic Physics', gradeLevelId: 'gr_9' },
  { id: 'sub_chem_9', name: 'الكيمياء العضوية المبسطة', nameEn: 'Introductory Chemistry', gradeLevelId: 'gr_9' },
  
  { id: 'sub_physics_12', name: 'الفيزياء العامة والنووية', nameEn: 'Nuclear & General Physics', gradeLevelId: 'gr_12' },
  { id: 'sub_arabic_12', name: 'الأدب والبلاغة واللغة العربية', nameEn: 'Arabic Literature & Rhetoric', gradeLevelId: 'gr_12' },
  { id: 'sub_english_12', name: 'اللغة الإنجليزية التخصصية', nameEn: 'Specialized English', gradeLevelId: 'gr_12' }
];

export const initialTeachers: Teacher[] = [
  {
    id: 'tch_ahmed',
    fullName: 'أ. أحمد حامد السعدي',
    fullNameEn: 'Mr. Ahmed Hamed Al-Saadi',
    phone: '07705551122',
    email: 'ahmed.teacher@edu.iq',
    schoolId: 'sch_noor',
    subjectsIds: ['sub_math_7', 'sub_math_9'],
    sectionsIds: ['sec_7_a', 'sec_7_b', 'sec_9_a'],
    schedule: 'الأحد، الإثنين، الأربعاء (من 8:00 صباحاً إلى 1:30 ظهراً)',
    documents: ['الشهادة الجامعية.pdf', 'شهادة التدريب التربوي.pdf'],
    notes: 'خبير في تدريس الرياضيات لأكثر من 12 عاماً ومسؤول نادي الذكاء الاصطناعي المدرسي.',
    isActive: true
  },
  {
    id: 'tch_sara',
    fullName: 'أ. سارة مصطفى الطائي',
    fullNameEn: 'Mrs. Sara Mustafa Al-Tai',
    phone: '07802223344',
    email: 'sara.teacher@edu.iq',
    schoolId: 'sch_resalah',
    subjectsIds: ['sub_physics_9', 'sub_physics_12'],
    sectionsIds: ['sec_9_a', 'sec_12_a', 'sec_12_b'],
    schedule: 'الإثنين، الثلاثاء، الخميس (من 8:30 صباحاً إلى 2:00 ظهراً)',
    documents: ['شهادة الماجستير في الفيزياء.pdf'],
    notes: 'تتميز باستخدام تقنيات التعليم النشط والابتكاري في تدريس المواد العلمية والفيزياء التجريبية.',
    isActive: true
  },
  {
    id: 'tch_hassan',
    fullName: 'أ. حسن علي الخفاجي',
    fullNameEn: 'Mr. Hassan Ali Al-Khafaji',
    phone: '07503334455',
    email: 'hassan.teacher@edu.iq',
    schoolId: 'sch_rowad',
    subjectsIds: ['sub_arabic_7', 'sub_arabic_12'],
    sectionsIds: ['sec_7_a', 'sec_12_a'],
    schedule: 'الأحد، الثلاثاء، الخميس (من 8:00 صباحاً إلى 1:00 ظهراً)',
    documents: ['وثيقة التخرج_اللغة العربية.pdf'],
    notes: 'مؤلف وباحث في اللغة العربية وآدابها ومصمم مناهج البلاغة الرقمية.',
    isActive: true
  },
  {
    id: 'tch_reem',
    fullName: 'أ. ريم يوسف السامرائي',
    fullNameEn: 'Mrs. Reem Yousif Al-Samarrai',
    phone: '07718889900',
    email: 'reem.teacher@edu.iq',
    schoolId: 'sch_hekma',
    subjectsIds: ['sub_english_7', 'sub_english_12'],
    sectionsIds: ['sec_7_b', 'sec_12_b'],
    schedule: 'الإثنين، الثلاثاء، الأربعاء (من 8:00 صباحاً إلى 1:30 ظهراً)',
    documents: ['IELTS_Certificate.pdf', 'English_Literature_BA.pdf'],
    notes: 'تعتمد مناهج دولية تفاعلية معتمدة في تعليم اللغة الإنجليزية للمراحل الثانوية العليا.',
    isActive: true
  }
];

export const initialStudents: Student[] = [
  {
    id: 'std_ali',
    studentIdNo: 'STD-2026-0001',
    examNo: 'EXM-991024',
    fullName: 'علي أحمد حامد السعدي',
    fullNameEn: 'Ali Ahmed Hamed Al-Saadi',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=60',
    gender: 'ذكر',
    birthDate: '2012-05-15',
    schoolId: 'sch_noor',
    gradeLevelId: 'gr_7',
    sectionId: 'sec_7_a',
    academicYearId: '2025_2026',
    address: 'بغداد، المنصور، محلة 609، زقاق 12',
    phone: '07705551122',
    parentPhone: '07701112233',
    parentName: 'أحمد حامد السعدي',
    parentRelation: 'أب',
    email: 'ali.ahmed@student.edu.iq',
    studyStatus: StudentStatus.CONTINUING,
    isRegistered: true,
    documents: [
      { name: 'هوية الأحوال المدنية.pdf', url: '#', size: '1.2 MB' },
      { name: 'بطاقة اللقاحات الطبية.pdf', url: '#', size: '850 KB' }
    ],
    notes: 'طالب متفوق ومشارك فعال في الأنشطة الطلابية والرياضية.',
    isActive: true
  },
  {
    id: 'std_zahra',
    studentIdNo: 'STD-2026-0002',
    examNo: 'EXM-883201',
    fullName: 'زهراء محمد العبيدي',
    fullNameEn: 'Zahra Mohammed Al-Obaidi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60',
    gender: 'أنثى',
    birthDate: '2010-09-20',
    schoolId: 'sch_resalah',
    gradeLevelId: 'gr_9',
    sectionId: 'sec_9_a',
    academicYearId: '2025_2026',
    address: 'بغداد، الكرادة، قرب سينما بابل',
    phone: '07802229911',
    parentPhone: '07809998877',
    parentName: 'محمد العبيدي',
    parentRelation: 'أب',
    email: 'zahra.ob@student.edu.iq',
    studyStatus: StudentStatus.CONTINUING,
    isRegistered: true,
    documents: [
      { name: 'الجنسية العراقية والبطاقة الموحدة.pdf', url: '#', size: '2.1 MB' },
      { name: 'تأييد دراسي متوسطة.pdf', url: '#', size: '450 KB' }
    ],
    notes: 'شغوفة بمادة الفيزياء وموهوبة في الرسم والأدب العربي.',
    isActive: true
  },
  {
    id: 'std_youssef',
    studentIdNo: 'STD-2026-0003',
    examNo: 'EXM-771190',
    fullName: 'يوسف حسن علي الخفاجي',
    fullNameEn: 'Youssef Hassan Ali Al-Khafaji',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60',
    gender: 'ذكر',
    birthDate: '2008-01-10',
    schoolId: 'sch_rowad',
    gradeLevelId: 'gr_12',
    sectionId: 'sec_12_a',
    academicYearId: '2025_2026',
    address: 'أربيل، عينكاوة، مجمع الإسكان المقابل للكنيسة',
    phone: '07503338800',
    parentPhone: '07503334455',
    parentName: 'حسن علي الخفاجي',
    parentRelation: 'أب',
    email: 'youssef.h@student.edu.iq',
    studyStatus: StudentStatus.CONTINUING,
    isRegistered: true,
    documents: [
      { name: 'البطاقة الوطنية الموحدة.pdf', url: '#', size: '1.9 MB' }
    ],
    notes: 'طالب ذكي جداً، يستعد للالتحاق بكلية الهندسة، متميز في البرمجة والرياضيات.',
    isActive: true
  },
  {
    id: 'std_fatima',
    studentIdNo: 'STD-2026-0004',
    examNo: 'EXM-662244',
    fullName: 'فاطمة محمد العبيدي',
    fullNameEn: 'Fatima Mohammed Al-Obaidi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60',
    gender: 'أنثى',
    birthDate: '2014-11-02',
    schoolId: 'sch_noor',
    gradeLevelId: 'gr_7',
    sectionId: 'sec_7_b',
    academicYearId: '2025_2026',
    address: 'بغداد، الكرادة، قرب سينما بابل',
    phone: '07709998877',
    parentPhone: '07809998877',
    parentName: 'محمد العبيدي',
    parentRelation: 'أب',
    email: 'fatima.ob@student.edu.iq',
    studyStatus: StudentStatus.CONTINUING,
    isRegistered: true,
    documents: [
      { name: 'البطاقة الموحدة فاطمة.pdf', url: '#', size: '1.4 MB' }
    ],
    notes: 'شقيقة زهراء العبيدي، مسجلة في مدرسة النور ولديها تقدم متميز في حفظ القرآن الكريم.',
    isActive: true
  }
];

export const initialParents: Parent[] = [
  {
    id: 'pr_ahmed_saadi',
    fullName: 'أحمد حامد السعدي',
    email: 'ahmed.saadi@parent.edu.iq',
    phone: '07701112233',
    childrenIds: ['std_ali'],
    isActive: true
  },
  {
    id: 'pr_mohammed_obaidi',
    fullName: 'محمد العبيدي',
    email: 'm.obaidi@parent.edu.iq',
    phone: '07809998877',
    childrenIds: ['std_zahra', 'std_fatima'], // Note: two children in different schools! (Al-Noor and Al-Resalah)
    isActive: true
  }
];

export const initialLessons: Lesson[] = [
  {
    id: 'les_math_01',
    schoolId: 'sch_noor',
    gradeLevelId: 'gr_7',
    sectionId: 'sec_7_a',
    subjectId: 'sub_math_7',
    unitName: 'الوحدة الأولى: الجبر والعمليات الأساسية',
    title: 'مفهوم الأعداد الصحيحة وخصائصها الكبرى',
    description: 'في هذا الدرس سنتعرف بالتفصيل على مجموعة الأعداد الصحيحة (ص)، كيفية تمثيلها على خط الأعداد والعمليات الأربع الكبرى عليها مع أمثلة عملية توضيحية.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-writing-numbers-and-maths-formulas-on-glass-41584-large.mp4',
    videoDurationSeconds: 154,
    allowDownloadVideo: false,
    popupQuizzes: [
      {
        timeInSeconds: 30,
        question: {
          id: 'pop_q1',
          questionText: 'ما هي قيمة الناتج لـ (-5) + (-8)؟',
          options: ['-13', '13', '-3', '3'],
          correctOptionIndex: 0
        }
      },
      {
        timeInSeconds: 80,
        question: {
          id: 'pop_q2',
          questionText: 'أي من الأرقام التالية يمثل عدداً صحيحاً سالباً أصغر؟',
          options: ['-1', '-5', '-100', '0'],
          correctOptionIndex: 2
        }
      }
    ],
    pdfUrl: '#',
    pdfName: 'ملخص الدرس الأول في الأعداد الصحيحة.pdf',
    wordUrl: '#',
    wordName: 'أوراق العمل التفاعلية للأسبوع الأول.docx',
    externalLinks: [
      { title: 'شرح إضافي على قناة أكاديمية خان', url: 'https://khanacademy.org' }
    ],
    publishDate: '2026-07-15T08:00:00',
    viewCount: 45,
    completionRate: 88
  },
  {
    id: 'les_physics_12_01',
    schoolId: 'sch_resalah',
    gradeLevelId: 'gr_12',
    sectionId: 'sec_12_a',
    subjectId: 'sub_physics_12',
    unitName: 'الباب الأول: الفيزياء النووية والذرة',
    title: 'النشاط الإشعاعي وعمر النصف للنواة غير المستقرة',
    description: 'شرح مفصل لظاهرة النشاط الإشعاعي الطبيعي والصناعي وقانون التناقص الإشعاعي وحسابات عمر النصف للنظائر غير المستقرة.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-scientific-formulas-written-on-glass-board-with-marker-41585-large.mp4',
    videoDurationSeconds: 198,
    allowDownloadVideo: false,
    popupQuizzes: [
      {
        timeInSeconds: 45,
        question: {
          id: 'pop_q3',
          questionText: 'أي من الأشعة التالية يمتلك أعلى قدرة على الاختراق؟',
          options: ['أشعة ألفا', 'أشعة بيتا', 'أشعة غاما', 'الأشعة تحت الحمراء'],
          correctOptionIndex: 2
        }
      }
    ],
    pdfUrl: '#',
    pdfName: 'ملزمة الفيزياء النووية الجزء الأول.pdf',
    externalLinks: [
      { title: 'تجارب تفاعلية في الفيزياء النووية PHET', url: 'https://phet.colorado.edu' }
    ],
    publishDate: '2026-07-16T09:30:00',
    viewCount: 32,
    completionRate: 92
  }
];

export const initialAssignments: Assignment[] = [
  {
    id: 'asn_math_7_1',
    schoolId: 'sch_noor',
    gradeLevelId: 'gr_7',
    sectionId: 'sec_7_a',
    subjectId: 'sub_math_7',
    title: 'الواجب الأول: العمليات الحسابية والترتيب',
    description: 'الرجاء حل جميع المسائل الواردة في الصفحة 12 من الكتاب المدرسي وكتابة الخطوات كاملة، مع رفع الحل كملف PDF أو صورة واضحة.',
    attachmentUrl: '#',
    attachmentName: 'ورقة الأسئلة المساعدة.pdf',
    dueDate: '2026-07-22T23:59:59',
    maxScore: 10,
    allowMultipleAttempts: true,
    isActive: true
  },
  {
    id: 'asn_physics_12_1',
    schoolId: 'sch_resalah',
    gradeLevelId: 'gr_12',
    sectionId: 'sec_12_a',
    subjectId: 'sub_physics_12',
    title: 'واجب الفيزياء النووية: حساب عمر النصف وتناقص عينة',
    description: 'قم بحل المسائل في المرفق والمتعلقة بحساب الزمن اللازم لتناقص عينة من اليورانيوم المشع إلى الثمن من كتلتها الأصلية.',
    attachmentUrl: '#',
    attachmentName: 'مسائل تدريبية - فيزياء 12.pdf',
    dueDate: '2026-07-25T14:00:00',
    maxScore: 20,
    allowMultipleAttempts: false,
    isActive: true
  }
];

export const initialAssignmentSubmissions: AssignmentSubmission[] = [
  {
    id: 'sub_asn_01',
    assignmentId: 'asn_math_7_1',
    studentId: 'std_ali',
    submitDate: '2026-07-18T16:45:00',
    answerText: 'تم إرفاق صورة الحل لجميع المسائل الخمسة، يرجى التكرم بالتدقيق أستاذي العزيز.',
    fileUrl: '#',
    fileName: 'حل_علي_أحمد_الرياضيات.pdf',
    score: 9.5,
    teacherFeedback: 'خطوات ممتازة وطريقة ترتيب ذكية، واظب على هذا المستوى الرائع!',
    status: 'graded'
  },
  {
    id: 'sub_asn_02',
    assignmentId: 'asn_physics_12_1',
    studentId: 'std_zahra',
    submitDate: '2026-07-19T00:05:00',
    answerText: 'الجواب النهائي هو: عمر النصف للعينة = 15 سنة، مرفق التفاصيل الكاملة بالخطوات الرياضية في الملف.',
    fileUrl: '#',
    fileName: 'واجب_الفيزياء_زهراء.pdf',
    status: 'submitted'
  }
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'qz_math_01',
    schoolId: 'sch_noor',
    gradeLevelId: 'gr_7',
    sectionId: 'sec_7_a',
    subjectId: 'sub_math_7',
    title: 'اختبار سريع: الجبر والقيمة المطلقة للأعداد',
    description: 'اختبار قصير ومؤتمت لقياس فهم الطلاب لمفهوم القيمة المطلقة وترتيب العمليات.',
    durationMinutes: 10,
    isActive: true,
    dueDate: '2026-07-28T22:00:00',
    questions: [
      {
        id: 'q_m_1',
        questionText: 'ما هي القيمة المطلقة لـ |-15|؟',
        options: ['-15', '15', '0', '30'],
        correctOptionIndex: 1
      },
      {
        id: 'q_m_2',
        questionText: 'حسب ترتيب العمليات الرياضية، ما هو ناتج: 4 + 3 × 5؟',
        options: ['35', '19', '23', '12'],
        correctOptionIndex: 1
      },
      {
        id: 'q_m_3',
        questionText: 'إذا كانت س = -3، فإن قيمة 2س + 10 هي:',
        options: ['4', '-4', '16', '-16'],
        correctOptionIndex: 0
      }
    ]
  }
];

export const initialStudentGrades: StudentGradeRecord[] = [
  {
    id: 'grd_ali_math',
    studentId: 'std_ali',
    subjectId: 'sub_math_7',
    academicYearId: '2025_2026',
    homeworksAvg: 9.5,
    quizzesAvg: 8.7,
    monthlyExam1: 92,
    monthlyExam2: 95,
    midYearExam: 94,
    finalExam: 96,
    activityScore: 10,
    yearlyTotal: 95,
    percentage: 95,
    gradeLetter: 'امتياز',
    isPassed: true
  },
  {
    id: 'grd_zahra_phys',
    studentId: 'std_zahra',
    subjectId: 'sub_physics_12',
    academicYearId: '2025_2026',
    homeworksAvg: 18.5,
    quizzesAvg: 19.0,
    monthlyExam1: 98,
    monthlyExam2: 96,
    midYearExam: 97,
    finalExam: 99,
    activityScore: 10,
    yearlyTotal: 98,
    percentage: 98,
    gradeLetter: 'امتياز',
    isPassed: true
  }
];

export const initialAttendance: AttendanceRecord[] = [
  { id: 'att_01', studentId: 'std_ali', date: '2026-07-15', status: 'present', markedByTeacherId: 'tch_ahmed' },
  { id: 'att_02', studentId: 'std_ali', date: '2026-07-16', status: 'present', markedByTeacherId: 'tch_ahmed' },
  { id: 'att_03', studentId: 'std_ali', date: '2026-07-17', status: 'late', markedByTeacherId: 'tch_ahmed' },
  { id: 'att_04', studentId: 'std_ali', date: '2026-07-18', status: 'present', markedByTeacherId: 'tch_ahmed' },
  
  { id: 'att_05', studentId: 'std_zahra', date: '2026-07-15', status: 'present', markedByTeacherId: 'tch_sara' },
  { id: 'att_06', studentId: 'std_zahra', date: '2026-07-16', status: 'absent', reason: 'مراجعة الطبيب لوعكة صحية', markedByTeacherId: 'tch_sara' },
  { id: 'att_07', studentId: 'std_zahra', date: '2026-07-17', status: 'excused', reason: 'مراجعة الطبيب لوعكة صحية وبإجازة رسمية', markedByTeacherId: 'tch_sara' },
  { id: 'att_08', studentId: 'std_zahra', date: '2026-07-18', status: 'present', markedByTeacherId: 'tch_sara' }
];

export const initialSchedules: ScheduleSlot[] = [
  // 7th Grade Section A (Al-Noor School)
  { id: 'sc_01', schoolId: 'sch_noor', gradeLevelId: 'gr_7', sectionId: 'sec_7_a', subjectId: 'sub_math_7', teacherId: 'tch_ahmed', dayOfWeek: 0, period: 1, timeRange: '08:00 - 08:45', roomName: 'قاعة الفارابي' },
  { id: 'sc_02', schoolId: 'sch_noor', gradeLevelId: 'gr_7', sectionId: 'sec_7_a', subjectId: 'sub_math_7', teacherId: 'tch_ahmed', dayOfWeek: 0, period: 2, timeRange: '08:45 - 09:30', roomName: 'قاعة الفارابي' },
  { id: 'sc_03', schoolId: 'sch_noor', gradeLevelId: 'gr_7', sectionId: 'sec_7_a', subjectId: 'sub_arabic_7', teacherId: 'tch_hassan', dayOfWeek: 1, period: 1, timeRange: '08:00 - 08:45', roomName: 'قاعة الفارابي' },
  { id: 'sc_04', schoolId: 'sch_noor', gradeLevelId: 'gr_7', sectionId: 'sec_7_a', subjectId: 'sub_cs_7', teacherId: 'tch_ahmed', dayOfWeek: 1, period: 3, timeRange: '09:45 - 10:30', roomName: 'مختبر الحاسوب' },
  
  // 12th Grade Section A (Al-Resalah School)
  { id: 'sc_05', schoolId: 'sch_resalah', gradeLevelId: 'gr_12', sectionId: 'sec_12_a', subjectId: 'sub_physics_12', teacherId: 'tch_sara', dayOfWeek: 1, period: 1, timeRange: '08:00 - 08:45', roomName: 'مختبر الفيزياء الكبرى' },
  { id: 'sc_06', schoolId: 'sch_resalah', gradeLevelId: 'gr_12', sectionId: 'sec_12_a', subjectId: 'sub_arabic_12', teacherId: 'tch_hassan', dayOfWeek: 1, period: 2, timeRange: '08:45 - 09:30', roomName: 'قاعة الخوارزمي' }
];

export const initialSupportTickets: SupportTicket[] = [
  {
    id: 'tkt_01',
    userId: 'pr_mohammed_obaidi',
    userName: 'محمد العبيدي',
    userRole: UserRole.PARENT,
    schoolId: 'sch_resalah',
    category: 'مالي',
    title: 'طلب تقسيط الدفعة الثانية من الأقساط الدراسية',
    description: 'السلام عليكم، أود تقديم طلب لتقسيط الدفعة الثانية المستحقة لابنتي زهراء محمد العبيدي على دفعتين متساويتين بسبب بعض الظروف الطارئة. جزاكم الله خيراً.',
    priority: 'medium',
    status: 'replied',
    createdAt: '2026-07-16T11:20:00',
    replies: [
      {
        id: 'rep_01',
        senderName: 'الإدارة المالية - مدرسة الرسالة',
        senderRole: UserRole.SCHOOL_ADMIN,
        message: 'وعليكم السلام ورحمة الله وبركاته، والد الطالبة المحترم. لا توجد أي مشكلة، تم قبول طلبكم وجدولة القسط على دفعتين (الأولى بداية الشهر القادم والثانية مطلع الشهر الذي يليه). يسعدنا دوماً التعاون معكم.',
        createdAt: '2026-07-17T09:00:00'
      }
    ]
  },
  {
    id: 'tkt_02',
    userId: 'std_ali',
    userName: 'علي أحمد حامد السعدي',
    userRole: UserRole.STUDENT,
    schoolId: 'sch_noor',
    category: 'تقني',
    title: 'صعوبة في تشغيل فيديو الدرس الأول في الرياضيات',
    description: 'أواجه مشكلة في تحميل وتشغيل الفيديو بالدقة الكاملة على هاتفي حيث يتوقف الفيديو بشكل متكرر بالرغم من أن سرعة الإنترنت لدي جيدة.',
    priority: 'low',
    status: 'open',
    createdAt: '2026-07-18T19:30:00',
    replies: []
  }
];

export const initialAuditLogs: AuditLog[] = [
  { id: 'log_01', userId: 'tch_ahmed', userName: 'أحمد حامد السعدي', userRole: UserRole.TEACHER, schoolId: 'sch_noor', operation: 'إضافة', targetTable: 'الدروس', details: 'إضافة درس جديد بعنوان: مفهوم الأعداد الصحيحة وخصائصها', timestamp: '2026-07-15T08:00:00', ipAddress: '192.168.1.45' },
  { id: 'log_02', userId: 'tch_ahmed', userName: 'أحمد حامد السعدي', userRole: UserRole.TEACHER, schoolId: 'sch_noor', operation: 'إضافة', targetTable: 'الواجبات', details: 'إنشاء واجب جديد: العمليات الحسابية والترتيب', timestamp: '2026-07-15T08:15:00', ipAddress: '192.168.1.45' },
  { id: 'log_03', userId: 'sys_admin', userName: 'المسؤول العام', userRole: UserRole.SUPER_ADMIN, operation: 'تعديل', targetTable: 'المدارس', details: 'تحديث بيانات مدرسة رواد الغد الأهلية والفروع', timestamp: '2026-07-17T14:30:00', ipAddress: '10.0.4.12' },
  { id: 'log_04', userId: 'tch_ahmed', userName: 'أحمد حامد السعدي', userRole: UserRole.TEACHER, schoolId: 'sch_noor', operation: 'تعديل', targetTable: 'الدرجات', details: 'رصد درجة واجب الرياضيات للطالب علي أحمد حامد السعدي (9.5/10)', timestamp: '2026-07-18T20:10:00', ipAddress: '192.168.1.52' }
];

export const initialRegistrationRequests: RegistrationRequest[] = [
  {
    id: 'req_01',
    fullName: 'مصطفى عادل الجبوري',
    gender: 'ذكر',
    birthDate: '2014-06-12',
    schoolId: 'sch_noor',
    levelId: 'lvl_elementary',
    gradeLevelId: 'gr_6',
    parentName: 'عادل الجبوري',
    parentPhone: '07723334455',
    parentEmail: 'adel.jabouri@gmail.com',
    address: 'بغداد، المنصور، قرب المتنزه الدولي',
    documents: [
      { name: 'البطاقة الموحدة للطفل.pdf', url: '#', size: '1.5 MB' },
      { name: 'كارت اللقاحات.jpg', url: '#', size: '920 KB' }
    ],
    status: AdmissionStatus.PENDING,
    requestDate: '2026-07-15T10:00:00'
  },
  {
    id: 'req_02',
    fullName: 'مريم عمار العاني',
    gender: 'أنثى',
    birthDate: '2011-03-24',
    schoolId: 'sch_resalah',
    levelId: 'lvl_middle',
    gradeLevelId: 'gr_9',
    parentName: 'عمار العاني',
    parentPhone: '07812224466',
    parentEmail: 'ammar.ani@yahoo.com',
    address: 'بغداد، الجادرية، قرب جامعة بغداد',
    documents: [
      { name: 'البطاقة الموحدة مريم.pdf', url: '#', size: '1.8 MB' },
      { name: 'الشهادة المدرسية للصف الثامن.pdf', url: '#', size: '2.3 MB' }
    ],
    status: AdmissionStatus.APPROVED,
    requestDate: '2026-07-14T11:45:00',
    adminNotes: 'مستنداتها كاملة ومعدلها في الصف الثامن (96%). تم القبول والتوجيه لقطع الوصل المالي.'
  }
];

export const initialPayments: PaymentRecord[] = [
  { id: 'pay_01', studentId: 'std_ali', amount: 750000, currency: 'د.ع', title: 'القسط الدراسي الأول - الفصل الأول', paymentDate: '2025-09-10', receiptNo: 'REC-2025-9982', status: 'paid' },
  { id: 'pay_02', studentId: 'std_ali', amount: 750000, currency: 'د.ع', title: 'القسط الدراسي الثاني - الفصل الثاني', paymentDate: '2026-01-15', receiptNo: 'REC-2026-1204', status: 'paid' },
  { id: 'pay_03', studentId: 'std_zahra', amount: 900000, currency: 'د.ع', title: 'القسط الدراسي الأول - تخصص علمي', paymentDate: '2025-09-12', receiptNo: 'REC-2025-9990', status: 'paid' },
  { id: 'pay_04', studentId: 'std_zahra', amount: 900000, currency: 'د.ع', title: 'القسط الدراسي الثاني - تخصص علمي', paymentDate: '', receiptNo: '', status: 'pending' }
];

export const initialNotifications: AppNotification[] = [
  { id: 'nt_01', title: 'تم نشر درس جديد', body: 'قام الأستاذ أحمد حامد بنشر درس "مفهوم الأعداد الصحيحة" لمادة الرياضيات.', type: 'lesson', targetType: 'section', targetSchoolId: 'sch_noor', targetSectionId: 'sec_7_a', createdAt: '2026-07-15T08:05:00', isRead: false },
  { id: 'nt_02', title: 'تم الإعلان عن واجب جديد', body: 'لديك واجب مدرسي جديد في مادة الرياضيات يستحق في 2026-07-22.', type: 'assignment', targetType: 'section', targetSchoolId: 'sch_noor', targetSectionId: 'sec_7_a', createdAt: '2026-07-15T08:20:00', isRead: false },
  { id: 'nt_03', title: 'تم رصد درجات جديدة', body: 'تم تصحيح ورصد درجات واجب الرياضيات الأول. يمكنك الآن الاطلاع على النتيجة.', type: 'grade', targetType: 'student', targetUserId: 'std_ali', createdAt: '2026-07-18T20:15:00', isRead: false }
];
