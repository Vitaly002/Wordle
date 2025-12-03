export default function Dialog({
  show,
  title,
  children,
  onClose,
}: Readonly<{
  show: boolean;
  title: string;
  children?: React.ReactNode;
  onClose: () => void;
}>) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pb-32 bg-black/50 backdrop-blur-[2px]">
      <div
        className="
          w-[90%] max-w-sm
          bg-white dark:bg-neutral-900 
          text-black dark:text-neutral-100
          p-6 rounded-2xl shadow-2xl
          flex flex-col items-center gap-4
        "
      >
        <h2 className="text-2xl font-bold">{title}</h2>

        {children}

        <button
          onClick={onClose}
          className="
            w-full py-2.5 rounded-md font-semibold
            bg-green-600 hover:bg-green-700 
            dark:bg-green-500 dark:hover:bg-green-600
            text-white transition cursor-pointer
          "
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
