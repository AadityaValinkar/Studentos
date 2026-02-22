import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { supabase } from '@/lib/supabase'; // Service role client

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const supabaseClient = createClient();

        try {
            const { data, error } = await supabaseClient.auth.exchangeCodeForSession(code);

            if (!error && data.session?.user) {
                // Check if user exists in our local Postgres public.users
                const user = data.session.user;
                const { data: existingUser, error: searchError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', user.email)
                    .single();

                if (searchError && searchError.code !== 'PGRST116') {
                    console.error("Supabase user search error:", searchError);
                }

                if (!existingUser && user.email) {
                    // Create new user profile on first login
                    await supabase.from('users').insert([{
                        email: user.email,
                        name: user.user_metadata?.full_name || user.email.split('@')[0],
                        image: user.user_metadata?.avatar_url,
                    }]);
                }
            } else if (error) {
                console.error("Auth exchange error:", error);
                return NextResponse.redirect(`${origin}/login?error=auth`);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return NextResponse.redirect(`${origin}${next}`);
}
