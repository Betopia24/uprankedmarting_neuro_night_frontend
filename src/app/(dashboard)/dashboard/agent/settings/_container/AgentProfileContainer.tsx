"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getAgentInfo, uploadAgentProfileImage } from "@/app/api/profile-settings/profile-settings";
import ImageUpload from "../../../organization/settings/_container/image-upload";
import { env } from "process";

const AgentProfileContainerPage = () => {
  const auth = useAuth();
  const token = auth?.token;


  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState<string>("");
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchAgentInfo = async () => {
      try {
        const response = await getAgentInfo(token);
        console.log("Agent info:", response);
        if (response.success) {
          setUserData(response.data);
          setBio(response.data.bio || "");
        } else {
          toast.error("Failed to load profile information");
        }
      } catch (error) {
        env.NEXT_PUBLIC_APP_ENV === "development" &&
          console.error("Error fetching agent info:", error);
        toast.error("Failed to load profile information");
      } finally {
        setLoading(false);
      }
    };

    fetchAgentInfo();
  }, [token]);

  const updateBio = async () => {
    if (!token) return;
    try {
      await uploadAgentProfileImage((null as unknown) as File, token, bio);
      toast.success("Bio updated successfully");
      const refreshed = await getAgentInfo(token);
      if (refreshed.success) {
        setUserData(refreshed.data);
        setBio(refreshed.data.bio || "");
      }
      setIsEditingBio(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Bio update failed");
    }
  };


  const handleImageChange = async (file: File | null) => {
    if (!token || !file) return;
    try {
      await uploadAgentProfileImage(file, token, userData?.bio || "");
      toast.success("Image updated successfully");
      const refreshed = await getAgentInfo(token);
      if (refreshed.success) setUserData(refreshed.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Image upload failed");
    }
  };

  if (!token)
    return (
      <p className="text-center text-gray-600 mt-8">
        Please log in to access your profile.
      </p>
    );
  if (loading)
    return <p className="text-center text-gray-600 mt-8">Loading profile...</p>;
  if (!userData)
    return (
      <p className="text-center text-gray-600 mt-8">
        No profile data available.
      </p>
    );

  // Date format helper
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US");
    } catch {
      return dateString;
    }
  };

  // Time format helper
  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <ImageUpload currentImage={userData.image || null} onImageChange={handleImageChange} />
      </div>

      {/* Bio Section */}
      <h1 className="text-2xl font-bold text-black mb-4">Profile Bio</h1>
      <div className="flex flex-col items-start gap-2 mb-4">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          readOnly={!isEditingBio}
          className={`h-16 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent border border-gray-300 ${isEditingBio ? "bg-white" : "bg-gray-100"
            }`}
        />

        {!isEditingBio ? (
          <button
            type="button"
            onClick={() => setIsEditingBio(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
        ) : (
          <button
            type="button"
            onClick={updateBio}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Okay
          </button>
        )}
      </div>

      {/* Personal Information Section */}
      <div className="mb-8 mt-10">
        <h2 className="text-2xl font-semibold text-black mb-9">Personal Information</h2>
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">
              Full Name (as per ID)
            </Label>
            <textarea
              value={userData.name || ""}
              readOnly
              className="h-16 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">
              Date of Birth (MM/DD/YYYY)
            </Label>
            <textarea
              value={userData.Agent?.dateOfBirth ? formatDate(userData.Agent.dateOfBirth) : ""}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">
              Gender
            </Label>
            <textarea
              value={
                userData.Agent?.gender
                  ? userData.Agent.gender.charAt(0).toUpperCase() + userData.Agent.gender.slice(1)
                  : ""
              }
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>
        </div>

        {/* Full width SSN field */}
        <div className="bg-gray-50 border border-gray-300">
          <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">
            Social Security Number (SSN) or Taxpayer Identification Number (TIN)
            – if required for payroll
          </Label>
          <textarea
            value={userData.Agent?.ssn || ""}
            className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
            readOnly
          />
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-black mb-9">
          Contact Information
        </h2>

        {/* Two column grid for contact info */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">
              Email Address (Official & Personal)
            </Label>
            <textarea
              value={userData.email || ""}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">
              Phone Number
            </Label>
            <textarea
              value={userData.phone || ""}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">
              Emergency Contact Name & Number
            </Label>
            <textarea
              value={userData.Agent?.emergencyPhone || ""}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">
              Residential Address (with ZIP code)
            </Label>
            <textarea
              value={userData.Agent?.address || ""}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Employment Information Section */}
      <div>
        <h2 className="text-2xl font-semibold text-black mb-9">
          Employment Information
        </h2>

        {/* Two column grid for employment info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">
              Job Title:
            </Label>
            <textarea
              value={userData.Agent?.jobTitle || ""}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">
              Employment Type
            </Label>
            <textarea
              value={
                userData.Agent?.employmentType
                  ? userData.Agent.employmentType
                    .replace("_", " ")
                    .toUpperCase()
                  : ""
              }
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">
              Department:
            </Label>
            <textarea
              value={userData.Agent?.department || ""}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">
              Work Schedule:
            </Label>
            <textarea
              value={
                userData.Agent?.workStartTime && userData.Agent?.workEndTime
                  ? `${formatTime(userData.Agent.workStartTime)} - ${formatTime(
                    userData.Agent.workEndTime
                  )}`
                  : ""
              }
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>
        </div>

        {/* Full width start date field */}
        <div className="bg-gray-50 border border-gray-300">
          <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">
            Start Work Date:
          </Label>
          <textarea
            value={
              userData.Agent?.startWorkDateTime
                ? formatDate(userData.Agent.startWorkDateTime)
                : ""
            }
            className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default AgentProfileContainerPage;

