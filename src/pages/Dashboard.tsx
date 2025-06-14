
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// A simple React dashboard component only for logged-in users.
export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is not logged in, redirect to /auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-900 to-black p-4">
      <div className="w-full max-w-xl bg-black/80 rounded-2xl shadow-xl p-8 border border-green-800/40 backdrop-blur-md flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-green-100 mb-3">🌱 Sproutsly Dashboard</h1>
        <p className="text-green-200 mb-6 text-center">Welcome to your dashboard! You are now logged in.</p>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-xl shadow transition"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/auth");
          }}
        >
          Sign out
        </button>
      </div>
    </main>
  );
}
