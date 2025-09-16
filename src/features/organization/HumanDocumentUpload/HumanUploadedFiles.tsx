import { Button } from "@/components";
import { LucideTrash } from "lucide-react";

type KnowledgeBase = {
  id: string;
  fileName: string;
};

type Props = {
  files: KnowledgeBase[];
  organizationId: string;
  onDelete: (id: string) => void;
};

export default function HumanUploadedList({ files, onDelete }: Props) {
  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex justify-between items-center p-2 rounded shadow-xs border border-gray-100 transition-transform hover:-translate-y-px hover:shadow-sm text-xs"
        >
          {file.fileName}
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(file.id)}
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
