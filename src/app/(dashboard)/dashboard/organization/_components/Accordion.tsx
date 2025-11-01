"use client";

import { ReactNode } from "react";
import { AccordionProvider } from "./AccordionContext";

interface AccordionProps {
  children: ReactNode;
  defaultOpenId?: string | null;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpenId = null,
  className = "",
}) => {
  return (
    <AccordionProvider defaultOpenId={defaultOpenId}>
      <div className={`w-full ${className}`}>{children}</div>
    </AccordionProvider>
  );
};

// import { Accordion, AccordionItem } from "@/components/Accordion";
// import { Suspense } from "react";

// export default function Page() {
//   return (
//     <Accordion defaultOpenId="users">
//       <AccordionItem id="users" title="Users">
//         <Suspense fallback={<div>Loading...</div>}>
//           <UserList />
//         </Suspense>
//       </AccordionItem>

//       <AccordionItem id="posts" title="Posts">
//         <Suspense fallback={<div>Loading...</div>}>
//           <PostList />
//         </Suspense>
//       </AccordionItem>
//     </Accordion>
//   );
// }
