import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { Ghost, Home } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-trend-sage text-trend-pine">
          <Ghost size={40} strokeWidth={1.6} />
        </span>
        <h1 className="mt-6 text-3xl font-black text-trend-ink sm:text-4xl">
          الصفحة غير موجودة
        </h1>
        <p className="mt-3 max-w-md text-trend-ink/60">
          يبدو أن الرابط إلي فتحته مو صحيح أو تم نقل الصفحة. جرّب ترجع
          للصفحة الرئيسية وتكمل تسوقك.
        </p>
        <Button
          variant="primary"
          size="lg"
          className="mt-8 rounded-full bg-accent px-8"
          onPress={() => navigate("/")}
        >
          <Home size={18} />
          العودة للرئيسية
        </Button>
      </main>

      <Footer />
    </div>
  );
}
