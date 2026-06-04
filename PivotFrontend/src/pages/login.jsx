import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
  try {
    const response = await fetch(
    `http://localhost:8080/repo/login?email=${email}&password=${password}`,
    {
        method: "POST",
        mode: "cors",
    }
    );

    if (!response.ok) {
    throw new Error("Invalid credentials");
    }

    const userId = await response.text();

    localStorage.setItem("userId", userId);

    navigate("/dashboard");
  } catch (err) {
    console.error("FULL ERROR:", err);
  }
};

  return (
    <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center px-4">

      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-3xl border border-slate-700 bg-[#0f172a] flex items-center justify-center">
          <span className="text-white text-3xl font-bold">P</span>
        </div>

        <h1 className="mt-4 text-[#60A5FA] text-2xl tracking-[8px] font-light">
          PIVOTVC
        </h1>
      </div>

      <div className="w-full max-w-[520px] bg-[#111827] border border-slate-700 rounded-3xl px-10 py-10">

        <div className="flex justify-center mb-8">
          <div className="border border-green-800 bg-green-950/40 text-green-500 text-sm px-4 py-2 rounded-lg">
            v1.0 · dev build
          </div>
        </div>

        <h2 className="text-center text-white text-4xl font-bold mb-10">
          Sign in to your account
        </h2>

        <div className="mb-6">
          <label className="block text-slate-400 text-lg mb-2">
            Email address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-[#27272A] border border-slate-600 rounded-xl px-4 py-3 text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-400 text-lg mb-2">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#27272A] border border-slate-600 rounded-xl px-4 py-3 text-white outline-none"
          />

          <div className="flex justify-end mt-2">
            <button className="text-[#60A5FA] text-sm">
              Forgot password?
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="mt-8 w-full py-3 rounded-xl border border-slate-600 text-white text-lg font-semibold hover:bg-slate-800"
        >
          Sign in
        </button>

        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-slate-700"></div>

          <span className="px-4 text-slate-500">
            or continue with
          </span>

          <div className="flex-1 border-t border-slate-700"></div>
        </div>

        <button className="w-full border border-slate-600 rounded-xl py-3 flex items-center justify-center gap-3 text-white hover:bg-slate-800">
          <img
            src="https://github.githubassets.com/favicons/favicon.svg"
            alt="GitHub"
            className="w-5 h-5"
          />
          Continue with GitHub
        </button>

        <button className="mt-3 w-full border border-slate-600 rounded-xl py-3 flex items-center justify-center gap-3 text-white hover:bg-slate-800">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>

      <div className="mt-8 text-slate-500">
        New here?{" "}
        <button className="text-[#60A5FA]">
          Create an account →
        </button>
      </div>
    </div>
  );
}