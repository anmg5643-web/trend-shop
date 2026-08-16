# Trend Shop 🛍️ — مشروع متجر إلكتروني متكامل

مشروع full-stack كامل:

- **`frontend/`** — React 19 + Vite + Tailwind CSS v4 + HeroUI v3 (RTL + خط Tajawal)
- **`backend/`** — Node.js + Express 5 + MongoDB (Mongoose)

## الميزات

- صفحة متجر كاملة: هيرو، تشكيلة المنتجات، من نحن
- **صفحة تفاصيل مستقلة** لكل منتج (مع اختيار الكمية)
- **صفحة سلة مخصصة** (`/cart`) بخطوات: السلة → إتمام الطلب → تأكيد
- **رفع صور حقيقية** للمنتجات من لوحة التحكم (تظهر بدل الأيقونة تلقائياً)
- إرسال تفاصيل الطلب عبر **واتساب** بعد التأكيد + زر واتساب عائم في كل الصفحات
- روابط **واتساب وتيك توك** حقيقية في الفوتر
- **صفحة 404** مخصصة لأي رابط غير موجود
- تحسينات **SEO** (Open Graph، Twitter Card، robots.txt، sitemap.xml)
- **حماية أساسية للباك إند**: Helmet، تحديد معدل الطلبات (rate limiting)، وCORS مقيّد بنطاق الفرونت إند فقط
- الطلبات تُحفظ في قاعدة البيانات مباشرة
- **لوحة تحكم للأدمن**: تسجيل دخول، إضافة/تعديل/حذف منتجات، عرض الطلبات وتحديث حالتها

---

## 1) تشغيل قاعدة البيانات (MongoDB)

اختر إحدى الطريقتين:

**أ) محلياً على جهازك:**
ثبّت MongoDB Community من الموقع الرسمي وشغّله (عادة يعمل تلقائياً على
`mongodb://127.0.0.1:27017`).

**ب) سحابياً (الأسهل، مجاني):**
أنشئ حساب على [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)، أنشئ
Cluster مجاني، وانسخ رابط الاتصال (Connection String).

## 2) تشغيل الباك إند

```bash
cd backend
npm install
cp .env.example .env
```

افتح ملف `.env` وعدّل `MONGO_URI` (وضع رابط Atlas إذا تستخدمه)، ثم:

```bash
npm run seed     # يضيف منتجات تجريبية + يُنشئ حساب أدمن (admin / admin123456)
npm run dev      # يشغّل الخادم على http://localhost:5000
```

## 3) تشغيل الفرونت إند

في نافذة طرفية (terminal) ثانية:

```bash
cd frontend
npm install
cp .env.example .env   # القيمة الافتراضية تكفي إذا الباك إند على المنفذ 5000
npm run dev
```

افتح الرابط الذي يظهر (عادة `http://localhost:5173`).

## 4) الدخول للوحة التحكم

اذهب إلى: `http://localhost:5173/admin/login`

بيانات الدخول الافتراضية (من `npm run seed`):

- **اسم المستخدم:** `admin`
- **كلمة المرور:** `admin123456`

⚠️ **مهم:** غيّر بيانات الأدمن قبل رفع المشروع لأي بيئة حقيقية (عدّل
`ADMIN_USERNAME` و`ADMIN_PASSWORD` في `.env` قبل تشغيل `npm run seed`، أو
أنشئ حساب أدمن جديد من قاعدة البيانات مباشرة).

---

## هيكل المشروع

```
alwaha-project/
├── backend/
│   ├── server.js
│   ├── seed.js
│   ├── config/db.js
│   ├── models/          # Product, Order, Admin
│   ├── controllers/
│   ├── routes/
│   ├── middleware/       # auth.js, upload.js
│   └── uploads/          # صور المنتجات المرفوعة (تُنشأ تلقائياً)
└── frontend/
    └── src/
        ├── pages/        # StorePage, AdminLogin, AdminDashboard
        ├── components/
        ├── components/admin/
        ├── context/CartContext.jsx
        ├── lib/api.js    # الاتصال بالباك إند
        └── lib/icons.js
```

## نشر المشروع لاحقاً (Deployment)

- **الباك إند:** يمكن نشره على Render أو Railway أو أي خادم يدعم Node.js
- **الفرونت إند:** `npm run build` ثم رفع مجلد `dist/` على Vercel أو Netlify
- لا تنسَ تحديث `VITE_API_URL` في الفرونت إند ليشير لرابط الباك إند بعد النشر
- حدّث `FRONTEND_URL` في `.env` الباك إند ليطابق رابط موقعك الحقيقي (لأجل CORS)
- حدّث روابط `og:url`, `sitemap.xml`, و`robots.txt` في الفرونت إند لرابط نطاقك

### قائمة تحقق قبل النشر ✅

- [ ] غيّرت `ADMIN_USERNAME` و`ADMIN_PASSWORD` قبل تشغيل `npm run seed` على الخادم الحقيقي
- [ ] غيّرت `JWT_SECRET` لنص عشوائي طويل وسري
- [ ] حدّثت `FRONTEND_URL` بالباك إند و`VITE_API_URL` بالفرونت إند
- [ ] حدّثت روابط النطاق في `index.html` و`robots.txt` و`sitemap.xml`
- [ ] راجعت `VITE_WHATSAPP_NUMBER` في `.env` الفرونت إند
