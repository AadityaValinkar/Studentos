import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const phone = searchParams.get('phone');

        if (!phone) {
            return NextResponse.json({ error: "Missing phone number parameter" }, { status: 400 });
        }

        const externalUrl = `https://success.cedokconnect.com/api/customer/${encodeURIComponent(phone)}`;

        // Fetch using standard fetch - Next.js handles this on the server side which bypasses browser CORS.
        const response = await fetch(externalUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            },
            // We can optionally add cache strategies here if the data doesn't change often
            cache: 'no-store'
        });

        const textStr = await response.text();

        let data;
        try {
            data = textStr ? JSON.parse(textStr) : {};
        } catch {
            console.error("Failed to parse JSON:", textStr);
            return NextResponse.json({ error: "Invalid JSON from CEDOK API" }, { status: 502 });
        }

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch profile from external CEDOK API.", status: response.status, data }, { status: response.status });
        }

        // Pass successful response downstream
        return NextResponse.json(data);

    } catch (error: unknown) {
        console.error("Internship Proxy Error:", error);
        return NextResponse.json({ error: "Internal Server Error proxying CEDOK API." }, { status: 500 });
    }
}
