
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginBar() {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-center mb-20">
      <div className="w-full flex justify-center bg-black/75 border border-white/30 backdrop-blur-lg rounded-xl shadow-lg py-4">
        <button
          className="flex items-center gap-2 text-white font-bold px-8 text-lg group transition"
          type="button"
          onClick={() => navigate("/auth")}
        >
          <LogIn className="w-6 h-6 group-hover:animate-bounce" />
          Login or Create Account
        </button>
      </div>
    </div>
  );
}
