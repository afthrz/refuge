"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, hasSupabaseConfig } from "@/app/lib/supabase";
import RefugeSales from "@/app/components/RefugeSales";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // Returning members who've already bought skip the sales page.
  useEffect(() => {
    if (!hasSupabaseConfig()) {
      setChecking(false);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: purchase } = await supabase
          .from("purchases")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (purchase) {
          router.replace("/course/slowing-down");
          return;
        }
      }
      setChecking(false);
    });
  }, [router]);

  if (checking) return null;

  return <RefugeSales />;
}
