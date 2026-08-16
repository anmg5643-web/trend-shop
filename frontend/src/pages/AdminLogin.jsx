import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { Lock, User, AlertCircle } from "lucide-react";
import { adminLogin } from "../lib/api.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await adminLogin(username, password);
      localStorage.setItem("alwaha_admin_token", data.token);
      localStorage.setItem("alwaha_admin_username", data.admin.username);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "تعذر تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-trend-sage px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <img src="/logo-icon.png" alt="Trend Shop" className="h-14 w-auto" />
          <h1 className="mt-4 text-xl font-black text-trend-ink">
            لوحة تحكم Trend Shop
          </h1>
          <p className="mt-1 text-sm text-trend-ink/60">
            تسجيل دخول مخصص للإدارة فقط
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              <AlertCircle size={16} />
              {error}
            </p>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-trend-ink">
              اسم المستخدم
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-trend-ink/40"
              />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-separator py-2.5 pr-10 pl-4 outline-none focus:border-accent"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-trend-ink">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-trend-ink/40"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-separator py-2.5 pr-10 pl-4 outline-none focus:border-accent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isDisabled={loading}
            className="rounded-full bg-accent"
          >
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
      </div>
    </div>
  );
}
