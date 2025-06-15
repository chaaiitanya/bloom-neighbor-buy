import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Parse ?redirectTo=... from URL
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirectTo");

  // Auth state listener (ensures live session updates)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Redirect to / or redirectTo if already logged in
  useEffect(() => {
    if (user) {
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate, redirectTo]);

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
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        // Redirect to dashboard or where user came from
        if (redirectTo) {
          navigate(redirectTo, { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    } else {
      // Signup mode (with emailRedirectTo as required for Supabase)
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl },
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-900 to-black">
      <div className="w-full max-w-md bg-black/80 rounded-2xl shadow-xl p-8 border border-green-800/40 backdrop-blur-md">
        <div className="flex flex-col items-center gap-2 mb-7">
          <LogIn className="w-8 h-8 text-green-400" />
          <h1 className="text-2xl font-bold text-green-200 mb-0">Sproutsly</h1>
          <span className="font-semibold text-green-400">
            {mode === "login" ? "Sign In" : "Sign Up"}
          </span>
        </div>
        <form autoComplete="off" className="flex flex-col gap-5" onSubmit={handleAuth}>
          <Input
            type="email"
            placeholder="Email"
            className="bg-zinc-900 border-green-800/50 text-green-200"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
            autoFocus
          />
          <Input
            type="password"
            placeholder="Password"
            className="bg-zinc-900 border-green-800/50 text-green-200"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
          />
          {error && (
            <div className="w-full text-red-400 text-sm text-center -mt-3">{error}</div>
          )}
          <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
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
          className="mt-5 text-green-300 hover:text-green-200 transition underline underline-offset-2 text-sm w-full text-center"
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login"
            ? "New here? Sign up for an account"
            : "Already have an account? Sign in"}
        </button>
        <button
          className="mt-6 bg-zinc-900 rounded-lg py-2 px-4 w-full font-semibold text-green-300 hover:bg-zinc-800 transition"
          type="button"
          onClick={() => navigate("/")}
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
