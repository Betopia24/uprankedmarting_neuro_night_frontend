"use client";

import { useEffect, useState } from "react";
import { string, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { env } from "@/env";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// ---------- Constants ----------
const LLM_OPTIONS = [
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-4",
  "gpt-4-turbo",
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "gpt-5",
  "gpt-5-mini",
  "gpt-5-nano",
  "gpt-3.5-turbo",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "claude-sonnet-4",
  "claude-3-7-sonnet",
  "claude-3-5-sonnet",
  "claude-3-5-sonnet-v1",
  "claude-3-haiku",
  "grok-beta",
  "custom-llm",
] as const;

// ---------- Types ----------
type LLMOption = (typeof LLM_OPTIONS)[number];

interface AgentFormProps {
  orgId: string;
  agentId?: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

interface AgentData {
  knowledgeBaseId?: string;
  callMax: number;
  dailyLimit: number;
  llm: LLMOption;
  stability: number;
  speed: number;
  similarityBoost: number;
  temperature: number;
}

// ---------- Schema ----------
const agentFormSchema = z.object({
  knowledgeBaseId: z.string().optional().optional(),
  callMax: z.coerce.number().int().min(0).max(100).optional(),
  dailyLimit: z.coerce.number().int().min(0).max(100).optional(),
  llm: z.string().optional(),
  stability: z.coerce.number().min(0).max(100).optional(),
  speed: z.coerce.number().min(0).max(100).optional(),
  similarityBoost: z.coerce.number().min(0).max(100).optional(),
  temperature: z.coerce.number().min(0).max(10).optional(),
});

type AgentFormData = z.infer<typeof agentFormSchema>;

// ---------- Slider Configuration ----------
const SLIDER_CONFIGS: ReadonlyArray<{
  name: keyof Pick<AgentFormData, "stability" | "speed" | "similarityBoost">;
  min: number;
  max: number;
  step: number;
  label: string;
}> = [
  { name: "stability", min: 0, max: 100, step: 1, label: "Stability" },
  { name: "speed", min: 0, max: 100, step: 1, label: "Speed" },
  {
    name: "similarityBoost",
    min: 0,
    max: 100,
    step: 1,
    label: "Similarity Boost",
  },
];

// ---------- Default Values ----------
const DEFAULT_VALUES: AgentFormData = {
  knowledgeBaseId: "",
  callMax: 100,
  dailyLimit: 100,
  llm: "gpt-4o-mini",
  stability: 50,
  speed: 50,
  similarityBoost: 50,
  temperature: 1,
};

// ---------- Component ----------
export default function AgentForm({ orgId, agentId }: AgentFormProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // ---------- API Helpers ----------
  const fetchAgentData = async (): Promise<AgentData | null> => {
    if (!agentId) return null;

    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_BASE_URL_AI}/organizations/${orgId}/agents/${agentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AgentData = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch agent data:", error);
      throw error;
    }
  };

  const createAgent = async (data: AgentFormData): Promise<Response> => {
    return fetch(
      `${env.NEXT_PUBLIC_API_BASE_URL_AI}/organizations/create/${orgId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  };

  const updateAgent = async (data: AgentFormData): Promise<Response> => {
    if (!agentId) {
      throw new Error("Agent ID is required for updates");
    }

    return fetch(
      `${env.NEXT_PUBLIC_API_BASE_URL_AI}/organizations/${orgId}/agents/${agentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  };

  // ---------- Effects ----------
  useEffect(() => {
    let isMounted = true;

    const loadAgentData = async (): Promise<void> => {
      try {
        const data = await fetchAgentData();
        if (data && isMounted) {
          form.reset({ ...DEFAULT_VALUES, ...data });
        }
      } catch (error) {
        if (isMounted) {
          toast.error("Failed to load agent data");
        }
      }
    };

    loadAgentData();

    return () => {
      isMounted = false;
    };
  }, [orgId, agentId, form]);

  // ---------- Handlers ----------
  const handleSubmit = async (values: AgentFormData): Promise<void> => {
    setLoading(true);

    try {
      const response = agentId
        ? await updateAgent(values)
        : await createAgent(values);

      if (response.ok) {
        const successMessage = agentId
          ? "Agent updated successfully"
          : "Agent created successfully";
        toast.success(successMessage);
      } else {
        let errorMessage = agentId
          ? "Failed to update agent"
          : "Failed to create agent";

        try {
          const errorData: ApiErrorResponse = await response.json();
          if (errorData.message || errorData.error) {
            errorMessage += `: ${errorData.message || errorData.error}`;
          }
        } catch {
          // If we can't parse the error response, use the default message
        }

        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely convert values to strings for display
  const formatDisplayValue = (
    value: number | undefined,
    defaultValue: number
  ): string => {
    const numValue =
      typeof value === "number" && !isNaN(value) ? value : defaultValue;
    return numValue.toString();
  };

  // ---------- Render ----------
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* LLM Selection */}
          {/* <FormField
            control={form.control}
            name="llm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LLM Model</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select LLM Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {LLM_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* Knowledge Base */}
          {/* <FormField
            control={form.control}
            name="knowledgeBaseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Knowledge Base</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Knowledge Base" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">(None)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* Call Max */}
          <FormField
            control={form.control}
            name="callMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Calls</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={1000}
                    placeholder="100"
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseInt(value, 10) : "");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Daily Limit */}
          <FormField
            control={form.control}
            name="dailyLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daily Limit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="100"
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseInt(value, 10) : "");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Standard Sliders */}
          {SLIDER_CONFIGS.map(({ name, min, max, step, label }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    <span>{label}</span>
                    <span className="text-sm text-gray-500">
                      {formatDisplayValue(field.value, 50)}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={min}
                      max={max}
                      step={step}
                      value={[field.value || 50]}
                      onValueChange={(value) => field.onChange(value[0] || 50)}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {/* Temperature Slider */}
          <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between">
                  <span>Temperature</span>
                  <span className="text-sm text-gray-500">
                    {formatDisplayValue(field.value, 1)}
                  </span>
                </FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={10}
                    step={0.1}
                    value={[Number(field.value) || 1]}
                    onValueChange={(value) =>
                      field.onChange(Number(value[0]) || 1)
                    }
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading
                ? "Processing..."
                : agentId
                ? "Update Agent"
                : "Create Agent"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
