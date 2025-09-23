"use client";

import { useState } from "react";

interface FormMessage {
  type: 'success' | 'error';
  text: string;
}

interface QuestionFormProps {
  initialValue?: string;
  onCancel: () => void;
  onSave: (question: string) => Promise<void> | void; // allow async
  message?: FormMessage | null;
}

export default function QuestionForm({
  initialValue = "",
  onCancel,
  onSave,
  message
}: QuestionFormProps) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    try {
      //! if onSave is async, await it
      await onSave(value.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        {message && (
          <div
            className={`my-2 text-sm ${message.type === 'success'
              ? 'text-green-600 bg-green-50 border border-green-200'
              : 'text-red-600 bg-red-50 border border-red-200'
              } px-3 py-2 rounded`}
          >
            {message.text}
          </div>
        )}

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter your question..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          autoFocus
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={`px-3 py-1 rounded text-white ${loading
            ? 'bg-green-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
            }`}
          disabled={loading}
        >
          {loading ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
