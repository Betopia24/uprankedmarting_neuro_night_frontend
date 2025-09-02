import { Button, Heading } from "@/components";
import { LucideTrash } from "lucide-react";

type KnowledgeBase = {
  knowledgeBaseId: string;
  knowledgeBaseName: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  files: KnowledgeBase[];
  organizationId: string;
  onDelete: (id: string) => void;
};

export default function KnowledgeBaseList({ files, onDelete }: Props) {
  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.knowledgeBaseId}
          className="flex justify-between items-center p-2 rounded shadow-xs border border-gray-100 transition-transform hover:-translate-y-px hover:shadow-sm text-xs"
        >
          {file.fileName}
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(file.knowledgeBaseId)}
          >
            <LucideTrash />
          </Button>
          {/* <Button variant="destructive" size="icon">
            <LucideMonitorCheck />
          </Button> */}
        </div>
      ))}
    </div>
  );
}
