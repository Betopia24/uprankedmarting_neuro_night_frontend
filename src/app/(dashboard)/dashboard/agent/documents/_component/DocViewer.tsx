import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/utils/formatDateTime";

interface TableRow {
  id: string;
  fileName: string;
  fileFormat: string;
  docFor: string;
  createdAt: string;
  actions: React.ReactNode;
  _rawCreatedAt: string;
}

const tableData: TableRow[] = docs.map((doc) => {
  const lowerFormat = doc.fileFormat.toLowerCase();

  // Decide embed URL
  let previewUrl: string | null = null;
  if (lowerFormat === "pdf") {
    previewUrl = doc.cloudUrl;
  } else if (
    ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "pages"].includes(lowerFormat)
  ) {
    // Use Google Docs Viewer
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
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-lg">
            View
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[85vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-lg font-semibold">
              {doc.fileName}.{doc.fileFormat.toLowerCase()}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-full">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full flex-1 border-0"
                title={doc.fileName}
              />
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 p-6 text-center">
                <p className="text-gray-600">
                  Preview not available for <b>{doc.fileFormat}</b>.
                </p>
                <Button asChild>
                  <a
                    href={doc.cloudUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
