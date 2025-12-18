'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Target, Sparkles, ChevronRight, Award, GraduationCap } from 'lucide-react';

export default function HeroPolitec() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-gray-900/20 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
      
      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-24 h-24 rounded-full bg-gradient-to-br from-brand-main/10 to-brand-lime/10 blur-xl"
      />
      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-32 right-16 w-32 h-32 rounded-full bg-gradient-to-br from-brand-lime/10 to-brand-main/10 blur-xl"
      />
      <motion.div
        animate={{
          x: [0, 15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-brand-main/5 to-brand-lime/5 blur-lg"
      />

      {/* Main Content */}
      <div className="relative container mx-auto px-4 pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-main/10 to-brand-lime/10 border border-brand-main/20"
            >
              <Sparkles className="w-4 h-4 text-brand-main" />
              <span className="text-sm font-medium text-brand-main">
                Transformando Futuros
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              <span className="block text-gray-900 dark:text-white">
                Educação que{' '}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-brand-main to-brand-lime bg-clip-text text-transparent">
                    transforma
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-brand-main/20 to-brand-lime/20 blur-xl" />
                </span>
              </span>
              <span className="block text-gray-700 dark:text-gray-300 mt-2">
                vidas e constrói{' '}
                <span className="text-brand-main dark:text-brand-lime">futuros</span>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed"
            >
              No <span className="font-semibold text-brand-main">POLITEC</span>, unimos 
              conhecimento teórico com prática inovadora para formar os 
              profissionais que moldarão o amanhã. Nossa missão é ir além 
              da sala de aula.
            </motion.p>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {[
                {
                  icon: <BookOpen className="w-5 h-5" />,
                  title: "Ensino Prático",
                  color: "from-brand-main to-blue-500"
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  title: "Comunidade Ativa",
                  color: "from-brand-lime to-green-500"
                },
                {
                  icon: <Target className="w-5 h-5" />,
                  title: "Foco no Mercado",
                  color: "from-brand-main to-purple-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color}`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {feature.title}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-brand-main to-brand-lime text-white font-semibold overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Inscreva-se Agora
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-brand-lime to-brand-main"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 rounded-xl border-2 border-brand-main dark:border-brand-lime text-brand-main dark:text-brand-lime font-semibold hover:bg-brand-main/5 dark:hover:bg-brand-lime/5 transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  Explorar Cursos
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-main/20 via-brand-lime/10 to-transparent" />
              
              {/* Abstract Shapes */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border-2 border-brand-main/10"
              />
              <motion.div
                animate={{
                  rotate: [360, 0],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full border-2 border-brand-lime/10"
              />
              
              {/* Content Overlay */}
              <div className="relative z-10 p-8 md:p-12 h-[500px] flex flex-col justify-end bg-gradient-to-t from-black/40 via-transparent to-transparent">
                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-8 right-8 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <GraduationCap className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{
                    y: [0, 15, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute bottom-1/3 left-8 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <Award className="w-8 h-8 text-white" />
                </motion.div>
                
                {/* Text Content */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">
                      Inovação e Excelência
                    </span>
                  </motion.div>
                  
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-2xl md:text-3xl font-bold text-white"
                  >
                    O futuro começa aqui
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="text-white/90"
                  >
                    Junte-se a uma comunidade de aprendizes, 
                    inovadores e líderes do amanhã.
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -bottom-6 -left-6 w-32 h-32 rounded-3xl bg-gradient-to-br from-brand-main/20 to-brand-lime/10 -z-10 blur-lg"
            />
            
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute -top-6 -right-6 w-40 h-40 rounded-3xl bg-gradient-to-br from-brand-lime/10 to-brand-main/20 -z-10 blur-lg"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Explore mais
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-brand-main/30 dark:border-brand-lime/30 flex items-start justify-center p-1">
            <motion.div
              animate={{
                y: [0, 16, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-1.5 h-1.5 rounded-full bg-brand-main dark:bg-brand-lime"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}