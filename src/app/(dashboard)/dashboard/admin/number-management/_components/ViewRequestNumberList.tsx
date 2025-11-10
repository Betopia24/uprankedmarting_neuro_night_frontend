"use client";

import React, { useEffect, useState } from "react";
import { env } from "@/env";
import { useAuth } from "@/components/AuthProvider";
import { Search, Loader2 } from "lucide-react";
import { Loading } from "@/components";
import { toast } from "sonner";

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
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);

  // ✅ Server-side Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // For loading states
  const [pinningId, setPinningId] = useState<string | null>(null);
  const [unpinningId, setUnpinningId] = useState<string | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch data with pagination
  const fetchRequests = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const [reqRes, numRes] = await Promise.all([
        fetch(
          `${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/requests?page=${currentPage}&limit=${rowsPerPage}&search=${searchQuery}`,
          { headers: { Authorization: token } }
        ),
        fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/all`, {
          headers: { Authorization: token },
        }),
      ]);

      const reqJson = await reqRes.json();
      const numJson = await numRes.json();

      // ✅ total, totalPages from backend
      if (reqJson.success) {
        const allNumbers: AvailableNumber[] = numJson.success ? numJson.data || [] : [];

        const mapped = (reqJson.data || []).map((req: any) => {
          const firstTwilio = req.organization?.requestedTwilioNumbers?.[0];
          if (!firstTwilio) return { ...req, pinnedNumber: null };

          const match = allNumbers.find(
            (n) => n.phoneNumber === firstTwilio.phoneNumber
          );

          return {
            ...req,
            pinnedNumber: {
              id: match ? match.id : null,
              friendlyName: firstTwilio.phoneNumber,
              phoneNumber: firstTwilio.phoneNumber,
              countryCode: match
                ? match.countryCode
                : firstTwilio.phoneNumber.startsWith("+1")
                  ? "US"
                  : "BD",
            },
          };
        });

        setRequests(mapped);
        setTotal(reqJson.meta.total);
        setTotalPages(reqJson.meta.totalPage);

        const tempMap: Record<string, string> = {};
        mapped.forEach((r: any) => {
          if (r.pinnedNumber?.id) tempMap[r.id] = r.pinnedNumber.id;
        });
        setSelectedNumbers(tempMap);
      }

      if (numJson.success) {
        const filtered = (numJson.data || []).filter((n: any) => !n.isPinned);
        setAvailableNumbers(filtered);
      }
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token, currentPage]);

  // ✅ Search triggers refresh
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setTimeout(() => fetchRequests(), 200);
  };

  // ===================== PIN =====================
  const handlePin = async (requestId: string, numberId: string, orgId: string) => {
    if (!numberId) return;

    setPinningId(requestId);

    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/${numberId}/pin`,
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
        await fetchRequests();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPinningId(null);
    }
  };

  // ===================== UNPIN =====================
  const handleUnpin = async (
    requestId: string,
    pinnedId: string | null | undefined
  ) => {
    if (!pinnedId) return;

    setUnpinningId(requestId);

    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/${pinnedId}/pin`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({ isPinned: false }),
        }
      );

      if (!res.ok) {
        toast.error("Failed to unpin. Already purchased.");
        return;
      }

      await fetchRequests();
    } catch (err) {
      console.error("Error unpinning:", err);
    } finally {
      setUnpinningId(null);
    }
  };

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
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-3 py-2">Organization</th>
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Requested Number</th>
                <th className="border px-3 py-2">Select Number</th>
                <th className="border px-3 py-2">Pinned Number</th>
                <th className="border px-3 py-2">Country Code</th>
                <th className="border px-3 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-6">
                    <Loading />
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    No requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const isPinning = pinningId === req.id;
                  const isUnpinning = unpinningId === req.id;
                  const isProcessing = isPinning || isUnpinning;

                  return (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">{req.organization.name}</td>
                      <td className="border px-3 py-2">
                        {req.organization.ownedOrganization.email}
                      </td>
                      <td className="border px-3 py-2">
                        {req.requestedPhonePattern}
                      </td>

                      <td className="border px-3 py-2">
                        <select
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-full disabled:opacity-50"
                          value={selectedNumbers[req.id] || ""}
                          onChange={(e) =>
                            handlePin(req.id, e.target.value, req.organization.id)
                          }
                          disabled={
                            (!!req.pinnedNumber && !!req.pinnedNumber.id) ||
                            isProcessing
                          }
                        >
                          <option value="">Select Number</option>
                          {availableNumbers.map((num) => (
                            <option key={num.id} value={num.id}>
                              {num.friendlyName} ({num.countryCode})
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="border px-3 py-2">
                        {req.pinnedNumber ? (
                          <span className="text-sm text-green-700 flex items-center gap-1">
                            {isPinning && (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            )}
                            {req.pinnedNumber.friendlyName}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="border px-3 py-2 text-center">
                        {req.pinnedNumber ? req.pinnedNumber.countryCode : "—"}
                      </td>

                      <td className="border px-3 py-2 text-center">
                        {req.pinnedNumber?.id ? (
                          <button
                            onClick={() =>
                              handleUnpin(req.id, req.pinnedNumber!.id)
                            }
                            disabled={isProcessing}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50 flex items-center gap-1 mx-auto"
                          >
                            {isUnpinning && (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            )}
                            {isUnpinning ? "Unpinning..." : "Unpin"}
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
                            disabled={!selectedNumbers[req.id] || isProcessing}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1 mx-auto"
                          >
                            {isPinning && (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            )}
                            {isPinning ? "Pinning..." : "Pin"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="text-gray-600">
              Showing {(currentPage - 1) * rowsPerPage + 1}–
              {Math.min(currentPage * rowsPerPage, total)} of {total}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded ${currentPage === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "hover:bg-gray-100 border-gray-300"
                  }`}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${currentPage === i + 1
                    ? "bg-blue-500 text-white border-blue-500"
                    : "hover:bg-gray-100 border-gray-300"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded ${currentPage === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
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

