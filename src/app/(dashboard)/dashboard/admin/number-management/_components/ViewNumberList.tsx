"use client";

import React, { useEffect, useState } from "react";
import { env } from "@/env";
import { useAuth } from "@/components/AuthProvider";
import { Search } from "lucide-react";
import { Loading } from "@/components";

interface Capabilities {
  voice: boolean;
  sms: boolean;
  mms: boolean;
  fax: boolean;
}

interface NumberData {
  id: string;
  sid: string;
  phoneNumber: string;
  friendlyName: string;
  capabilities: Capabilities;
  countryCode: string;
  isPurchased: boolean;
}

const ViewNumberListPage = () => {
  const { token } = useAuth();
  const [numbers, setNumbers] = useState<NumberData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/all`,
          {
            headers: { Authorization: token || "" },
          }
        );
        const json = await res.json();
        if (json.success) {
          setNumbers(json.data || []);
        }
      } catch (error) {
        console.error("Error fetching number list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // ✅ Search filter
  const filteredNumbers = numbers.filter(
    (num) =>
      num.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      num.friendlyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      num.countryCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination calculation
  const totalPages = Math.ceil(filteredNumbers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNumbers.slice(indexOfFirstItem, indexOfLastItem);

  // ✅ Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-md shadow mb-4">
        <div className="flex items-center mb-4 border border-gray-200 rounded-md px-3 py-2">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by Number"
            className="w-full outline-none text-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // নতুন সার্চ হলে প্রথম পেজে যাক
            }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-200 px-3 py-2">Id</th>
                <th className="border border-gray-200 px-3 py-2">Sid</th>
                <th className="border border-gray-200 px-3 py-2">Phone Number</th>
                <th className="border border-gray-200 px-3 py-2">Friendly Name</th>
                <th className="border border-gray-200 px-3 py-2">Capabilities</th>
                <th className="border border-gray-200 px-3 py-2">Country Code</th>
                <th className="border border-gray-200 px-3 py-2">Is Purchased</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    <Loading />
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((num) => (
                  <tr key={num.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2">{num.id}</td>
                    <td className="border border-gray-200 px-3 py-2">{num.sid}</td>
                    <td className="border border-gray-200 px-3 py-2">
                      {num.phoneNumber}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {num.friendlyName}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(num.capabilities)
                          .filter(([, val]) => val)
                          .map(([cap]) => (
                            <span
                              key={cap}
                              className="bg-green-500 text-white text-xs px-2 py-1 rounded"
                            >
                              {cap.toUpperCase()}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {num.countryCode}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <span
                        className={`text-xs px-2 py-1 rounded text-white ${num.isPurchased ? "bg-gray-600" : "bg-green-500"
                          }`}
                      >
                        {num.isPurchased ? "Purchased" : "Available"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No numbers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination Controls */}
        {!loading && filteredNumbers.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="text-gray-600">
              Showing {indexOfFirstItem + 1}–
              {Math.min(indexOfLastItem, filteredNumbers.length)} of{" "}
              {filteredNumbers.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded ${currentPage === 1
                  ? "text-gray-400 border-gray-200"
                  : "hover:bg-gray-100 border-gray-300"
                  }`}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${currentPage === i + 1
                    ? "bg-blue-500 text-white border-blue-500"
                    : "hover:bg-gray-100 border-gray-300"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded ${currentPage === totalPages
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

export default ViewNumberListPage;
