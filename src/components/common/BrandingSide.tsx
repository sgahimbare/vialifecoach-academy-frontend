import { motion } from "framer-motion";

export function BrandingSide() {
  return (
    <div className="hidden lg:flex lg:flex-col lg:justify-center lg:px-16 xl:px-20 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-0 w-24 h-24 bg-white/8 rounded-full blur-lg transform -translate-x-1/2" />
        
        {/* Geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-2 h-20 bg-white/20 rounded-full rotate-12" />
        <div className="absolute bottom-1/3 left-1/3 w-16 h-2 bg-white/15 rounded-full rotate-45" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        {/* Logo and brand */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <span className="text-white text-xl">D</span>
            </div>
            <div>
              <h1 className="text-white text-2xl">
                <span className="font-semibold">Vialifecoach</span>
              </h1>
              <p className="text-blue-100 text-sm">Academy</p>
            </div>
          </div>
        </div>

        {/* Main heading */}
        <div className="mb-12">
          <h2 className="text-4xl xl:text-5xl text-white mb-6 leading-tight">
            Transform Your Life with
            <span className="block text-blue-200">Expert Coaching</span>
          </h2>
          <p className="text-blue-100 text-lg xl:text-xl leading-relaxed max-w-lg">
            Join thousands of learners who have unlocked their potential through our comprehensive life coaching programs.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-12">
          {[
            "Expert-led courses and workshops",
            "Personalized learning paths",
            "24/7 community support",
            "Lifetime access to resources"
          ].map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-blue-100 text-base">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-3 gap-8">
          {[
            { number: "50K+", label: "Students" },
            { number: "95%", label: "Success Rate" },
            { number: "4.9★", label: "Rating" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl xl:text-3xl text-white mb-1">{stat.number}</div>
              <div className="text-blue-200 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div> */}
      </motion.div>

      {/* Bottom testimonial */}
      {/* <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-8 left-16 right-16 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
      >
        <p className="text-blue-100 text-sm mb-3 italic">
          "This academy completely transformed my approach to life. The coaching techniques I learned here have been invaluable."
        </p>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
          <div>
            <div className="text-white text-sm">BERNARD GODONOU</div>
            <div className="text-blue-200 text-xs">DICETHELIFEAOACH ACADEMY GRADUATE</div>
          </div>
        </div>
      </motion.div> */}
    </div>
  );
}