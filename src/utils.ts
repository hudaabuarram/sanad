import { AuditLog, UserRole } from './types';

// Format currency to Iraqi Dinar (IQD)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-IQ', {
    style: 'currency',
    currency: 'IQD',
    maximumFractionDigits: 0
  }).format(amount);
}

// Format date to local Arabic format
export function formatDate(dateStr: string): string {
  if (!dateStr) return 'غير محدد';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('ar-IQ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Export JSON data to CSV and trigger download
export function exportToCSV(data: any[], fileName: string) {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','), // header row
    ...data.map(row => 
      headers.map(fieldName => {
        const val = row[fieldName];
        // handle strings with commas
        const stringVal = val === null || val === undefined ? '' : String(val);
        return `"${stringVal.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ];
  
  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + csvRows.join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate dynamic Audit Log record
export function createAuditLog(
  userId: string,
  userName: string,
  role: UserRole,
  operation: 'إضافة' | 'تعديل' | 'حذف' | 'تسجيل دخول' | 'تصدير' | 'ترحيل',
  targetTable: string,
  details: string,
  schoolId?: string
): AuditLog {
  return {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    userId,
    userName,
    userRole: role,
    schoolId,
    operation,
    targetTable,
    details,
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.' + Math.floor(Math.random() * 254 + 1)
  };
}

// Simulate PDF generation with styled printing window
export function printStudentCard(student: any, schoolName: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const cardHtml = `
    <html>
      <head>
        <title>بطاقة الطالب التعريفية - ${student.fullName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Cairo:wght@400;600;700&display=swap');
          body {
            font-family: 'Cairo', sans-serif;
            direction: rtl;
            text-align: right;
            padding: 40px;
            background: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80vh;
          }
          .card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            width: 450px;
            padding: 24px;
            border-top: 12px solid #0f172a;
            position: relative;
            overflow: hidden;
          }
          .card::after {
            content: '';
            position: absolute;
            top: -50px;
            right: -50px;
            width: 150px;
            height: 150px;
            background: rgba(15, 23, 42, 0.03);
            border-radius: 50%;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .school-info h2 {
            font-size: 18px;
            margin: 0;
            color: #0f172a;
          }
          .school-info p {
            font-size: 11px;
            margin: 4px 0 0 0;
            color: #6b7280;
          }
          .logo {
            width: 50px;
            height: 50px;
            border-radius: 8px;
            object-fit: cover;
          }
          .content {
            display: flex;
            gap: 20px;
          }
          .avatar-container {
            flex-shrink: 0;
          }
          .avatar {
            width: 100px;
            height: 120px;
            border-radius: 12px;
            object-fit: cover;
            border: 3px solid #e5e7eb;
          }
          .details {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .detail-row {
            font-size: 13px;
            color: #374151;
            display: flex;
          }
          .detail-label {
            font-weight: 700;
            width: 110px;
            color: #4b5563;
          }
          .detail-val {
            color: #111827;
          }
          .footer {
            margin-top: 24px;
            border-top: 1px dashed #d1d5db;
            padding-top: 12px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
          }
          .barcode {
            font-family: monospace;
            font-size: 14px;
            letter-spacing: 4px;
            color: #0f172a;
            margin-top: 6px;
            font-weight: bold;
          }
          @media print {
            body { background: white; padding: 0; }
            .card { box-shadow: none; border: 1px solid #d1d5db; }
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="school-info">
              <h2>${schoolName}</h2>
              <p>البطاقة التعريفية الرسمية للطالب</p>
            </div>
            <img class="logo" src="${student.avatar || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150'}" />
          </div>
          <div class="content">
            <div class="avatar-container">
              <img class="avatar" src="${student.avatar || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'}" />
            </div>
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">اسم الطالب:</span>
                <span class="detail-val" style="font-weight: 700; color: #0f172a;">${student.fullName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">الرقم التعريفي:</span>
                <span class="detail-val font-mono" style="color: #4f46e5;">${student.studentIdNo}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">الصف والشعبة:</span>
                <span class="detail-val">${student.gradeLevelId === 'gr_7' ? 'الأول المتوسط' : student.gradeLevelId === 'gr_9' ? 'الثالث المتوسط' : 'السادس الإعدادي'} - الشعبة ${student.sectionId === 'sec_7_a' || student.sectionId === 'sec_9_a' || student.sectionId === 'sec_12_a' ? 'أ' : 'ب'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">حالة الطالب:</span>
                <span class="detail-val" style="color: #16a34a; font-weight: 600;">${student.studyStatus}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">هاتف الطوارئ:</span>
                <span class="detail-val">${student.parentPhone}</span>
              </div>
            </div>
          </div>
          <div class="footer">
            <div>نظام إدارة المدارس والتعليم الإلكتروني المتكامل</div>
            <div class="barcode">*${student.studentIdNo}*</div>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;
  
  printWindow.document.write(cardHtml);
  printWindow.document.close();
}
