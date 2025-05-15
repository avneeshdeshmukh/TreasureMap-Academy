import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            await request.json();

        // Generate expected signature
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        // Verify signature
        if (generatedSignature === razorpay_signature) {
            // Payment is verified
            // Optionally, save payment details to your database here
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { success: false, error: 'Invalid signature' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}