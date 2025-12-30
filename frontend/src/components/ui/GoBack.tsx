import { useNavigate } from "react-router-dom";

export default function GoBack() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="text-sm text-gray-600 mb-4 cursor-pointer"
    >
      ← <span className="hover:underline">Go back</span> 
    </button>
  );
}
