"use client"

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";;
import { Trophy, Clock, Star, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

export default function WinModal({ isOpen, time, difficulty, mistakes, onNewGame, onBack }) {
  useEffect(() => {
    if (isOpen) {
      const duration = 3000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 3n,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#7c3aed", "#2dd4bf", "#f59e0b"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#7c3aed", "#2dd4bf", "#f59e0b"],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [isOpen]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-6"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-card rounded-3xl border border-border p-8 max-w-sm w-full text-center shadow-2xl"
          >
            <motion.div
              initial={{ rotate: -15, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/30"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
              Puzzle Solved!
            </h2>
            <p className="text-muted-foreground mb-5">
              You completed the {difficulty} puzzle
            </p>

            <div className="flex justify-center gap-1 mb-5">
              {[1, 2, 3].map((s) => (
                <motion.div
                  key={s}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3 + s * 0.15, type: "spring" }}
                >
                  <Star
                    className={`w-8 h-8 ${
                      s <= stars ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
                    }`}
                  />
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center gap-6 mb-6 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-accent" />
                <span className="font-mono text-foreground">{formatTime(time)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Mistakes: </span>
                <span className="font-mono text-foreground">{mistakes}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button variant="outline" onClick={onBack} className="flex-1 font-heading">
                Menu
              </button>
              <button onClick={onNewGame} className="flex-1 bg-primary hover:bg-primary/90 font-heading gap-2">
                <RotateCcw className="w-4 h-4" /> Play Again
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}