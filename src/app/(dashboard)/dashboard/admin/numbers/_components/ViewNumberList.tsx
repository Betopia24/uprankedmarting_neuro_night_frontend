"use client";

import React, { useEffect, useState } from "react";
import { env } from "@/env";
import { useAuth } from "@/components/AuthProvider";
import { Search } from "lucide-react";

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

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/all`, {
          headers: { Authorization: token || "" },
        });
        const json = await res.json();
        console.log("Fetched Data view number list: ", json);
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

  const filteredNumbers = numbers.filter(
    (num) =>
      num.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      num.friendlyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      num.countryCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-md shadow mb-4">
        <div className="flex items-center mb-4 border border-gray-200 rounded-md px-3 py-2">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by  Number"
            className="w-full outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                    Loading...
                  </td>
                </tr>
              ) : filteredNumbers.length > 0 ? (
                filteredNumbers.map((num) => (
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
                      <div className="flex gap-1 flex-wrap">
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
      </div>
    </div>
  );
};

export default ViewNumberListPage;
