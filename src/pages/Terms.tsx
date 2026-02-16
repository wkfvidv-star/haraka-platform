import React from 'react';

export const Terms = () => {
    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <p className="mb-4 text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="mb-2">By accessing or using our platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
                <p className="mb-2">You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Acceptable Use</h2>
                <p className="mb-2">You agree not to misuse the platform or help anyone else to do so. This includes not attempting to probe, scan, or test the vulnerability of any system or network.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Termination</h2>
                <p className="mb-2">We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            </section>
        </div>
    );
};
