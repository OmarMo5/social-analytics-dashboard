// ============================================================
//  ⚙️  ملف الإعدادات — ضع بياناتك هنا قبل تشغيل المشروع
// ============================================================

const CONFIG = {
  // ─── Google Sheets API ───────────────────────────────────
  // احصل عليه من: console.cloud.google.com → APIs & Services → Credentials
  GOOGLE_API_KEY: "AIzaSyDcsExaWkbH_2tmmsh9wav-S7AZNYVLNI4",

  // معرّف الجدول — موجود في رابط Google Sheets:
  // https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
  SPREADSHEET_ID: "1q7sE0V6zZBKbEAX4UX5_OiRAp0tkRRm-TG1BNM6iba0",

  // اسم الـ Sheet (التبويب) داخل الملف
  SHEET_NAME: "news",

  // ─── أسماء الأعمدة كما هي في الشيت ─────────────────────
  COLUMNS: {
    TITLE:      "title",
    SOURCE:     "Source",
    PLATFORM:   "نوع المقالة",
    DATE:       "isoDate",
    LINK:       "link",
    SENTIMENT:  "تحليل المقالة",
    VERIFIED:   "التحقق",
  },

  // قيمة العمود التحقق للأخبار الصالحة
  VERIFIED_VALUE: "TRUE",

  // تحديث تلقائي كل X دقائق (0 = إيقاف التحديث التلقائي)
  AUTO_REFRESH_MINUTES: 5,

  // ─── اسم المنصة في الداشبورد ────────────────────────────
  DASHBOARD_TITLE:    "منصة الرصد الإعلامي",
  DASHBOARD_SUBTITLE:"المتحف الدولي للسيرة النبوية",

  // ─── إحصائيات ثابتة أو قيم أساسية للمنصات النشطة والظهور ──────
  STATIC_METRICS: {
    Instagram: {
      followers: 45000,
    },
    Internet: {
      visibility: 63,
    },
    Sentiment: {
      positive: 71,
    },
    PlatformsEngagement: {
      rate: 68,
    }
  },
};

export default CONFIG;
