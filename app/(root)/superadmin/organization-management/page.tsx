"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  Pause,
  Trash2,
  Play,
  Users,
  Building,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  getAllOrganizations,
  updateOrganizationStatus,
  deleteOrganization,
} from "@/actions/organization.actions";
import Image from "next/image";

// 1. Tipe data untuk organisasi dibuat lebih lengkap dan jelas
type Organization = {
  _id: string;
  organizationName: string;
  responsiblePerson: string;
  adminEmail: string;
  imageUrl: string;
  origin: string;
  memberCount: number;
  status: "active" | "inactive" | "pending";
  createdAt: string; // Menggunakan string untuk ISO date
};

const OrganizationsManagement = () => {
  // 2. Memberikan tipe data yang jelas pada state
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"suspend" | "delete" | "">("");
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 3. Debounce untuk pencarian agar tidak memanggil API setiap kali mengetik
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset ke halaman pertama saat pencarian berubah
    }, 500); // Delay 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // 4. Fetch data dari API, sekarang juga mengirimkan filter status dan debounced search
  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllOrganizations({
        query: debouncedSearchTerm,
        status: statusFilter === "all" ? undefined : statusFilter,
        limit: 10,
        page: currentPage,
      });

      if (result && result.data) {
        setOrganizations(result.data);
        setTotalPages(result.totalPages || 1);
      } else {
        setOrganizations([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setOrganizations([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, currentPage, statusFilter]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  // 5. Memberikan tipe data 'Organization' pada parameter 'org'
  const handleViewDetail = (org: Organization) => {
    window.open(
      `/superadmin/organization-management/detail/${org._id}`,
      "_blank"
    );
  };

  const handleSuspend = (org: Organization) => {
    setSelectedOrg(org);
    setModalType("suspend");
    setShowModal(true);
  };

  const handleDelete = (org: Organization) => {
    setSelectedOrg(org);
    setModalType("delete");
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedOrg) return;

    setActionLoading(true);
    try {
      if (modalType === "suspend") {
        const newStatus =
          selectedOrg.status === "active" ? "inactive" : "active";
        await updateOrganizationStatus(selectedOrg._id, newStatus);
        // Memanggil fetchOrganizations lagi untuk data yang paling update dari server
        await fetchOrganizations();
      } else if (modalType === "delete") {
        await deleteOrganization(selectedOrg._id);
        await fetchOrganizations();
      }

      setShowModal(false);
      setSelectedOrg(null);
    } catch (error) {
      console.error("Error performing action:", error);
      alert("Failed to perform action. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: Organization["status"]) => {
    const badges = {
      active: {
        className: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
        label: "Active",
      },
      inactive: {
        className: "bg-red-100 text-red-800",
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
        label: "Inactive",
      },
      pending: {
        className: "bg-yellow-100 text-yellow-800",
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
        label: "Pending",
      },
    };
    const badge = badges[status] || {
      className: "bg-gray-100 text-gray-800",
      icon: null,
      label: "Unknown",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
      >
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading && organizations.length === 0) {
    return (
      <div className="bg-white shadow-md shadow-black/10 px-5 py-3 rounded-lg w-full min-h-[350px] h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading organizations...</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md shadow-black/10 px-5 py-3 rounded-lg w-full min-h-[350px] h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header and Filters */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Organizations Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage approved organizations, their status and members.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, admin, or origin..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Organizations Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {organizations.map(
                  (
                    org: Organization 
                  ) => (
                    <tr key={org._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Image
                            className="h-10 w-10 rounded-full mr-4 object-cover ring-2 ring-gray-100"
                            src={org.imageUrl || "/images/default-org.png"}
                            alt={org.organizationName}
                            width={40}
                            height={40}
                            // Fallback jika image error
                            onError={(e) => {
                              e.currentTarget.src = `https://placehold.co/40x40/E2E8F0/4A5568?text=${org.organizationName.charAt(
                                0
                              )}`;
                            }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {org.organizationName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {org.origin}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {org.responsiblePerson}
                          </div>
                          <div className="text-sm text-gray-500">
                            {org.adminEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Users className="w-4 h-4 mr-1 text-gray-400" />
                          {org.memberCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(org.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(org.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetail(org)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSuspend(org)}
                            className={`p-1 rounded ${
                              org.status === "active"
                                ? "text-orange-600 hover:text-orange-900 hover:bg-orange-50"
                                : "text-green-600 hover:text-green-900 hover:bg-green-50"
                            }`}
                            title={
                              org.status === "active" ? "Suspend" : "Activate"
                            }
                            disabled={actionLoading}
                          >
                            {org.status === "active" ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(org)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete"
                            disabled={actionLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {organizations.length === 0 && !loading && (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No organizations found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6">
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Modal Kustom (bukan dari shadcn) */}
      {showModal && selectedOrg && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300">
            <div className="p-6">
              <h3
                className={`text-lg font-bold ${
                  modalType === "delete" ? "text-red-600" : "text-gray-900"
                }`}
              >
                {modalType === "delete"
                  ? "Delete Organization"
                  : selectedOrg.status === "active"
                  ? "Suspend Organization"
                  : "Activate Organization"}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {modalType === "delete"
                  ? `Are you sure you want to permanently delete "${selectedOrg.organizationName}"? This action cannot be undone.`
                  : `Are you sure you want to ${
                      selectedOrg.status === "active" ? "suspend" : "activate"
                    } "${selectedOrg.organizationName}"?`}
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setShowModal(false)}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center ${
                  modalType === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : selectedOrg.status === "active"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-green-600 hover:bg-green-700"
                } ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {actionLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : null}
                {actionLoading
                  ? "Processing..."
                  : modalType === "delete"
                  ? "Delete"
                  : selectedOrg.status === "active"
                  ? "Suspend"
                  : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationsManagement;
