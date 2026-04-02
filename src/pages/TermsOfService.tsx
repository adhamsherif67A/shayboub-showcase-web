import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, FileText } from "lucide-react";

const TermsOfService = () => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const content = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last Updated: April 2026",
      backToHome: "Back to Home",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: `By accessing or using Shayboub Café's website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.`
        },
        {
          title: "2. Services Description",
          content: `Shayboub Café provides:
• Online menu viewing
• Table reservations and pickup orders
• Loyalty rewards program
• Customer account management

We reserve the right to modify or discontinue any service at any time.`
        },
        {
          title: "3. Account Registration",
          content: `To use certain features, you must create an account. You agree to:
• Provide accurate and complete information
• Maintain the security of your account credentials
• Notify us immediately of any unauthorized access
• Be responsible for all activities under your account

We reserve the right to suspend or terminate accounts that violate these terms.`
        },
        {
          title: "4. Reservations and Orders",
          content: `When making a reservation or order:
• You agree to provide accurate information
• Reservations are subject to availability
• We may contact you to confirm reservations
• Cancellation policies apply as communicated
• Prices are subject to change without notice

No-shows or repeated cancellations may result in restrictions on future bookings.`
        },
        {
          title: "5. Loyalty Program",
          content: `By participating in our loyalty program:
• Points are earned based on confirmed orders
• Points have no cash value
• Rewards are subject to availability
• We reserve the right to modify the program
• Fraudulent activity will result in account termination
• Points may expire according to program rules

Voucher codes are single-use and non-transferable.`
        },
        {
          title: "6. User Conduct",
          content: `You agree not to:
• Use the service for any unlawful purpose
• Attempt to gain unauthorized access
• Interfere with the service's operation
• Submit false or misleading information
• Harass staff or other customers
• Use automated systems to access the service`
        },
        {
          title: "7. Intellectual Property",
          content: `All content on this website, including logos, images, text, and design, is owned by Shayboub Café and protected by copyright laws. You may not reproduce, distribute, or create derivative works without our written consent.`
        },
        {
          title: "8. Limitation of Liability",
          content: `To the maximum extent permitted by law:
• Our services are provided "as is"
• We are not liable for indirect damages
• Our liability is limited to the amount you paid
• We are not responsible for third-party services

We make no warranties about service availability or accuracy.`
        },
        {
          title: "9. Indemnification",
          content: `You agree to indemnify and hold harmless Shayboub Café and its employees from any claims arising from your use of our services or violation of these terms.`
        },
        {
          title: "10. Governing Law",
          content: `These terms are governed by the laws of the Arab Republic of Egypt. Any disputes shall be resolved in the courts of Egypt.`
        },
        {
          title: "11. Changes to Terms",
          content: `We may update these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.`
        },
        {
          title: "12. Contact Us",
          content: `For questions about these Terms of Service:

Shayboub Café
Email: shayboub@cafe.com
Phone: +20 XXX XXX XXXX`
        }
      ]
    },
    ar: {
      title: "شروط الخدمة",
      lastUpdated: "آخر تحديث: أبريل 2026",
      backToHome: "العودة للصفحة الرئيسية",
      sections: [
        {
          title: "١. قبول الشروط",
          content: `باستخدامك لموقع وخدمات شايبوب كافيه، فإنك توافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام خدماتنا.`
        },
        {
          title: "٢. وصف الخدمات",
          content: `يقدم شايبوب كافيه:
• عرض القائمة عبر الإنترنت
• حجز الطاولات وطلبات الاستلام
• برنامج مكافآت الولاء
• إدارة حساب العميل

نحتفظ بالحق في تعديل أو إيقاف أي خدمة في أي وقت.`
        },
        {
          title: "٣. تسجيل الحساب",
          content: `لاستخدام ميزات معينة، يجب إنشاء حساب. أنت توافق على:
• تقديم معلومات دقيقة وكاملة
• الحفاظ على أمان بيانات اعتماد حسابك
• إخطارنا فورًا بأي وصول غير مصرح به
• تحمل المسؤولية عن جميع الأنشطة تحت حسابك

نحتفظ بالحق في تعليق أو إنهاء الحسابات التي تنتهك هذه الشروط.`
        },
        {
          title: "٤. الحجوزات والطلبات",
          content: `عند إجراء حجز أو طلب:
• توافق على تقديم معلومات دقيقة
• الحجوزات تخضع للتوافر
• قد نتواصل معك لتأكيد الحجوزات
• تطبق سياسات الإلغاء كما هو معلن
• الأسعار قابلة للتغيير دون إشعار

عدم الحضور أو الإلغاء المتكرر قد يؤدي إلى قيود على الحجوزات المستقبلية.`
        },
        {
          title: "٥. برنامج الولاء",
          content: `بالمشاركة في برنامج الولاء:
• تُكتسب النقاط بناءً على الطلبات المؤكدة
• النقاط ليس لها قيمة نقدية
• المكافآت تخضع للتوافر
• نحتفظ بالحق في تعديل البرنامج
• النشاط الاحتيالي سيؤدي إلى إنهاء الحساب
• قد تنتهي صلاحية النقاط وفقًا لقواعد البرنامج

أكواد القسائم للاستخدام مرة واحدة وغير قابلة للتحويل.`
        },
        {
          title: "٦. سلوك المستخدم",
          content: `توافق على عدم:
• استخدام الخدمة لأي غرض غير قانوني
• محاولة الوصول غير المصرح به
• التدخل في تشغيل الخدمة
• تقديم معلومات كاذبة أو مضللة
• مضايقة الموظفين أو العملاء الآخرين
• استخدام أنظمة آلية للوصول إلى الخدمة`
        },
        {
          title: "٧. الملكية الفكرية",
          content: `جميع المحتويات على هذا الموقع، بما في ذلك الشعارات والصور والنصوص والتصميم، مملوكة لشايبوب كافيه ومحمية بقوانين حقوق النشر. لا يجوز لك إعادة الإنتاج أو التوزيع أو إنشاء أعمال مشتقة دون موافقتنا الخطية.`
        },
        {
          title: "٨. تحديد المسؤولية",
          content: `إلى أقصى حد يسمح به القانون:
• خدماتنا مقدمة "كما هي"
• نحن غير مسؤولين عن الأضرار غير المباشرة
• مسؤوليتنا محدودة بالمبلغ الذي دفعته
• نحن غير مسؤولين عن خدمات الطرف الثالث

نحن لا نقدم أي ضمانات حول توفر الخدمة أو دقتها.`
        },
        {
          title: "٩. التعويض",
          content: `توافق على تعويض وإبراء ذمة شايبوب كافيه وموظفيه من أي مطالبات ناشئة عن استخدامك لخدماتنا أو انتهاكك لهذه الشروط.`
        },
        {
          title: "١٠. القانون الواجب التطبيق",
          content: `تخضع هذه الشروط لقوانين جمهورية مصر العربية. يتم حل أي نزاعات في محاكم مصر.`
        },
        {
          title: "١١. تغييرات الشروط",
          content: `قد نقوم بتحديث هذه الشروط في أي وقت. استمرار استخدام خدماتنا بعد التغييرات يعني قبولك للشروط الجديدة.`
        },
        {
          title: "١٢. اتصل بنا",
          content: `للأسئلة حول شروط الخدمة هذه:

شايبوب كافيه
البريد الإلكتروني: shayboub@cafe.com
الهاتف: +20 XXX XXX XXXX`
        }
      ]
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/" 
            className={`flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isRTL ? <ArrowLeft className="h-5 w-5 rotate-180" /> : <ArrowLeft className="h-5 w-5" />}
            <span>{t.backToHome}</span>
          </Link>
          
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <FileText className="h-10 w-10" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t.title}</h1>
              <p className="text-primary-foreground/70 mt-1">{t.lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {t.sections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h2 className={`text-xl font-semibold text-foreground ${isRTL ? 'text-right' : ''}`}>
                {section.title}
              </h2>
              <p className={`text-muted-foreground whitespace-pre-line leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
