import { motion } from "framer-motion";
import { Zap, Flame, Skull } from "lucide-react";

const difficulties = [
  {
    key: "easy",
    label: "Easy",
    description: "Perfect for beginners",
    icon: Zap,
    color: "transparent text-green-500",
    glow: "shadow-green-500/30",
    cells: "42 clues",
  },
  {
    key: "medium",
    label: "Medium",
    description: "A fair challenge",
    icon: Flame,
    color: "transparent text-amber-500",
    glow: "shadow-amber-500/30",
    cells: "32 clues",
  },
  {
    key: "hard",
    label: "Hard",
    description: "For Sudoku masters",
    icon: Skull,
    color: "transparent text-red-500",
    glow: "shadow-red-500/30",
    cells: "25 clues",
  },
];

export default function DifficultySelect({ onSelect}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-3">
          <span className="text-primary">SU</span>
          <span className="text-foreground">DO</span>
          <span className="text-foreground">KU</span>
        </h1>
        <p className="text-muted-foreground text-lg font-heading">
          Choose your challenge
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl w-full">
        {difficulties.map((d, i) => {
          const Icon = d.icon;
          return (
            <motion.button
              key={d.key}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(d.key)}
              className={`relative group bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 shadow-lg hover:${d.glow} cursor-pointer`}
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center mx-auto mb-4`}
              >
                <Icon className={`w-7 h-7 ${d.text}`} />
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-1">
                {d.label}
              </h3>
              <p className="text-muted-foreground text-sm mb-2">
                {d.description}
              </p>
              <span className="text-xs font-mono text-primary/70">{d.cells}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}