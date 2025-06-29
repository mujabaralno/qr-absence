"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import dynamic from 'next/dynamic';
import { Input } from "@/components/ui/input";
import { attendanceSessionFormSchema } from "@/lib/validator";
import * as z from "zod";
import { AttendancSessionDefaultValues } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import {
  createAttendanceSession,
  updateAttendaceSession,
} from "@/actions/attendanceSession";
import { Calendar, MapPin, Clock, FileText, Users, Loader2 } from "lucide-react";
import { IAttendanceSession } from "@/lib/database/models/attendanceSession.model";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { getAddressFromCoords } from "@/utils/geolocation";

type AttendanceFormCreateProps = {
  userId: string;
  organizationId: string;
  attendance?: IAttendanceSession;
  attendanceId?: string;
  type: "Create" | "Update";
};

const DynamicLocationPicker = dynamic(
  () => import('./LocationPicker'),
  { ssr: false }
);

const FormAttendanceSession = ({
  userId,
  organizationId,
  type,
  attendance,
  attendanceId,
}: AttendanceFormCreateProps) => {
  const initialValues =
    attendance && type === "Update"
      ? {
          ...attendance,
          startTime: new Date(attendance.startTime),
          endTime: new Date(attendance.endTime),
        }
      : AttendancSessionDefaultValues;

  const form = useForm<z.infer<typeof attendanceSessionFormSchema>>({
    resolver: zodResolver(attendanceSessionFormSchema),
    defaultValues: initialValues,
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof attendanceSessionFormSchema>) {
    if (type === "Create") {
      try {
        const newAttendance = await createAttendanceSession({
          attendance: { ...values },
          userId,
          organizationId,
          path: "/admin/all-session",
        });

        if (newAttendance) {
          form.reset();
          router.push(`/admin/all-session/${newAttendance._id}`);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error dalam membuat sesi");
      }
    }

    if (type === "Update") {
      try {
        const updatedAttendance = await updateAttendaceSession({
          userId,
          organizationId,
          attendance: { ...values, _id: attendanceId },
          path: `/admin/all-session/update/${attendanceId}`,
        });

        if (updatedAttendance) {
          form.reset();
          router.push(`/admin/all-session/${updatedAttendance._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Session Name */}
        <div className="space-y-2">
          <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Session Name
          </Label>
          <FormField
            control={form.control}
            name="sessionName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter meeting title (e.g., Weekly Team Meeting)"
                      {...field}
                      className="pl-4 pr-12 py-5 text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-3 h-3 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Meeting Location
          </Label>
          <FormField
            control={form.control}
            name="locationMeeting"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-4">
                      <DynamicLocationPicker
                        onLocationSelect={async (lat, lng) => {
                          const address = await getAddressFromCoords(lat, lng);
                          field.onChange({
                            address,
                            lat,
                            lng,
                          });
                        }}
                      />
                    </div>
                    <div className="relative">
                      <Input
                        readOnly
                        value={field.value?.address ?? ""}
                        placeholder="Location will appear here after selection"
                        className="pl-4 pr-12 py-5 text-base border-2 border-gray-200 rounded-xl bg-gray-50"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-3 h-3 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Time Picker */}
        <div className="space-y-2">
          <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Session Time
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-purple-900 mb-1">Start Time</p>
                          <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            timeInputLabel="Time:"
                            dateFormat="MM/dd/yyyy h:mm aa"
                            className="w-full bg-transparent border-none text-purple-800 font-medium focus:outline-none"
                            placeholderText="Select start time"
                          />
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative bg-gradient-to-r from-pink-50 to-orange-50 border-2 border-pink-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-pink-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-pink-900 mb-1">End Time</p>
                          <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            timeInputLabel="Time:"
                            dateFormat="MM/dd/yyyy h:mm aa"
                            className="w-full bg-transparent border-none text-pink-800 font-medium focus:outline-none"
                            placeholderText="Select end time"
                          />
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Description
          </Label>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Add meeting description, agenda, or any additional notes..."
                      {...field}
                      className="min-h-32 text-base border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <FileText className="w-3 h-3 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="w-full py-6 text-lg font-semibold bg-[#25388C] hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Session...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{type} Attendance Session</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormAttendanceSession;