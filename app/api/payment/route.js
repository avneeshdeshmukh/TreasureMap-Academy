// app/api/payment/route.js
import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { amount } = await request.json();

    // Validate the amount
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // Amount in paisa (1 INR = 100 paisa)
      currency: 'INR',
      payment_capture: 1,
    };

    // Create an order with Razorpay
    const order = await razorpay.orders.create(options);

    return NextResponse.json({ orderId: order.id, amount: options.amount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 });
  }
}
