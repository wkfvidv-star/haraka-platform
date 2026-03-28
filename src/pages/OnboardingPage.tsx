import React from 'react';
import { OnboardingAssessment } from '@/components/onboarding/OnboardingAssessment';
import { motion } from 'framer-motion';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4"
          >
            <span className="text-4xl">🏃‍♂️</span>
          </motion.div>
        </div>
        <OnboardingAssessment />
      </motion.div>
    </div>
  );
}
