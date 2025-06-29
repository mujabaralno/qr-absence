"use client";
import React, { useState, useEffect } from "react";
import {
  getAllMailRequests,
  deleteMailRequest,
} from "@/actions/mailRequest.action";
import { usePathname, useRouter } from "next/navigation";
import { Building, CheckCheckIcon, Mailbox } from "lucide-react";
import Image from "next/image";

interface MailRequest {
  _id: string;
  organizationName: string;
  responsiblePerson: string;
  adminEmail: string;
  email?: string; // ✅ Add this as optional fallback
  origin: string;
  description: string;
  subjectMail: string;
  organizationPhoto?: string;
  approved: boolean;
  organizationCreated?: boolean;
  createdAt: string;
}

const OrganizationRequestPage = () => {
  const [selectedRequest, setSelectedRequest] = useState<MailRequest | null>(
    null
  );
  const [requests, setRequests] = useState<MailRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const pathname = usePathname();
  const router = useRouter();

  // Fetch data from database
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getAllMailRequests();
        setRequests(data || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter requests based on status
  const filteredRequests = requests.filter((request) => {
    if (filter === "all") return true;
    if (filter === "pending") return !request.approved;
    if (filter === "approved") return request.approved;
    return true;
  });

  const getStatusBadge = (request: MailRequest) => {
    if (request.organizationCreated) {
      return "bg-purple-100 text-purple-800 border-purple-200";
    }
    return request.approved
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getStatusIcon = (request: MailRequest) => {
    if (request.organizationCreated) return "🏢";
    return request.approved ? <CheckCheckIcon /> : "⏳";
  };

  const getStatusText = (request: MailRequest) => {
    if (request.organizationCreated) return "ORGANIZATION CREATED";
    return request.approved ? "APPROVED" : "PENDING";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 hari yang lalu";
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} minggu yang lalu`;
    return date.toLocaleDateString("id-ID");
  };

  const handleApproveAndCreateOrganization = async (request: MailRequest) => {
    try {
      const encodedData = encodeURIComponent(
        JSON.stringify({
          organizationName: request.organizationName,
          responsiblePerson: request.responsiblePerson,
          adminEmail: request.adminEmail || request.email,
          origin: request.origin,
          description: request.description,
          imageUrl: request.organizationPhoto || "",
        })
      );

      // Navigate to create organization page dengan data + requestId
      router.push(
        `/superadmin/organization-request/create-organization?data=${encodedData}&requestId=${request._id}`
      );
    } catch (error) {
      console.error("Error preparing organization creation:", error);
      alert("Failed to prepare organization creation");
    }
  };

  const handleReject = async (mailId: string) => {
    try {
      const confirmDelete = confirm(
        "Are you sure you want to reject and delete this request?"
      );
      if (!confirmDelete) return;

      await deleteMailRequest({
        mailId,
        path: pathname,
      });

      // Remove from local state
      setRequests((prev) => prev.filter((req) => req._id !== mailId));

      // Close detail view if this request was selected
      if (selectedRequest && selectedRequest._id === mailId) {
        setSelectedRequest(null);
      }

      alert("Organization request rejected and deleted successfully!");
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request");
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="bg-white shadow-md shadow-black/10 px-5 py-3 rounded-lg w-full min-h-[350px] h-full">
        <h1 className="h5-bold text-center sm:text-left mb-5">
          Organization Requests
        </h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading requests...</span>
        </div>
      </section>
    );
  }

  // Detail view
  if (selectedRequest) {
    return (
      <section className="bg-white shadow-md shadow-black/10 px-5 py-3 rounded-lg w-full min-h-[350px] h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setSelectedRequest(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Kembali ke List
          </button>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(
              selectedRequest
            )}`}
          >
            {getStatusText(selectedRequest)}
          </span>
        </div>

        {/* Detail Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedRequest.organizationName}
            </h1>
            <p className="text-gray-600">
              Diajukan {formatDate(selectedRequest.createdAt)}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Informasi Kontak
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p>
                    <span className="font-medium">Penanggung Jawab:</span>{" "}
                    {selectedRequest.responsiblePerson}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedRequest.adminEmail || selectedRequest.email}
                  </p>
                  <p>
                    <span className="font-medium">Asal:</span>{" "}
                    {selectedRequest.origin}
                  </p>
                  <p>
                    <span className="font-medium">Subject:</span>{" "}
                    {selectedRequest.subjectMail}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Logo Organisasi
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {selectedRequest.organizationPhoto ? (
                    <Image
                      src={selectedRequest.organizationPhoto}
                      alt={`Logo ${selectedRequest.organizationName}`}
                      width={80}
                      height={80}
                      className="w-32 h-32 object-contain mx-auto rounded-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mx-auto rounded-lg">
                      <span className="text-gray-500">No Logo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Deskripsi</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {selectedRequest.description}
              </p>
            </div>
          </div>
          {/* Action Buttons */}

          <div className="flex gap-3 pt-4 border-t">
            {selectedRequest.approved && (
              <div className="bg-purple-100 text-purple-800 px-6 py-2 rounded-lg font-medium border border-purple-200">
                🏢 Organization Already Created
              </div>
            )}

            {!selectedRequest.approved &&
              !selectedRequest.organizationCreated && (
                <>
                  <button
                    onClick={() =>
                      handleApproveAndCreateOrganization(selectedRequest)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    ✅ Approve & Create Organization
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    ❌ Reject & Delete
                  </button>
                </>
              )}
          </div>
        </div>
      </section>
    );
  }

  // List view
  return (
    <>
      <section className="relative  overflow-hidden">
        <div className="relative">
          <div className="flex gap-5">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#25388C] rounded-full shadow-lg">
              <Building className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Organization Request
              </h1>
              <p className="text-gray-600 mt-2">
                Kelola anggota organisasi dengan mudah
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white shadow-2xl my-6 shadow-black/10 px-5 py-6 rounded-lg w-full min-h-[350px] h-full">
        {/* Filter Tabs */}
        <div className="flex gap-1 mb-4 bg-[#F8F8FF] p-1 rounded-lg w-fit">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === "pending"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Pending ({requests.filter((r) => !r.approved).length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === "approved"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Approved ({requests.filter((r) => r.approved).length})
          </button>
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              onClick={() => setSelectedRequest(request)}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl">{getStatusIcon(request)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                        {request.organizationName}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                          request
                        )}`}
                      >
                        {getStatusText(request)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span>📅 {formatDate(request.createdAt)}</span>
                      <span>
                        👤 {request.responsiblePerson} ({request.email})
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-2">
                      📝 &quot;
                      {request.description.length > 100
                        ? request.description.substring(0, 100) + "..."
                        : request.description}
                      &quot;
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      📍 {request.origin}
                    </p>
                  </div>
                </div>
                <div className="text-blue-600 ml-4">→</div>
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="flex justify-center items-center">
              <Mailbox size={40} color="#6e11b0"/>
            </div>
            <p>
              {filter === "all"
                ? "Belum ada organization requests"
                : `Belum ada ${filter} requests`}
            </p>
          </div>
        )}
      </section>
    </>
  );
};

export default OrganizationRequestPage;
