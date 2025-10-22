import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { MapPin, Loader2, X } from "lucide-react";
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
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const isSelectingRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal state with external value changes
  useEffect(() => {
    if (value !== inputValue && !isSelectingRef.current) {
      setInputValue(value || "");
    }
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      setShowDropdown(false);
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
          setShowDropdown(data.length > 0);
        } catch (error) {
          console.error("Error fetching addresses:", error);
          setSuggestions([]);
          setShowDropdown(false);
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
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleClear = (): void => {
    setInputValue("");
    onChange("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="w-full max-w-xl space-y-2" ref={containerRef}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="relative">
        <Input
          ref={ref}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-full pr-20"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="size-4 text-gray-500" />
            </button>
          )}
          {isLoading && (
            <Loader2 className="size-4 animate-spin text-gray-900" />
          )}
          {!isLoading && <MapPin className="size-4 text-gray-900" />}
        </div>

        {showDropdown && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                onClick={() => handleSelectAddress(suggestion)}
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
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
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
