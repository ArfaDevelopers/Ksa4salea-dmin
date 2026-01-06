"use client";

import React, { useState, useEffect } from "react";
import DateRangePicker from "./DateRangePicker";
import { DateFilterState, PresetType } from "@/types/dateFilter";
import { getPresetDateRanges, formatDateRange } from "@/utils/dateFilterHelpers";

interface DateRangeComparisonFilterProps {
  onFilterChange: (filter: DateFilterState) => void;
  onReset?: () => void;
  initialFilter?: DateFilterState;
}

const DateRangeComparisonFilter: React.FC<DateRangeComparisonFilterProps> = ({
  onFilterChange,
  onReset,
  initialFilter,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetType>(
    initialFilter?.preset || "Q1vsQ2"
  );
  const [period1Start, setPeriod1Start] = useState<Date>(new Date());
  const [period1End, setPeriod1End] = useState<Date>(new Date());
  const [period2Start, setPeriod2Start] = useState<Date>(new Date());
  const [period2End, setPeriod2End] = useState<Date>(new Date());
  const [showCustomPickers, setShowCustomPickers] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  // Preset button configurations
  const presetButtons: { value: PresetType; label: string }[] = [
    { value: "Q1vsQ2", label: "Q1 vs Q2" },
    { value: "Q2vsQ3", label: "Q2 vs Q3" },
    { value: "Q3vsQ4", label: "Q3 vs Q4" },
    { value: "Q4vsQ1", label: "Q4 vs Q1" },
    { value: "MonthToMonth", label: "MoM" },
    { value: "YearToYear", label: "YoY" },
    { value: "Custom", label: "Custom" },
  ];

  // Update dates when preset changes
  useEffect(() => {
    if (selectedPreset !== "Custom") {
      const ranges = getPresetDateRanges(selectedPreset);
      setPeriod1Start(ranges.period1.startDate);
      setPeriod1End(ranges.period1.endDate);
      setPeriod2Start(ranges.period2.startDate);
      setPeriod2End(ranges.period2.endDate);
      setShowCustomPickers(false);
    } else {
      setShowCustomPickers(true);
    }
  }, [selectedPreset]);

  const handlePresetClick = (preset: PresetType) => {
    setSelectedPreset(preset);
    setValidationError("");
  };

  const validateDateRanges = (): boolean => {
    // Check if period2 starts after period1 ends
    if (period2Start <= period1End) {
      setValidationError("Period 2 must start after Period 1 ends");
      return false;
    }

    // Check if dates are in the future
    const now = new Date();
    if (period2End > now) {
      setValidationError("Cannot select future dates");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleApply = () => {
    if (!validateDateRanges()) {
      return;
    }

    const filterState: DateFilterState = {
      preset: selectedPreset,
      period1: {
        startDate: period1Start,
        endDate: period1End,
      },
      period2: {
        startDate: period2Start,
        endDate: period2End,
      },
    };

    onFilterChange(filterState);
  };

  const handleReset = () => {
    setSelectedPreset("Q1vsQ2");
    setValidationError("");
    setShowCustomPickers(false);
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="space-y-4">
      {/* Preset Buttons */}
      <div>
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          Select Comparison Period
        </label>
        <div className="flex flex-wrap gap-2">
          {presetButtons.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetClick(preset.value)}
              className={`rounded px-4 py-2 text-sm font-medium transition ${
                selectedPreset === preset.value
                  ? "bg-primary text-white shadow-card dark:bg-primary dark:text-white"
                  : "bg-gray-2 text-black hover:bg-gray-3 dark:bg-meta-4 dark:text-white dark:hover:bg-meta-4"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Pickers */}
      {showCustomPickers && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DateRangePicker
            label="Period 1"
            startDate={period1Start}
            endDate={period1End}
            onChange={(start, end) => {
              setPeriod1Start(start);
              setPeriod1End(end);
            }}
            placeholder="Select Period 1 range"
          />
          <DateRangePicker
            label="Period 2"
            startDate={period2Start}
            endDate={period2End}
            onChange={(start, end) => {
              setPeriod2Start(start);
              setPeriod2End(end);
            }}
            placeholder="Select Period 2 range"
          />
        </div>
      )}

      {/* Selected Periods Display */}
      {!showCustomPickers && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-sm border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
            <p className="text-xs font-medium text-black dark:text-white">
              Period 1
            </p>
            <p className="mt-1 text-sm text-black dark:text-white">
              {formatDateRange({
                startDate: period1Start,
                endDate: period1End,
              })}
            </p>
          </div>
          <div className="rounded-sm border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
            <p className="text-xs font-medium text-black dark:text-white">
              Period 2
            </p>
            <p className="mt-1 text-sm text-black dark:text-white">
              {formatDateRange({
                startDate: period2Start,
                endDate: period2End,
              })}
            </p>
          </div>
        </div>
      )}

      {/* Validation Error */}
      {validationError && (
        <div className="rounded-sm border border-danger bg-danger bg-opacity-10 px-4 py-3">
          <p className="text-sm text-danger">{validationError}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleReset}
          className="rounded bg-gray-2 px-6 py-2 text-sm font-medium text-black hover:bg-gray-3 dark:bg-meta-4 dark:text-white dark:hover:bg-meta-4"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="rounded bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default DateRangeComparisonFilter;
