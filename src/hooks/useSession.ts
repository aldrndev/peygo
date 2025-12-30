"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  role: "user" | "admin";
  company_name: string | null;
}

interface SessionState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isProfileComplete: boolean;
}

export function useSession(): SessionState {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent duplicate fetches
    if (hasFetched.current) return;
    hasFetched.current = true;

    const supabase = createClient();

    const fetchSession = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }

        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, name, phone, role, company_name")
          .eq("id", authUser.id)
          .single();

        setUser(authUser);
        setProfile(profileData as Profile | null);
      } catch {
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Listen for auth changes (only for sign out detection)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
      }
      // For SIGNED_IN, we don't refetch since initial fetch already handles it
      // This prevents duplicate fetches
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Profile complete check: admin always complete, users need name + phone
  const isProfileComplete = profile?.role === "admin" || !!(profile?.name && profile?.phone);

  return {
    user,
    profile,
    isLoading,
    isProfileComplete,
  };
}

