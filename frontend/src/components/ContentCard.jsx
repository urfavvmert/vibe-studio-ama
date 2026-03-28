import React, { useState, useEffect } from 'react';
import { Copy, Check, MessageSquare, Briefcase, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const PLATFORMS = {
  linkedin: {
    icon: Briefcase,
    color: 'text-[#0a66c2]',
    label: 'LinkedIn Post'
  },
  twitter: {
    icon: MessageSquare,
    color: 'text-white', // Twitter X style
    label: 'Twitter'
  },
  instagram: {
    icon: Camera,
    color: 'text-[#e1306c]',
    label: 'Instagram Caption'
  }
};

export default function ContentCard({ platform, content }) {
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const info = PLATFORMS[platform];
  const Icon = info.icon;

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      if (i < content.length) {
        const charToAppend = content.charAt(i);
        setDisplayedText(prev => prev + charToAppend);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 15); // Hız (ms)
    return () => clearInterval(interval);
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-effect rounded-2xl p-6 mb-6 overflow-hidden relative group transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-[var(--color-apple-border)]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-[var(--color-apple-bg)]/50 ${info.color}`}>
            <Icon size={20} />
          </div>
          <h3 className="font-semibold text-lg text-[var(--color-apple-text)]">
            {info.label}
          </h3>
        </div>
        
        <button 
          onClick={handleCopy}
          className="p-2 rounded-lg bg-[var(--color-apple-glass)] border border-[var(--color-apple-border)] text-[var(--color-apple-text-muted)] hover:text-[var(--color-apple-text)] transition-colors"
          title="Copy"
        >
          {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
        </button>
      </div>
      
      <div className="text-[var(--color-apple-text)] whitespace-pre-wrap leading-relaxed opacity-90 overflow-y-auto max-h-60 mt-2 custom-scrollbar">
        {displayedText}
        {displayedText.length < content.length && (
          <span className="inline-block w-2 h-4 ml-1 bg-[var(--color-apple-accent)] animate-pulse" />
        )}
      </div>
    </motion.div>
  );
}
