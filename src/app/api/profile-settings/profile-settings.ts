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
    
    headers.Authorization = `${token}`
  }

  if (profileImage) {
    const formData = new FormData()
    formData.append("data", JSON.stringify(payload))
    formData.append("file", profileImage) 

    return fetch(`${env.NEXT_PUBLIC_API_URL}/users/update`, {
      method: "PATCH",
      headers, 
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

export const getProfileInfo = async (
  id: string,            
  token: string | null
): Promise<Response> => {
  const headers: Record<string, string> = {}
  if (token) {
    headers.Authorization = `${token}`
  }

  return fetch(`${env.NEXT_PUBLIC_API_URL}/auth/get-user/${id}`, {
    method: "GET",
    headers,
  })
}
