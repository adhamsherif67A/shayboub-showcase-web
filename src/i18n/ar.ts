import type { Translations } from './en';

export const ar: Translations = {
  // Navigation
  nav: {
    menu: "القائمة",
    reservations: "الحجوزات",
    locations: "الفروع",
    about: "عن شيبوب",
    orderNow: "اطلب الآن",
  },
  
  // Hero Section
  hero: {
    tagline: "قهوة مختصة، ساندويتشات مميزة وأجواء رائعة",
    exploreMenu: "استكشف القائمة",
    orderOnTalabat: "اطلب من طلبات",
  },
  
  // Menu Section
  menu: {
    title: "قائمتنا",
    subtitle: "صُنعت بحب، تُقدم بشغف",
    searchPlaceholder: "ابحث في القائمة...",
    filters: {
      all: "الكل",
      new: "جديد",
      topRated: "الأعلى تقييماً",
      spicy: "حار",
    },
    dietary: {
      title: "النظام الغذائي",
      vegan: "نباتي",
      vegetarian: "نباتي",
      glutenFree: "خالي من الجلوتين",
      dairyFree: "خالي من الألبان",
      sugarFree: "خالي من السكر",
    },
    noResults: "لم يتم العثور على عناصر",
    addToOrder: "أضف للطلب",
    currency: "ج.م",
  },
  
  // Reservation Section
  reservation: {
    title: "احجز طاولتك",
    subtitle: "اختر طريقتك المفضلة لتجربة شيبوب",
    header: "احجز مكانك",
    serviceType: {
      title: "كيف تريد زيارتنا؟",
      dineIn: "في المكان",
      dineInDesc: "احجز طاولة",
      pickup: "استلام",
      pickupDesc: "احجز وقت الاستلام",
    },
    location: {
      title: "الفرع",
      cairo: "القاهرة - القاهرة الجديدة (المشير طنطاوي)",
      alexKafr: "الإسكندرية - كفر عبده",
      alexGleem: "الإسكندرية - جليم (الرمل)",
    },
    date: "التاريخ",
    time: "الوقت",
    partySize: "عدد الأشخاص",
    person: "شخص",
    people: "أشخاص",
    guests: "عدد الضيوف",
    guest: "ضيف",
    guestsPlural: "ضيوف",
    name: "اسمك",
    namePlaceholder: "الاسم الكامل",
    nameRequired: "*",
    phone: "رقم الهاتف",
    phonePlaceholder: "+20 1xx xxx xxxx",
    email: "البريد الإلكتروني",
    emailOptional: "(اختياري)",
    emailPlaceholder: "you@email.com",
    specialRequests: "طلبات أو ملاحظات خاصة",
    specialRequestsPlaceholder: "حساسية، ترتيب عيد ميلاد، كرسي أطفال...",
    preOrder: {
      title: "اطلب مسبقاً من القائمة",
      subtitle: "حسّن تجربتك بطلب أصنافك المفضلة مع الحجز",
      addItems: "تصفح القائمة واختر",
      closeMenu: "إغلاق القائمة",
      cart: "السلة",
      items: "عناصر",
      total: "الإجمالي",
      empty: "لم تتم إضافة عناصر",
      searchPlaceholder: "ابحث في القائمة...",
      noItemsFound: "لم يتم العثور على عناصر",
      noItems: "لم يتم العثور على عناصر",
      add: "أضف",
      decrease: "تقليل",
      increase: "زيادة",
      benefits: {
        fresh: "تحضير طازج",
        ready: "جاهز عند الوصول",
        efficient: "توفير الوقت",
      },
      medium: "وسط",
      large: "كبير",
      selectSize: "اختر الحجم",
    },
    summary: {
      title: "ملخص الحجز",
      service: "الخدمة",
      location: "الفرع",
      dateTime: "التاريخ والوقت",
      guests: "ضيوف",
      guest: "ضيف",
      preOrder: "الطلبات المسبقة",
      preorderedItems: "الطلبات المسبقة",
      total: "الإجمالي",
      dineIn: "في المكان",
      pickup: "استلام",
    },
    submitButton: "إرسال الحجز",
    submit: "تأكيد الحجز",
    submitting: "جاري الإرسال...",
    items: "عناصر",
    confirmationNote: "سنؤكد حجزك خلال الساعة القادمة",
    success: {
      title: "تم إرسال الحجز!",
      message: "شكراً لحجزك!",
      pickupMessage: "شكراً لطلبك!",
      confirmMessage: "سنؤكد حجزك عبر الهاتف خلال الساعة القادمة.",
    },
    errors: {
      name: "الاسم مطلوب",
      phone: "رقم الهاتف مطلوب",
      date: "التاريخ مطلوب",
      time: "الوقت مطلوب",
    },
    toast: {
      successTitle: "تم بنجاح! 🎉",
      successMessage: "تم إرسال حجزك. سنتواصل معك قريباً للتأكيد.",
      errorTitle: "خطأ",
      errorMessage: "فشل الإرسال. يرجى المحاولة مرة أخرى.",
    },
  },
  
  // Locations Section
  locations: {
    title: "فروعنا",
    subtitle: "تجدنا في القاهرة والإسكندرية",
    cairo: {
      name: "القاهرة - القاهرة الجديدة",
      address: "القاهرة الجديدة، التجمع الخامس",
    },
    alexSmouha: {
      name: "الإسكندرية - سموحة",
      address: "سموحة، الإسكندرية",
    },
    alexSidiGaber: {
      name: "الإسكندرية - سيدي جابر",
      address: "سيدي جابر، الإسكندرية",
    },
    getDirections: "احصل على الاتجاهات",
    workingHours: "ساعات العمل",
    dailyHours: "يومياً: 8 ص - 12 م",
  },
  
  // About Section
  about: {
    title: "عن شيبوب",
    subtitle: "قصتنا",
    description: "منذ عام 2017، يقدم شيبوب القهوة المختصة والساندويتشات المميزة بحب. ما بدأ كمقهى صغير نما ليصبح وجهة محبوبة في القاهرة والإسكندرية.",
    stats: {
      rating: "التقييم",
      reviews: "التقييمات",
      locations: "الفروع",
    },
    values: {
      quality: "الجودة أولاً",
      qualityDesc: "مكونات فاخرة، صُنعت بإتقان",
      community: "المجتمع",
      communityDesc: "أكثر من مقهى، مكان للتجمع",
      passion: "الشغف",
      passionDesc: "كل كوب يحكي قصة",
    },
  },
  
  // Footer
  footer: {
    tagline: "قهوة مختصة والمزيد",
    copyright: "جميع الحقوق محفوظة.",
    links: {
      menu: "القائمة",
      locations: "الفروع",
      about: "عن شيبوب",
      talabat: "طلبات",
    },
    social: {
      facebook: "فيسبوك",
      instagram: "انستجرام",
    },
  },
  
  // Common
  common: {
    loading: "جاري التحميل...",
    error: "حدث خطأ ما",
    close: "إغلاق",
    cancel: "إلغاء",
    confirm: "تأكيد",
    save: "حفظ",
    delete: "حذف",
    edit: "تعديل",
    add: "إضافة",
    remove: "إزالة",
    search: "بحث",
    filter: "تصفية",
    clear: "مسح",
    viewAll: "عرض الكل",
    seeMore: "عرض المزيد",
    seeLess: "عرض أقل",
    optional: "اختياري",
  },

  // Admin Panel
  admin: {
    title: "لوحة التحكم",
    nav: {
      dashboard: "الرئيسية",
      analytics: "التحليلات",
      menu: "إدارة القائمة",
      reservations: "الحجوزات",
      calendar: "عرض التقويم",
      staff: "إدارة الموظفين",
      viewWebsite: "← عرض الموقع",
    },
    logout: "تسجيل الخروج",
  },
};
