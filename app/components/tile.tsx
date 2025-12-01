type TileProps = Readonly<{
  char: string;
}>;

export default function Tile({ char }: TileProps) {
  return (
    <div className="tile flex items-center justify-center rounded font-bold select-none">
      {char}
    </div>
  );
}
