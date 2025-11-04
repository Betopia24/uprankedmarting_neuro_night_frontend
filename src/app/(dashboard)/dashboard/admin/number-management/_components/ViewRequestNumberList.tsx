"use client";

import React, { useEffect, useState } from "react";
import { env } from "@/env";
import { useAuth } from "@/components/AuthProvider";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Loading } from "@/components";

// interface Organization {
//   id: string;
//   name: string;
//   ownedOrganization: {
//     id: string;
//     phone: string;
//     name: string;
//     email: string;
//   };
// }

// interface RequestData {
//   id: string;
//   requesterName: string;
//   message: string;
//   requestedPhonePattern: string;
//   status: string;
//   createdAt: string;
//   organization: Organization & {
//     requestedTwilioNumbers?: { phoneNumber: string }[];
//   };
//   pinnedNumber?: {
//     id?: string | null; // actual phone record id (if found)
//     friendlyName: string;
//     phoneNumber: string;
//     countryCode: string;
//   } | null;
// }

// interface AvailableNumber {
//   id: string;
//   friendlyName: string;
//   phoneNumber: string;
//   countryCode: string;
//   isPinned: boolean;
// }

// const ViewRequestNumberListPage = () => {
//   const { token } = useAuth();
//   const [requests, setRequests] = useState<RequestData[]>([]);
//   const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>(
//     []
//   );
//   const [loading, setLoading] = useState(true);
//   const [selectedNumbers, setSelectedNumbers] = useState<
//     Record<string, string>
//   >({});
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     if (!token) return;

//     const fetchData = async () => {
//       try {
//         const [res1, res2] = await Promise.all([
//           fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/requests`, {
//             headers: { Authorization: token },
//           }),
//           fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/all`, {
//             headers: { Authorization: token },
//           }),
//         ]);

//         const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

//         // set available numbers from data2 (only those not pinned)
//         if (data2.success) {
//           const filteredNumbers = (data2.data || []).filter(
//             (num: AvailableNumber) => !num.isPinned
//           );
//           setAvailableNumbers(filteredNumbers);
//         }

//         if (data1.success) {
//           // map requests and try to resolve pinnedNumber -> actual phone record id from data2
//           const allNumbers: AvailableNumber[] = data2.success
//             ? data2.data || []
//             : [];

//           const mappedRequests: RequestData[] = (data1.data || []).map(
//             (req: any) => {
//               const firstTwilio = req.organization?.requestedTwilioNumbers?.[0];
//               if (!firstTwilio) {
//                 return { ...req, pinnedNumber: null };
//               }

//               // Try to find the corresponding phone record in `allNumbers` by phoneNumber
//               const matchingNumber = allNumbers.find(
//                 (n) => n.phoneNumber === firstTwilio.phoneNumber
//               );

//               return {
//                 ...req,
//                 pinnedNumber: {
//                   id: matchingNumber ? matchingNumber.id : null, // important: actual phone record id
//                   friendlyName: firstTwilio.phoneNumber, // or matchingNumber?.friendlyName ?? firstTwilio.phoneNumber
//                   phoneNumber: firstTwilio.phoneNumber,
//                   countryCode: matchingNumber
//                     ? matchingNumber.countryCode
//                     : firstTwilio.phoneNumber.startsWith("+1")
//                       ? "US"
//                       : "BD",
//                 },
//               };
//             }
//           );

//           setRequests(mappedRequests);

//           // build selectedNumbers only for those where we found a real phone-record id
//           const pinnedMap: Record<string, string> = {};
//           mappedRequests.forEach((req) => {
//             if (req.pinnedNumber && req.pinnedNumber.id) {
//               pinnedMap[req.id] = req.pinnedNumber.id!;
//             }
//           });
//           setSelectedNumbers(pinnedMap);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [token]);

//   const handlePin = async (
//     requestId: string,
//     availableNumberId: string,
//     orgId: string
//   ) => {
//     if (!availableNumberId) return;
//     try {
//       const res = await fetch(
//         `${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/${availableNumberId}/pin`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token || "",
//           },
//           body: JSON.stringify({
//             isPinned: true,
//             organizationId: orgId,
//           }),
//         }
//       );

//       const json = await res.json();
//       if (json.success) {
//         // remove pinned from dropdown
//         setAvailableNumbers((prev) =>
//           prev.filter((n) => n.id !== availableNumberId)
//         );
//         setSelectedNumbers((prev) => ({
//           ...prev,
//           [requestId]: availableNumberId,
//         }));

//         // update the request to show pinnedNumber (use json.data if it returns the phone object)
//         const pinnedObj = (() => {
//           // prefer server response if available
//           if (json.data) {
//             return {
//               id: json.data.id,
//               friendlyName: json.data.friendlyName ?? json.data.phoneNumber,
//               phoneNumber: json.data.phoneNumber ?? json.data.friendlyName,
//               countryCode:
//                 json.data.countryCode ??
//                 (json.data.phoneNumber?.startsWith("+1") ? "US" : "BD"),
//             };
//           }
//           // fallback: find from availableNumbers state (we removed it above so reference from previous state)
//           const found = (availableNumbers || []).find(
//             (n) => n.id === availableNumberId
//           );
//           if (found) {
//             return {
//               id: found.id,
//               friendlyName: found.friendlyName,
//               phoneNumber: found.phoneNumber,
//               countryCode: found.countryCode,
//             };
//           }
//           return null;
//         })();

//         setRequests((prev) =>
//           prev.map((r) =>
//             r.id === requestId
//               ? {
//                 ...r,
//                 pinnedNumber: pinnedObj,
//               }
//               : r
//           )
//         );
//       } else {
//         console.error("Failed to pin:", json.message);
//       }
//     } catch (error) {
//       console.error("Error pinning number:", error);
//     }
//   };

//   const handleUnpin = async (
//     requestId: string,
//     pinnedNumberId: string | undefined | null
//   ) => {
//     if (!pinnedNumberId) {
//       console.warn("No pinnedNumberId available for unpin. Unpin skipped.");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/${pinnedNumberId}/pin`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token || "",
//           },
//           body: JSON.stringify({ isPinned: false }),
//         }
//       );

//       const json = await res.json();

//       if (json.success) {
//         // server returns the number object in json.data (per your docs)
//         if (json.data) {
//           setAvailableNumbers((prev) => [...prev, json.data]);
//         }

//         setRequests((prev) =>
//           prev.map((r) =>
//             r.id === requestId ? { ...r, pinnedNumber: null } : r
//           )
//         );

//         setSelectedNumbers((prev) => {
//           const newState = { ...prev };
//           delete newState[requestId];
//           return newState;
//         });
//       } else {
//         console.error("Failed to unpin:", json.message);
//       }
//     } catch (error) {
//       console.error("Error unpinning number:", error);
//     }
//   };

//   // Filter search
//   const filteredRequests = requests.filter(
//     (req) =>
//       req.organization.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       req.organization.ownedOrganization.email
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase()) ||
//       req.requestedPhonePattern
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="bg-white p-4 rounded-md shadow">
//         {/* Search */}
//         <div className="flex items-center mb-4 border border-gray-200 rounded-md px-3 py-2">
//           <Search size={18} className="text-gray-500 mr-2" />
//           <input
//             type="text"
//             placeholder="Search by Organization or Number"
//             className="w-full outline-none text-sm"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse text-sm text-gray-700">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="border border-gray-200 px-3 py-2">
//                   Organization
//                 </th>
//                 <th className="border border-gray-200 px-3 py-2">Email</th>
//                 <th className="border border-gray-200 px-3 py-2">
//                   Requested Number
//                 </th>
//                 <th className="border border-gray-200 px-3 py-2">
//                   Select Number
//                 </th>
//                 <th className="border border-gray-200 px-3 py-2">
//                   Pinned Number
//                 </th>
//                 <th className="border border-gray-200 px-3 py-2">
//                   Country Code
//                 </th>
//                 <th className="border border-gray-200 px-3 py-2 text-center">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={8} className="text-center py-6 text-gray-500">
//                     <Loading />
//                   </td>
//                 </tr>
//               ) : filteredRequests.length > 0 ? (
//                 filteredRequests.map((req) => (
//                   <tr key={req.id} className="hover:bg-gray-50">
//                     <td className="border border-gray-200 px-3 py-2">
//                       {req.organization.name}
//                     </td>
//                     <td className="border border-gray-200 px-3 py-2">
//                       {req.organization.ownedOrganization.email}
//                     </td>
//                     <td className="border border-gray-200 px-3 py-2">
//                       {req.requestedPhonePattern}
//                     </td>

//                     <td className="border border-gray-200 px-3 py-2">
//                       <select
//                         className="border border-gray-300 rounded px-2 py-1 text-sm"
//                         value={selectedNumbers[req.id] || ""}
//                         onChange={(e) =>
//                           handlePin(req.id, e.target.value, req.organization.id)
//                         }
//                         disabled={!!req.pinnedNumber && !!req.pinnedNumber.id}
//                       >
//                         <option value="">Select Number</option>
//                         {availableNumbers.map((num) => (
//                           <option key={num.id} value={num.id}>
//                             {num.friendlyName} ({num.countryCode})
//                           </option>
//                         ))}
//                       </select>
//                     </td>

//                     <td className="border border-gray-200 px-3 py-2">
//                       {req.pinnedNumber ? (
//                         <span className="text-sm font-medium text-green-700">
//                           {req.pinnedNumber.friendlyName}
//                         </span>
//                       ) : (
//                         "—"
//                       )}
//                     </td>

//                     <td className="border border-gray-200 px-3 py-2 text-center">
//                       {req.pinnedNumber ? req.pinnedNumber.countryCode : "—"}
//                     </td>

//                     <td className="border border-gray-200 px-3 py-2 text-center">
//                       {req.pinnedNumber && req.pinnedNumber.id ? (
//                         <button
//                           onClick={() =>
//                             handleUnpin(req.id, req.pinnedNumber!.id)
//                           }
//                           className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
//                         >
//                           Unpin
//                         </button>
//                       ) : req.pinnedNumber ? (
//                         <span className="text-xs text-yellow-600">
//                           Pinned (no id)
//                         </span>
//                       ) : (
//                         <button
//                           onClick={() =>
//                             handlePin(
//                               req.id,
//                               selectedNumbers[req.id],
//                               req.organization.id
//                             )
//                           }
//                           className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
//                         >
//                           Pin
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={8} className="text-center py-6 text-gray-500">
//                     No requests found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewRequestNumberListPage;

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

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

const ViewRequestNumberListPage = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNumbers, setSelectedNumbers] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });

  const fetchData = async (page: number = 1) => {
    if (!token) return;

    try {
      const [res1, res2] = await Promise.all([
        fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/requests?page=${page}&limit=${pagination.limit}`, {
          headers: { Authorization: token },
        }),
        fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/all`, {
          headers: { Authorization: token },
        }),
      ]);

      const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

      // set available numbers from data2 (only those not pinned)
      if (data2.success) {
        const filteredNumbers = (data2.data || []).filter(
          (num: AvailableNumber) => !num.isPinned
        );
        setAvailableNumbers(filteredNumbers);
      }

      if (data1.success) {
        // Update pagination meta
        if (data1.meta) {
          setPagination(data1.meta);
        }

        // map requests and try to resolve pinnedNumber -> actual phone record id from data2
        const allNumbers: AvailableNumber[] = data2.success ? data2.data || [] : [];

        const mappedRequests: RequestData[] = (data1.data || []).map((req: any) => {
          const firstTwilio = req.organization?.requestedTwilioNumbers?.[0];
          if (!firstTwilio) {
            return { ...req, pinnedNumber: null };
          }

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
        });

        setRequests(mappedRequests);

        // build selectedNumbers only for those where we found a real phone-record id
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

  useEffect(() => {
    fetchData(pagination.page);
  }, [token]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPage) return;

    // Optimistic UI update
    setPagination(prev => ({ ...prev, page: newPage }));
    setLoading(true);

    fetchData(newPage);
  };

  const handlePin = async (
    requestId: string,
    availableNumberId: string,
    orgId: string
  ) => {
    if (!availableNumberId) return;

    // Optimistic UI update
    const pinnedNumber = availableNumbers.find(n => n.id === availableNumberId);
    if (pinnedNumber) {
      setAvailableNumbers((prev) => prev.filter((n) => n.id !== availableNumberId));
      setSelectedNumbers((prev) => ({ ...prev, [requestId]: availableNumberId }));
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
              ...r,
              pinnedNumber: {
                id: pinnedNumber.id,
                friendlyName: pinnedNumber.friendlyName,
                phoneNumber: pinnedNumber.phoneNumber,
                countryCode: pinnedNumber.countryCode,
              },
            }
            : r
        )
      );
    }

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
      if (!json.success) {
        // Revert optimistic update on failure
        console.error("Failed to pin:", json.message);
        if (pinnedNumber) {
          setAvailableNumbers((prev) => [...prev, pinnedNumber]);
          setRequests((prev) =>
            prev.map((r) => (r.id === requestId ? { ...r, pinnedNumber: null } : r))
          );
          setSelectedNumbers((prev) => {
            const newState = { ...prev };
            delete newState[requestId];
            return newState;
          });
        }
      }
    } catch (error) {
      console.error("Error pinning number:", error);
      // Revert optimistic update on error
      if (pinnedNumber) {
        setAvailableNumbers((prev) => [...prev, pinnedNumber]);
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, pinnedNumber: null } : r))
        );
        setSelectedNumbers((prev) => {
          const newState = { ...prev };
          delete newState[requestId];
          return newState;
        });
      }
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

    // Optimistic UI update - store pinned number before removing
    const request = requests.find(r => r.id === requestId);
    const pinnedNumberData = request?.pinnedNumber;

    if (pinnedNumberData && pinnedNumberData.id) {
      const unpinnedNumber: AvailableNumber = {
        id: pinnedNumberData.id,
        friendlyName: pinnedNumberData.friendlyName,
        phoneNumber: pinnedNumberData.phoneNumber,
        countryCode: pinnedNumberData.countryCode,
        isPinned: false,
      };

      setAvailableNumbers((prev) => [...prev, unpinnedNumber]);
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, pinnedNumber: null } : r))
      );
      setSelectedNumbers((prev) => {
        const newState = { ...prev };
        delete newState[requestId];
        return newState;
      });
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

      if (!json.success) {
        // Revert optimistic update on failure
        console.error("Failed to unpin:", json.message);
        if (pinnedNumberData) {
          setAvailableNumbers((prev) =>
            prev.filter(n => n.id !== pinnedNumberData.id)
          );
          setRequests((prev) =>
            prev.map((r) =>
              r.id === requestId ? { ...r, pinnedNumber: pinnedNumberData } : r
            )
          );
          setSelectedNumbers((prev) => ({
            ...prev,
            [requestId]: pinnedNumberData.id!,
          }));
        }
      }
    } catch (error) {
      console.error("Error unpinning number:", error);
      // Revert optimistic update on error
      if (pinnedNumberData) {
        setAvailableNumbers((prev) =>
          prev.filter(n => n.id !== pinnedNumberData.id)
        );
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId ? { ...r, pinnedNumber: pinnedNumberData } : r
          )
        );
        setSelectedNumbers((prev) => ({
          ...prev,
          [requestId]: pinnedNumberData.id!,
        }));
      }
    }
  };

  // Filter search
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

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="bg-white p-4 rounded-md shadow">
        {/* Search */}
        <div className="flex items-center mb-4 border border-gray-200 rounded-md px-3 py-2">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by Organization or Number"
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
                <th className="border border-gray-200 px-3 py-2">Organization</th>
                <th className="border border-gray-200 px-3 py-2">Email</th>
                <th className="border border-gray-200 px-3 py-2">Requested Number</th>
                <th className="border border-gray-200 px-3 py-2">Select Number</th>
                <th className="border border-gray-200 px-3 py-2">Pinned Number</th>
                <th className="border border-gray-200 px-3 py-2">Country Code</th>
                <th className="border border-gray-200 px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    <Loading />
                  </td>
                </tr>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
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
                          onClick={() => handleUnpin(req.id, req.pinnedNumber!.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Unpin
                        </button>
                      ) : req.pinnedNumber ? (
                        <span className="text-xs text-yellow-600">Pinned (no id)</span>
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
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPage > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing page {pagination.page} of {pagination.totalPage} ({pagination.total} total requests)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map((page) => {
                  // Show first, last, current, and pages around current
                  const showPage =
                    page === 1 ||
                    page === pagination.totalPage ||
                    (page >= pagination.page - 1 && page <= pagination.page + 1);

                  const showEllipsis =
                    (page === 2 && pagination.page > 3) ||
                    (page === pagination.totalPage - 1 && pagination.page < pagination.totalPage - 2);

                  if (!showPage && !showEllipsis) return null;

                  if (showEllipsis) {
                    return <span key={page} className="px-2 text-gray-400">...</span>;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded text-sm ${pagination.page === page
                        ? "bg-blue-500 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPage}
                className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRequestNumberListPage;
