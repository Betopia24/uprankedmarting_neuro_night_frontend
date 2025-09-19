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

//! AGENT Profile settings

export const uploadAgentProfileImage = async (file: File, token: string, bio: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bio", bio);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/agents/profile`,
    {
      method: "PATCH",
      headers: {
        Authorization: `${token}`,
      },
      body: formData,
    }
  );

  if (!res.ok) {
    let errText = "Image upload failed";
    try {
      const json = await res.json();
      if (json?.message) errText = json.message;
    } catch {}
    throw new Error(errText);
  }

  return res.json();
};

export const getAgentInfo = async (token: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: {
      Authorization: `${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user info");
  return res.json();
};
