import { env } from "@/env"

export interface UserData {
  name: string
  phone: string
}

export interface OrganizationData {
  name: string
  industry: string
  address: string
  websiteLink: string
}

export interface ProfileSettingsPayload {
  userData: UserData
  organizationData: OrganizationData
}

export const updateProfileSettings = async (
  payload: ProfileSettingsPayload,
  token: string | null,
  profileImage?: File | null,
): Promise<Response> => {
  const headers: Record<string, string> = {}
  if (token) {
    // 'Bearer ' প্রিফিক্স থাকা উচিত
    headers.Authorization = `${token}`
  }

  // যদি ফাইল থাকে
  if (profileImage) {
    const formData = new FormData()
    // ✅ ব্যাকএন্ড যেটা আশা করছে সেটাই দাও:
    formData.append("data", JSON.stringify(payload))
    formData.append("file", profileImage) // 👈 multerUpload.single("file")

    return fetch(`${env.NEXT_PUBLIC_API_URL}/users/update`, {
      method: "PATCH",
      headers, // FormData হলে content-type সেট কোরো না
      body: formData,
    })
  } else {
    headers["Content-Type"] = "application/json"
    return fetch(`${env.NEXT_PUBLIC_API_URL}/users/update`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    })
  }
}

