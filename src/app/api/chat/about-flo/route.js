import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { message, threadId } = body;

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Forward to n8n Webhook
        const n8nUrl = 'https://biigbaan.app.n8n.cloud/webhook/8b4e4deb-1dbd-4fb6-a804-46eed54179b8';

        const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                threadId: threadId || undefined
            }),
        });

        if (!response.ok) {
            throw new Error(`n8n responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Normalize response
        // Priority: output > reply > text > message > "Hi"
        let reply = "Hi";
        if (typeof data === 'string') {
            reply = data;
        } else if (typeof data === 'object' && data !== null) {
            // Handle array response from n8n (common)
            const responseData = Array.isArray(data) ? data[0] : data;

            reply = responseData.output ||
                responseData.reply ||
                responseData.text ||
                responseData.message ||
                "Hi";
        }

        return NextResponse.json({
            reply,
            threadId: data.threadId || threadId // Pass back threadId if n8n generates/updates it
        });

    } catch (error) {
        console.error('Chat Proxy Error:', error);

        // Fallback response so UI doesn't break
        return NextResponse.json({
            reply: "Hi", // Calm fallback as requested
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
