import { motion } from "framer-motion";
import { Eraser } from "lucide-react";
import { cn } from "@/app/lib/utils";

export default function NumberPad({ onNumber, onErase, board, selectedCell, notes, noteMode }) {
  // Count how many of each number are on the board
  const counts = {};
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (v !== 0) counts[v] = (counts[v] || 0) + 1;
    }
  }

  const selectedNum = selectedCell ? board[selectedCell[0]]?.[selectedCell[1]] : null;
  const selectedNotes = selectedCell ? notes?.[selectedCell[0]]?.[selectedCell[1]] || [] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-lg mx-auto mt-5"
    >
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const isComplete = (counts[num] || 0) >= 9;
          const isActive = noteMode ? selectedNotes.includes(num) : selectedNum === num;
          return (
            <motion.button
              key={num}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNumber(num)}
              disabled={isComplete}
              className={cn(
                "relative h-12 sm:h-14 rounded-xl font-mono text-xl font-bold transition-all duration-200 border border-border/50",
                isComplete
                  ? "bg-secondary/50 text-muted-foreground/30 cursor-not-allowed"
                  : isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-secondary text-foreground hover:bg-primary/20 hover:text-primary active:bg-primary/30"
              )}
            >
              {num}
              {!isComplete && (
                <span className="absolute bottom-1 right-2 text-[10px] text-muted-foreground font-normal">
                  {9 - (counts[num] || 0)}
                </span>
              )}
            </motion.button>
          );
        })}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onErase}
          className="h-12 sm:h-14 rounded-xl bg-secondary text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all duration-200 flex items-center justify-center border border-border/50"
        >
          <Eraser className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}