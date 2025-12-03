import { getScoreBasedColor } from "@/lib/color";
import clsx from "clsx";

type TileProps = Readonly<{
  char: string;
  score: number;
  action: "pop" | "flip" | "shake" | null;
  active: boolean;
  revealed: boolean;
  onFlipEnd?: () => void;
}>;

function getColorClass(score: number | undefined, revealed: boolean) {
  if (!revealed) {
    return "";
  }
  return getScoreBasedColor(score);
}

export default function Tile({
  char,
  score,
  action,
  active,
  revealed,
  onFlipEnd,
}: TileProps) {
  const colorClass = getColorClass(score, revealed);

  return (
    <div
      className={clsx(
        "tile flex items-center justify-center rounded font-bold select-none",
        action,
        colorClass,
        { active, revealed }
      )}
      onAnimationEnd={() => {
        if (action === "flip") {
          onFlipEnd?.();
        }
      }}
    >
      {char}
    </div>
  );
}
