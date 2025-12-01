import { KEYS } from "@/data/keys";

export default function Keyboard() {
  return (
    <div className="mt-6">
      {KEYS.map((row) => (
        <div key={row.join("")} className="flex justify-center gap-2">
          {row.map((key) => (
            <button key={key}>{key}</button>
          ))}
        </div>
      ))}
    </div>
  );
}
