
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import BottomTabNav from "@/components/BottomTabNav";
import GlassHeader from "@/components/GlassHeader";
import WelcomeSection from "@/components/WelcomeSection";
import SearchBar from "@/components/SearchBar";
import SproutslyDetails from "@/components/SproutslyDetails";
import FavoritePlants from "@/components/FavoritePlants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";

const bgImage = "/lovable-uploads/57e20818-f97d-4a73-ba99-7f6eedf5d5f9.png";

const Index = () => {
  const navigate = useNavigate();
  const [plantType, setPlantType] = useState("All");
  const [headerVisible, setHeaderVisible] = useState(false);
  const welcomeRef = useRef<HTMLDivElement>(null);

  // Auth state
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

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
      setUser(session?.user ?? null);
    });

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Show glass header when welcome section is out of viewport
  useEffect(() => {
    const ref = welcomeRef.current;
    if (!ref) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setHeaderVisible(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, []);

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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden">
      {/* BACKGROUND IMAGE (behind everything) */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* BLACK OVERLAY */}
      <div className="absolute inset-0 -z-10 bg-black/80" />

      {/* GLASS HEADER */}
      <GlassHeader visible={headerVisible} />

      {/* Hero Section Central Card */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center min-h-[90vh]">
        <div className="max-w-xl w-full mx-auto flex flex-col items-center justify-center min-h-[60vh]">
          <div className="backdrop-blur-lg bg-white/70 dark:bg-[#161b16]/85 rounded-3xl shadow-2xl border border-white/20 dark:border-green-900/60 p-8 sm:p-12 flex flex-col items-center w-full animate-fade-in">
            <div className="flex flex-col items-center mb-8 mt-3">
              <span className="text-green-400 text-6xl mb-3">🍃</span>
              <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl text-center text-green-900 dark:text-green-50 drop-shadow-xl mb-4 tracking-tight select-none">
                Sproutsly
              </h1>
              <div className="text-lg sm:text-xl text-green-700 dark:text-green-200 font-semibold text-center mt-1 mb-4 max-w-lg">
                Swap, give, or sell plants—right in your neighborhood.
              </div>
            </div>

            {/* Auth + Search + Call-to-Action */}
            {!session && (
              <div className="w-full flex flex-col items-center gap-6">
                <form autoComplete="off" className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleAuth}>
                  <div className="flex flex-col items-center mb-3">
                    <LogIn className="w-8 h-8 text-green-400" />
                    <span className="font-semibold text-green-400">
                      {mode === "login" ? "Sign In" : "Sign Up"}
                    </span>
                  </div>
                  {mode === "signup" && (
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="First name"
                        className="bg-zinc-900 border-green-800/50 text-green-200"
                        value={firstName}
                        required
                        disabled={loading}
                        onChange={e => setFirstName(e.target.value)}
                        autoFocus
                      />
                      <Input
                        type="text"
                        placeholder="Last name"
                        className="bg-zinc-900 border-green-800/50 text-green-200"
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
                    className="bg-zinc-900 border-green-800/50 text-green-200"
                    value={email}
                    required
                    onChange={e => setEmail(e.target.value)}
                    autoFocus={mode === "login"}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="bg-zinc-900 border-green-800/50 text-green-200"
                    value={password}
                    required
                    onChange={e => setPassword(e.target.value)}
                  />
                  {error && <div className="w-full text-red-400 text-sm text-center -mt-3">{error}</div>}
                  <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white font-bold shadow">
                    {loading
                      ? mode === "login"
                        ? "Signing in..."
                        : "Signing up..."
                      : mode === "login"
                        ? "Sign In"
                        : "Sign Up"}
                  </Button>
                </form>
                <button
                  className="mt-1 text-green-400 hover:text-green-500 transition underline underline-offset-4 text-base w-full text-center"
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                >
                  {mode === "login"
                    ? "New here? Sign up for an account"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            )}

            {/* Show details and favorite plants only if NOT logging in or for very wide screens */}
            {(session || (!session && !loading)) && (
              <>
                <div className="w-full mt-6 mb-2">
                  <SproutslyDetails />
                </div>
                <div className="w-full mt-6">
                  <FavoritePlants />
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Show BottomTabNav only if logged in */}
      {!!session && <BottomTabNav />}
    </div>
  );
};

export default Index;

