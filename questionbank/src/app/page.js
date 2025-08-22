

"use client";
import { useEffect, useState } from "react";
import { supabase } from "../app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import QuestionBankUI from "./QuestionBankUI";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/auth");
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  return <QuestionBankUI />;
}
