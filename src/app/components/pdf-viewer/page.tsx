"use client";

export default function PdfViewerPage() {
  const pdfUrl = "/pdfs/guide.pdf#toolbar=0&navpanes=0&scrollbar=0";

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">PDF Viewer</h1>

      <a
        href="/pdfs/guide.pdf"
        download="guide.pdf"
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Download PDF
      </a>

      <div className="w-full max-w-4xl h-[600px] border shadow rounded overflow-hidden">
        <iframe src={pdfUrl} className="w-full h-full" title="PDF Viewer" />
      </div>
    </div>
  );
}
