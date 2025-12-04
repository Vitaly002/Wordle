import { KEYS } from "@/data/keys";
import clsx from "clsx";

export default function Keyboard({
  onKey,
  keyboardColors,
}: Readonly<{
  onKey: (k: string) => void;
  keyboardColors: Record<string, string>;
}>) {
  return (
    <div className="w-full">
      {KEYS.map((row) => (
        <div key={row.join("")} className="flex justify-center gap-2 mb-2">
          {row.map((key) => {
            const color = keyboardColors[key] ?? "";

            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                className={clsx(
                  "tile key-tile font-semibold cursor-pointer",
                  (key === "ENTER" || key === "DEL") && "key-wide",
                  color
                )}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
