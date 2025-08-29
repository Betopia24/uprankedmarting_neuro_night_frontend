import { useState } from "react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

type Props = {
  initialValue?: string;
  onCancel: () => void;
  onSave: (value: string) => void;
};

export default function QuestionForm({
  initialValue = "",
  onCancel,
  onSave,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleSubmit = () => {
    if (!value.trim()) {
      setError("Question cannot be empty");
      return;
    }
    if (!user) return;
    console.log(user);
    const userId = user.id;
    const data = { question: value.trim(), userId };

    setError("");
    onSave(value.trim());
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`border px-3 py-2 rounded w-full ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="Write your lead question..."
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {initialValue ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
}
