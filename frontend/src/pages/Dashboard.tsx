import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600">No user data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Dashboard
        </h2>

        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-medium">Name:</span>{" "}
            {user.fullName}
          </p>
          <p>
            <span className="font-medium">Email:</span>{" "}
            {user.email}
          </p>
          <p>
            <span className="font-medium">Role:</span>{" "}
            {user.role}
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Link
            to="/profile"
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Profile
          </Link>

          {user.role === "ADMIN" && (
            <Link
              to="/admin"
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            >
              Admin
            </Link>
          )}
        </div>

        <button
          onClick={logout}
          className="mt-8 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
