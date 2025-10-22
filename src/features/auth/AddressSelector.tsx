import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState, useRef } from "react";
import { MapPin, Loader2, LucideMapPin } from "lucide-react";
import { useController, Control, FieldValues, Path } from "react-hook-form";

interface NominatimAddress {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
}

interface AddressSelectorProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  label?: string;
}

export default function AddressSelector<T extends FieldValues>({
  control,
  name,
  placeholder = "Start typing an address...",
  label = "Address",
}: AddressSelectorProps<T>) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [inputValue, setInputValue] = useState<string>(value || "");
  const [suggestions, setSuggestions] = useState<NominatimAddress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const isSelectingRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync internal state with external value changes
  useEffect(() => {
    if (value !== inputValue && !isSelectingRef.current) {
      setInputValue(value || "");
    }
  }, [value]);

  useEffect(() => {
    // Skip fetch if we're selecting an address
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!inputValue || inputValue.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      const fetchAddress = async (): Promise<void> => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
              inputValue
            )}&format=json&limit=5`
          );
          const data = (await response.json()) as NominatimAddress[];
          setSuggestions(data);
          setOpen(data.length > 0);
        } catch (error) {
          console.error("Error fetching addresses:", error);
          setSuggestions([]);
          setOpen(false);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAddress();
    }, 800);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue]);

  const handleSelectAddress = (selectedAddress: NominatimAddress): void => {
    isSelectingRef.current = true;
    const newValue = selectedAddress.display_name;
    setInputValue(newValue);
    onChange(newValue);
    setSuggestions([]);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    if (newValue.length >= 3) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    // Close popover on Escape
    if (e.key === "Escape") {
      setOpen(false);
      setSuggestions([]);
    }
  };

  return (
    <div className="w-full max-w-xl space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              ref={ref}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={onBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full rounded-full pr-8"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-gray-900" />
            )}
            {!isLoading && (
              <LucideMapPin className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-900" />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] max-w-xl p-0 border border-gray-100"
          align="start"
        >
          <div className="max-h-[300px] overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                onClick={() => handleSelectAddress(suggestion)}
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-b-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {suggestion.display_name.split(",")[0]}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {suggestion.display_name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
