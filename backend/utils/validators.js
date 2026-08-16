// نفس قواعد التحقق الموجودة في الفرونت إند (frontend/src/lib/validation.js)
// مكرّرة هنا عمداً — الباك إند لازم يتحقق بنفسه ولا يثق بأي بيانات جاية
// من الفرونت إند، لأن أي حد يقدر يرسل طلب مباشرة للـ API بدون المرور
// بالواجهة أصلاً.

const LIBYA_CITIES = [
  "طرابلس", "بنغازي", "مصراتة", "الزاوية", "صبراتة", "زليتن", "سبها",
  "البيضاء", "درنة", "توكرة", "الخمس", "غريان", "جادو", "نالوت",
  "الجفرة", "مرزق", "غات", "أوباري", "اوباري", "سرت", "اجدابيا",
  "أجدابيا", "طبرق", "القبة", "شحات", "المرج", "تاجوراء", "جنزور",
  "سوق الجمعة", "عين زارة", "قصر بن غشير", "ترهونة", "بني وليد",
  "يفرن", "زوارة", "الأبيار", "الابيار", "مسلاتة", "القره بوللي",
  "الجميل", "رقدالين", "الرجبان", "وادي عتبة", "زليطن",
];

export function validateName(name) {
  const trimmed = (name || "").trim();
  if (trimmed.length < 4) {
    return "الاسم قصير جداً، اكتب اسمك الكامل";
  }
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2) {
    return "اكتب الاسم الأول واسم العائلة على الأقل";
  }
  if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(trimmed)) {
    return "الاسم يجب أن يحتوي على أحرف فقط (بدون أرقام أو رموز)";
  }
  return null;
}

export function validatePhone(phone) {
  const cleaned = (phone || "").replace(/[\s-]/g, "");
  if (!cleaned) return "الرجاء إدخال رقم الهاتف";
  const regex = /^(\+?218|0)?9[1245]\d{7}$/;
  if (!regex.test(cleaned)) {
    return "رقم غير صحيح — يجب أن يكون رقم ليبي فعّال (يبدأ بـ 091 / 092 / 094 / 095) ومكوّن من 10 أرقام";
  }
  return null;
}

export function validateAddress(address) {
  const trimmed = (address || "").trim();
  if (trimmed.length < 10) {
    return "اكتب عنوان أوضح (المدينة، الحي، وأقرب معلم)";
  }
  const hasCity = LIBYA_CITIES.some((city) => trimmed.includes(city));
  if (!hasCity) {
    return "الرجاء ذكر اسم المدينة الليبية بوضوح ضمن العنوان (مثال: طرابلس، بنغازي، مصراتة...)";
  }
  return null;
}

export function validateOrderInput({ customerName, phone, address }) {
  const errors = {};
  const nameError = validateName(customerName);
  const phoneError = validatePhone(phone);
  const addressError = validateAddress(address);
  if (nameError) errors.customerName = nameError;
  if (phoneError) errors.phone = phoneError;
  if (addressError) errors.address = addressError;
  return errors;
}
