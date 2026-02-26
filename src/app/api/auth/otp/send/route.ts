import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { phoneNumber } = await req.json();

        if (!phoneNumber) {
            return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
        }

        // 1. Generate 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        const supabase = createClient();

        // 2. Store OTP in database
        const { error: dbError } = await supabase
            .from("verification_codes")
            .insert({
                phone_number: phoneNumber,
                code: code,
                expires_at: expiresAt.toISOString()
            });

        if (dbError) {
            console.error("OTP DB Error:", dbError);
            return NextResponse.json({ error: "Failed to initialize verification" }, { status: 500 });
        }

        // 3. Call Datagenit API
        const authKey = process.env.DATAGENIT_AUTH_KEY;
        const senderId = process.env.DATAGENIT_SENDER_ID || "STU_OS";

        if (!authKey) {
            console.error("Missing DATAGENIT_AUTH_KEY in environment variables");
            return NextResponse.json({ error: "SMS Configuration Error: Missing API Key" }, { status: 500 });
        }
        const message = encodeURIComponent(`Your StudentOS verification code is: ${code}. Valid for 10 minutes.`);

        // Remove '+' from phone number if present for the API
        const cleanPhone = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber;

        const apiUrl = `https://global.datagenit.com/API/sms-api.php?auth=${authKey}&msisdn=${cleanPhone}&senderid=${senderId}&message=${message}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === "failure") {
            console.error("Datagenit API Failure:", data);
            return NextResponse.json({ error: `SMS Provider Error: ${data.desc}` }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "OTP sent successfully" });

    } catch (err: unknown) {
        console.error("OTP Send Exception:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
