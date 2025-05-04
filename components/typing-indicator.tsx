export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1.5">
      <span
        className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse"
        style={{ animationDelay: "0ms" }}
      ></span>
      <span
        className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse"
        style={{ animationDelay: "300ms" }}
      ></span>
      <span
        className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse"
        style={{ animationDelay: "600ms" }}
      ></span>
    </div>
  )
}
