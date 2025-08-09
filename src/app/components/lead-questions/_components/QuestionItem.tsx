"use client";

import { Pencil, Trash2 } from "lucide-react";

type Props = {
  question: string;
  index: number;
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export default function QuestionItem({
  question,
  index,
  isActive,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div
      className={`flex items-start gap-2 p-2 border rounded ${
        isActive ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    >
      <span className="font-semibold">{index + 1}.</span>
      <span className="flex-1">{question}</span>
      <div className="flex gap-1">
        <button onClick={onEdit} className="text-blue-600 hover:text-blue-800">
          <Pencil size={16} />
        </button>
        <button onClick={onDelete} className="text-red-600 hover:text-red-800">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
