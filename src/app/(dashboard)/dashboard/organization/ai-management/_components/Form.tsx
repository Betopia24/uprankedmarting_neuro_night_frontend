"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { env } from "@/env";
import { cn } from "@/lib/utils";

// UI Components
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
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

// Types
interface AgentFormProps {
  orgId: string;
  agentId?: string;
  onSuccess?: () => void;
}

interface KnowledgeBase {
  id: string;
  name: string;
}

// Schema
const agentSchema = z.object({
  first_message: z.string().optional(),
  knowledge_base_ids: z.array(z.string()).default([]).optional(),
  max_duration_seconds: z.number().int().min(1).max(3600),
  daily_limit: z.number().int().min(1).max(10000),
  llm: z
    .string()
    .default("gemini-2.5-flash")
    .catch("gemini-2.5-flash")
    .optional(),
  stability: z.number().min(0).max(1),
  speed: z.number().min(0.7).max(1.2),
  similarity_boost: z.number().min(0).max(1),
  temperature: z.number().min(0).max(1),
});

type AgentForm = z.infer<typeof agentSchema>;

// Constants
export const LLM_OPTIONS = [
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
  "qwen3-4b",
  "qwen3-30b-a3b",
  "gpt-oss-20b",
  "gpt-oss-120b",
  "gemini-2.5-flash-preview-05-20",
  "gemini-2.5-flash-preview-04-17",
  "gemini-2.5-flash-lite-preview-06-17",
  "gemini-2.0-flash-lite-001",
  "gemini-2.0-flash-001",
  "gemini-1.5-flash-002",
  "gemini-1.5-flash-001",
  "gemini-1.5-pro-002",
  "gemini-1.5-pro-001",
  "claude-sonnet-4@20250514",
  "claude-3-7-sonnet@20250219",
  "claude-3-5-sonnet@20240620",
  "claude-3-5-sonnet-v2@20241022",
  "claude-3-haiku@20240307",
  "gpt-5-2025-08-07",
  "gpt-5-mini-2025-08-07",
  "gpt-5-nano-2025-08-07",
  "gpt-4.1-2025-04-14",
  "gpt-4.1-mini-2025-04-14",
  "gpt-4.1-nano-2025-04-14",
  "gpt-4o-mini-2024-07-18",
  "gpt-4o-2024-11-20",
  "gpt-4o-2024-08-06",
  "gpt-4o-2024-05-13",
  "gpt-4-0613",
  "gpt-4-0314",
  "gpt-4-turbo-2024-04-09",
  "gpt-3.5-turbo-0125",
  "gpt-3.5-turbo-1106",
] as const;

const SLIDER_CONFIGS = [
  { key: "stability" as const, label: "Stability", min: 0, max: 1, step: 0.1 },
  { key: "speed" as const, label: "Speed", min: 0.7, max: 1.2, step: 0.1 },
  {
    key: "similarity_boost" as const,
    label: "Similarity Boost",
    min: 0,
    max: 1,
    step: 0.1,
  },
  {
    key: "temperature" as const,
    label: "Temperature",
    min: 0,
    max: 1,
    step: 0.1,
  },
];

// Multi-select Component
function KnowledgeBaseSelect({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  options: KnowledgeBase[];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedId: string) => {
    const newValue = value.includes(selectedId)
      ? value.filter((id) => id !== selectedId)
      : [...value, selectedId];
    onChange(newValue);
  };

  const selectedItems = options.filter((option) => value.includes(option.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-[40px]"
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1">
            {selectedItems.length === 0 ? (
              <span className="text-muted-foreground">
                Select knowledge bases
              </span>
            ) : (
              selectedItems.map((item) => (
                <Badge key={item.id} variant="secondary" className="text-xs">
                  {item.name}
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search knowledge bases..." />
          <CommandList>
            <CommandEmpty>No knowledge bases found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => handleSelect(option.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Main Component
export default function AgentForm({
  orgId,
  agentId,
  onSuccess,
}: AgentFormProps) {
  const [loading, setLoading] = useState(false);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);

  const form = useForm<AgentForm>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      first_message: "",
      knowledge_base_ids: [],
      max_duration_seconds: 600,
      daily_limit: 1000,
      llm: "gemini-2.5-flash",
      stability: 0.5,
      speed: 1.0,
      similarity_boost: 0.8,
      temperature: 0.0,
    },
  });

  // Fetch knowledge bases
  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      try {
        const response = await fetch(
          `${env.NEXT_PUBLIC_API_BASE_URL_AI}/organization-knowledge/knowledge-base/${orgId}`
        );

        if (response.ok) {
          const data = await response.json();

          // Handle the actual API response structure
          const rawBases = Array.isArray(data.knowledgeBaseList)
            ? data.knowledgeBaseList
            : [];

          // Transform to the expected format
          const transformedBases: KnowledgeBase[] = rawBases.map(
            (base: { knowledgeBaseId: string; knowledgeBaseName: string }) => ({
              id: base.knowledgeBaseId,
              name: base.knowledgeBaseName,
            })
          );

          setKnowledgeBases(transformedBases);
        }
      } catch (error) {
        console.error("Failed to fetch knowledge bases:", error);
        toast.error("Failed to load knowledge bases");
      }
    };

    fetchKnowledgeBases();
  }, [orgId]);

  // Fetch agent data for editing
  useEffect(() => {
    const fetchAgent = async () => {
      if (!agentId) return;

      try {
        const response = await fetch(
          `${env.NEXT_PUBLIC_API_BASE_URL_AI}/organizations/${orgId}/agents/${agentId}`
        );

        if (response.ok) {
          const data = await response.json();
          const agentData = data.data || data;
          form.reset(agentData);
        }
      } catch (error) {
        toast.error("Failed to load agent data");
      }
    };

    fetchAgent();
  }, [agentId, orgId, form]);

  // Submit handler
  const onSubmit = async (data: AgentForm) => {
    setLoading(true);

    try {
      const url = agentId
        ? `${env.NEXT_PUBLIC_API_BASE_URL_AI}/organizations/${orgId}/agents/${agentId}`
        : `${env.NEXT_PUBLIC_API_BASE_URL_AI}/organizations/create/${orgId}`;

      const response = await fetch(url, {
        method: agentId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(`Agent ${agentId ? "updated" : "created"} successfully`);
        onSuccess?.();
      } else {
        const error = await response.json();
        toast.error(error.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">
          {agentId ? "Edit Agent" : "Create Agent"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure your AI agent settings
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* First Message */}
          <FormField
            name="first_message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter greeting message..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* LLM Selection */}
          <FormField
            name="llm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language Model</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select LLM" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LLM_OPTIONS.map((llm) => (
                      <SelectItem key={llm} value={llm}>
                        {llm}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Duration and Limit */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="max_duration_seconds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Duration (seconds)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="daily_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sliders */}
          {SLIDER_CONFIGS.map(({ key, label, min, max, step }) => (
            <FormField
              key={key}
              name={key}
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>{label}</FormLabel>
                    <span className="text-sm text-muted-foreground">
                      {field.value?.toFixed(1)}
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      min={min}
                      max={max}
                      step={step}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {/* Knowledge Bases */}
          {knowledgeBases.length > 0 && (
            <FormField
              name="knowledge_base_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Knowledge Bases</FormLabel>
                  <FormControl>
                    <KnowledgeBaseSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={knowledgeBases}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Submit */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading
              ? "Processing..."
              : agentId
                ? "Update Agent"
                : "Create Agent"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
