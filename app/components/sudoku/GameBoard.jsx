import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

export default function GameBoard({
  board,
  initialBoard,
  selectedCell,
  onCellClick,
  errors,
  hintCell,
  isPaused,
}) {
  const errorSet = new Set(errors.map(([r, c]) => `${r}-${c}`));
  const selectedNum = selectedCell ? board[selectedCell[0]]?.[selectedCell[1]] : null;

  const isInSameGroup = (r, c) => {
    if (!selectedCell) return false;
    const [sr, sc] = selectedCell;
    return (
      r === sr ||
      c === sc ||
      (Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3))
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-lg mx-auto aspect-square"
    >
      {isPaused && (
        <div className="absolute inset-0 z-10 bg-card/90 backdrop-blur-md rounded-2xl flex items-center justify-center">
          <p className="font-heading text-2xl text-muted-foreground">Paused</p>
        </div>
      )}

      <div className="grid grid-cols-9 gap-0 rounded-2xl overflow-hidden border-2 border-primary/40 shadow-xl shadow-primary/10">
        {board.map((row, r) =>
          row.map((val, c) => {
            const isInitial = initialBoard[r][c] !== 0;
            const isSelected = selectedCell && selectedCell[0] === r && selectedCell[1] === c;
            const isError = errorSet.has(`${r}-${c}`);
            const isHint = hintCell && hintCell.row === r && hintCell.col === c;
            const isSameNum = selectedNum && val === selectedNum && val !== 0;
            const isHighlighted = isInSameGroup(r, c);

            const borderRight = c % 3 === 2 && c !== 8 ? "border-r-2 border-r-primary/30" : "border-r border-r-border/50";
            const borderBottom = r % 3 === 2 && r !== 8 ? "border-b-2 border-b-primary/30" : "border-b border-b-border/50";

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => onCellClick(r, c)}
                className={cn(
                  "relative aspect-square flex items-center justify-center font-mono text-base sm:text-lg md:text-xl transition-all duration-150",
                  borderRight,
                  borderBottom,
                  isSelected
                    ? "bg-primary/25 z-2"
                    : isHighlighted
                    ? "bg-secondary/60"
                    : "bg-card",
                  isSameNum && !isSelected && "bg-primary/10",
                  isError && "bg-destructive/20",
                  isHint && "bg-accent/25",
                  !isInitial && !isSelected && "hover:bg-secondary"
                )}
              >
                {val !== 0 && (
                  <motion.span
                    key={`${r}-${c}-${val}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                      "font-semibold select-none",
                      isInitial
                        ? "text-foreground"
                        : isError
                        ? "text-red-500"
                        : isHint
                        ? "text-accent"
                        : "text-green-500"
                    )}
                  >
                    {val}
                  </motion.span>
                )}
              </button>
            );
          })
        )}
      </div>
    </motion.div>
  );
}