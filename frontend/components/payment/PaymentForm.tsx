import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useAuth } from '@/contexts/auth-context';

const stripePromise = loadStripe('pk_test_51PNCu5RuW4NDldMhZA9iCCskYyLpxjahc0XZJqP9KYceFSZzZHLXnMNzAYNBHCRMXiELPxBQLOEzMhTOfidNPHRK00V5cFwecY'); // your Stripe publishable key

const CheckoutForm: React.FC<{ price: number; campaignId: number }> = ({ price, campaignId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState(price);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        setAmount(price);
    }, [price]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !user) return;

        try {
            setLoading(true);
            // 1. Create PaymentIntent on backend
            const res = await axios.post("http://localhost:1234/create-payment-intent", { price: amount });
            const data = res.data;

            // 2. Confirm Card Payment
            const card = elements.getElement(CardElement);
            if (!card) return;

            const paymentResult = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: { card }
            });

            if (paymentResult.error) {
                setMessage(`Payment failed: ${paymentResult.error.message}`);
            } else if (paymentResult.paymentIntent?.status === 'succeeded') {
                const paymentRecord = {
                    userId: user._id,
                    campaignId: campaignId,
                    amount: paymentResult.paymentIntent.amount / 100,
                    currency: paymentResult.paymentIntent.currency,
                    paymentIntentId: paymentResult.paymentIntent.id,
                    status: paymentResult.paymentIntent.status,
                };

                // 3. Save payment info in backend
                await axios.post("http://localhost:1234/payments", paymentRecord);

                setMessage('✅ Payment succeeded and recorded!');
            }
        } catch (err: any) {
            setMessage(`Error: ${err.message}`);
        }finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            <h2 className="text-lg font-semibold">Pay ৳{amount}</h2>
            <div className="p-3 border rounded-md bg-white shadow-sm">
                <CardElement />
            </div>
            <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
                disabled={!stripe || loading}
            >
                {loading ? "Processing..." : "Donate Now"}
            </Button>
            {message && <p className="text-center mt-4">{message}</p>}
        </form>
    );
};

const PaymentForm: React.FC<{ price: number; campaignId: number }> = ({ price, campaignId }) => (
    <Elements stripe={stripePromise}>
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <CheckoutForm price={price} campaignId={campaignId} />
        </div>
    </Elements>
);

export default PaymentForm;
