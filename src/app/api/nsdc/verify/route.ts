import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// We use the edge runtime since PDF buffers can be large, but node is also fine.
export const maxDuration = 10;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { docId, fullName, dob } = body;

        if (!docId || !fullName || !dob) {
            return NextResponse.json({ error: "missing_parameter", errorDescription: "DOCID, FullName, and DOB are required." }, { status: 400 });
        }

        // Generate the complex Consent Artifact structure required by API Setu
        const currentTimestamp = new Date().toISOString();
        const consentId = uuidv4();
        const txnId = uuidv4();

        const payload = {
            txnId: txnId,
            format: "pdf",
            certificateParameters: {
                DOCID: docId,
                FullName: fullName,
                DOB: dob
            },
            consentArtifact: {
                consent: {
                    consentId: consentId,
                    timestamp: currentTimestamp,
                    dataConsumer: { id: "studentOSClient" },
                    dataProvider: { id: "nsdc" },
                    purpose: { description: "Skill Certificate Verification" },
                    user: {
                        idType: "AADHAAR", // Example default
                        idNumber: "123456789012", // Placeholder
                        mobile: "9999999999",
                        email: "user@example.com"
                    },
                    data: { id: "skcer" },
                    permission: {
                        access: "VIEW",
                        dateRange: {
                            from: currentTimestamp,
                            to: currentTimestamp
                        },
                        frequency: {
                            unit: "HOUR",
                            value: 1,
                            repeats: 0
                        }
                    }
                },
                signature: {
                    signature: "placeholder_signature" // In production, this needs actual cryptographical signing if strictly enforced by Setu
                }
            }
        };

        const response = await fetch("https://apisetu.gov.in/certificate/v3/nsdcindia/skcer", {
            method: "POST",
            headers: {
                "accept": "application/pdf",
                "Content-Type": "application/json",
                // Required API Setu headers (will fail 401 locally without actual credentials)
                "X-APISETU-CLIENTID": process.env.APISETU_CLIENT_ID || "",
                "X-APISETU-APIKEY": process.env.APISETU_API_KEY || "",
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = { error: "upstream_error", errorDescription: response.statusText };
            }
            return NextResponse.json(errorData, { status: response.status });
        }

        // If successful, the response is a PDF Buffer
        const pdfBuffer = await response.arrayBuffer();

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="NSDC_Certificate_${docId}.pdf"`
            }
        });

    } catch (error: unknown) {
        console.error("NSDC Proxy Error:", error);
        return NextResponse.json({ error: "internal_server_error", errorDescription: "Failed to verify certificate proxy." }, { status: 500 });
    }
}
