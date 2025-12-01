import { MAX_GUESS } from "@/hooks/useWordle";
import Tile from "./tile";

type BoardProps = Readonly<{
  guesses: string[];
  scores: number[][];
  currentGuess: string;
}>;

export default function Board({ guesses, scores, currentGuess }: BoardProps) {
  const rows = [
    ...guesses,
    ...(guesses.length < MAX_GUESS ? [currentGuess] : []),
    ...Array(Math.max(0, MAX_GUESS - guesses.length - 1)).fill(""),
  ];

  return (
    <div className="grid gap-2 justify-items-center">
      {rows.map((row, rowIndex) => {
        const letters: string[] = row.padEnd(5).split("");

        return (
          <div key={rowIndex} className="flex gap-2">
            {letters.map((char, tileIndex) => (
              <Tile key={tileIndex} char={char} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
