"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { generatePuzzle, checkBoard, getErrors, getHint } from "@/app/lib/sudoku";
import DifficultySelect from "@/app/components/sudoku/DifficultySelect";
import GameHeader from "@/app/components/sudoku/GameHeader";
import GameBoard from "@/app/components/sudoku/GameBoard";
import NumberPad from "@/app/components/sudoku/NumberPad";
import WinModal from "@/app/components/sudoku/WinModal";
import { toast } from "sonner";

export default function Game() {
  const [screen, setScreen] = useState("menu"); // menu | playing | won
  const [difficulty, setDifficulty] = useState("medium");
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [errors, setErrors] = useState([]);
  const [hintCell, setHintCell] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [history, setHistory] = useState([]);
  const timerRef = useRef(null);

  const startGame = useCallback((diff) => {
    const { puzzle, solution: sol } = generatePuzzle(diff);
    setDifficulty(diff);
    setBoard(puzzle.map((r) => [...r]));
    setInitialBoard(puzzle.map((r) => [...r]));
    setSolution(sol);
    setSelectedCell(null);
    setErrors([]);
    setHintCell(null);
    setMistakes(0);
    setHintsLeft(3);
    setTime(0);
    setIsPaused(false);
    setHistory([]);
    setScreen("playing");
  }, []);

  // Timer
  useEffect(() => {
    if (screen === "playing" && !isPaused) {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, isPaused]);

  // Keyboard input
  useEffect(() => {
    const handler = (e) => {
      if (screen !== "playing" || isPaused || !selectedCell) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) handleNumber(num);
      if (e.key === "Backspace" || e.key === "Delete") handleErase();
      if (e.key === "ArrowUp" && selectedCell[0] > 0) setSelectedCell([selectedCell[0] - 1, selectedCell[1]]);
      if (e.key === "ArrowDown" && selectedCell[0] < 8) setSelectedCell([selectedCell[0] + 1, selectedCell[1]]);
      if (e.key === "ArrowLeft" && selectedCell[1] > 0) setSelectedCell([selectedCell[0], selectedCell[1] - 1]);
      if (e.key === "ArrowRight" && selectedCell[1] < 8) setSelectedCell([selectedCell[0], selectedCell[1] + 1]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, isPaused, selectedCell, board]);

  const handleNumber = (num) => {
    if (!selectedCell || isPaused) return;
    const [r, c] = selectedCell;
    if (initialBoard[r][c] !== 0) return;
    if (board[r][c] === solution[r][c] && board[r][c] !== 0) return;

    setHistory((prev) => [...prev, { row: r, col: c, prevVal: board[r][c] }]);

    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = num;
    setBoard(newBoard);
    setHintCell(null);

    // Check if wrong
    if (num !== solution[r][c]) {
      setMistakes((m) => {
        const next = m + 1;
        if (next >= 3) {
          toast.error("Too many mistakes! Try again.");
          setTimeout(() => startGame(difficulty), 1200);
        }
        return next;
      });
      setErrors((prev) => [...prev, [r, c]]);
    } else {
      setErrors((prev) => prev.filter(([er, ec]) => !(er === r && ec === c)));
      // Check win
      if (checkBoard(newBoard, solution)) {
        clearInterval(timerRef.current);
        setScreen("won");
      }
    }
  };

  const handleErase = () => {
    if (!selectedCell || isPaused) return;
    const [r, c] = selectedCell;
    if (initialBoard[r][c] !== 0) return;
    if (board[r][c] === solution[r][c] && board[r][c] !== 0) return;

    setHistory((prev) => [...prev, { row: r, col: c, prevVal: board[r][c] }]);

    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = 0;
    setBoard(newBoard);
    setErrors((prev) => prev.filter(([er, ec]) => !(er === r && ec === c)));
  };

  const handleUndo = () => {
    if (history.length === 0 || isPaused) return;
    const last = history[history.length - 1];
    const newBoard = board.map((row) => [...row]);
    newBoard[last.row][last.col] = last.prevVal;
    setBoard(newBoard);
    setHistory((prev) => prev.slice(0, -1));

    // Recalculate errors
    const newErrors = getErrors(newBoard, solution);
    setErrors(newErrors);
  };

  const handleHint = () => {
    if (hintsLeft <= 0 || isPaused) return;
    const hint = getHint(board, solution);
    if (!hint) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[hint.row][hint.col] = hint.value;
    setBoard(newBoard);
    setHintCell(hint);
    setHintsLeft((h) => h - 1);
    setErrors((prev) => prev.filter(([er, ec]) => !(er === hint.row && ec === hint.col)));

    setTimeout(() => setHintCell(null), 2000);

    if (checkBoard(newBoard, solution)) {
      clearInterval(timerRef.current);
      setScreen("won");
    }
  };

  const handleValidate = () => {
    if (isPaused) return;
    const errs = getErrors(board, solution);
    setErrors(errs);
    if (errs.length === 0) {
      toast.success("Looking good! No errors found.");
    } else {
      toast.error(`Found ${errs.length} error${errs.length > 1 ? "s" : ""}`);
    }
  };

  if (screen === "menu") {
    return <DifficultySelect onSelect={startGame  } />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6">
      <GameHeader
        difficulty={difficulty}
        time={time}
        mistakes={mistakes}
        hintsLeft={hintsLeft}
        isPaused={isPaused}
        onPause={() => setIsPaused(!isPaused)}
        onHint={handleHint}
        onValidate={handleValidate}
        onUndo={handleUndo}
        onRestart={() => startGame(difficulty)}
        onBack={() => setScreen("menu")}
      />

      <GameBoard
        board={board}
        initialBoard={initialBoard}
        solution={solution}
        selectedCell={selectedCell}
        onCellClick={(r, c) => setSelectedCell([r, c])}
        errors={errors}
        hintCell={hintCell}
        isPaused={isPaused}
      />

      <NumberPad
        onNumber={handleNumber}
        onErase={handleErase}
        board={board}
        selectedCell={selectedCell}
      />

      <WinModal
        isOpen={screen === "won"}
        time={time}
        difficulty={difficulty}
        mistakes={mistakes}
        onNewGame={() => startGame(difficulty)}
        onBack={() => setScreen("menu")}
      />
    </div>
  );
}