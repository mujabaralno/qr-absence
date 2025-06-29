"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const InviteUser = () => {
  const { id: organizationId } = useParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!organizationId) {
      setError("ID organisasi tidak ditemukan.");
    }
  }, [organizationId]);

  const inviteUser = async (email: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (!organizationId) {
      setError("Organisasi ID tidak ditemukan");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/inviteUser/${organizationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        toast.success("Email berhasil terkirim")
      } else {
        setError(data.error ?? "Terjadi kesalahan");
        toast.error("Terjadi kesalahan pada server ");
      }
    } catch (err: unknown) {
      console.error("Error caught during fetch:", err);
      toast.error("Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      inviteUser(email);
    } else {
      setError("Alamat email wajib diisi!");
    }
  };

  return (
    <div className="w-full">
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <label htmlFor="email" className="block">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Email Admin"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full p-2 bg-[#25388C] text-white rounded-md ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Mengirim..." : "Undang Admin"}
        </button>
      </form>
    </div>
  );
};

export default InviteUser;
