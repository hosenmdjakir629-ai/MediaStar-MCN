import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";

export function InvitePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [valid, setValid] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!token) {
      setValid(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get(`/invites/verify?token=${token}`);
        setValid(res.data.valid);
      } catch (error) {
        setValid(false);
      }
    };
    verify();
  }, [token]);

  const acceptInvite = async () => {
    try {
      await api.post("/invites/accept", { token, name, password });
      alert("Account created!");
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to create account");
    }
  };

  if (valid === null) return <div className="p-6 text-white">Verifying...</div>;
  if (valid === false) return <div className="p-6 text-white">Invalid or expired invite link!</div>;

  return (
    <div className="p-6 bg-[#0D0D0D] min-h-screen flex items-center justify-center">
      <div className="bg-[#141414] p-8 rounded-xl border border-[#262626] w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Accept Invitation</h2>
        <input 
          type="text" 
          placeholder="Your Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#1A1A1A] border border-[#262626] rounded-lg px-4 py-2 text-white mb-4"
        />
        <input 
          type="password" 
          placeholder="Create Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#1A1A1A] border border-[#262626] rounded-lg px-4 py-2 text-white mb-6"
        />
        <button 
          onClick={acceptInvite}
          className="w-full bg-[#4f46e5] text-white py-2 rounded-lg font-bold hover:bg-[#4338ca]"
        >
          Join Now
        </button>
      </div>
    </div>
  );
}
