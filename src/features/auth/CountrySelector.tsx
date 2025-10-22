"use client";

import React, { useEffect, useState } from "react";
import {
  parsePhoneNumberFromString,
  getCountryCallingCode,
  CountryCode,
} from "libphonenumber-js";
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";
import * as flags from "country-flag-icons/react/3x2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface CountrySelectorProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  children?: React.ReactNode;
}

// All country codes
const COUNTRY_CODES: CountryCode[] = [
  "US",
  "GB",
  "CA",
  "AU",
  "BD",
  "IN",
  "PK",
  "CN",
  "JP",
  "KR",
  "DE",
  "FR",
  "IT",
  "ES",
  "NL",
  "BE",
  "CH",
  "AT",
  "SE",
  "NO",
  "DK",
  "FI",
  "PL",
  "CZ",
  "HU",
  "RO",
  "BG",
  "GR",
  "PT",
  "IE",
  "BR",
  "MX",
  "AR",
  "CL",
  "CO",
  "PE",
  "VE",
  "EC",
  "BO",
  "PY",
  "UY",
  "RU",
  "UA",
  "BY",
  "KZ",
  "UZ",
  "AZ",
  "GE",
  "AM",
  "MD",
  "ZA",
  "EG",
  "NG",
  "KE",
  "GH",
  "TZ",
  "UG",
  "ET",
  "MA",
  "DZ",
  "AE",
  "SA",
  "IQ",
  "IR",
  "IL",
  "JO",
  "LB",
  "SY",
  "KW",
  "OM",
  "QA",
  "BH",
  "YE",
  "TR",
  "ID",
  "MY",
  "SG",
  "TH",
  "VN",
  "PH",
  "MM",
  "KH",
  "LA",
  "NP",
  "LK",
  "AF",
  "MV",
  "BT",
  "BN",
  "TL",
  "NZ",
  "FJ",
  "PG",
  "NC",
  "PF",
  "GU",
  "AS",
  "MP",
  "MH",
  "FM",
  "AL",
  "BA",
  "HR",
  "RS",
  "SI",
  "MK",
  "ME",
  "XK",
  "CY",
  "MT",
  "IS",
  "LU",
  "LI",
  "MC",
  "SM",
  "VA",
  "AD",
  "GI",
  "IM",
  "JE",
];

export default function CountrySelector<T extends FieldValues>({
  form,
}: CountrySelectorProps<T>) {
  const phoneValue = form.watch("phoneNumber" as Path<T>) as string;
  const [countryCode, setCountryCode] = useState<CountryCode>("BD");

  // Detect country from typed phone number
  useEffect(() => {
    if (phoneValue) {
      const parsed = parsePhoneNumberFromString(phoneValue);
      if (parsed?.country && parsed.country !== countryCode) {
        setCountryCode(parsed.country);
      }
    }
  }, [phoneValue, countryCode]);

  // Update phone number when flag/country changes
  const handleCountryChange = (code: string) => {
    const typedCode = code as CountryCode;
    try {
      const callingCode = getCountryCallingCode(typedCode);
      // Extract just the digits without the country code
      const currentNumber = phoneValue?.replace(/^\+\d+\s*/, "") || "";
      const newPhoneNumber = currentNumber
        ? `+${callingCode}${currentNumber}`
        : `+${callingCode}`;

      form.setValue("phoneNumber" as Path<T>, newPhoneNumber as T[Path<T>], {
        shouldValidate: true,
      });
      setCountryCode(typedCode);
    } catch (error) {
      console.error("Error updating country code:", error);
    }
  };

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("phoneNumber" as Path<T>, e.target.value as T[Path<T>], {
      shouldValidate: true,
    });
  };

  // Get flag component safely
  const getFlagComponent = (code: CountryCode) => {
    const FlagComponent = (
      flags as Record<
        string,
        React.ComponentType<{ className?: string; title?: string }>
      >
    )[code];
    return FlagComponent || flags.BD;
  };

  const CurrentFlag = getFlagComponent(countryCode);
  const phoneError = form.formState.errors.phoneNumber;

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-sm">Phone Number</label>

      <div className="flex items-center gap-2">
        {/* Country Flag Dropdown - Shows only flags and country codes */}
        <Select value={countryCode} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[110px]">
            <SelectValue>
              <div className="flex items-center gap-2">
                <CurrentFlag className="w-6 h-4 rounded" />
                <span className="text-sm font-medium">{countryCode}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <div className="grid grid-cols-3 gap-1 p-2">
              {COUNTRY_CODES.map((code) => {
                const FlagComponent = getFlagComponent(code);
                const callingCode = getCountryCallingCode(code);

                return (
                  <SelectItem
                    key={code}
                    value={code}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-1 py-1">
                      <FlagComponent className="w-8 h-6 rounded border" />
                      <span className="text-xs font-semibold">{code}</span>
                      <span className="text-xs text-muted-foreground">
                        +{callingCode}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </div>
          </SelectContent>
        </Select>

        {/* Phone Number Input */}
        <Input
          type="tel"
          placeholder="Write your phone number"
          value={phoneValue || ""}
          onChange={handlePhoneChange}
          className="flex-1"
        />
      </div>

      {/* Error Message */}
      {phoneError && "message" in phoneError && (
        <p className="text-sm text-destructive">{String(phoneError.message)}</p>
      )}
    </div>
  );
}
