import React from 'react';

export const Privacy = () => {
    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p className="mb-4 text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                <p className="mb-2">We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p className="mb-2">We use the information we collect to provide, maintain, and improve our services, such as to:</p>
                <ul className="list-disc pl-6 mb-2">
                    <li>Process transactions and send related information.</li>
                    <li>Send you technical notices, updates, security alerts, and support messages.</li>
                    <li>Respond to your comments, questions, and requests.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
                <p className="mb-2">We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Contact Us</h2>
                <p className="mb-2">If you have any questions about this Privacy Policy, please contact us at support@haraka.edu.sa.</p>
            </section>
        </div>
    );
};
