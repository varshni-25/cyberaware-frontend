import { useState } from "react";
import { apiFetch, setToken } from "../lib/api";
import { ShieldCheck, Users, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

interface AuthPageProps {
  onAuthSuccess: (user: any) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
    const body = mode === "login" ? { email, password } : { name, email, password };

    try {
      const response = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });
      setToken(response.token);
      onAuthSuccess(response.user);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div
      className="min-h-screen grid-bg flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "#020c1b" }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #00d4ff, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
        <div className="absolute top-3/4 left-1/4 w-[300px] h-[300px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #00ff9d, transparent 70%)" }} />
      </div>

      <div className="relative w-full animate-fade-in-up" style={{ maxWidth: 440 }}>
        <div
          className="absolute -inset-px rounded-2xl pointer-events-none"
          style={{ boxShadow: "0 0 60px rgba(0,212,255,0.08), 0 0 120px rgba(0,212,255,0.04)" }}
        />

        <div
          className="relative rounded-2xl p-8"
          style={{
            background: "rgba(10,22,40,0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(0,212,255,0.12)",
          }}
        >
          <div className="flex flex-col items-center mb-7">
            <div
              className="animate-pulse-glow mb-4 p-3.5 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(0,212,255,0.18), rgba(99,102,241,0.12))",
                border: "1px solid rgba(0,212,255,0.35)",
              }}
            >
              <ShieldCheck className="w-9 h-9 text-[#00d4ff]" />
            </div>

            <div className="flex items-center gap-1.5 mb-1">
              <span className="font-exo font-black text-xl text-white tracking-tight">
                Cyber<span className="text-[#00d4ff]" style={{ textShadow: "0 0 18px rgba(0,212,255,0.55)" }}>Aware</span>
              </span>
            </div>
            <p className="font-mono-jet text-[10px] text-[#8892b0] tracking-widest uppercase">
              Cybersecurity Awareness Platform
            </p>
          </div>

          <div
            className="flex mb-7 rounded-xl p-1"
            style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            {(["login", "register"] as const).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className="flex-1 py-2.5 rounded-lg text-sm font-exo font-bold capitalize transition-all duration-200"
                style={mode === m
                  ? { background: "rgba(0,212,255,0.14)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.28)", boxShadow: "0 0 14px rgba(0,212,255,0.12)" }
                  : { color: "#8892b0", border: "1px solid transparent" }
                }
              >
                {m === "login" ? "Log In" : "Register"}
              </button>
            ))}
          </div>

          <h1 className="font-exo text-2xl font-black text-white mb-6 text-center" style={{ letterSpacing: "-0.01em" }}>
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>

          {error && (
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-5 animate-fade-in"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <AlertCircle className="w-4 h-4 text-[#ef4444] flex-shrink-0 mt-0.5" />
              <span className="text-[#ef4444] text-sm leading-snug">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-[#8892b0] text-xs font-mono-jet uppercase tracking-widest mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8892b0] pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-[#ccd6f6] placeholder-[#4a5568] transition-all duration-200 focus:outline-none"
                    style={{ background: "#0d1f38", border: "1px solid rgba(0,212,255,0.18)", fontFamily: "Inter, sans-serif" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)" }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.18)"; e.currentTarget.style.boxShadow = "none" }}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[#8892b0] text-xs font-mono-jet uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8892b0] pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-[#ccd6f6] placeholder-[#4a5568] transition-all duration-200 focus:outline-none"
                  style={{ background: "#0d1f38", border: "1px solid rgba(0,212,255,0.18)", fontFamily: "Inter, sans-serif" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)" }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.18)"; e.currentTarget.style.boxShadow = "none" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8892b0] text-xs font-mono-jet uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8892b0] pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={isLogin ? "Your password" : "Min. 10 characters"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-[#ccd6f6] placeholder-[#4a5568] transition-all duration-200 focus:outline-none"
                  style={{ background: "#0d1f38", border: "1px solid rgba(0,212,255,0.18)", fontFamily: "Inter, sans-serif" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)" }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.18)"; e.currentTarget.style.boxShadow = "none" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8892b0] hover:text-[#00d4ff] transition-colors p-0.5"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-cyber w-full mt-6 py-3.5 rounded-xl font-exo font-bold text-[#020c1b] text-base transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: loading ? "rgba(0,212,255,0.6)" : "#00d4ff",
              boxShadow: loading ? "none" : "0 0 20px rgba(0,212,255,0.3), 0 0 40px rgba(0,212,255,0.1)",
            }}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Please wait…
              </>
            ) : (
              isLogin ? "Log In" : "Create Account"
            )}
          </button>

          <p className="text-center text-sm mt-4" style={{ color: "#8892b0" }}>
            {isLogin ? "Need an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => switchMode(isLogin ? "register" : "login")}
              className="font-bold transition-colors hover:underline underline-offset-2"
              style={{ color: "#00d4ff" }}
            >
              {isLogin ? "Register" : "Log in"}
            </button>
          </p>

          {!isLogin && (
            <p className="text-center mt-4 leading-relaxed" style={{ fontSize: 11.5, color: "#4a5568", lineHeight: 1.6 }}>
              Your name and email are only used to save your learning progress on this platform.
              We never share your information.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}