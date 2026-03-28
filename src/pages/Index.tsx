import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Activity, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => navigate('/auth');

  return (
    <div className="min-h-screen bg-white font-sans text-right relative overflow-hidden" dir="rtl">
      {/* Background Decorators - Matching Haraka Brand Lines */}

      {/* Top Left Lines (Mirrored) */}
      <svg className="absolute top-0 left-0 w-[600px] h-[600px] md:w-[800px] md:h-[800px] pointer-events-none opacity-60 scale-x-[-1]" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 400 -100 C 600 100, 900 300, 1000 0" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
        <path d="M 300 -50 C 550 150, 850 400, 1100 100" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <path d="M 500 -150 C 700 50, 800 200, 900 -50" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 550 50 C 750 250, 950 400, 1100 200" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M 450 -20 C 680 180, 850 350, 1000 150" stroke="#4ade80" strokeWidth="1" strokeLinecap="round" />
        <path d="M 650 150 C 850 350, 1000 500, 1200 300" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M 750 0 C 900 150, 1000 250, 1100 100" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="500" cy="100" r="4" fill="#1d4ed8" />
        <circle cx="650" cy="50" r="3" fill="#16a34a" />
        <circle cx="700" cy="200" r="5" fill="#ea580c" />
        <circle cx="450" cy="250" r="2" fill="#3b82f6" />
        <circle cx="800" cy="150" r="4" fill="#1e3a8a" />
      </svg>

      {/* Top Right Lines */}
      <svg className="absolute top-0 right-0 w-[600px] h-[600px] md:w-[800px] md:h-[800px] pointer-events-none opacity-60" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sweeping Blue Lines */}
        <path d="M 400 -100 C 600 100, 900 300, 1000 0" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
        <path d="M 300 -50 C 550 150, 850 400, 1100 100" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <path d="M 500 -150 C 700 50, 800 200, 900 -50" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />

        {/* Sweeping Green Lines */}
        <path d="M 550 50 C 750 250, 950 400, 1100 200" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M 450 -20 C 680 180, 850 350, 1000 150" stroke="#4ade80" strokeWidth="1" strokeLinecap="round" />

        {/* Sweeping Orange Lines */}
        <path d="M 650 150 C 850 350, 1000 500, 1200 300" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M 750 0 C 900 150, 1000 250, 1100 100" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />

        {/* Decorative Dots */}
        <circle cx="500" cy="100" r="4" fill="#1d4ed8" />
        <circle cx="650" cy="50" r="3" fill="#16a34a" />
        <circle cx="700" cy="200" r="5" fill="#ea580c" />
        <circle cx="450" cy="250" r="2" fill="#3b82f6" />
        <circle cx="800" cy="150" r="4" fill="#1e3a8a" />
      </svg>

      {/* Bottom Right Lines (Flipped to wrap around content) */}
      <svg className="absolute bottom-0 right-0 w-[500px] h-[500px] md:w-[700px] md:h-[700px] pointer-events-none opacity-50 translate-x-1/4 translate-y-1/4" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 800 900 C 600 700, 300 500, 200 800" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 900 850 C 650 650, 350 400, 100 700" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <path d="M 700 950 C 500 750, 400 600, 300 850" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="400" cy="700" r="3" fill="#ea580c" />
        <circle cx="550" cy="600" r="5" fill="#1d4ed8" />
        <circle cx="300" cy="550" r="4" fill="#16a34a" />
      </svg>

      {/* Bottom Left Lines */}
      <svg className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] pointer-events-none opacity-40 -translate-x-1/4 translate-y-1/4" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M -100 800 C 100 600, 400 500, 500 800" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" />
        <path d="M 0 900 C 250 700, 550 550, 700 900" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
        <circle cx="200" cy="650" r="4" fill="#3b82f6" />
        <circle cx="400" cy="750" r="3" fill="#ea580c" />
      </svg>

      {/* Main Content Container */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-center">

        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center mb-8"
        >
          {/* Custom Image Logo Container */}
          <div className="w-72 h-auto md:w-96 flex items-center justify-center mb-6 relative group">
            <img
              src="/haraka_logo.png"
              alt="Haraka Logo"
              className="w-full h-auto object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                // Fallback if the user hasn't uploaded it yet
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="text-sm text-red-500 bg-red-100 p-4 rounded-lg">يرجى رفع الشعار باسم haraka_logo.png في مجلد public</div>';
              }}
            />
          </div>
        </motion.div>

        {/* Welcome Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-2xl px-4"
        >
          <p className="text-2xl md:text-3xl font-bold text-slate-700 mb-12 leading-relaxed">
            اكتشف رحلتك مع حركة الآن!
          </p>

          {/* Call to Action Button */}
          <Button
            size="lg"
            className="group relative h-16 md:h-20 px-10 md:px-14 text-xl md:text-2xl font-black rounded-full bg-blue-600 text-white overflow-hidden shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
            onClick={handleGetStarted}
          >
            {/* Button Gradient Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Button Content */}
            <span className="relative z-10 flex items-center justify-center gap-3">
              ابدأ الآن
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-2 transition-transform duration-300" strokeWidth={3} />
            </span>
          </Button>
        </motion.div>

      </main>

      {/* Simple Footer Text */}
      <div className="absolute bottom-6 left-0 w-full text-center text-slate-400 text-sm font-medium z-10">
        © {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة حركة.
      </div>
    </div>
  );
}
