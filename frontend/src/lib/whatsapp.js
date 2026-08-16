const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "218945630859";

// يبني رسالة واتساب منسّقة بتفاصيل الطلب ويرجع رابط wa.me جاهز
export function buildOrderWhatsAppLink({ order, items, form }) {
  const lines = [
    "🛍️ *طلب جديد من Trend Shop*",
    "",
    `👤 *الاسم:* ${form.customerName}`,
    `📞 *الهاتف:* ${form.phone}`,
    `📍 *العنوان:* ${form.address}`,
  ];

  if (form.notes) {
    lines.push(`📝 *ملاحظات:* ${form.notes}`);
  }

  lines.push("", "🛒 *المنتجات:*");
  items.forEach((item) => {
    lines.push(`• ${item.name} × ${item.quantity} — ${item.price * item.quantity} د.ل`);
  });

  lines.push("", `💰 *الإجمالي:* ${order.totalPrice} د.ل`);
  if (order._id) {
    lines.push(`🔖 *رقم الطلب:* ${order._id.slice(-6)}`);
  }

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
