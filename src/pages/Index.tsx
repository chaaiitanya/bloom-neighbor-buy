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
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#154321] to-[#19391d] bg-no-repeat bg-cover"
      style={{
        backgroundImage: `url("${bgImage}")`, // restores the intended planty background image
      }}
    >
      {/* BG Blur & overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(135deg,rgba(22,52,21,0.95) 50%,rgba(15,34,16,0.9) 100%)",
          backdropFilter: "blur(3.5px)",
          WebkitBackdropFilter: "blur(3.5px)"
        }}
      />
      {/* Central Card */}
      <div
        className="relative z-10 w-full max-w-md mx-auto flex flex-col justify-center items-center min-h-[90vh]"
      >
        <div
          className="w-full rounded-[2.2rem] shadow-2xl px-8 pt-10 pb-8 flex flex-col items-center"
          style={{
            background: "rgba(15,32,17,0.925)",
            border: "2.5px solid rgba(35,87,42,0.21)",
            boxShadow: "0 6px 32px 0 rgba(10,25,18,0.21), 0 1.5px 16px 0 rgba(15,53,36,0.21)"
          }}
        >
          {/* Logo and App Name */}
          <div className="flex flex-col items-center gap-1 mb-2">
            <SproutslyLogo size={38} />
            <span className="font-bold text-[1.45rem] text-[#55e988] tracking-tight mt-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Sproutsly
            </span>
          </div>
          {/* Main Headline */}
          <h1
            className="font-extrabold text-4xl md:text-5xl tracking-tight text-center mb-1 mt-2"
            style={{
              color: "#41df71",
              fontFamily: "Nunito, sans-serif",
              letterSpacing: "-1px",
            }}
          >
            Sproutsly
          </h1>
          <div
            className="text-lg md:text-2xl font-bold mb-6 mt-0.5 text-center max-w-xs"
            style={{
              color: "#41df71", // Lighter green
              fontFamily: "Nunito, sans-serif",
              letterSpacing: "-0.019em",
            }}
          >
            Swap, give, or sell plants—<br className="hidden md:block" />right in your neighborhood.
          </div>

          {/* Auth Form / Sign In */}
          {!session && (
            <form
              autoComplete="off"
              className="w-full flex flex-col items-center"
              onSubmit={handleAuth}
            >
              <div className="flex flex-col items-center mb-3">
                <span
                  className="font-semibold mb-2 text-xl"
                  style={{
                    color: "#57e88e",
                    letterSpacing: "-0.011em",
                  }}
                >
                  {mode === "login" ? "Sign In" : "Sign Up"}
                </span>
              </div>
              {mode === "signup" && (
                <div className="flex gap-2 w-full mb-2">
                  <Input
                    type="text"
                    placeholder="First name"
                    className="bg-[#17231b] border-none focus:ring-2 focus:ring-[#47ff95] text-white placeholder:text-[#aecab9] rounded-xl shadow-none font-semibold text-lg h-12"
                    value={firstName}
                    required
                    disabled={loading}
                    onChange={e => setFirstName(e.target.value)}
                    autoFocus
                  />
                  <Input
                    type="text"
                    placeholder="Last name"
                    className="bg-[#17231b] border-none focus:ring-2 focus:ring-[#47ff95] text-white placeholder:text-[#aecab9] rounded-xl shadow-none font-semibold text-lg h-12"
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
                className="bg-[#121915] border-none focus:ring-2 focus:ring-[#41df71] text-white placeholder:text-[#aecab9] rounded-xl shadow-none font-normal text-lg h-12 mb-3"
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
                className="bg-[#121915] border-none focus:ring-2 focus:ring-[#41df71] text-white placeholder:text-[#aecab9] rounded-xl shadow-none font-normal text-lg h-12 mb-3"
                value={password}
                required
                disabled={loading}
                onChange={e => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              {error && <div className="w-full text-red-400 text-sm text-center -mt-1 mb-2">{error}</div>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 font-bold text-[1.3rem] rounded-xl bg-[#41df71] hover:bg-[#34c75d] text-[#0d2412] shadow-md transition-all mb-2"
                style={{
                  boxShadow: "0 2px 16px 0 #15ba5b20"
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
                className="transition w-full text-base text-center font-medium underline underline-offset-2 mt-2"
                style={{
                  color: "#41df71"
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
              className="text-xl font-bold mb-3 text-center"
              style={{ color: "#7affaf", fontFamily: "Nunito, sans-serif" }}
            >
              Why Sproutsly?
            </h3>
            <ul className="mb-1 text-[1.09rem] space-y-3 font-normal w-full"
              style={{ color: "#81f3ad", fontFamily: "Nunito, sans-serif" }}
            >
              <li>🌱 <span className="font-normal ml-0.5">Swap, give, or sell plants with&nbsp;neighbors easily</span></li>
              <li>📷 <span className="font-normal ml-0.5">Share photos and tips about your plant babies</span></li>
              <li>🧑‍🌾 <span className="font-normal ml-0.5">Join a green community, learn and grow together</span></li>
              <li>🔍 <span className="font-normal ml-0.5">Discover rare finds near you</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
