"use client";

import React, { useEffect, useState } from "react";
import { env } from "@/env";
import { useAuth } from "@/components/AuthProvider";
import { Search } from "lucide-react";
import { Loading } from "@/components";

interface Organization {
  id: string;
  name: string;
  ownedOrganization: {
    id: string;
    phone: string;
    name: string;
    email: string;
  };
}

interface RequestData {
  id: string;
  requesterName: string;
  message: string;
  requestedPhonePattern: string;
  status: string;
  createdAt: string;
  organization: Organization & {
    requestedTwilioNumbers?: { phoneNumber: string }[];
  };
  pinnedNumber?: {
    id?: string | null;
    friendlyName: string;
    phoneNumber: string;
    countryCode: string;
  } | null;
}

interface AvailableNumber {
  id: string;
  friendlyName: string;
  phoneNumber: string;
  countryCode: string;
  isPinned: boolean;
}

const ViewRequestNumberListPage = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedNumbers, setSelectedNumbers] = useState<
    Record<string, string>
  >({});
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/requests`, {
            headers: { Authorization: token },
          }),
          fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/all`, {
            headers: { Authorization: token },
          }),
        ]);

        const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

        if (data2.success) {
          const filteredNumbers = (data2.data || []).filter(
            (num: AvailableNumber) => !num.isPinned
          );
          setAvailableNumbers(filteredNumbers);
        }

        if (data1.success) {
          const allNumbers: AvailableNumber[] = data2.success
            ? data2.data || []
            : [];

          const mappedRequests: RequestData[] = (data1.data || []).map(
            (req: any) => {
              const firstTwilio = req.organization?.requestedTwilioNumbers?.[0];
              if (!firstTwilio) return { ...req, pinnedNumber: null };

              const matchingNumber = allNumbers.find(
                (n) => n.phoneNumber === firstTwilio.phoneNumber
              );

              return {
                ...req,
                pinnedNumber: {
                  id: matchingNumber ? matchingNumber.id : null,
                  friendlyName: firstTwilio.phoneNumber,
                  phoneNumber: firstTwilio.phoneNumber,
                  countryCode: matchingNumber
                    ? matchingNumber.countryCode
                    : firstTwilio.phoneNumber.startsWith("+1")
                    ? "US"
                    : "BD",
                },
              };
            }
          );

          setRequests(mappedRequests);

          const pinnedMap: Record<string, string> = {};
          mappedRequests.forEach((req) => {
            if (req.pinnedNumber && req.pinnedNumber.id) {
              pinnedMap[req.id] = req.pinnedNumber.id!;
            }
          });
          setSelectedNumbers(pinnedMap);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handlePin = async (
    requestId: string,
    availableNumberId: string,
    orgId: string
  ) => {
    if (!availableNumberId) return;
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/${availableNumberId}/pin`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({
            isPinned: true,
            organizationId: orgId,
          }),
        }
      );

      const json = await res.json();
      if (json.success) {
        setAvailableNumbers((prev) =>
          prev.filter((n) => n.id !== availableNumberId)
        );
        setSelectedNumbers((prev) => ({
          ...prev,
          [requestId]: availableNumberId,
        }));

        const pinnedObj = (() => {
          if (json.data) {
            return {
              id: json.data.id,
              friendlyName: json.data.friendlyName ?? json.data.phoneNumber,
              phoneNumber: json.data.phoneNumber ?? json.data.friendlyName,
              countryCode:
                json.data.countryCode ??
                (json.data.phoneNumber?.startsWith("+1") ? "US" : "BD"),
            };
          }
          const found = (availableNumbers || []).find(
            (n) => n.id === availableNumberId
          );
          if (found) {
            return {
              id: found.id,
              friendlyName: found.friendlyName,
              phoneNumber: found.phoneNumber,
              countryCode: found.countryCode,
            };
          }
          return null;
        })();

        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId ? { ...r, pinnedNumber: pinnedObj } : r
          )
        );
      } else {
        console.error("Failed to pin:", json.message);
      }
    } catch (error) {
      console.error("Error pinning number:", error);
    }
  };

  const handleUnpin = async (
    requestId: string,
    pinnedNumberId: string | undefined | null
  ) => {
    if (!pinnedNumberId) {
      console.warn("No pinnedNumberId available for unpin. Unpin skipped.");
      return;
    }

    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/${pinnedNumberId}/pin`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({ isPinned: false }),
        }
      );

      const json = await res.json();

      if (json.success) {
        if (json.data) {
          setAvailableNumbers((prev) => [...prev, json.data]);
        }

        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId ? { ...r, pinnedNumber: null } : r
          )
        );

        setSelectedNumbers((prev) => {
          const newState = { ...prev };
          delete newState[requestId];
          return newState;
        });
      } else {
        console.error("Failed to unpin:", json.message);
      }
    } catch (error) {
      console.error("Error unpinning number:", error);
    }
  };

  // Filter and Pagination Logic
  const filteredRequests = requests.filter(
    (req) =>
      req.organization.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.organization.ownedOrganization.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      req.requestedPhonePattern
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="bg-white p-4 rounded-md shadow">
        {/* Search */}
        <div className="flex items-center mb-4 border border-gray-200 rounded-md px-3 py-2">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by Organization or Number"
            className="w-full outline-none text-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // নতুন সার্চে প্রথম পেজে যাক
            }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-200 px-3 py-2">
                  Organization
                </th>
                <th className="border border-gray-200 px-3 py-2">Email</th>
                <th className="border border-gray-200 px-3 py-2">
                  Requested Number
                </th>
                <th className="border border-gray-200 px-3 py-2">
                  Select Number
                </th>
                <th className="border border-gray-200 px-3 py-2">
                  Pinned Number
                </th>
                <th className="border border-gray-200 px-3 py-2">
                  Country Code
                </th>
                <th className="border border-gray-200 px-3 py-2 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    <Loading />
                  </td>
                </tr>
              ) : paginatedRequests.length > 0 ? (
                paginatedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2">
                      {req.organization.name}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {req.organization.ownedOrganization.email}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {req.requestedPhonePattern}
                    </td>

                    <td className="border border-gray-200 px-3 py-2">
                      <select
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        value={selectedNumbers[req.id] || ""}
                        onChange={(e) =>
                          handlePin(req.id, e.target.value, req.organization.id)
                        }
                        disabled={!!req.pinnedNumber && !!req.pinnedNumber.id}
                      >
                        <option value="">Select Number</option>
                        {availableNumbers.map((num) => (
                          <option key={num.id} value={num.id}>
                            {num.friendlyName} ({num.countryCode})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="border border-gray-200 px-3 py-2">
                      {req.pinnedNumber ? (
                        <span className="text-sm font-medium text-green-700">
                          {req.pinnedNumber.friendlyName}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="border border-gray-200 px-3 py-2 text-center">
                      {req.pinnedNumber ? req.pinnedNumber.countryCode : "—"}
                    </td>

                    <td className="border border-gray-200 px-3 py-2 text-center">
                      {req.pinnedNumber && req.pinnedNumber.id ? (
                        <button
                          onClick={() =>
                            handleUnpin(req.id, req.pinnedNumber!.id)
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Unpin
                        </button>
                      ) : req.pinnedNumber ? (
                        <span className="text-xs text-yellow-600">
                          Pinned (no id)
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            handlePin(
                              req.id,
                              selectedNumbers[req.id],
                              req.organization.id
                            )
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                        >
                          Pin
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination Controls */}
        {!loading && filteredRequests.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="text-gray-600">
              Showing {(currentPage - 1) * rowsPerPage + 1}–
              {Math.min(currentPage * rowsPerPage, filteredRequests.length)} of{" "}
              {filteredRequests.length}
            </span>

            <div className="flex gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded ${
                  currentPage === 1
                    ? "text-gray-400 border-gray-200"
                    : "hover:bg-gray-100 border-gray-300"
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white border-blue-500"
                      : "hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded ${
                  currentPage === totalPages
                    ? "text-gray-400 border-gray-200"
                    : "hover:bg-gray-100 border-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRequestNumberListPage;
