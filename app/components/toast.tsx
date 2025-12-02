export default function Toast({
  message,
}: Readonly<{ message: string | null }>) {
  if (!message) return null;

  return (
    <div
      className="
        fixed top-4 left-1/2 -translate-x-1/2
        bg-red-600 text-white px-4 py-2 rounded-md
        text-lg shadow-lg
        z-50
      "
    >
      {message}
    </div>
  );
}
