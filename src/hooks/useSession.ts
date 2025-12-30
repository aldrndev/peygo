"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  role: "user" | "admin";
  company_name: string | null;
  is_onboarding_complete: boolean;
}

interface SessionState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isProfileComplete: boolean;
  refetchProfile: () => Promise<void>;
}

export function useSession(): SessionState {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchSession = useCallback(async () => {
    const supabase = createClient();
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setUser(null);
        setProfile(null);
        return;
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, name, phone, role, company_name, is_onboarding_complete")
        .eq("id", authUser.id)
        .single();

      setUser(authUser);
      setProfile(profileData as Profile | null);
    } catch {
      setUser(null);
      setProfile(null);
    }
  }, []);

  const refetchProfile = useCallback(async () => {
    await fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    // Prevent duplicate fetches on initial mount
    if (hasFetched.current) return;
    hasFetched.current = true;

    const init = async () => {
      await fetchSession();
      setIsLoading(false);
    };

    init();

    // Listen for auth changes (only for sign out detection)
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchSession]);

  // Profile complete check: admin always complete, users need is_onboarding_complete flag
  const isProfileComplete = profile?.role === "admin" || !!profile?.is_onboarding_complete;

  return {
    user,
    profile,
    isLoading,
    isProfileComplete,
    refetchProfile,
  };
}
