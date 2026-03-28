import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroScreen({ onComplete }) {
  const [phase, setPhase] = useState('button'); // 'button' -> 'logo' -> 'exit'

  const playDeepBassWhoosh = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume().then(() => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 2.5);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.8);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 3);
      });
    } catch (e) {
      console.warn("Audio API error", e);
    }
  };

  const startSequence = () => {
    setPhase('hidden_button'); // Fade button out quickly
    playDeepBassWhoosh();
    
    setTimeout(() => {
      setPhase('logo'); // Show AMA
      
      setTimeout(() => {
        setPhase('logo_fade'); // Make AMA glow/fade out
        
        setTimeout(() => {
          setPhase('exit'); // Slide up curtain
          
          setTimeout(() => {
            onComplete(); // Unmount
          }, 1000); // Wait for curtain slide
        }, 800);
      }, 1500); // Show AMA for 1.5s
    }, 400); // 0.4s to hide button
  };

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={phase === 'exit' ? { y: "-100vh" } : { y: 0 }}
      transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }} 
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {phase === 'button' && (
          <motion.button
            key="btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            onClick={startSequence}
            className="px-8 py-3 rounded-full border border-white/20 text-white/80 font-light tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 uppercase text-sm"
          >
            Enter Studio
          </motion.button>
        )}

        {(phase === 'logo' || phase === 'logo_fade') && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
            animate={
              phase === 'logo' 
                ? { opacity: 1, filter: 'blur(0px)', scale: 1 } 
                : { opacity: 0, filter: 'blur(20px)', scale: 1.1 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute text-transparent bg-gradient-to-r from-gray-500 via-white to-gray-500 bg-clip-text font-[200] tracking-[0.3em] text-5xl md:text-7xl"
          >
            AMA
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
