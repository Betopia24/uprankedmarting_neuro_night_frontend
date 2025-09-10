"use client";

import { useState } from "react";
import QuestionItem from "./QuestionItem";
import QuestionForm from "./QuestionForm";

const suggested = [
  "What type of service are you looking for?",
  "What is your project about, in short?",
  "Do you already have an existing website/app/system?",
  "What problems are you currently facing in your business?",
];

export default function QuestionList() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (question: string) => {
    setQuestions([...questions, question]);
    setShowForm(false);
  };

  const handleUpdate = (question: string) => {
    if (editingIndex === null) return;
    const updated = [...questions];
    updated[editingIndex] = question;
    setQuestions(updated);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">For Lead Questions</h1>

      <div className="mb-6">
        <p className="text-sm font-semibold mb-2">Suggested Questions:</p>
        <div className="flex flex-col gap-2">
          {suggested.map((text, idx) => {
            const alreadyAdded = questions.includes(text);
            return (
              <button
                key={idx}
                onClick={() =>
                  !alreadyAdded && setQuestions([...questions, text])
                }
                disabled={alreadyAdded}
                className={`text-left px-3 py-2 border rounded transition ${
                  alreadyAdded
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "hover:bg-gray-50 border-gray-300"
                }`}
              >
                {text}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {questions.map((q, i) =>
          editingIndex === i ? (
            <QuestionForm
              key={i}
              initialValue={q}
              onCancel={() => setEditingIndex(null)}
              onSave={handleUpdate}
            />
          ) : (
            <QuestionItem
              key={i}
              question={q}
              index={i}
              isActive={false}
              onEdit={() => setEditingIndex(i)}
              onDelete={() => handleDelete(i)}
            />
          )
        )}
      </div>

      {showForm ? (
        <QuestionForm onCancel={() => setShowForm(false)} onSave={handleAdd} />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Question
        </button>
      )}
    </div>
  );
}
