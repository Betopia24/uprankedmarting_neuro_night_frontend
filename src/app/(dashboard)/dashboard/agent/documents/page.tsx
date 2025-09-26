import React from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import Pagination from "@/components/table/components/Pagination";
import SearchField from "@/components/table/components/SearchField";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";
import { formatDateTime } from "@/utils/formatDateTime";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { agentDocumentsPath } from "@/paths";

export interface TableSearchParams {
  page?: number;
  limit?: number;
  sort?: string; // frontend only: "field.asc" or "field.desc"
  query?: string;
  [key: string]: string | string[] | number | undefined;
}

interface TableProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

interface CompanyDoc {
  id: string;
  organizationId: string;
  docFor: string;
  fileName: string;
  cloudUrl: string;
  fileFormat: string;
  createdAt: string;
  updatedAt: string;
}

interface CompanyDocApiResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: CompanyDoc[];
}

interface TableRow {
  id: string;
  fileName: string;
  fileFormat: string;
  docFor: string;
  createdAt: string;
  actions: React.ReactNode;
  _rawCreatedAt: string;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "";

const basePath = agentDocumentsPath();

// Simple TableHeaderItem component built into this file
function TableHeaderItem({
  field,
  currentSort,
  limit,
  searchQuery,
  basePath,
}: {
  field: keyof TableRow;
  currentSort: string;
  currentPage: number;
  limit: number;
  searchQuery: string;
  basePath: string;
}) {
  // Don't make actions sortable
  if (field === "actions") {
    return (
      <th className="px-4 py-3 text-left font-medium text-gray-900 border border-gray-200">
        Actions
      </th>
    );
  }

  // Parse current sort
  const [currentSortField, currentSortDirection] = currentSort
    ? currentSort.split(".")
    : ["", ""];
  const isCurrentField = currentSortField === field;

  // Determine next sort direction
  let nextSortDirection: string;
  if (!isCurrentField) {
    nextSortDirection = "asc";
  } else if (currentSortDirection === "asc") {
    nextSortDirection = "desc";
  } else {
    nextSortDirection = "asc";
  }

  // Build the new sort parameter
  const newSort = `${field}.${nextSortDirection}`;

  // Build URL with new sort
  const params = new URLSearchParams();
  params.set("page", "1");
  params.set("limit", String(limit));
  if (searchQuery) params.set("query", searchQuery);
  params.set("sort", newSort);

  const href = `${basePath}?${params.toString()}`;

  // Format field name for display
  const displayName = field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

  return (
    <th className="px-4 py-3 text-left font-medium text-gray-900 border border-gray-200">
      <Link
        href={href}
        className="flex items-center gap-1 hover:text-blue-600 transition-colors group"
      >
        {displayName}
        <div className="flex flex-col">
          <ChevronUp
            className={`w-3 h-3 transition-colors ${
              isCurrentField && currentSortDirection === "asc"
                ? "text-blue-600"
                : "text-gray-400 group-hover:text-gray-600"
            }`}
          />
          <ChevronDown
            className={`w-3 h-3 -mt-1 transition-colors ${
              isCurrentField && currentSortDirection === "desc"
                ? "text-blue-600"
                : "text-gray-400 group-hover:text-gray-600"
            }`}
          />
        </div>
      </Link>
    </th>
  );
}

async function getCompanyDocs(
  params: TableSearchParams
): Promise<CompanyDocApiResponse | null> {
  const auth = await getServerAuth();
  if (!auth?.accessToken) return null;

  const orgId = auth?.data?.Agent?.organization?.id;
  if (!orgId) return null;

  const url = new URL(`${env.API_BASE_URL}/company-docs/organization/${orgId}`);
  url.searchParams.set("page", String(params.page ?? DEFAULT_PAGE));
  url.searchParams.set("limit", String(params.limit ?? DEFAULT_LIMIT));
  if (params.query) url.searchParams.set("searchTerm", String(params.query));

  const res = await fetch(url.toString(), {
    headers: { Authorization: auth.accessToken },
    cache: "no-cache",
  });

  if (!res.ok) return null;

  const json: CompanyDocApiResponse = await res.json();
  return json;
}

export default async function CompanyDocsPage({ searchParams }: TableProps) {
  const sp: Record<string, string | string[] | undefined> = searchParams
    ? await searchParams
    : {};

  const queryParams: TableSearchParams = {
    page: sp.page
      ? parseInt(Array.isArray(sp.page) ? sp.page[0] : sp.page, 10)
      : DEFAULT_PAGE,
    limit: sp.limit
      ? parseInt(Array.isArray(sp.limit) ? sp.limit[0] : sp.limit, 10)
      : DEFAULT_LIMIT,
    sort: sp.sort
      ? Array.isArray(sp.sort)
        ? sp.sort[0]
        : sp.sort
      : DEFAULT_SORT,
    query: sp.query ? (Array.isArray(sp.query) ? sp.query[0] : sp.query) : "",
  };

  const response = await getCompanyDocs(queryParams);
  if (!response || !response.data)
    return (
      <div className="py-16 text-center text-gray-500 bg-white shadow-sm rounded-lg">
        No Documents Found.
      </div>
    );

  const { data: docs, meta } = response;

  // Map docs to tableData
  let tableData: TableRow[] = docs.map((doc) => {
    const lowerFormat = doc.fileFormat.toLowerCase();

    let previewUrl: string | null = null;
    if (lowerFormat === "pdf") {
      previewUrl = doc.cloudUrl;
    } else if (
      ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "pages"].includes(
        lowerFormat
      )
    ) {
      previewUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
        doc.cloudUrl
      )}&embedded=true`;
    }

    return {
      id: doc.id,
      fileName: doc.fileName,
      fileFormat: doc.fileFormat.toUpperCase(),
      docFor: doc.docFor,
      createdAt: formatDateTime(doc.createdAt),
      actions: (
        <Dialog modal>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-lg">
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl! w-full! h-screen flex flex-col p-0 gap-0 overflow-hidden">
            <DialogHeader className="flex-shrink-0 px-6 py-4 border-b bg-white/95 backdrop-blur-sm pr-14">
              <div className="flex items-center justify-between gap-4">
                <DialogTitle className="text-lg font-semibold text-gray-900 min-w-0 flex-1">
                  <div
                    className="truncate max-w-[400px]"
                    title={`${doc.fileName}.${doc.fileFormat
                      .toLowerCase()
                      .slice(0, 15)}`}
                  >
                    {doc.fileName}.{doc.fileFormat.toLowerCase().slice(0, 15)}
                  </div>
                </DialogTitle>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border">
                    {doc.fileFormat.toUpperCase()}
                  </span>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-8 px-3"
                  >
                    <a
                      href={doc.cloudUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-gray-50 to-gray-100/50">
              {previewUrl ? (
                <div className="flex-1 p-4">
                  <div className="w-full h-full bg-white rounded-xl shadow-lg border border-gray-200/50 overflow-hidden ring-1 ring-gray-900/5">
                    <iframe
                      src={previewUrl}
                      className="w-full h-full border-0"
                      title={doc.fileName.slice(0, 15)}
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center shadow-sm">
                    <svg
                      className="w-8 h-8 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>

                  <div className="space-y-3 max-w-sm">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Preview Not Available
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Preview is not supported for{" "}
                      <span className="font-semibold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                        {doc.fileFormat.toUpperCase()}
                      </span>{" "}
                      files. Download the file to view its contents.
                    </p>
                  </div>

                  <Button asChild className="mt-2 shadow-sm">
                    <a
                      href={doc.cloudUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download File
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      ),
      _rawCreatedAt: doc.createdAt,
    };
  });

  // Frontend-only sorting
  const sortKey = queryParams.sort; // example: "createdAt.asc"
  if (sortKey) {
    const [field, direction] = sortKey.split(".");
    tableData.sort((a, b) => {
      const dir = direction === "desc" ? -1 : 1;
      let valA: any = a[field as keyof TableRow];
      let valB: any = b[field as keyof TableRow];

      // Use raw date for createdAt sorting
      if (field === "createdAt") {
        valA = a._rawCreatedAt;
        valB = b._rawCreatedAt;
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return valA.localeCompare(valB) * dir;
      }

      return 0;
    });
  }

  const tableHeader: (keyof TableRow)[] = [
    "fileName",
    "fileFormat",
    "docFor",
    "createdAt",
    "actions",
  ];

  // Parse current sort to get field and direction
  const currentSort = queryParams.sort ?? "";
  const [sortField, sortDirection] = currentSort
    ? currentSort.split(".")
    : ["", ""];

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchField
          basePath={basePath}
          defaultQuery={queryParams.query ?? ""}
        />

        {/* Debug info - you can remove this after confirming it works */}
        <div className="text-sm text-gray-500 bg-gray-100 p-2 rounded">
          Sort: {currentSort || "none"} | Field: {sortField || "none"} | Dir:{" "}
          {sortDirection || "none"}
        </div>
      </div>

      <div className="w-full overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="bg-gray-50 text-gray-900 text-sm font-medium border-b border-gray-200">
            <tr>
              {tableHeader.map((field) => (
                <TableHeaderItem
                  key={field}
                  field={field}
                  currentSort={currentSort}
                  currentPage={queryParams.page ?? 1}
                  limit={meta.limit}
                  searchQuery={queryParams.query ?? ""}
                  basePath={basePath}
                />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tableData.length > 0 ? (
              tableData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                    {item.fileName}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                    {item.fileFormat}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                    {item.docFor}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                    {item.createdAt}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                    {item.actions}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-500 border border-gray-200"
                >
                  No documents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={meta.page}
        totalPages={meta.totalPage}
        hasNextPage={meta.page < meta.totalPage}
        hasPrevPage={meta.page > 1}
        limit={meta.limit}
        sortField={sortField}
        sortDirection={sortDirection as "asc" | "desc"}
        basePath={basePath}
      />
    </div>
  );
}
