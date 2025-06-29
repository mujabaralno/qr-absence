"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Button } from "../ui/button";
import { Trash2, Calendar, Mail, User, Shield, Crown, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteUser } from "@/actions/user.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // atau gunakan toast library yang Anda pakai

type TableAllUserProps = {
  users: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    img: string;
    dateJoined: string;
    role: string;
  }[];
};

const TableAllUser = ({ users }: TableAllUserProps) => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200';
      case 'moderator':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  const handleDeleteUser = async (_id: string, userName: string) => {
    setIsDeleting(_id);
    try {
      await deleteUser(_id);
      toast.success(`${userName} berhasil dihapus dari organisasi`);
      router.refresh(); // Refresh halaman untuk update data
    } catch (error) {
      toast.error("Gagal menghapus user. Silakan coba lagi.");
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada anggota</h3>
        <p className="text-gray-500">Undang anggota pertama untuk memulai.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100">
            <TableHead className="font-semibold text-gray-700 px-6 py-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Anggota
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Bergabung
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Peran
              </div>
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700 pr-6">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow 
              key={index} 
              className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
            >
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={user.img}
                      alt="Profile"
                      width={44}
                      height={44}
                      className="rounded-full ring-2 ring-white shadow-md group-hover:ring-blue-200 transition-all duration-200"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-gray-600 font-medium">
                {new Date(user.dateJoined).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </TableCell>
              <TableCell>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role)}`}>
                  {getRoleIcon(user.role)}
                  {user.role}
                </div>
              </TableCell>
              <TableCell className="text-right pr-6">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 group-hover:shadow-md"
                      disabled={isDeleting === user._id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Anggota</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus <strong>{user.firstName} {user.lastName}</strong> dari organisasi? 
                        Tindakan ini tidak dapat dibatalkan dan user akan kehilangan akses ke organisasi.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleting === user._id}
                      >
                        {isDeleting === user._id ? "Menghapus..." : "Hapus"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableAllUser;