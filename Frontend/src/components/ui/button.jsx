export function Button({ children, onClick, variant }) {
  let className = "px-4 py-2 rounded shadow bg-blue-600 text-white font-semibold hover:bg-blue-700";
  if (variant === "outline") className = "px-4 py-2 rounded border border-blue-500 text-blue-600 font-semibold bg-white";
  if (variant === "secondary") className = "px-4 py-2 rounded shadow bg-green-600 text-white font-semibold hover:bg-green-700";
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}