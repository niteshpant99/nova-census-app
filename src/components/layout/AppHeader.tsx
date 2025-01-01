'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/types/database";

export function AppHeader() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      try {
          // Get the full response first
          const sessionResponse = await supabase.auth.getSession();
          const userId = sessionResponse.data.session?.user?.id;
          
          
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single<UserProfile>();

          if (!userId) {
            return;
          }
          
        if (error) {
          console.error('Profile fetch error:', error);
          return;
        }

        // We can safely assert this type because it matches our database schema
        setUserProfile(data);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    }

    void getProfile();
  }, [supabase]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const initials = userProfile?.display_name ? getInitials(userProfile.display_name) : '??';

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-medium">Nova Census App</h1>
      <div className="flex items-center gap-2">
        <span className="text-sm mr-2">{userProfile?.display_name ?? 'Loading...'}</span>
        <Avatar>
          <AvatarImage src={userProfile?.avatar_url ?? ''} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}