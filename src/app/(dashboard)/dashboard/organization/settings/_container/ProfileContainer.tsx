"use client";

import type React from "react";
import { useEffect, useState } from "react";
import FormField from "@/features/auth/FormField";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import ImageUpload from "./image-upload";
import {
  getProfileInfo,
  updateProfileSettings,
} from "@/app/api/profile-settings/profile-settings";

const ProfileContainerPage = ({ planLevel }: { planLevel: string }) => {
  const auth = useAuth();
  const token = auth?.token;

  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    serviceName: "",
    phoneNumber: "",
    industry: "",
    website: "",
    serviceAddress: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileInfo(auth?.user?.id || "", token || "");
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();

        const user = data.data;

        setFormData({
          fullName: user.name || "",
          serviceName: user.ownedOrganization?.name || "",
          phoneNumber: user.phone || "",
          industry: user.ownedOrganization?.industry || "",
          website: user.ownedOrganization?.websiteLink || "",
          serviceAddress: user.ownedOrganization?.address || "",
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [token, auth?.user?.id]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setProfileImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    const payload = {
      userData: {
        name: formData.fullName,
        phone: formData.phoneNumber,
      },
      organizationData: {
        name: formData.serviceName,
        industry: formData.industry,
        address: formData.serviceAddress,
        websiteLink: formData.website,
      },
    };
    try {
      const res = await updateProfileSettings(payload, token, profileImage);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("API Error:", res.status, errorData);
        throw new Error(`Failed to update profile: ${res.status}`);
      }

      const data = await res.json();
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error("Failed to update profile settings");
    }
  };

  if (!auth) {
    return (
      <div className="max-w-5xl mx-auto">
        <p>Loading authentication...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-5xl mx-auto">
        <p>Please log in to access your profile settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <ImageUpload
          currentImage={
            typeof auth.user?.image === "string" ? auth.user?.image : null
          }
          onImageChange={handleImageChange}
        />
        <p className="text-sm text-emerald-500 font-semibold text-center">
          Purchased Plan: {planLevel}
        </p>
      </div>

      <h1 className="text-2xl font-semibold text-black mb-6">
        Personal Information
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mb-4">
          <FormField
            label="Full Name"
            name="fullName"
            placeholder="Write Full Name"
            value={formData.fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("fullName", e.target.value)
            }
          />
          <FormField
            label="Service Name"
            name="serviceName"
            placeholder="Write Service Name"
            value={formData.serviceName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("serviceName", e.target.value)
            }
          />
          <FormField
            label="Phone Number"
            name="phoneNumber"
            placeholder="Write Phone Number"
            value={formData.phoneNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("phoneNumber", e.target.value)
            }
          />
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-4">
          <FormField
            label="Enter Industry"
            name="industry"
            placeholder="Write your Industry name"
            value={formData.industry}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("industry", e.target.value)
            }
          />
          <FormField
            label="Website"
            name="website"
            placeholder="Website address"
            value={formData.website}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("website", e.target.value)
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <FormField
            label="Service Address"
            name="serviceAddress"
            placeholder="Write Your Address"
            value={formData.serviceAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("serviceAddress", e.target.value)
            }
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="px-6">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileContainerPage;
