import React, { useState } from 'react';
import ContentCard from './components/ContentCard';
import { Loader2, Brain, Rocket, KeyRound, X, Music, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroScreen from './components/IntroScreen';

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

function App() {
  const [content, setContent] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [isIntroDone, setIsIntroDone] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setMusicPlaying(true);
    setError('');
    setResults(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: content.trim(),
          tone: selectedTone 
        })
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        if (data.error === 'MISSING_API_KEY') {
          setShowKeyModal(true);
        } else {
          setError(data.error || 'İçerik üretilirken hata oluştu.');
        }
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[var(--color-apple-text)] p-4 md:p-8 relative overflow-hidden bg-[var(--color-apple-bg)]">
      {!isIntroDone && <IntroScreen onComplete={() => setIsIntroDone(true)} />}

      {/* Background Aurora */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none animate-aurora-1" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none animate-aurora-2" />

      {isIntroDone && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 1 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2, delayChildren: 0.1 }
            }
          }}
          className="relative z-10 w-full"
        >
          <main className="max-w-4xl mx-auto pt-10 md:pt-20">
            
            {/* Header Segment */}
            <motion.div 
              variants={itemVariants}
              className="text-center mb-12"
            >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect text-sm font-medium mb-6">
            <Brain size={16} className="text-[var(--color-apple-accent)]" />
            <span className="text-[var(--color-apple-text-muted)]">Akıllı İçerik Atölyesi</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-gradient">
            Vibe Stüdyo
          </h1>
          <p className="text-lg md:text-xl font-medium text-[var(--color-apple-text-muted)] max-w-2xl mx-auto">
            Yapay Zeka Destekli İçerik Fabrikası – Powered by AMA
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div 
          variants={itemVariants}
          className="mb-16"
        >
          <form 
            onSubmit={handleGenerate}
            className="glass-effect rounded-[2rem] p-3 md:p-5 flex flex-col md:flex-row gap-4 items-center focus-within:ring-2 focus-within:ring-[var(--color-apple-accent)]/80 transition-all shadow-[0_4px_40px_rgba(168,85,247,0.15)] focus-within:shadow-[0_4px_60px_rgba(168,85,247,0.25)] relative z-20"
          >
            <div className="flex-1 w-full pl-4">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Fikrinizi buraya yazın..."
                className="w-full bg-transparent border-none text-[var(--color-apple-text)] placeholder:text-[var(--color-apple-text-muted)] outline-none text-xl md:text-2xl h-16 font-medium"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !content.trim() || !selectedTone}
              className="w-full md:w-auto h-16 px-10 rounded-[1.5rem] bg-gradient-to-r from-[#9333ea] to-[var(--color-apple-accent)] text-white font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(219,0,255,0.7)] group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Üret <Rocket size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Ebru Gündeş Soundtrack */}
        {musicPlaying && (
          <div className="absolute top-[-9999px] left-[-9999px] opacity-0 pointer-events-none">
            <iframe 
              width="560" 
              height="315" 
              src="https://www.youtube.com/embed/YWVIebzbf28?autoplay=1&start=52" 
              frameBorder="0" 
              allow="autoplay; encrypted-media" 
              title="Ebru"
            />
          </div>
        )}

        {/* Tone Selector */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              { id: 'viral', icon: '🚀', label: 'Viral' },
              { id: 'ciddi', icon: '👔', label: 'Ciddi' },
              { id: 'mizah', icon: '😂', label: 'Mizah' }
            ].map(tone => (
              <button
                key={tone.id}
                onClick={() => setSelectedTone(tone.id)}
                className={`px-5 py-2.5 rounded-full border transition-all text-sm font-medium flex items-center gap-2
                  ${selectedTone === tone.id 
                    ? 'border-[var(--color-apple-accent)] bg-[var(--color-apple-accent)]/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                    : 'border-[var(--color-apple-border)] bg-[var(--color-apple-glass)] text-[var(--color-apple-text-muted)] hover:border-[var(--color-apple-accent)]/50 hover:text-white'
                  }`}
              >
                <span>{tone.icon}</span>
                {tone.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Error Handling */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-effect border-red-500/30 text-red-400 p-4 rounded-xl mb-8 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Container */}
        <AnimatePresence>
          {results && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="grid md:grid-cols-[1fr_1.5fr] gap-6">
                <div className="space-y-6">
                  <div className="glass-effect rounded-2xl p-6 border border-[var(--color-apple-border)]">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                       Twitter Threads
                    </h2>
                    <div className="space-y-4">
                      {results.tweets.map((tweet, idx) => (
                        <ContentCard key={`twitter-${idx}`} platform="twitter" content={tweet} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <ContentCard platform="linkedin" content={results.linkedin_post} />
                  <ContentCard platform="instagram" content={results.instagram_caption} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
      
      {/* Footer */}
      <motion.footer 
        variants={itemVariants}
        className="relative z-10 pb-12 pt-16 text-center"
      >
        <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-transparent via-[#a855f7] to-transparent opacity-50 mb-4 w-64"></div>
        <p className="text-[var(--color-apple-text-muted)] text-sm font-medium tracking-widest uppercase glow-effect">
          Made by AMA (Ali Mert APUHAN)
        </p>
      </motion.footer>
      </motion.div>
      )}

      {/* API Key Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-effect p-8 rounded-3xl max-w-md w-full relative border-[var(--color-apple-border)]"
            >
              <button 
                onClick={() => setShowKeyModal(false)}
                className="absolute top-4 right-4 text-[var(--color-apple-text-muted)] hover:text-white transition-colors"
                title="Kapat"
              >
                <X size={20} />
              </button>
              
              <div className="w-16 h-16 rounded-full bg-[var(--color-apple-accent)]/20 flex items-center justify-center mb-6 mx-auto">
                <KeyRound size={32} className="text-[var(--color-apple-accent)]" />
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-4">API Anahtarı Eksik!</h2>
              <p className="text-[var(--color-apple-text-muted)] text-center mb-6">
                Groq yapay zeka servisine bağlanabilmek için arka planda bir <strong>GROQ_API_KEY</strong> tanımlamalısın.
              </p>
              
              <div className="bg-black/40 rounded-xl p-4 mb-6">
                <ol className="text-sm space-y-2 text-[var(--color-apple-text-muted)]">
                  <li>1. <strong>console.groq.com/keys</strong> adresinden bedava key al.</li>
                  <li>2. Backend klasörü içine <strong>.env</strong> dosyası oluştur.</li>
                  <li>3. İçine <code className="text-[var(--color-apple-accent)] bg-[var(--color-apple-accent)]/10 px-1 rounded">GROQ_API_KEY=gsk_...</code> şeklinde kaydet.</li>
                  <li>4. Sunucuyu kapatıp yeniden başlat.</li>
                </ol>
              </div>
              
              <button 
                onClick={() => setShowKeyModal(false)}
                className="w-full py-3 rounded-xl bg-[var(--color-apple-accent)] hover:bg-[var(--color-apple-accent-hover)] text-white font-semibold transition-all shadow-[0_0_15px_rgba(219,0,255,0.3)]"
              >
                Anladım
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Toggle Button */}
      {isIntroDone && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setMusicPlaying(!musicPlaying)}
          className={`fixed bottom-6 right-6 p-4 rounded-full z-50 glass-effect border transition-all shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex items-center gap-2 ${musicPlaying ? 'border-[var(--color-apple-accent)] text-[var(--color-apple-accent)] hover:bg-[var(--color-apple-accent)]/10' : 'border-white/10 text-white/50 hover:text-white/80'}`}
          title="Müziği Aç / Kapat"
        >
          {musicPlaying ? <Disc size={20} className="animate-spin" style={{ animationDuration: '3s' }} /> : <Music size={20} />}
        </motion.button>
      )}

    </div>
  );
}

export default App;
