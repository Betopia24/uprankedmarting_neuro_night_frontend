// import { env } from "@/env";

// export interface UserData {
//   name: string;
//   phone: string;
// }

// export interface OrganizationData {
//   name: string;
//   industry: string;
//   address: string;
//   websiteLink: string;
// }

// export interface ProfileSettingsPayload {
//   userData: UserData;
//   organizationData: OrganizationData;
// }

// export const updateProfileSettings = async (
//   payload: ProfileSettingsPayload,
//   token: string | null
// ): Promise<Response> => {
//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//   };

//   if (token) {
//     headers.Authorization = `${token}`;
//   }

//   console.log("Using token:", token ? "Token present" : "No token");

//   return fetch(`${env.NEXT_PUBLIC_API_URL}/users/update`, {
//     method: "PATCH",
//     headers,
//     body: JSON.stringify(payload),
//   });
// };

//! Try - 1

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

  console.log("Using token:", token ? "Token present" : "No token")

  if (profileImage) {
    const formData = new FormData()
    formData.append("userData", JSON.stringify(payload.userData))
    formData.append("organizationData", JSON.stringify(payload.organizationData))
    formData.append("image", profileImage)

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
