// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/components/AuthProvider';
// import { Plus } from 'lucide-react';
// import Image from 'next/image';
// import GoogleSheetsIntegration from './GoogleSheetsIntegration';

// const ToolsPageContainerPage = () => {
//   const auth = useAuth();
//   const orgId = auth?.user?.ownedOrganization?.id || ''
//   const [selectedTool, setSelectedTool] = useState<string | null>(null);

//   const tools = [
//     {
//       name: 'HubSpot',
//       icon: '/hubspot.png',
//     },
//     {
//       name: 'Google Sheets',
//       icon: '/sheet.png',
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Title */}
//       <div className="flex items-center gap-2 mb-4">
//         <Image
//           src="/framer.png"
//           alt="icon"
//           width={25}
//           height={25}
//           className="object-contain"
//         />
//         <h1 className="text-lg font-semibold text-gray-800">
//           Tools
//         </h1>
//       </div>

//       {selectedTool === 'Google Sheets' ? (
//         <GoogleSheetsIntegration
//           orgId={orgId}
//           onBack={() => setSelectedTool(null)} // back button pressed
//         />
//       ) : (
//         // Tool List
//         <div className="bg-white shadow-sm border border-gray-200 rounded-md divide-y">
//           {tools.map((tool: any) => (
//             <div
//               key={tool.name}
//               className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
//             >
//               <div className="flex items-center gap-3">
//                 <Image
//                   src={tool.icon}
//                   alt={tool.name}
//                   width={25}
//                   height={25}
//                   className="object-contain"
//                 />
//                 <span className="text-sm text-gray-800">{tool.name}</span>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setSelectedTool(tool.name)}
//                 className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700"
//               >
//                 <Plus className="w-4 h-4 text-white" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ToolsPageContainerPage;


//! Try - 1

// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/components/AuthProvider';
// import { Plus } from 'lucide-react';
// import Image from 'next/image';
// import GoogleSheetsIntegration from './GoogleSheetsIntegration';
// import HubSpotIntegration from './HubSpotIntegration';

// const ToolsPageContainerPage = () => {
//   const auth = useAuth();
//   const orgId = auth?.user?.ownedOrganization?.id || '';
//   const [selectedTool, setSelectedTool] = useState<string | null>(null);



//   const tools = [
//     { name: 'HubSpot', icon: '/hubspot.png' },
//     { name: 'Google Sheets', icon: '/sheet.png' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="flex items-center gap-2 mb-4">
//         <Image
//           src="/framer.png"
//           alt="icon"
//           width={25}
//           height={25}
//           className="object-contain"
//         />
//         <h1 className="text-lg font-semibold text-gray-800">
//           Tools
//         </h1>
//       </div>

//       {selectedTool === 'Google Sheets' ? (
//         <GoogleSheetsIntegration orgId={orgId} onBack={() => setSelectedTool(null)} />
//       ) : selectedTool === 'HubSpot' ? (
//         <HubSpotIntegration orgId={orgId} onBack={() => setSelectedTool(null)} />
//       ) : (
//         <div className="bg-white shadow-sm border border-gray-200 rounded-md divide-y">
//           {tools.map((tool) => (
//             <div
//               key={tool.name}
//               className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
//             >
//               <div className="flex items-center gap-3">
//                 <Image
//                   src={tool.icon}
//                   alt={tool.name}
//                   width={25}
//                   height={25}
//                   className="object-contain"
//                 />
//                 <span className="text-sm text-gray-800">{tool.name}</span>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setSelectedTool(tool.name)}
//                 className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700"
//               >
//                 <Plus className="w-4 h-4 text-white" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ToolsPageContainerPage;

//! Try = 2
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import GoogleSheetsIntegration from "./GoogleSheetsIntegration";
import HubSpotIntegration from "./HubSpotIntegration";

const ToolsPageContainerPage = () => {
  const auth = useAuth();
  const orgId = auth?.user?.ownedOrganization?.id || "";
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  console.log("OrgId: ", orgId);

  // ✅ Handle success/error toast after OAuth callback
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      toast.success(decodeURIComponent(success));
      router.replace("/dashboard/organization/tools", { scroll: false });
    } else if (error) {
      toast.error(decodeURIComponent(error));
      router.replace("/dashboard/organization/tools", { scroll: false });
    }
  }, [searchParams, router]);

  const tools = [
    { name: "HubSpot", icon: "/hubspot.png" },
    { name: "Google Sheets", icon: "/sheet.png" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Image
          src="/framer.png"
          alt="icon"
          width={25}
          height={25}
          className="object-contain"
        />
        <h1 className="text-lg font-semibold text-gray-800">Tools</h1>
      </div>

      {selectedTool === "Google Sheets" ? (
        <GoogleSheetsIntegration orgId={orgId} onBack={() => setSelectedTool(null)} />
      ) : selectedTool === "HubSpot" ? (
        <HubSpotIntegration orgId={orgId} onBack={() => setSelectedTool(null)} />
      ) : (
        <div className="bg-white shadow-sm border border-gray-200 rounded-md divide-y">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={tool.icon}
                  alt={tool.name}
                  width={25}
                  height={25}
                  className="object-contain"
                />
                <span className="text-sm text-gray-800">{tool.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTool(tool.name)}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolsPageContainerPage;


