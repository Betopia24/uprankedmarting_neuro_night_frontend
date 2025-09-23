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
import { SelectField } from "@/components";
import CustomSelectField from "@/components/CustomSelectField";

const ProfileContainerPage = ({ planLevel }: { planLevel: string }) => {
  const auth = useAuth();
  const token = auth?.token;

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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
      if (!auth?.user?.id || !token) return;

      try {
        setLoading(true);
        const res = await getProfileInfo(auth.user.id, token);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData?.message || "Failed to load profile");
        }

        const data = await res.json();
        const user = data.data;

        setFormData({
          fullName: user.name ?? "",
          serviceName: user.ownedOrganization?.name ?? "",
          phoneNumber: user.phone ?? "",
          industry: user.ownedOrganization?.industry ?? "",
          website: user.ownedOrganization?.websiteLink ?? "",
          serviceAddress: user.ownedOrganization?.address ?? "",
        });
      } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setLoading(false);
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
      setLoading(true);
      const res = await updateProfileSettings(payload, token, profileImage);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("API Error:", res.status, errorData);
        throw new Error(`Failed to update profile: ${res.status}`);
      }

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error("Failed to update profile settings");
    } finally {
      setLoading(false);
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
          <CustomSelectField
            className="w-full"
            name="industry"
            label="Industry"
            required
            placeholder="Choose your industry"
            value={formData.industry}
            onChange={(value: string) => handleChange("industry", value)}
            options={[
              { label: "Information Technology", value: "information-technology" },
              { label: "Healthcare & Biotechnology", value: "healthcare-biotechnology" },
              { label: "Education & E-Learning", value: "education-elearning" },
              { label: "Finance & Banking", value: "finance-banking" },
              { label: "E-Commerce & Retail", value: "ecommerce-retail" },
              { label: "Manufacturing & Supply Chain", value: "manufacturing-supply" },
              { label: "Media & Entertainment", value: "media-entertainment" },
              { label: "Residential Construction", value: "residential-construction" },
              { label: "Commercial Construction", value: "commercial-construction" },
              { label: "Plumbing", value: "plumbing" },
              { label: "Electrical Services", value: "electrical-services" },
              { label: "HVAC (Heating & Cooling)", value: "hvac" },
              { label: "Roofing", value: "roofing" },
              { label: "Home Remodeling & Renovation", value: "home-remodeling" },
              { label: "Landscaping & Lawn Care", value: "landscaping-lawn-care" },
              { label: "Painting & Decorating", value: "painting-decorating" },
              { label: "Flooring Installation", value: "flooring-installation" },
              { label: "Carpentry & Woodworking", value: "carpentry-woodworking" },
              { label: "Masonry & Concrete", value: "masonry-concrete" },
              { label: "Real Estate Development", value: "real-estate-development" },
              { label: "Property Management", value: "property-management" },
              { label: "Auto Repair & Maintenance", value: "auto-repair-maintenance" },
              { label: "Logistics & Freight", value: "logistics-freight" },
              { label: "Restaurants & Food Service", value: "restaurants-food-service" },
              { label: "Hotels & Resorts", value: "hotels-resorts" },
              { label: "Event Management", value: "event-management" },
              { label: "Travel & Tourism", value: "travel-tourism" },
              { label: "Fitness & Wellness", value: "fitness-wellness" },
              { label: "Beauty & Personal Care", value: "beauty-personal-care" },
              { label: "Cleaning Services", value: "cleaning-services" },
              { label: "Childcare & Daycare", value: "childcare-daycare" },
              { label: "Senior Care & Assisted Living", value: "senior-care" },
              { label: "Furniture & Home Décor", value: "furniture-home-decor" },
              { label: "Fashion & Apparel", value: "fashion-apparel" },
              { label: "Sports & Outdoor Goods", value: "sports-outdoor-goods" },
              { label: "Marketing & Advertising", value: "marketing-advertising" },
              { label: "Legal Services", value: "legal-services" },
              { label: "Accounting & Tax Services", value: "accounting-tax-services" },
              { label: "Renewable Energy & Solar Installation", value: "renewable-energy" },
              { label: "Pet Care & Pet Products", value: "pet-care" },
              { label: "Security Services", value: "security-services" },
              { label: "Tutoring & Test Preparation", value: "tutoring-test-prep" },
            ]}
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
          <Button
            type="submit"
            className="px-6"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileContainerPage;

