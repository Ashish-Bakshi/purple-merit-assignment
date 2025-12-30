import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import Spinner from "../components/ui/Spinner";
import Toast from "../components/ui/Toast";
import Modal from "../components/ui/Modal";
import GoBack from "../components/ui/GoBack";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
};

export default function AdminUsers() {
  const { user, loading } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  function showToast(message: string, type: "success" | "error" | "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchUsers() {
    try {
      setFetching(true);
      const res = await api.get(`/admin/users?page=${page}`);
      setUsers(res.data.data);
    } catch {
      showToast("Failed to fetch users", "error");
    } finally {
      setFetching(false);
    }
  }

  async function confirmToggle() {
    if (!selectedUser) return;

    try {
      await api.patch(
        `/admin/users/${selectedUser.id}/${
          selectedUser.status === "ACTIVE" ? "deactivate" : "activate"
        }`
      );
      showToast("User status updated", "success");
      setSelectedUser(null);
      fetchUsers();
    } catch {
      showToast("Action failed", "error");
    }
  }

  useEffect(() => {
    if (!loading && user?.role === "ADMIN") {
      fetchUsers();
    }
  }, [loading, user, page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Spinner />
      </div>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600">Access denied</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {selectedUser && (
        <Modal
          title="Confirm Action"
          description={`Are you sure you want to ${
            selectedUser.status === "ACTIVE" ? "deactivate" : "activate"
          } this user?`}
          onConfirm={confirmToggle}
          onClose={() => setSelectedUser(null)}
        />
      )}

      <div className="w-full max-w-6xl bg-white rounded-lg shadow p-8">
        <GoBack />
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Admin Users
        </h2>

        {fetching ? (
          <Spinner />
        ) : users.length === 0 ? (
          <p className="text-center text-gray-600">No users found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Email</th>
                    <th className="p-3 border">Role</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{u.fullName}</td>
                      <td className="p-3 border">{u.email}</td>
                      <td className="p-3 border">{u.role}</td>
                      <td className="p-3 border">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            u.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3 border text-center">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className={`px-3 py-1 rounded text-white cursor-pointer ${
                            u.status === "ACTIVE"
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {u.status === "ACTIVE"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 bg-gray-200 rounded cursor-pointer"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
