type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
};

export default function Toast({ message, type = "info" }: ToastProps) {
  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
    <div
      className={`${colors[type]} text-white px-4 py-2 rounded-md shadow fixed top-4 right-4 z-50`}
    >
      {message}
    </div>
  );
}
