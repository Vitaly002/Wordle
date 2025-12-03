"use client";
import Keyboard from "./components/keyboard";
import Board from "./components/board";
import Toast from "./components/toast";
import Dialog from "./components/dialog";
import { useWordle } from "./hooks/useWordle";
import { useEffect } from "react";

export default function WordlePage() {
  const {
    guesses,
    scores,
    currentGuess,
    shakeRow,
    toast,
    status,
    onKey,
    resetGame,
    keyboardColors,
    onRowFlipEnd,
  } = useWordle();

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (status !== "playing") {
        return;
      }

      if (e.key === "Enter") {
        onKey("ENTER");
      } else if (e.key === "Backspace") {
        onKey("DEL");
      } else {
        onKey(e.key.toUpperCase());
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onKey, status]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">WORDLE</h1>

      <Board
        guesses={guesses}
        scores={scores}
        currentGuess={currentGuess}
        shakeRow={shakeRow}
        onRowFlipEnd={onRowFlipEnd}
      />

      <Keyboard onKey={onKey} keyboardColors={keyboardColors} />

      <Toast message={toast} />

      <Dialog
        show={status === "win"}
        title="🎉 Correct Word!"
        onClose={resetGame}
      >
        <p className="text-lg">You solved it!</p>
      </Dialog>

      <Dialog show={status === "lose"} title="😢 Game Over" onClose={resetGame}>
        <p className="text-lg">Try again!</p>
      </Dialog>
    </div>
  );
}
