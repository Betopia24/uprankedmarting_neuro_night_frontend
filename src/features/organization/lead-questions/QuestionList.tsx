"use client";

import { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem";
import QuestionForm from "./QuestionForm";
import { Container } from "@/components";
import { useAuth } from "@/components/AuthProvider";
import {
  createOrganizationQuestion,
  getOrganizationQuestions,
  updateOrganizationQuestion,
  deleteOrganizationQuestion,
} from "@/app/api/organization/organization";
import { toast } from "sonner";
import Image from "next/image";
import { env } from "@/env";

const suggested = [
  "What type of service are you looking for?",
  "What is your project about, in short?",
  "Do you already have an existing website/app/system?",
  "What problems are you currently facing in your business?",
];

interface Question {
  question_id: string;
  question_text: string;
  question_keywords: string[];
  created_at: string;
  updated_at: string | null;
}

interface FormMessage {
  type: "success" | "error";
  text: string;
}

export default function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);
  const [editFormMessage, setEditFormMessage] = useState<FormMessage | null>(
    null
  );

  const { user } = useAuth();
  const orgId = user?.ownedOrganization?.id;
  const orgName = user?.ownedOrganization?.name;

  useEffect(() => {
    if (!showForm) {
      setFormMessage(null);
    }
  }, [showForm]);

  useEffect(() => {
    if (editingIndex === null) {
      setEditFormMessage(null);
    }
  }, [editingIndex]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!orgId) return;

      try {
        setLoading(true);
        const res = await getOrganizationQuestions(orgId);

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch questions");
        }

        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        env.NEXT_PUBLIC_APP_ENV === "development" &&
          console.error("Error fetching questions:", error);
        toast.error("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [orgId]);

  const handleAdd = async (question: string) => {
    setFormMessage(null);

    try {
      if (!orgId || !orgName) {
        env.NEXT_PUBLIC_APP_ENV === "development" &&
          console.error("Organization not found");
        setFormMessage({ type: "error", text: "Organization not found" });
        return;
      }

      const res = await createOrganizationQuestion(orgId, orgName, question);
      const responseData = await res.json();

      if (!res.ok || !responseData.accepted) {
        const errorMessage = responseData.reason || "Failed to add question";
        setFormMessage({ type: "error", text: errorMessage });
        return;
      }

      const successMessage =
        responseData.message || "Question added successfully";
      setFormMessage({ type: "success", text: successMessage });

      const fetchRes = await getOrganizationQuestions(orgId);
      if (fetchRes.ok) {
        const updatedQuestions = await fetchRes.json();
        setQuestions(updatedQuestions);
        toast.success(successMessage);

        setTimeout(() => {
          setShowForm(false);
        }, 2000);
      }
    } catch (error) {
      env.NEXT_PUBLIC_APP_ENV === "development" &&
        console.error("Error adding question:", error);
      setFormMessage({ type: "error", text: "Failed to add question" });
    }
  };

  const handleUpdate = async (questionText: string) => {
    if (editingIndex === null || !orgId) return;

    const questionToUpdate = questions[editingIndex];
    if (!questionToUpdate) return;

    setEditFormMessage(null);

    try {
      const res = await updateOrganizationQuestion(
        orgId,
        questionToUpdate.question_id,
        questionText
      );

      const responseData = await res.json();

      if (!res.ok || !responseData.accepted) {
        const errorMessage = responseData.reason || "Failed to update question";
        setEditFormMessage({ type: "error", text: errorMessage });
        return;
      }

      const successMessage =
        responseData.message || "Question updated successfully";
      setEditFormMessage({ type: "success", text: successMessage });

      const updated = [...questions];
      updated[editingIndex] = {
        ...questionToUpdate,
        question_text: questionText,
        updated_at: new Date().toISOString(),
      };
      setQuestions(updated);
      toast.success(successMessage);

      setTimeout(() => {
        setEditingIndex(null);
      }, 2000);
    } catch (error) {
      env.NEXT_PUBLIC_APP_ENV === "development" &&
        console.error("Error updating question:", error);
      setEditFormMessage({ type: "error", text: "Failed to update question" });
    }
  };

  const handleDelete = async (index: number) => {
    if (!orgId) return;

    const questionToDelete = questions[index];
    if (!questionToDelete) return;

    try {
      const res = await deleteOrganizationQuestion(
        orgId,
        questionToDelete.question_id
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to delete question");
      }

      setQuestions((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        toast.success("Question deleted successfully");
        return updated;
      });
    } catch (error) {
      env.NEXT_PUBLIC_APP_ENV === "development" &&
        console.error("Error deleting question:", error);
      toast.error("Failed to delete question");
    }
  };

  const handleSuggestedSelect = async (question: string) => {
    try {
      if (!orgId || !orgName) {
        env.NEXT_PUBLIC_APP_ENV === "development" &&
          console.error("Organization not found");
        toast.error("Organization not found");
        return;
      }

      const res = await createOrganizationQuestion(orgId, orgName, question);
      const responseData = await res.json();

      if (!res.ok || !responseData.accepted) {
        const errorMessage = responseData.reason || "Failed to add question";
        toast.error(errorMessage);
        return;
      }

      const successMessage =
        responseData.message || "Question added successfully";

      const fetchRes = await getOrganizationQuestions(orgId);
      if (fetchRes.ok) {
        const updatedQuestions = await fetchRes.json();
        setQuestions(updatedQuestions);
        toast.success(successMessage);
      }
    } catch (err) {
      env.NEXT_PUBLIC_APP_ENV === "development" &&
        console.error("Error adding suggested question:", err);
      toast.error("Failed to add question");
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading questions...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="text-xl font-bold mb-4">For Lead Questions</h1>

      <div className="mb-6">
        <p className="text-sm font-semibold mb-2">Select or Add Questions</p>
        <div className="flex flex-col gap-2">
          {suggested.map((text, idx) => {
            const alreadyAdded = questions.some(
              (q) => q.question_text === text
            );
            return (
              <button
                key={idx}
                onClick={() => !alreadyAdded && handleSuggestedSelect(text)}
                disabled={alreadyAdded}
                className={`text-left px-3 py-2 border rounded transition ${alreadyAdded
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
              key={q.question_id}
              initialValue={q.question_text}
              onCancel={() => setEditingIndex(null)}
              onSave={handleUpdate}
              message={editFormMessage}
            />
          ) : (
            <QuestionItem
              key={q.question_id}
              question={q.question_text}
              index={i}
              isActive={false}
              onEdit={() => setEditingIndex(i)}
              onDelete={() => handleDelete(i)}
            />
          )
        )}
      </div>

      {questions.length === 0 && !showForm && (
        <div className="flex flex-col items-center py-8 text-gray-500">
          <Image
            src={"/help-circle.png"}
            alt="No questions"
            width={100}
            height={100}
          />
          <p className="mt-2">
            No questions added yet. Add your first question below.
          </p>
        </div>
      )}

      {showForm ? (
        <QuestionForm
          onCancel={() => setShowForm(false)}
          onSave={handleAdd}
          message={formMessage}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Question
        </button>
      )}
    </Container>
  );
}
