import { MAX_GUESS } from "@/hooks/useWordle";
import Tile from "./tile";

type BoardProps = Readonly<{
  guesses: string[];
  scores: number[][];
  currentGuess: string;
  shakeRow: number | null;
}>;

export default function Board({
  guesses,
  scores,
  currentGuess,
  shakeRow,
}: BoardProps) {
  const rows = [
    ...guesses,
    ...(guesses.length < MAX_GUESS ? [currentGuess] : []),
    ...Array(Math.max(0, MAX_GUESS - guesses.length - 1)).fill(""),
  ];

  function getTileAction(rowIndex: number, tileIndex: number) {
    if (shakeRow === rowIndex) {
      return "shake";
    }

    const isCurrentRow = rowIndex === guesses.length;
    const isGuessedRow = rowIndex < guesses.length;

    if (isCurrentRow) {
      return tileIndex < currentGuess.length ? "pop" : null;
    }

    if (isGuessedRow) return "flip";

    return null;
  }

  return (
    <div className="grid gap-2 justify-items-center">
      {rows.map((row, rowIndex) => {
        const letters: string[] = row.padEnd(5).split("");
        const isGuessedRow = rowIndex < guesses.length;

        return (
          <div key={rowIndex} className="row flex gap-2">
            {letters.map((char, tileIndex) => {
              const score = scores[rowIndex]?.[tileIndex];
              const revealed = isGuessedRow && score !== undefined;

              return (
                <Tile
                  key={tileIndex}
                  char={char}
                  score={score}
                  action={getTileAction(rowIndex, tileIndex)}
                  active={
                    rowIndex === guesses.length &&
                    tileIndex < currentGuess.length
                  }
                  revealed={revealed}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
