"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type Session, type User } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabase-client";

type SupabaseContextType = {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType>({
    session: null,
    user: null,
    isLoading: true,
});

export function SupabaseProvider({
    children,
    initialSession,
}: {
    children: React.ReactNode;
    initialSession: Session | null;
}) {
    const [session, setSession] = useState<Session | null>(initialSession);
    const [user, setUser] = useState<User | null>(initialSession?.user ?? null);
    const [isLoading, setIsLoading] = useState(!initialSession); // only load if we lack a session initially

    useEffect(() => {
        const {
            data: { subscription },
        } = supabaseClient.auth.onAuthStateChange((_event, currentSession) => {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setIsLoading(false);
        });

        if (!initialSession) {
            supabaseClient.auth.getSession().then(({ data: { session: currentSession } }) => {
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
                setIsLoading(false);
            });
        }

        return () => {
            subscription.unsubscribe();
        };
    }, [initialSession]);

    return (
        <SupabaseContext.Provider value={{ session, user, isLoading }}>
            {children}
        </SupabaseContext.Provider>
    );
}

export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (context === undefined) {
        throw new Error("useSupabase must be used within a SupabaseProvider");
    }
    return context;
};
