import type { Translations } from './en';

export const ar: Translations = {
  // الترجمات الشائعة
  common: {
    back: "رجوع",
    cancel: "إلغاء",
    confirm: "تأكيد",
    save: "حفظ",
    delete: "حذف",
    edit: "تعديل",
    loading: "جاري التحميل...",
    home: "الرئيسية",
  },

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
    
    // Dashboard
    dashboard: {
      title: "الرئيسية",
      subtitle: "مرحباً بعودتك! إليك نظرة عامة على مقهاك.",
      menuItems: "عناصر القائمة",
      totalReservations: "إجمالي الحجوزات",
      pending: "قيد الانتظار",
      staffMembers: "الموظفين",
      confirmed: "مؤكد",
      cancelled: "ملغي",
      recentReservations: "الحجوزات الأخيرة",
      noReservations: "لا توجد حجوزات بعد",
      guests: "ضيوف",
      viewAll: "عرض الكل",
    },
    
    // Analytics
    analytics: {
      title: "تحليلات الإيرادات",
      subtitle: "رؤى تفصيلية حول أداء عملك",
      
      // Date Filters
      today: "اليوم",
      yesterday: "أمس",
      last7Days: "آخر 7 أيام",
      last30Days: "آخر 30 يوم",
      last90Days: "آخر 90 يوم",
      customRange: "نطاق مخصص",
      
      // Real-time Metrics
      realTime: {
        todayRevenue: "إيرادات اليوم",
        todayOrders: "طلبات اليوم",
        todayGuests: "ضيوف اليوم",
        avgOrderValue: "متوسط قيمة الطلب",
        conversionRate: "معدل التحويل",
        livePending: "معلقة الآن",
        vsYesterday: "مقارنة بالأمس",
        vsLastWeek: "مقارنة بالأسبوع الماضي",
        vsLastMonth: "مقارنة بالشهر الماضي",
      },
      
      // Revenue Analytics
      totalRevenue: "إجمالي الإيرادات",
      preOrders: "الطلبات المسبقة",
      avgOrder: "متوسط الطلب",
      reservations: "الحجوزات",
      totalGuests: "إجمالي الضيوف",
      conversion: "معدل التحويل",
      revenueTrend: "اتجاه الإيرادات",
      revenueByLocation: "الإيرادات حسب الفرع",
      revenueByServiceType: "الإيرادات حسب نوع الخدمة",
      revenueByTimeSlot: "الإيرادات حسب الوقت",
      preOrderRevenue: "إيرادات الطلبات المسبقة",
      reservationOnlyRevenue: "حجوزات فقط",
      
      // Menu Performance
      menuPerformance: {
        title: "أداء القائمة",
        topSellers: "الأكثر مبيعاً",
        trending: "الأكثر رواجاً",
        underperforming: "ضعيف الأداء",
        categoryPerformance: "أداء الفئات",
        avgItemsPerOrder: "متوسط العناصر لكل طلب",
        quantity: "الكمية",
        revenue: "الإيرادات",
        orders: "الطلبات",
      },
      
      // Customer Insights
      customerInsights: {
        title: "رؤى العملاء",
        newCustomers: "عملاء جدد",
        returningCustomers: "عملاء عائدون",
        customerLifetimeValue: "القيمة الدائمة للعميل",
        avgPartySize: "متوسط حجم المجموعة",
        bookingLeadTime: "وقت الحجز المسبق",
        cancellationRate: "معدل الإلغاء",
        noShowRate: "معدل عدم الحضور",
      },
      
      // Time Analytics
      timeAnalytics: {
        title: "التحليلات الزمنية",
        hourlyHeatmap: "خريطة الساعات",
        dayOfWeek: "الأداء حسب اليوم",
        peakHours: "ساعات الذروة",
        breakfast: "الإفطار (6-11 ص)",
        lunch: "الغداء (11 ص-3 م)",
        dinner: "العشاء (3-10 م)",
        night: "الليل (10 م+)",
        monday: "الإثنين",
        tuesday: "الثلاثاء",
        wednesday: "الأربعاء",
        thursday: "الخميس",
        friday: "الجمعة",
        saturday: "السبت",
        sunday: "الأحد",
      },
      
      // Location Performance
      locationPerformance: {
        title: "أداء الفروع",
        rankings: "ترتيب الفروع",
        utilization: "معدل الاستخدام",
        busiestLocation: "الفرع الأكثر ازدحاماً",
        topLocation: "الفرع الأول",
      },
      
      // Operational Metrics
      operational: {
        title: "المقاييس التشغيلية",
        confirmationRate: "معدل التأكيد",
        avgResponseTime: "متوسط وقت الاستجابة",
        tableTurnover: "معدل دوران الطاولات",
        specialRequests: "الطلبات الخاصة",
        minutes: "دقيقة",
        hours: "ساعة",
      },
      
      // Growth Metrics
      growth: {
        title: "النمو والاتجاهات",
        weekOverWeek: "أسبوع بعد أسبوع",
        monthOverMonth: "شهر بعد شهر",
        customerAcquisition: "اكتساب العملاء",
        retentionRate: "معدل الاحتفاظ",
        forecast: "توقع الإيرادات",
      },
      
      // Funnel
      funnel: {
        title: "مسار الحجز",
        totalBookings: "إجمالي الحجوزات",
        pending: "معلقة",
        confirmed: "مؤكدة",
        completed: "مكتملة",
        cancelled: "ملغاة",
      },
      
      // Export
      export: {
        title: "تصدير التقارير",
        pdf: "تصدير PDF",
        excel: "تصدير Excel",
        email: "إرسال التقرير",
        generating: "جاري الإنشاء...",
      },
      
      // Common
      peakHours: "ساعات الذروة",
      morning: "صباحاً",
      afternoon: "ظهراً",
      evening: "مساءً",
      night: "ليلاً",
      revenue: "الإيرادات",
      guests: "الضيوف",
      orders: "الطلبات",
      items: "العناصر",
      total: "الإجمالي",
      average: "المتوسط",
      percentage: "النسبة",
      trend: "الاتجاه",
      comparison: "المقارنة",
      noData: "لا توجد بيانات",
      loading: "جاري تحميل التحليلات...",
    },
    
    // Menu Management
    menuManagement: {
      title: "إدارة القائمة",
      subtitle: "إضافة، تعديل، أو حذف عناصر القائمة",
      exportMenu: "تصدير القائمة",
      addItem: "إضافة عنصر",
      searchPlaceholder: "البحث في القائمة...",
      allCategories: "جميع الفئات",
      categories: {
        hotCoffee: "قهوة ساخنة",
        coldCoffee: "قهوة باردة",
        tea: "شاي",
        juices: "عصائر",
        smoothies: "سموذي",
        desserts: "حلويات",
        sandwiches: "ساندويتشات",
        mainDishes: "أطباق رئيسية",
      },
      noItems: "لم يتم العثور على عناصر",
      addFirstItem: "أضف أول عنصر في القائمة",
      noImage: "لا توجد صورة",
      new: "جديد",
      top: "الأفضل",
      spicy: "حار",
      edit: "تعديل",
      editItem: "تعديل عنصر القائمة",
      addItemTitle: "إضافة عنصر جديد",
      nameEnglish: "الاسم (إنجليزي) *",
      nameArabic: "الاسم (عربي)",
      description: "الوصف",
      descriptionPlaceholder: "إسبريسو غني مع حليب مبخر...",
      priceEGP: "السعر (ج.م) *",
      category: "الفئة *",
      imageUrl: "رابط الصورة",
      imageUrlPlaceholder: "https://example.com/image.jpg",
      tags: "العلامات",
      cancel: "إلغاء",
      save: "حفظ",
      deleteItem: "حذف العنصر؟",
      deleteConfirm: "لا يمكن التراجع عن هذا الإجراء. سيتم حذف العنصر نهائياً.",
      delete: "حذف",
    },
    
    // Reservations
    reservationsPage: {
      title: "الحجوزات",
      subtitle: "إدارة حجوزات الطاولات",
      todaysRevenue: "إيرادات اليوم",
      tomorrowsBookings: "حجوزات الغد",
      printDate: "طباعة التاريخ",
      exportExcel: "تصدير Excel",
      total: "الإجمالي",
      pending: "قيد الانتظار",
      confirmed: "مؤكد",
      cancelled: "ملغي",
      searchPlaceholder: "البحث بالاسم أو الهاتف أو البريد...",
      allBranches: "جميع الفروع",
      allStatus: "جميع الحالات",
      noReservations: "لم يتم العثور على حجوزات",
      guests: "ضيوف",
      specialRequest: "طلب خاص:",
      preOrderedItems: "الطلبات المسبقة:",
      totalAmount: "الإجمالي:",
      confirm: "تأكيد",
      cancel: "إلغاء",
      reopen: "إعادة فتح",
      delete: "حذف",
      deleteConfirm: "هل أنت متأكد من حذف هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء.",
      smsConfirmation: "تم تأكيد حجزك في شيبوب!",
    },
    
    // Calendar
    calendar: {
      title: "تقويم الحجوزات",
      subtitle: "عرض التقويم • اسحب لإعادة الجدولة",
      pending: "قيد الانتظار",
      confirmed: "مؤكد",
      cancelled: "ملغي",
      total: "الإجمالي",
      today: "اليوم",
      reservationDetails: "تفاصيل الحجز",
      guests: "ضيوف",
      preOrderItems: "الطلبات المسبقة",
      specialRequests: "طلبات خاصة",
      confirm: "تأكيد",
      cancel: "إلغاء",
      setPending: "تعيين كمعلق",
      whatsappCustomer: "واتساب العميل",
      notSpecified: "غير محدد",
    },
    
    // Staff Management
    staffManagement: {
      title: "إدارة الموظفين",
      subtitle: "إدارة حسابات المدراء والموظفين",
      addStaff: "إضافة موظف",
      admins: "المدراء",
      staff: "الموظفين",
      searchPlaceholder: "البحث بالاسم أو البريد...",
      noStaff: "لم يتم العثور على موظفين",
      addFirstStaff: "أضف أول موظف",
      admin: "مدير",
      staffRole: "موظف",
      addStaffMember: "إضافة موظف جديد",
      fullName: "الاسم الكامل *",
      namePlaceholder: "أحمد محمد",
      email: "البريد الإلكتروني *",
      emailPlaceholder: "staff@shayboub.com",
      password: "كلمة المرور *",
      passwordPlaceholder: "••••••••",
      minPassword: "6 أحرف على الأقل",
      role: "الدور *",
      staffDesc: "عرض وتأكيد الحجوزات",
      adminDesc: "صلاحيات كاملة",
      cancel: "إلغاء",
      createAccount: "إنشاء حساب",
      creating: "جاري الإنشاء...",
      removeStaff: "إزالة الموظف؟",
      removeConfirm: "سيتم إزالة صلاحياته للوحة التحكم. لا يمكن التراجع عن هذا الإجراء.",
      remove: "إزالة",
      errors: {
        fillRequired: "يرجى ملء جميع الحقول المطلوبة",
        minPassword: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        emailExists: "هذا البريد مسجل مسبقاً",
        invalidEmail: "البريد الإلكتروني غير صالح",
        weakPassword: "كلمة المرور ضعيفة",
        createFailed: "فشل في إنشاء حساب الموظف",
      },
    },
    
    // Location names
    locations: {
      cairoNewCairo: "القاهرة - القاهرة الجديدة",
      alexKafrAbdou: "الإسكندرية - كفر عبده",
      alexGleem: "الإسكندرية - جليم",
      alexSmouha: "الإسكندرية - سموحة",
      alexSidiGaber: "الإسكندرية - سيدي جابر",
    },
  },

  // المصادقة
  auth: {
    // صفحات تسجيل الدخول/الاشتراك
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    welcome: "مرحباً بك في شايبوب",
    welcomeBack: "مرحباً بعودتك",
    loginSubtitle: "سجل الدخول للوصول إلى مكافآت الولاء",
    signupSubtitle: "أنشئ حساباً لتبدأ في كسب النقاط",
    
    // طرق المصادقة
    continueWithGoogle: "المتابعة بحساب Google",
    continueWithApple: "المتابعة بحساب Apple",
    continueWithEmail: "المتابعة بالبريد الإلكتروني",
    continueWithPhone: "المتابعة برقم الهاتف",
    orDivider: "أو",
    
    // نموذج البريد الإلكتروني/كلمة المرور
    emailAddress: "البريد الإلكتروني",
    emailPlaceholder: "your@email.com",
    phoneNumber: "رقم الهاتف",
    phonePlaceholder: "٠١٢٣٤٥٦٧٨٩٠+",
    password: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    confirmPassword: "تأكيد كلمة المرور",
    fullName: "الاسم الكامل",
    namePlaceholder: "أحمد محمد",
    birthday: "تاريخ الميلاد (اختياري)",
    birthdayPlaceholder: "يوم/شهر/سنة",
    birthdayBonus: "احصل على نقاط إضافية في عيد ميلادك!",
    
    // الإجراءات
    signInButton: "تسجيل الدخول",
    signUpButton: "إنشاء حساب",
    signingIn: "جاري تسجيل الدخول...",
    signingUp: "جاري إنشاء الحساب...",
    forgotPassword: "نسيت كلمة المرور؟",
    dontHaveAccount: "ليس لديك حساب؟",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    signUpLink: "إنشاء حساب",
    signInLink: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    myAccount: "حسابي",
    
    // التحقق من الهاتف
    verifyPhone: "تحقق من رقم الهاتف",
    enterCode: "أدخل الرمز المرسل إلى",
    verificationCode: "رمز التحقق",
    resendCode: "إعادة إرسال الرمز",
    verify: "تحقق",
    verifying: "جاري التحقق...",
    
    // الأخطاء
    errors: {
      invalidEmail: "البريد الإلكتروني غير صالح",
      invalidPhone: "رقم الهاتف غير صالح",
      weakPassword: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      passwordMismatch: "كلمات المرور غير متطابقة",
      emailExists: "البريد الإلكتروني مسجل مسبقاً",
      phoneExists: "رقم الهاتف مسجل مسبقاً",
      wrongPassword: "كلمة المرور غير صحيحة",
      userNotFound: "لا يوجد حساب بهذا البريد",
      networkError: "خطأ في الشبكة. حاول مرة أخرى.",
      tooManyRequests: "محاولات كثيرة. حاول لاحقاً.",
      accountDisabled: "تم تعطيل هذا الحساب",
      invalidVerificationCode: "رمز التحقق غير صالح",
      verificationExpired: "انتهت صلاحية رمز التحقق",
      fillAllFields: "يرجى ملء جميع الحقول المطلوبة",
    },
    
    // رسائل النجاح
    success: {
      accountCreated: "تم إنشاء الحساب بنجاح!",
      loggedIn: "مرحباً بعودتك!",
      codeSent: "تم إرسال رمز التحقق",
      phoneVerified: "تم التحقق من رقم الهاتف",
    },
  },

  // نظام الولاء
  loyalty: {
    // صفحة حسابي
    myAccount: "حسابي",
    memberSince: "عضو منذ",
    editProfile: "تعديل الملف الشخصي",
    settings: "الإعدادات",
    
    // قسم النقاط
    yourPoints: "نقاطك",
    pointsBalance: "رصيد النقاط",
    points: "نقطة",
    currentBalance: "الرصيد الحالي",
    totalEarned: "إجمالي المكتسب",
    totalSpent: "إجمالي المُنفق",
    pointsHistory: "سجل النقاط",
    
    // التقدم
    progressTo25: "التقدم نحو خصم ٢٥٪",
    progressTo100: "التقدم نحو مشروب مجاني",
    earnMorePoints: "اكسب {points} نقطة إضافية للحصول على المكافأة!",
    needMoreBookings: "يحتاج إلى {count} حجوزات مؤكدة إضافية",
    nextReward: "المكافأة التالية",
    
    // المكافآت
    availableRewards: "المكافآت المتاحة",
    claimReward: "استلم المكافأة",
    rewardClaimed: "تم استلام المكافأة!",
    yourVouchers: "قسائمك",
    activeVouchers: "القسائم النشطة",
    usedVouchers: "القسائم المستخدمة",
    noActiveVouchers: "لا توجد قسائم نشطة",
    noUsedVouchers: "لم تستخدم أي قسائم بعد",
    
    // أنواع المكافآت
    reward25Off: "خصم ٢٥٪ على أي منتج",
    reward25OffDesc: "احصل على خصم ٢٥٪ على أي منتج من القائمة",
    rewardFreeDrink: "مشروب مجاني",
    rewardFreeDrinkDesc: "احصل على أي مشروب من اختيارك مجاناً",
    rewardFreeItem: "منتج مجاني",
    rewardFreeItemDesc: "احصل على أي منتج من القائمة مجاناً",
    birthdayReward: "عرض عيد الميلاد",
    birthdayRewardDesc: "منتج مجاني من اختيارك في عيد ميلادك!",
    
    // تفاصيل القسيمة
    voucherCode: "رمز القسيمة",
    copyCode: "نسخ الرمز",
    codeCopied: "تم نسخ الرمز!",
    useNow: "استخدم الآن",
    expires: "تنتهي في",
    neverExpires: "لا تنتهي صلاحيتها",
    usedOn: "استُخدمت في",
    discount: "الخصم",
    
    // نافذة القسيمة
    congratulations: "مبروك!",
    rewardClaimedSuccess: "تم استلام مكافأتك بنجاح!",
    yourDiscountCode: "رمز الخصم الخاص بك:",
    howToUse: "كيفية الاستخدام:",
    step1: "١. قم بعمل حجزك التالي",
    step2: "٢. أدخل هذا الرمز أثناء الحجز",
    step3: "٣. احصل على خصمك تلقائياً!",
    close: "إغلاق",
    
    // قسم الإحصائيات
    yourStats: "إحصائياتك",
    totalVisits: "إجمالي الزيارات",
    confirmedBookings: "الحجوزات المؤكدة",
    lifetimeSpent: "إجمالي الإنفاق",
    currentPoints: "النقاط الحالية",
    visits: "زيارات",
    spent: "منفق",
    
    // سجل الحجوزات
    bookingHistory: "سجل الحجوزات",
    noBookings: "لا توجد حجوزات بعد",
    makeFirstBooking: "قم بأول حجز لتبدأ في كسب النقاط!",
    pointsEarned: "+{points} نقطة مكتسبة",
    pointsPending: "النقاط معلقة (غير مؤكدة بعد)",
    usedVoucher: "استُخدمت القسيمة: {code}",
    statusPending: "في انتظار التأكيد",
    statusConfirmed: "مؤكد",
    statusCancelled: "ملغي",
    statusCompleted: "مكتمل",
    
    // المنتجات المفضلة
    favoriteItems: "الأكثر طلباً",
    noFavorites: "لا توجد طلبات بعد",
    orderedTimes: "{count} مرة",
    favoriteTag: "⭐ المفضل",
    
    // معلومات كسب النقاط
    howToEarn: "كيفية كسب النقاط",
    earnPerBooking: "١٠ نقاط لكل حجز مؤكد",
    earnFirstBooking: "٢٠ نقطة إضافية للحجز الأول",
    earnBirthday: "٥٠ نقطة إضافية في عيد ميلادك",
    pointsOnConfirmation: "يتم منح النقاط عند تأكيد المسؤول لحجزك",
    
    // عيد الميلاد
    happyBirthday: "🎂 عيد ميلاد سعيد!",
    birthdayMessage: "استمتع بمنتج مجاني منا!",
    birthdayBadge: "🎉 إنه عيد ميلادك!",
    
    // الأخطاء
    errors: {
      loadingProfile: "فشل في تحميل الملف الشخصي",
      claimingReward: "فشل في استلام المكافأة",
      notEnoughPoints: "النقاط غير كافية",
      invalidVoucher: "رمز القسيمة غير صالح",
      voucherUsed: "تم استخدام هذه القسيمة بالفعل",
      voucherExpired: "انتهت صلاحية هذه القسيمة",
      voucherNotFound: "القسيمة غير موجودة",
    },
  },

  // نظام القسائم (عام)
  voucher: {
    haveCode: "لديك رمز خصم؟",
    enterCode: "أدخل رمز القسيمة",
    codePlaceholder: "SHAYBOUB25",
    apply: "تطبيق",
    applied: "تم التطبيق!",
    remove: "إزالة",
    codeApplied: "تم تطبيق الرمز {code}!",
    discountApplied: "تم تفعيل خصم {discount}٪!",
    freeDrinkApplied: "تم تطبيق قسيمة المشروب المجاني!",
    freeItemApplied: "تم تطبيق قسيمة المنتج المجاني!",
    selectYourDrink: "اختر مشروبك المجاني",
    selectYourItem: "اختر منتجك المجاني",
    validating: "جاري التحقق...",
    invalid: "رمز غير صالح",
  },

  // إدارة الولاء للمسؤولين
  adminLoyalty: {
    title: "إدارة الولاء",
    overview: "نظرة عامة على الولاء",
    customers: "العملاء",
    vouchers: "القسائم",
    settings: "الإعدادات",
    
    // إحصائيات النظرة العامة
    totalMembers: "إجمالي الأعضاء",
    activeToday: "نشطون اليوم",
    vouchersIssued: "القسائم الصادرة",
    pointsGiven: "النقاط الممنوحة",
    totalCustomers: "إجمالي العملاء",
    newThisMonth: "جدد هذا الشهر",
    activeVouchers: "القسائم النشطة",
    usedVouchers: "القسائم المستخدمة",
    
    // قائمة العملاء
    searchCustomers: "بحث بالاسم أو البريد أو الهاتف...",
    customerName: "اسم العميل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    points: "النقاط",
    totalVisits: "الزيارات",
    lastVisit: "آخر زيارة",
    joined: "انضم في",
    actions: "الإجراءات",
    viewDetails: "عرض التفاصيل",
    adjustPoints: "تعديل النقاط",
    noCustomers: "لم يتم العثور على عملاء",
    
    // تفاصيل العميل
    customerDetails: "تفاصيل العميل",
    contactInfo: "معلومات الاتصال",
    loyaltyInfo: "معلومات الولاء",
    birthday: "تاريخ الميلاد",
    pointsBalance: "رصيد النقاط",
    totalEarned: "إجمالي المكتسب",
    totalSpent: "إجمالي المُنفق",
    memberSince: "عضو منذ",
    
    // سجل النقاط
    pointsHistory: "سجل النقاط",
    transaction: "المعاملة",
    date: "التاريخ",
    amount: "المبلغ",
    reason: "السبب",
    bookingConfirmed: "تم تأكيد الحجز",
    firstBookingBonus: "مكافأة الحجز الأول",
    birthdayBonus: "مكافأة عيد الميلاد",
    rewardClaimed: "تم استلام المكافأة",
    manualAdjustment: "تعديل يدوي",
    noTransactions: "لا توجد معاملات بعد",
    
    // تعديل النقاط اليدوي
    manualPointsTitle: "تعديل النقاط اليدوي",
    addPoints: "إضافة نقاط",
    subtractPoints: "خصم نقاط",
    pointsAmount: "عدد النقاط",
    adjustmentReason: "سبب التعديل",
    reasonPlaceholder: "مثال: تعويض عن شكوى العميل",
    confirm: "تأكيد",
    cancel: "إلغاء",
    adjusting: "جاري التعديل...",
    successAdjusted: "تم تعديل النقاط بنجاح",
    
    // التحقق من القسيمة
    validateVoucher: "التحقق من رمز القسيمة",
    enterVoucherCode: "أدخل رمز القسيمة للتحقق منه",
    checkCode: "فحص الرمز",
    checking: "جاري الفحص...",
    voucherDetails: "تفاصيل القسيمة",
    voucherCode: "الرمز",
    voucherType: "النوع",
    voucherCustomer: "العميل",
    voucherStatus: "الحالة",
    voucherCreated: "تم الإنشاء",
    voucherUsed: "تم الاستخدام",
    voucherExpires: "تنتهي في",
    statusUnused: "غير مستخدمة ✓",
    statusUsed: "مستخدمة",
    statusExpired: "منتهية",
    markAsUsed: "تحديد كمستخدمة",
    cancelVoucher: "إلغاء القسيمة",
    discount25: "خصم ٢٥٪",
    freeDrink: "مشروب مجاني",
    freeItem: "منتج مجاني",
    birthdaySpecial: "عرض عيد الميلاد",
    
    // النشاط الأخير
    recentActivity: "نشاط النقاط الأخير",
    earnedPoints: "{customer} اكتسب {points} نقطة",
    redeemedPoints: "{customer} استبدل {points} نقطة",
    adjustedPoints: "تم تعديل نقاط {customer}",
    
    // الإعدادات
    loyaltySettings: "إعدادات الولاء",
    pointsPerBooking: "النقاط لكل حجز مؤكد",
    firstBookingBonusSetting: "نقاط مكافأة الحجز الأول",
    birthdayBonusPoints: "نقاط مكافأة عيد الميلاد",
    saveSettings: "حفظ الإعدادات",
    saving: "جاري الحفظ...",
    settingsSaved: "تم حفظ الإعدادات بنجاح",
    
    // التصدير
    exportData: "تصدير بيانات العملاء",
    exportCSV: "تصدير كـ CSV",
    exportExcel: "تصدير كـ Excel",
    exporting: "جاري التصدير...",
  },

  // رسائل واتساب
  whatsapp: {
    bookingReceived: {
      greeting: "☕ مقهى شايبوب",
      thanks: "شكراً {name}!",
      reservationDetails: "📋 حجزك:",
      date: "📅 {date} الساعة {time}",
      location: "📍 {location}",
      guests: "👥 {count} ضيوف",
      status: "⏳ الحالة: في انتظار التأكيد",
      confirmation: "سنؤكد خلال ساعة واحدة.",
    },
    bookingConfirmed: {
      title: "✅ تم التأكيد!",
      reserved: "تم حجز طاولتك:",
      date: "📅 {date} الساعة {time}",
      location: "📍 {location}",
      pointsEarned: "⭐ لقد كسبت {points} نقطة!",
      totalPoints: "الإجمالي: {total} نقطة",
      seeYouSoon: "نراك قريباً! 🎉",
    },
    birthdayMessage: {
      title: "🎂 عيد ميلاد سعيد {name}!",
      message: "استمتع بمنتج مجاني منا!",
      code: "رمزك: {code}",
      howToUse: "استخدم هذا الرمز في زيارتك القادمة!",
      bonusPoints: "⭐ أضفنا أيضاً {points} نقطة إضافية!",
      wishes: "نتمنى لك يوماً رائعاً! 🎉",
    },
  },
};
