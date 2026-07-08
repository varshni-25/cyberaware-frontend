import { useState } from "react";
import { apiFetch, setToken } from "../lib/api";

interface AuthPageProps {
  onAuthSuccess: (user: any) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    console.log("handleSubmit called, mode:", mode);
    setError("");
    setLoading(true);

 const endpoint =
    mode === "login"
      ? "/auth/login"
      : "/auth/register";

const body =
    mode === "login"
      ? { email, password }
      : { name, email, password };

 try {
  const response = await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });

  setToken(response.token);
  onAuthSuccess(response.user);

} catch (err: any) {
     setError(err.message);

} finally {
   setLoading(false);
}    
  };   
  return (
  <div style={{ padding: 40, maxWidth: 400 }}>
    <h1>{mode === "login" ? "Log In" : "Create Account"}</h1>

    {error && <p style={{ color: "red" }}>{error}</p>}

    {mode === "register" && (
      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", width: "100%", padding: 8 }}
        />
      </div>
    )}
    <div style={{ marginBottom: 12 }}>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", padding: 8 }}
      />
    </div>
    <div style={{ marginBottom: 12 }}>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", padding: 8 }}
      />
    </div>

    <div style={{ marginBottom: 12 }}>
      <button onClick={handleSubmit} disabled={loading} style={{ padding: "8px 16px" }}>
        {loading ? "Please wait..." : mode === "login" ? "Log In" : "Register"}
      </button>
    </div>

    <div>
      <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ padding: "8px 16px" }}>
        {mode === "login" ? "Need an account? Register" : "Already have an account? Log in"}
      </button>
    </div>
  </div>
  );
}
