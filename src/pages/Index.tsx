
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";
// Logo icon, you could swap this for a plant icon or a local image
const leavesIcon = "/lovable-uploads/05906f64-8b32-4737-a074-8f373f371349.png";
const bgImage = "/lovable-uploads/57e20818-f97d-4a73-ba99-7f6eedf5d5f9.png";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  // Auth form states
  const [mode, setMode] = useState<"login" | "signup">("login");
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
    <div className="relative min-h-screen flex items-center justify-center overflow-x-hidden bg-no-repeat bg-cover"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: "center",
      }}
    >
      {/* glass-colored overlay */}
      <div className="absolute inset-0 z-0 bg-black/70" />
      {/* Centered glass card */}
      <div className="relative z-10 flex flex-col w-full max-w-md mx-auto px-2 py-16 min-h-[95vh] justify-center items-center">
        <div className="w-full rounded-3xl bg-white/65 dark:bg-[#26311E]/80 backdrop-blur-xl shadow-2xl border border-white/30 dark:border-[#274021]/60 px-6 pt-12 pb-8 flex flex-col items-center animate-fade-in"
          style={{
            boxShadow:
              "0 4px 36px 0 rgba(52,89,68,0.12), 0 1.5px 18px 0 rgba(58,90,64,0.07)",
          }}
        >
          {/* Logo and heading */}
          <img alt="Sproutsly logo" src={leavesIcon} className="w-16 h-16 mb-4" />
          <h1 className="font-extrabold text-5xl text-green-800 dark:text-green-200 mb-3 text-center tracking-tight select-none drop-shadow-md" style={{fontFamily:'Nunito, sans-serif'}}>
            Sproutsly
          </h1>
          <div className="text-lg sm:text-xl font-semibold text-green-700 dark:text-green-200 mb-7 mt-1 text-center max-w-xs">
            Swap, give, or sell plants—right in your neighborhood.
          </div>
          {/* Sign in */}
          {!session && (
            <form autoComplete="off" className="w-full flex flex-col items-center gap-5" onSubmit={handleAuth}>
              <div className="flex flex-col items-center -mt-2">
                <LogIn className="w-7 h-7 text-green-500 mb-1" />
                <span className="font-semibold text-green-500 mb-1">
                  {mode === "login" ? "Sign In" : "Sign Up"}
                </span>
              </div>
              {mode === "signup" && (
                <div className="flex gap-2 w-full">
                  <Input
                    type="text"
                    placeholder="First name"
                    className="bg-zinc-100 dark:bg-zinc-900/75 border border-green-200 dark:border-green-800/60 text-green-900 dark:text-green-100"
                    value={firstName}
                    required
                    disabled={loading}
                    onChange={e => setFirstName(e.target.value)}
                    autoFocus
                  />
                  <Input
                    type="text"
                    placeholder="Last name"
                    className="bg-zinc-100 dark:bg-zinc-900/75 border border-green-200 dark:border-green-800/60 text-green-900 dark:text-green-100"
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
                className="bg-zinc-900/95 border-none focus:ring-2 focus:ring-green-400 text-green-100 placeholder:text-green-200/60 transition"
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
                className="bg-zinc-900/95 border-none focus:ring-2 focus:ring-green-400 text-green-100 placeholder:text-green-200/60 transition"
                value={password}
                required
                disabled={loading}
                onChange={e => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              {error && <div className="w-full text-red-400 text-sm text-center -mt-3">{error}</div>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 font-bold text-lg bg-green-500 hover:bg-green-600 shadow-lg rounded-xl transition-all">
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
                className="mt-1 text-green-400 hover:text-green-500 transition underline underline-offset-4 text-base w-full text-center"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
              >
                {mode === "login"
                  ? "New here? Sign up for an account"
                  : "Already have an account? Sign in"}
              </button>
            </form>
          )}
          {/* Why Sproutsly */}
          <div className="mt-10 w-full flex flex-col items-center">
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-100 mb-4 text-center drop-shadow-sm">
              Why Sproutsly?
            </h3>
            <ul className="text-green-800 dark:text-green-100/90 mb-2 text-base space-y-3">
              <li>🌿 Swap, give, or sell plants with neighbors easily</li>
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

