// "use client";

// import React, { useEffect, useState } from "react";
// import { env } from "@/env";
// import { useAuth } from "@/components/AuthProvider";
// import { Search } from "lucide-react";

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
//   organization: Organization;
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
//   const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedNumbers, setSelectedNumbers] = useState<Record<string, string>>({}); // requestId -> availableNumberId
//   const [searchQuery, setSearchQuery] = useState("");

//   // ✅ Fetch all requests
//   useEffect(() => {
//     if (!token) return;
//     const fetchRequests = async () => {
//       try {
//         const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/requests`, {
//           headers: { Authorization: token },
//         });
//         const json = await res.json();
//         if (json.success) {
//           setRequests(json.data || []);
//         }
//       } catch (error) {
//         console.error("Error fetching requests:", error);
//       }
//     };

//     const fetchAvailableNumbers = async () => {
//       try {
//         // const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers/organization/available`, {
//         const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/all`, {
//           headers: { Authorization: token },
//         });
//         const json = await res.json();
//         console.log("Available Numbers: ", json.data);
//         if (json.success) {
//           setAvailableNumbers(json.data || []);
//         }
//       } catch (error) {
//         console.error("Error fetching available numbers:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//     fetchAvailableNumbers();
//   }, [token]);

//   // ✅ Handle pinning
//   const handlePin = async (requestId: string, availableNumberId: string, orgId: string) => {
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
//         // Remove selected number from available list
//         setAvailableNumbers((prev) => prev.filter((n) => n.id !== availableNumberId));
//         setSelectedNumbers((prev) => ({
//           ...prev,
//           [requestId]: availableNumberId,
//         }));
//         console.log("Pinned successfully:", json.message);
//       } else {
//         console.error("Failed to pin:", json.message);
//       }
//     } catch (error) {
//       console.error("Error pinning number:", error);
//     }
//   };

//   const filteredRequests = requests.filter(
//     (req) =>
//       req.organization.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       req.organization.ownedOrganization.email
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase()) ||
//       req.requestedPhonePattern.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="bg-gray-50 min-h-screen p-6">
//       <h1 className="text-2xl font-semibold mb-6">Number Management</h1>

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
//                 <th className="border border-gray-200 px-3 py-2">Organization</th>
//                 <th className="border border-gray-200 px-3 py-2">Email</th>
//                 <th className="border border-gray-200 px-3 py-2">Requested Number</th>
//                 <th className="border border-gray-200 px-3 py-2">Pinned Number</th>
//                 <th className="border border-gray-200 px-3 py-2">Country Code</th>
//                 <th className="border border-gray-200 px-3 py-2">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="text-center py-6 text-gray-500">
//                     Loading...
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
//                       >
//                         <option value="">Select Number</option>
//                         {availableNumbers.map((num) => (
//                           <option key={num.id} value={num.id}>
//                             {num.friendlyName} ({num.countryCode})
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="border border-gray-200 px-3 py-2 text-center">
//                       {selectedNumbers[req.id]
//                         ? availableNumbers.find(
//                           (n) => n.id === selectedNumbers[req.id]
//                         )?.countryCode || "US"
//                         : "—"}
//                     </td>
//                     <td className="border border-gray-200 px-3 py-2">
//                       <span
//                         className={`text-xs px-2 py-1 rounded text-white ${req.status === "PENDING"
//                           ? "bg-yellow-500"
//                           : "bg-green-500"
//                           }`}
//                       >
//                         {req.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={6} className="text-center py-6 text-gray-500">
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


// "use client";

// import React, { useEffect, useState } from "react";
// import { env } from "@/env";
// import { useAuth } from "@/components/AuthProvider";
// import { Search } from "lucide-react";

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
//   organization: Organization;
//   pinnedNumber?: {
//     id: string;
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
//   const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedNumbers, setSelectedNumbers] = useState<Record<string, string>>({});
//   const [searchQuery, setSearchQuery] = useState("");

//   // ✅ Fetch requests + available numbers
//   useEffect(() => {
//     if (!token) return;

//     const fetchData = async () => {
//       try {
//         // Fetch requests (with pinned numbers if available)
//         const res1 = await fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/requests`, {
//           headers: { Authorization: token },
//         });
//         const data1 = await res1.json();

//         // Fetch available numbers
//         const res2 = await fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/all`, {
//           headers: { Authorization: token },
//         });
//         const data2 = await res2.json();
//         console.log("Data to rent mobile: ", data2)
//         if (data1.success) {
//           setRequests(data1.data || []);
//           // ✅ Detect pinned numbers from backend response
//           const pinnedMap: Record<string, string> = {};
//           data1.data.forEach((req: RequestData) => {
//             if (req.pinnedNumber) {
//               pinnedMap[req.id] = req.pinnedNumber.id;
//             }
//           });
//           setSelectedNumbers(pinnedMap);
//         }

//         if (data2.success) {
//           setAvailableNumbers(data2.data || []);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [token]);

//   // ✅ Handle pinning
//   const handlePin = async (requestId: string, availableNumberId: string, orgId: string) => {
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
//       console.log("Pin Response: ", json);
//       if (json.success) {
//         setAvailableNumbers((prev) => prev.filter((n) => n.id !== availableNumberId));
//         setSelectedNumbers((prev) => ({
//           ...prev,
//           [requestId]: availableNumberId,
//         }));

//         // ✅ Update pinnedNumber in request list (so reload unnecessary)
//         setRequests((prev) =>
//           prev.map((r) =>
//             r.id === requestId
//               ? {
//                 ...r,
//                 pinnedNumber: availableNumbers.find((n) => n.id === availableNumberId) || null,
//               }
//               : r
//           )
//         );

//         console.log("Pinned successfully:", json.message);
//       } else {
//         console.error("Failed to pin:", json.message);
//       }
//     } catch (error) {
//       console.error("Error pinning number:", error);
//     }
//   };

//   // ✅ Filter by organization or requested number
//   const filteredRequests = requests.filter(
//     (req) =>
//       req.organization.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       req.organization.ownedOrganization.email
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase()) ||
//       req.requestedPhonePattern.toLowerCase().includes(searchQuery.toLowerCase())
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
//                 <th className="border border-gray-200 px-3 py-2">Organization</th>
//                 <th className="border border-gray-200 px-3 py-2">Email</th>
//                 <th className="border border-gray-200 px-3 py-2">Requested Number</th>
//                 <th className="border border-gray-200 px-3 py-2">Select Number</th>
//                 <th className="border border-gray-200 px-3 py-2">Pinned Number</th>
//                 <th className="border border-gray-200 px-3 py-2">Country Code</th>
//                 <th className="border border-gray-200 px-3 py-2">Status</th>
//                 <th className="border border-gray-200 px-3 py-2">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="text-center py-6 text-gray-500">
//                     Loading...
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
//                       <div className="flex items-center gap-2">
//                         <select
//                           className="border border-gray-300 rounded px-2 py-1 text-sm"
//                           value={selectedNumbers[req.id] || ""}
//                           onChange={(e) =>
//                             handlePin(req.id, e.target.value, req.organization.id)
//                           }
//                         >
//                           <option value="">Select Number</option>
//                           {availableNumbers.map((num) => (
//                             <option key={num.id} value={num.id}>
//                               {num.friendlyName} ({num.countryCode})
//                             </option>
//                           ))}
//                         </select>

//                         {/* ✅ Show pinned number */}
//                         {req.pinnedNumber && (
//                           <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
//                             {req.pinnedNumber.friendlyName}{" "}
//                             <span className="text-gray-400">({req.pinnedNumber.countryCode})</span>
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="border border-gray-200 px-3 py-2 text-center">
//                       {req.pinnedNumber
//                         ? req.pinnedNumber.countryCode
//                         : "—"}
//                     </td>
//                     <td className="border border-gray-200 px-3 py-2">
//                       <span
//                         className={`text-xs px-2 py-1 rounded text-white ${req.status === "PENDING" ? "bg-yellow-500" : "bg-green-500"
//                           }`}
//                       >
//                         {req.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={6} className="text-center py-6 text-gray-500">
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


//! Try - 1

"use client";

import React, { useEffect, useState } from "react";
import { env } from "@/env";
import { useAuth } from "@/components/AuthProvider";
import { Search } from "lucide-react";

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
  organization: Organization;
  pinnedNumber?: {
    id: string;
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
  const [loading, setLoading] = useState(true);
  const [selectedNumbers, setSelectedNumbers] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch requests + available numbers
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
        console.log("Data to rent mobile: ", data2);

        if (data1.success) {
          setRequests(data1.data || []);
          const pinnedMap: Record<string, string> = {};
          data1.data.forEach((req: RequestData) => {
            if (req.pinnedNumber) {
              pinnedMap[req.id] = req.pinnedNumber.id;
            }
          });
          setSelectedNumbers(pinnedMap);
        }

        if (data2.success) {
          setAvailableNumbers(data2.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // ✅ Handle pinning number
  const handlePin = async (requestId: string, availableNumberId: string, orgId: string) => {
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
      console.log("Pin Response: ", json);
      if (json.success) {
        setAvailableNumbers((prev) => prev.filter((n) => n.id !== availableNumberId));
        setSelectedNumbers((prev) => ({
          ...prev,
          [requestId]: availableNumberId,
        }));

        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId
              ? {
                ...r,
                pinnedNumber: availableNumbers.find((n) => n.id === availableNumberId) || null,
              }
              : r
          )
        );
      } else {
        console.error("Failed to pin:", json.message);
      }
    } catch (error) {
      console.error("Error pinning number:", error);
    }
  };

  // ✅ Handle unpin
  const handleUnpin = async (requestId: string, pinnedNumberId: string) => {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/active-numbers/admin/${pinnedNumberId}/unpin`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({
            isPinned: false,
          }),
        }
      );

      const json = await res.json();
      console.log("Unpin Response: ", json);

      if (json.success) {
        // ✅ Add back to availableNumbers
        setAvailableNumbers((prev) => [
          ...prev,
          json.data, // assuming backend returns unpinned number object
        ]);

        // ✅ Remove from requests pinnedNumber
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId
              ? {
                ...r,
                pinnedNumber: null,
              }
              : r
          )
        );

        // ✅ Clear selected number state
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

  // ✅ Filter search
  const filteredRequests = requests.filter(
    (req) =>
      req.organization.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.organization.ownedOrganization.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      req.requestedPhonePattern.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
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
                <th className="border border-gray-200 px-3 py-2">Status</th>
                <th className="border border-gray-200 px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2">{req.organization.name}</td>
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
                        onChange={(e) => handlePin(req.id, e.target.value, req.organization.id)}
                        disabled={!!req.pinnedNumber}
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

                    <td className="border border-gray-200 px-3 py-2">
                      <span
                        className={`text-xs px-2 py-1 rounded text-white ${req.status === "PENDING" ? "bg-yellow-500" : "bg-green-500"
                          }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td className="border border-gray-200 px-3 py-2 text-center">
                      {req.pinnedNumber ? (
                        <button
                          onClick={() => handleUnpin(req.id, req.pinnedNumber!.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Unpin
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handlePin(req.id, selectedNumbers[req.id], req.organization.id)
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
      </div>
    </div>
  );
};

export default ViewRequestNumberListPage;
