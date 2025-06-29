"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Send, Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const InviteUser = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inviteUser = async (email: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/inviteUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setEmail(""); // Clear email after success
        toast.success("Email undangan berhasil terkirim! 🎉");
      } else {
        setError(data.error ?? "Terjadi kesalahan");
        toast.error("Gagal mengirim undangan");
      }
    } catch (err: unknown) {
      console.error("Error caught during fetch:", err);
      setError("Terjadi kesalahan pada server");
      toast.error("Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      inviteUser(email.trim());
    } else {
      setError("Alamat email wajib diisi!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 animate-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label 
            htmlFor="email" 
            className="block text-sm font-semibold text-gray-700"
          >
            Email Anggota Baru
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              placeholder="nama@example.com"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#25388C] hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 ${
            loading ? "opacity-75 cursor-not-allowed transform-none" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Mengirim Undangan...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Kirim Undangan
            </>
          )}
        </button>
      </form>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-blue-100 rounded-lg">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 text-sm">Tips Undangan</h4>
            <p className="text-blue-700 text-xs mt-1 leading-relaxed">
              Pastikan email yang dimasukkan valid. Anggota baru akan menerima email undangan untuk bergabung dengan organisasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteUser;