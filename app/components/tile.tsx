import clsx from "clsx";

type TileProps = Readonly<{
  char: string;
  score: number;
  action: "pop" | "flip" | "shake" | null;
  active: boolean;
  revealed: boolean;
}>;

function getColorClass(score: number | undefined, revealed: boolean) {
  if (!revealed) return "";
  if (score === 2) return "tile-green";
  if (score === 1) return "tile-yellow";
  if (score === 0) return "tile-gray";
  return "";
}

export default function Tile({
  char,
  score,
  action,
  active,
  revealed,
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
    >
      {char}
    </div>
  );
}
