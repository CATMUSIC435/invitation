// app/api/send-qr/route.ts
import { Resend } from 'resend';
import QRCode from 'qrcode';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { to, qrData } = await req.json();

        if (!to || !qrData) {
            return NextResponse.json({ error: 'Missing email or QR data' }, { status: 400 });
        }

        const qrImageDataUrl = await QRCode.toDataURL(qrData);

        const email = await resend.emails.send({
            from: 'noreply@yourdomain.com',
            to,
            subject: 'Your QR Code',
            html: `
        <p>Chào bạn, đây là mã QR của bạn:</p>
        <img src="${qrImageDataUrl}" alt="QR Code" style="width:400px;" />
      `,
        });

        return NextResponse.json({ success: true, email });
    } catch (error) {
        console.error('Gửi thất bại:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
