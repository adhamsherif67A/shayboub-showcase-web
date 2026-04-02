import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Shield } from "lucide-react";

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: April 2026",
      backToHome: "Back to Home",
      sections: [
        {
          title: "1. Information We Collect",
          content: `We collect information you provide directly to us, including:
• Name and contact information (email, phone number)
• Account credentials
• Reservation details and order history
• Loyalty program participation data
• Birthday (optional, for rewards)
• Device and browser information`
        },
        {
          title: "2. How We Use Your Information",
          content: `We use the information we collect to:
• Process your reservations and orders
• Manage your loyalty rewards account
• Send you order confirmations and updates
• Provide customer support
• Send promotional offers (with your consent)
• Improve our services and website
• Comply with legal obligations`
        },
        {
          title: "3. Information Sharing",
          content: `We do not sell your personal information. We may share your information with:
• Service providers who assist our operations
• Payment processors for transactions
• Legal authorities when required by law
• Business partners with your consent`
        },
        {
          title: "4. Data Security",
          content: `We implement appropriate security measures to protect your personal information, including:
• Encrypted data transmission (SSL/TLS)
• Secure database storage with Firebase
• Access controls for staff
• Regular security reviews`
        },
        {
          title: "5. Your Rights",
          content: `You have the right to:
• Access your personal data
• Correct inaccurate information
• Delete your account and data
• Opt-out of marketing communications
• Export your data

To exercise these rights, contact us at shayboub@cafe.com`
        },
        {
          title: "6. Cookies",
          content: `We use cookies and similar technologies to:
• Keep you logged in
• Remember your preferences
• Analyze website usage
• Improve our services

You can manage cookie preferences in your browser settings.`
        },
        {
          title: "7. Children's Privacy",
          content: `Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.`
        },
        {
          title: "8. Changes to This Policy",
          content: `We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.`
        },
        {
          title: "9. Contact Us",
          content: `If you have questions about this Privacy Policy, please contact us at:

Shayboub Café
Email: shayboub@cafe.com
Phone: +20 XXX XXX XXXX`
        }
      ]
    },
    ar: {
      title: "سياسة الخصوصية",
      lastUpdated: "آخر تحديث: أبريل 2026",
      backToHome: "العودة للصفحة الرئيسية",
      sections: [
        {
          title: "١. المعلومات التي نجمعها",
          content: `نجمع المعلومات التي تقدمها لنا مباشرة، بما في ذلك:
• الاسم ومعلومات الاتصال (البريد الإلكتروني، رقم الهاتف)
• بيانات الحساب
• تفاصيل الحجز وسجل الطلبات
• بيانات برنامج الولاء
• تاريخ الميلاد (اختياري، للمكافآت)
• معلومات الجهاز والمتصفح`
        },
        {
          title: "٢. كيف نستخدم معلوماتك",
          content: `نستخدم المعلومات التي نجمعها من أجل:
• معالجة حجوزاتك وطلباتك
• إدارة حساب نقاط الولاء الخاص بك
• إرسال تأكيدات وتحديثات الطلبات
• تقديم الدعم للعملاء
• إرسال العروض الترويجية (بموافقتك)
• تحسين خدماتنا وموقعنا
• الامتثال للالتزامات القانونية`
        },
        {
          title: "٣. مشاركة المعلومات",
          content: `نحن لا نبيع معلوماتك الشخصية. قد نشارك معلوماتك مع:
• مزودي الخدمات الذين يساعدون في عملياتنا
• معالجي الدفع للمعاملات
• السلطات القانونية عند الطلب بموجب القانون
• شركاء الأعمال بموافقتك`
        },
        {
          title: "٤. أمان البيانات",
          content: `نطبق تدابير أمنية مناسبة لحماية معلوماتك الشخصية، بما في ذلك:
• نقل البيانات المشفر (SSL/TLS)
• تخزين قاعدة بيانات آمن مع Firebase
• ضوابط وصول للموظفين
• مراجعات أمنية منتظمة`
        },
        {
          title: "٥. حقوقك",
          content: `لديك الحق في:
• الوصول إلى بياناتك الشخصية
• تصحيح المعلومات غير الدقيقة
• حذف حسابك وبياناتك
• إلغاء الاشتراك في الاتصالات التسويقية
• تصدير بياناتك

لممارسة هذه الحقوق، تواصل معنا على shayboub@cafe.com`
        },
        {
          title: "٦. ملفات تعريف الارتباط",
          content: `نستخدم ملفات تعريف الارتباط والتقنيات المماثلة من أجل:
• إبقائك مسجل الدخول
• تذكر تفضيلاتك
• تحليل استخدام الموقع
• تحسين خدماتنا

يمكنك إدارة تفضيلات ملفات تعريف الارتباط في إعدادات المتصفح.`
        },
        {
          title: "٧. خصوصية الأطفال",
          content: `خدماتنا غير موجهة للأطفال دون سن 13 عامًا. نحن لا نجمع معلومات شخصية من الأطفال دون سن 13 عامًا عن علم.`
        },
        {
          title: "٨. التغييرات على هذه السياسة",
          content: `قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات عن طريق نشر السياسة الجديدة على هذه الصفحة.`
        },
        {
          title: "٩. اتصل بنا",
          content: `إذا كانت لديك أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا على:

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
            <Shield className="h-10 w-10" />
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

export default PrivacyPolicy;
