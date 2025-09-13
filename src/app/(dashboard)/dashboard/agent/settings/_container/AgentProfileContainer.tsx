// "use client"

// import { useEffect, useState } from "react"
// import { useAuth } from "@/components/AuthProvider"
// import { Label } from "@/components/ui/label"
// import { toast } from "sonner"
// import { getAgentInfo, uploadAgentProfileImage } from "@/app/api/profile-settings/profile-settings"
// import ImageUpload from "../../../organization/settings/_container/image-upload"

// const AgentProfileContainerPage = () => {
//   const auth = useAuth()
//   const token = auth?.token
//   const [userData, setUserData] = useState<any>(null)

//   const mockData = getAgentInfo(token || "");
//   console.log("Getting Data: ", mockData)

//   useEffect(() => {
//     if (!token) return
//     const mockData = getAgentInfo(token);
//     console.log("Getting Data: ", mockData)
//     setUserData(mockData)
//   }, [token])

//   const handleImageChange = async (file: File | null) => {
//     if (!token || !file) return;
//     try {
//       const res = await uploadAgentProfileImage(file, token);
//       if (!res.ok) {
//         toast.error("Image upload failed");
//         return;
//       }

//       toast.success("Image updated successfully");

//       const refreshed = await getAgentInfo(token);
//       setUserData(refreshed.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Image upload failed");
//     }
//   };

//   if (!token) return <p>Please log in to access your profile.</p>
//   if (!userData) return <p>Loading profile...</p>

//   return (
//     <div className="max-w-4xl mx-auto p-8">
//       <div className="mb-8">
//         <ImageUpload
//           currentImage={typeof auth.user?.image === "string" ? auth.user?.image : null}
//           onImageChange={handleImageChange}
//         />
//       </div>


//       {/* Main Title */}
//       <h1 className="text-4xl font-bold text-black mb-16">Profile Information</h1>

//       {/* Personal Information Section */}
//       <div className="mb-8">
//         <h2 className="text-2xl font-semibold text-black mb-9">Personal Information</h2>

//         {/* Three column grid for main personal info */}
//         <div className="grid grid-cols-3 gap-6 mb-6">
//           <div className="bg-gray-50 border border-gray-300 ">
//             <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Full Name (as per ID)</Label>
//             <textarea
//               value={userData.name}
//               readOnly
//               className="h-16 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0"
//             />
//           </div>

//           <div className="bg-gray-50 border border-gray-300 ">
//             <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Date of Birth (MM/DD/YYYY)</Label>
//             <textarea
//               value={new Date(userData.Agent.dateOfBirth).toLocaleDateString()}
//               className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0"
//               readOnly
//             />
//           </div>

//           <div className="bg-gray-50 border border-gray-300">
//             <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Gender</Label>
//             <textarea
//               value={userData.Agent.gender.charAt(0).toUpperCase() + userData.Agent.gender.slice(1)}
//               className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0"
//               readOnly
//             />
//           </div>
//         </div>

//         {/* Full width SSN field */}
//         <div className="bg-gray-50 border border-gray-300">
//           <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">
//             Social Security Number (SSN) or Taxpayer Identification Number (TIN) – if required for payroll
//           </Label>
//           <textarea value={userData.Agent.ssn} className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0" readOnly />
//         </div>
//       </div>

//       {/* Contact Information Section */}
//       <div className="mb-8">
//         <h2 className="text-2xl font-semibold text-black mb-9">Contact Information</h2>

//         {/* Two column grid for contact info */}
//         <div className="grid grid-cols-2 gap-6">
//           <div className="bg-gray-50 border border-gray-300">
//             <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Email Address (Official & Personal)</Label>
//             <textarea value={userData.email} className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0" readOnly />
//           </div>

//           <div className="bg-gray-50 border border-gray-300">
//             <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Phone Number</Label>
//             <textarea value={userData.phone} className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0" readOnly />
//           </div>

//           <div className="bg-gray-50 border border-gray-300">
//             <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Emergency Contact Name & Number</Label>
//             <textarea
//               value={userData.Agent.emergencyPhone}
//               className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0"
//               readOnly
//             />
//           </div>

//           <div className="bg-gray-50 border border-gray-300">
//             <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Residential Address (with ZIP code)</Label>
//             <textarea value={userData.Agent.address} className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0" readOnly />
//           </div>
//         </div>
//       </div>

//       {/* Employment Information Section */}
//       <div>
//         <h2 className="text-2xl font-semibold text-black mb-9">Employment Information</h2>

//         {/* Two column grid for employment info */}
//         <div className="grid grid-cols-2 gap-6 mb-6">
//           <div className="bg-gray-50 border border-gray-300">
//             <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Job Title:</Label>
//             <textarea value={userData.Agent.jobTitle} className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0" readOnly />
//           </div>

//           <div className="bg-gray-50 border border-gray-300">
//             <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Employment Type</Label>
//             <textarea
//               value={userData.Agent.employmentType.replace("_", " ").toUpperCase()}
//               className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0"
//               readOnly
//             />
//           </div>

//           <div className="bg-gray-50 border border-gray-300">
//             <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Department:</Label>
//             <textarea value={userData.Agent.department} className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0" readOnly />
//           </div>

//           <div className="bg-gray-50 border border-gray-300">
//             <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Work Schedule:</Label>
//             <textarea
//               value={`${userData.Agent.workStartTime} - ${userData.Agent.workEndTime}`}
//               className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0"
//               readOnly
//             />
//           </div>
//         </div>

//         {/* Full width start date field */}
//         <div className="bg-gray-50 border border-gray-300">
//           <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Start Work Date:</Label>
//           <textarea
//             value={userData.Agent.startWorkDateTime}
//             className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0"
//             readOnly
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AgentProfileContainerPage



//! Try - 1

"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/AuthProvider"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { getAgentInfo, uploadAgentProfileImage } from "@/app/api/profile-settings/profile-settings"
import ImageUpload from "../../../organization/settings/_container/image-upload"

const AgentProfileContainerPage = () => {
  const auth = useAuth()
  const token = auth?.token
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const fetchAgentInfo = async () => {
      try {
        const response = await getAgentInfo(token)
        if (response.success) {
          setUserData(response.data)
        } else {
          toast.error("Failed to load profile information")
        }
      } catch (error) {
        console.error("Error fetching agent info:", error)
        toast.error("Failed to load profile information")
      } finally {
        setLoading(false)
      }
    }

    fetchAgentInfo()
  }, [token])

  const handleImageChange = async (file: File | null) => {
    if (!token || !file) return;
    try {
      const res = await uploadAgentProfileImage(file, token);
      if (!res.ok) {
        toast.error("Image upload failed");
        return;
      }

      toast.success("Image updated successfully");

      const refreshed = await getAgentInfo(token);
      if (refreshed.success) {
        setUserData(refreshed.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
  };

  if (!token) return <p className="text-center text-gray-600 mt-8">Please log in to access your profile.</p>
  if (loading) return <p className="text-center text-gray-600 mt-8">Loading profile...</p>
  if (!userData) return <p className="text-center text-gray-600 mt-8">No profile data available.</p>

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US')
    } catch {
      return dateString
    }
  }

  // Format time helper
  const formatTime = (timeString: string) => {
    try {
      // Convert 24-hour format to 12-hour format with AM/PM
      const [hours, minutes] = timeString.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    } catch {
      return timeString
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <ImageUpload
          currentImage={userData.image || null}
          onImageChange={handleImageChange}
        />
      </div>

      {/* Main Title */}
      <h1 className="text-4xl font-bold text-black mb-16">Profile Information</h1>

      {/* Personal Information Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-black mb-9">Personal Information</h2>

        {/* Three column grid for main personal info */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Full Name (as per ID)</Label>
            <textarea
              value={userData.name || ''}
              readOnly
              className="h-16 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Date of Birth (MM/DD/YYYY)</Label>
            <textarea
              value={userData.Agent?.dateOfBirth ? formatDate(userData.Agent.dateOfBirth) : ''}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Gender</Label>
            <textarea
              value={userData.Agent?.gender ? userData.Agent.gender.charAt(0).toUpperCase() + userData.Agent.gender.slice(1) : ''}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>
        </div>

        {/* Full width SSN field */}
        <div className="bg-gray-50 border border-gray-300">
          <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">
            Social Security Number (SSN) or Taxpayer Identification Number (TIN) – if required for payroll
          </Label>
          <textarea
            value={userData.Agent?.ssn || ''}
            className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
            readOnly
          />
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-black mb-9">Contact Information</h2>

        {/* Two column grid for contact info */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Email Address (Official & Personal)</Label>
            <textarea
              value={userData.email || ''}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Phone Number</Label>
            <textarea
              value={userData.phone || ''}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Emergency Contact Name & Number</Label>
            <textarea
              value={userData.Agent?.emergencyPhone || ''}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Residential Address (with ZIP code)</Label>
            <textarea
              value={userData.Agent?.address || ''}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Employment Information Section */}
      <div>
        <h2 className="text-2xl font-semibold text-black mb-9">Employment Information</h2>

        {/* Two column grid for employment info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Job Title:</Label>
            <textarea
              value={userData.Agent?.jobTitle || ''}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Employment Type</Label>
            <textarea
              value={userData.Agent?.employmentType ? userData.Agent.employmentType.replace("_", " ").toUpperCase() : ''}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Department:</Label>
            <textarea
              value={userData.Agent?.department || ''}
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>

          <div className="bg-gray-50 border border-gray-300">
            <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Work Schedule:</Label>
            <textarea
              value={userData.Agent?.workStartTime && userData.Agent?.workEndTime
                ? `${formatTime(userData.Agent.workStartTime)} - ${formatTime(userData.Agent.workEndTime)}`
                : ''
              }
              className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
              readOnly
            />
          </div>
        </div>

        {/* Full width start date field */}
        <div className="bg-gray-50 border border-gray-300">
          <Label className="text-base font-bold text-black mb-2 block border-b-1 border-black p-2">Start Work Date:</Label>
          <textarea
            value={userData.Agent?.startWorkDateTime ? formatDate(userData.Agent.startWorkDateTime) : ''}
            className="h-20 w-full text-gray-600 p-2 resize-none focus:outline-none focus:ring-0 bg-transparent"
            readOnly
          />
        </div>
      </div>
    </div>
  )
}

export default AgentProfileContainerPage
