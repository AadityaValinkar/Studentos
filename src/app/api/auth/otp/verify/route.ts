import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { phoneNumber, code } = await req.json();

        if (!phoneNumber || !code) {
            return NextResponse.json({ error: "Phone number and code are required" }, { status: 400 });
        }

        const supabase = createClient();

        // 1. Fetch the latest code for this phone number
        const { data, error } = await supabase
            .from("verification_codes")
            .select("*")
            .eq("phone_number", phoneNumber)
            .eq("verified", false)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: "Verification code not found or already used" }, { status: 404 });
        }

        // 2. Check expiry
        if (new Date(data.expires_at) < new Date()) {
            return NextResponse.json({ error: "Verification code expired" }, { status: 410 });
        }

        // 3. Check code
        if (data.code !== code) {
            // Increment attempts
            await supabase
                .from("verification_codes")
                .update({ attempts: (data.attempts || 0) + 1 })
                .eq("id", data.id);

            return NextResponse.json({ error: "Invalid verification code" }, { status: 401 });
        }

        // 4. Success! Mark as verified
        await supabase
            .from("verification_codes")
            .update({ verified: true })
            .eq("id", data.id);

        // 5. Check if user exists with this phone
        const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("phone_number", phoneNumber)
            .single();

        return NextResponse.json({
            success: true,
            message: "Phone verified successfully",
            exists: !!profile,
            phoneNumber
        });

    } catch (err: unknown) {
        console.error("OTP Verify Exception:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
