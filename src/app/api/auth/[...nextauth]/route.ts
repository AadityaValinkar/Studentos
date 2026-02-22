import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || "placeholder_clientId",
            clientSecret: process.env.GOOGLE_SECRET || "placeholder_secret",
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            try {
                if (!user.email) return false;

                // Check if user exists in Supabase Postgres
                const { data: existingUser, error: searchError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', user.email)
                    .single();

                if (searchError && searchError.code !== 'PGRST116') {
                    // PGRST116 means zero rows returned (which is fine, they are new)
                    console.error("Supabase user search error:", searchError);
                    return false;
                }

                if (!existingUser) {
                    // Create new user profile on first login
                    const { error: insertError } = await supabase
                        .from('users')
                        .insert([{
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            // defaults for attendance, skills, and projects are handled by the Postgres Schema definitions
                        }]);

                    if (insertError) {
                        console.error("Supabase user insert error:", insertError);
                        return false;
                    }
                }
                return true;
            } catch (error) {
                console.error("Error saving user", error);
                return false;
            }
        },
    },
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "supersecret",
});

export { handler as GET, handler as POST };
