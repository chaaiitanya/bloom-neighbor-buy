import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";
import SproutslyLogo from "@/components/SproutslyLogo";

// Planty background and logo
const bgImage = "/lovable-uploads/57e20818-f97d-4a73-ba99-7f6eedf5d5f9.png";

// Reference green from screenshot (#18c964)
const brightGreen = "#18c964";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  // Auth form states
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Check for existing session (auto-redirect if logged in)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Welcome back!", description: "Successfully logged in." });
        navigate("/dashboard", { replace: true });
      }
    } else {
      if (!firstName.trim() || !lastName.trim()) {
        setError("Please enter your first and last name.");
        setLoading(false);
        return;
      }
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
        },
      });
      if (error) {
        setError(error.message);
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check your email",
          description: "A confirmation email has been sent.",
        });
      }
    }
    setLoading(false);
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: "center",
      }}
    >
      {/* BG Blur & dark overlay */}
      <div className="absolute inset-0 z-0" style={{
        background: "rgba(13,36,18,0.62)",
        backdropFilter: "blur(7px)",
        WebkitBackdropFilter: "blur(7px)"
      }} />

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col justify-center items-center min-h-[94vh]">
        <div className="w-full rounded-3xl shadow-2xl px-8 pt-10 pb-6 flex flex-col items-center"
          style={{
            background: "rgba(255,255,255,0.13)",
            border: "2px solid rgba(255,255,255,0.22)",
            boxShadow:
              "0 4px 36px 0 rgba(52,89,68,0.08), 0 2px 14px 0 rgba(58,90,64,0.13)"
          }}
        >
          {/* Logo and heading */}
          <div className="mb-3">
            <SproutslyLogo size={48} />
          </div>
          <h1
            className="font-extrabold text-5xl mb-2 text-center tracking-tighter select-none drop-shadow"
            style={{
              color: brightGreen,
              fontFamily: 'Nunito, sans-serif',
              textShadow: "0 2px 10px #02411e22"
            }}
          >
            Sproutsly
          </h1>
          <div className="text-xl sm:text-2xl font-semibold mb-5 mt-1 text-center max-w-xs"
              style={{ color: '#2c652e' }}
          >
            Swap, give, or sell plants—right in your neighborhood.
          </div>
          
          {/* Auth Form */}
          {!session && (
            <form
              autoComplete="off"
              className="w-full flex flex-col items-center gap-5"
              onSubmit={handleAuth}
            >
              <div className="flex flex-col items-center -mt-2 mb-2">
                <LogIn className="w-6 h-6" style={{ color: brightGreen }} />
                <span
                  className="font-semibold mb-1 text-lg cursor-pointer"
                  style={{ color: brightGreen }}
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                >
                  {mode === "login" ? "Sign In" : "Sign Up"}
                </span>
              </div>
              {mode === "signup" && (
                <div className="flex gap-2 w-full">
                  <Input
                    type="text"
                    placeholder="First name"
                    className="bg-white/95 border border-[#b8f5c0] rounded-lg text-[#193e17] focus:ring-2 focus:ring-[#18c964] shadow-none font-semibold placeholder:font-normal"
                    value={firstName}
                    required
                    disabled={loading}
                    onChange={e => setFirstName(e.target.value)}
                    autoFocus
                  />
                  <Input
                    type="text"
                    placeholder="Last name"
                    className="bg-white/95 border border-[#b8f5c0] rounded-lg text-[#193e17] focus:ring-2 focus:ring-[#18c964] shadow-none font-semibold placeholder:font-normal"
                    value={lastName}
                    required
                    disabled={loading}
                    onChange={e => setLastName(e.target.value)}
                  />
                </div>
              )}
              <Input
                type="email"
                placeholder="Email"
                className="bg-zinc-900 border-none focus:ring-2 focus:ring-[#18c964] text-white placeholder:text-zinc-300/60 rounded-lg shadow-none"
                value={email}
                required
                disabled={loading}
                onChange={e => setEmail(e.target.value)}
                autoFocus={mode === "login"}
                autoComplete="username"
              />
              <Input
                type="password"
                placeholder="Password"
                className="bg-zinc-900 border-none focus:ring-2 focus:ring-[#18c964] text-white placeholder:text-zinc-300/60 rounded-lg shadow-none"
                value={password}
                required
                disabled={loading}
                onChange={e => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              {error && <div className="w-full text-red-500 text-sm text-center -mt-3">{error}</div>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 font-bold text-lg rounded-xl transition-all"
                style={{
                  backgroundColor: brightGreen,
                  color: "#fff",
                  boxShadow: "0 2px 16px 0 #15ba5b2b"
                }}
              >
                {loading
                  ? mode === "login"
                    ? "Signing in..."
                    : "Signing up..."
                  : mode === "login"
                    ? "Sign In"
                    : "Sign Up"}
              </Button>
              <button
                type="button"
                className="mt-1 transition text-base w-full text-center font-medium underline underline-offset-4"
                style={{
                  color: brightGreen
                }}
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
              >
                {mode === "login"
                  ? "New here? Sign up for an account"
                  : "Already have an account? Sign in"}
              </button>
            </form>
          )}

          {/* Why Sproutsly */}
          <div className="mt-8 w-full flex flex-col items-center">
            <h3
              className="text-2xl font-bold mb-3 text-center"
              style={{ color: "#2c652e"}}
            >
              Why Sproutsly?
            </h3>
            <ul className="mb-1 text-base space-y-3"
                style={{ color: "#224421" }}
            >
              <li>🌱 Swap, give, or sell plants with neighbors easily</li>
              <li>📷 Share photos and tips about your plant babies</li>
              <li>🧑‍🌾 Join a green community, learn and grow together</li>
              <li>🔍 Discover rare finds near you</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
