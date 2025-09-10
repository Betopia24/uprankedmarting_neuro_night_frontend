// import { env } from "@/env";

// export const createOrganizationQuestion = async (
//   orgId: string,
//   orgName: string,
//   question: string
// ): Promise<Response> => {
//   return fetch(`${env.NEXT_PUBLIC_API_BASE_URL_AI_LOCAL}/organizations/${orgId}/questions`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       org_id: orgId,
//       org_name: orgName,
//       question,
//     }),
//   });
// };


import { env } from "@/env";

/** ✅ Create question */
export const createOrganizationQuestion = async (
  orgId: string,
  orgName: string,
  question: string
): Promise<Response> => {
  return fetch(`${env.NEXT_PUBLIC_API_BASE_URL_AI_LOCAL}/organizations/${orgId}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      org_id: orgId,
      org_name: orgName,
      question,
    }),
  });
};

/** ✅ Get all questions for an org */
export const getOrganizationQuestions = async (
  orgId: string
): Promise<Response> => {
  return fetch(`${env.NEXT_PUBLIC_API_BASE_URL_AI_LOCAL}/organizations/${orgId}/questions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/** ✅ Update a single question */
export const updateOrganizationQuestion = async (
  orgId: string,
  questionId: string,
  question: string
): Promise<Response> => {
  return fetch(`${env.NEXT_PUBLIC_API_BASE_URL_AI_LOCAL}/organizations/${orgId}/questions/${questionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });
};

/** ✅ Delete a single question */
export const deleteOrganizationQuestion = async (
  orgId: string,
  questionId: string
): Promise<Response> => {
  return fetch(`${env.NEXT_PUBLIC_API_BASE_URL_AI_LOCAL}/organizations/${orgId}/questions/${questionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
