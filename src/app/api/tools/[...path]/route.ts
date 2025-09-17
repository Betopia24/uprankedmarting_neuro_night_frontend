import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Helper function to construct backend URL
const constructBackendUrl = (path: string[] | string | undefined): string => {
  const pathString = Array.isArray(path) ? path.join("/") : path || "";
  const backendUrl = process.env.API_BASE_URL;
  return `${backendUrl}/tools/${pathString}`;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const url = constructBackendUrl(params.path);
  console.log("Proxying GET request to:", url);

  try {
    const response = await axios({
      method: "GET",
      url,
      headers: {
        Authorization: req.headers.get("authorization") || "",
      },
      params: Object.fromEntries(new URL(req.url).searchParams),
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("GET request error:", {
      url,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Internal server error";
    return NextResponse.json({ message }, { status });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const url = constructBackendUrl(params.path);
  console.log("Proxying POST request to:", url);
  const body = await req.json();

  try {
    const response = await axios({
      method: "POST",
      url,
      headers: {
        Authorization: req.headers.get("authorization") || "",
      },
      data: body,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("POST request error:", {
      url,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Internal server error";
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const url = constructBackendUrl(params.path);
  console.log("Proxying DELETE request to:", url);

  try {
    const response = await axios({
      method: "DELETE",
      url,
      headers: {
        Authorization: req.headers.get("authorization") || "",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("DELETE request error:", {
      url,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Internal server error";
    return NextResponse.json({ message }, { status });
  }
}
