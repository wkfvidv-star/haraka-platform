let stripe;

const initStripe = async () => {
    if (stripe) return stripe;
    try {
        const { default: Stripe } = await import('stripe');
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16',
        });
        return stripe;
    } catch (e) {
        console.warn('⚠️ Stripe module not found. Monetization will be limited.');
        return null;
    }
};

/**
 * Creates a Stripe Checkout Session for a subscription.
 */
export const createCheckoutSession = async ({ userId, userEmail, planId, priceId, successUrl, cancelUrl }) => {
    const s = await initStripe();
    if (!s) throw new Error('Stripe integration is currently unavailable in this environment.');

    try {
        const session = await s.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: userEmail,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                userId,
                planId,
            },
        });

        return session;
    } catch (error) {
        console.error('Stripe Checkout Session Error:', error);
        throw new Error('Failed to create payment session: ' + error.message);
    }
};

/**
 * Verifies the Stripe Webhook signature and constructs the event.
 */
export const constructWebhookEvent = async (payload, signature) => {
    const s = await initStripe();
    if (!s) throw new Error('Stripe integration is currently unavailable.');

    try {
        return s.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        throw new Error('Webhook signature verification failed');
    }
};

export default stripe;
