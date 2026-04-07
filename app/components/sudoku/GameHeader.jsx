import { motion } from "framer-motion";
import { Timer, RotateCcw, Lightbulb, CheckCircle, ArrowLeft, Pause, Play, Undo2 } from "lucide-react";

export default function GameHeader({
  difficulty,
  time,
  mistakes,
  hintsLeft,
  isPaused,
  onPause,
  onHint,
  onValidate,
  onUndo,
  onRestart,
  onBack,
}) {
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const diffColors = {
    easy: "text-green-400",
    medium: "text-amber-400",
    hard: "text-red-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-heading"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className={`font-heading font-semibold text-sm uppercase tracking-widest ${diffColors[difficulty]}`}>
          {difficulty}
        </span>
      </div>

      <div className="flex items-center justify-between bg-card rounded-xl border border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-accent" />
          <span className="font-mono text-lg text-foreground">{formatTime(time)}</span>
          <button onClick={onPause} className="text-muted-foreground hover:text-foreground ml-1">
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center gap-1 text-sm">
          <span className="text-muted-foreground">Mistakes:</span>
          <span className={`font-mono font-bold ${mistakes >= 3 ? "text-destructive" : "text-foreground"}`}>
            {mistakes}/3
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-3">
        <button variant="ghost" size="sm" onClick={onUndo} className="text-muted-foreground hover:text-foreground gap-1.5 font-heading">
          <Undo2 className="w-4 h-4" /> Undo
        </button>
        <button variant="ghost" size="sm" onClick={onHint} disabled={hintsLeft <= 0} className="text-muted-foreground hover:text-accent gap-1.5 font-heading">
          <Lightbulb className="w-4 h-4" /> Hint ({hintsLeft})
        </button>
        <button variant="ghost" size="sm" onClick={onValidate} className="text-muted-foreground hover:text-primary gap-1.5 font-heading">
          <CheckCircle className="w-4 h-4" /> Check
        </button>
        <button variant="ghost" size="sm" onClick={onRestart} className="text-muted-foreground hover:text-foreground gap-1.5 font-heading">
          <RotateCcw className="w-4 h-4" /> New
        </button>
      </div>
    </motion.div>
  );
}