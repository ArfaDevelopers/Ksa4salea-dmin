// Utility functions for date filtering and comparison

import {
  DateRange,
  PresetType,
  ChartGranularity,
  MetricComparison,
} from "@/types/dateFilter";

/**
 * Get preset date ranges for comparison
 */
export function getPresetDateRanges(preset: PresetType): {
  period1: DateRange;
  period2: DateRange;
} {
  const now = new Date();
  const currentYear = now.getFullYear();

  switch (preset) {
    case "Q1vsQ2":
      return {
        period1: {
          startDate: new Date(currentYear, 0, 1), // Jan 1
          endDate: new Date(currentYear, 2, 31), // Mar 31
        },
        period2: {
          startDate: new Date(currentYear, 3, 1), // Apr 1
          endDate: new Date(currentYear, 5, 30), // Jun 30
        },
      };

    case "Q2vsQ3":
      return {
        period1: {
          startDate: new Date(currentYear, 3, 1), // Apr 1
          endDate: new Date(currentYear, 5, 30), // Jun 30
        },
        period2: {
          startDate: new Date(currentYear, 6, 1), // Jul 1
          endDate: new Date(currentYear, 8, 30), // Sep 30
        },
      };

    case "Q3vsQ4":
      return {
        period1: {
          startDate: new Date(currentYear, 6, 1), // Jul 1
          endDate: new Date(currentYear, 8, 30), // Sep 30
        },
        period2: {
          startDate: new Date(currentYear, 9, 1), // Oct 1
          endDate: new Date(currentYear, 11, 31), // Dec 31
        },
      };

    case "Q4vsQ1":
      return {
        period1: {
          startDate: new Date(currentYear - 1, 9, 1), // Oct 1 (previous year)
          endDate: new Date(currentYear - 1, 11, 31), // Dec 31 (previous year)
        },
        period2: {
          startDate: new Date(currentYear, 0, 1), // Jan 1
          endDate: new Date(currentYear, 2, 31), // Mar 31
        },
      };

    case "MonthToMonth":
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        period1: {
          startDate: lastMonth,
          endDate: new Date(
            lastMonth.getFullYear(),
            lastMonth.getMonth() + 1,
            0
          ), // Last day of last month
        },
        period2: {
          startDate: currentMonth,
          endDate: now,
        },
      };

    case "YearToYear":
      return {
        period1: {
          startDate: new Date(currentYear - 2, 0, 1),
          endDate: new Date(currentYear - 2, 11, 31),
        },
        period2: {
          startDate: new Date(currentYear - 1, 0, 1),
          endDate: new Date(currentYear - 1, 11, 31),
        },
      };

    default:
      // Custom - return empty dates
      return {
        period1: {
          startDate: new Date(),
          endDate: new Date(),
        },
        period2: {
          startDate: new Date(),
          endDate: new Date(),
        },
      };
  }
}

/**
 * Generate mock historical data based on current value
 * Uses date-based seed for consistency
 */
export function generateMockHistoricalData(
  currentValue: number,
  period: DateRange,
  periodType: "period1" | "period2"
): number {
  if (currentValue === 0) return 0;

  // Create a seed based on the start date for consistency
  const seed =
    period.startDate.getFullYear() * 10000 +
    (period.startDate.getMonth() + 1) * 100 +
    period.startDate.getDate();

  // Simple seeded random function
  const seededRandom = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  // Apply seasonal variation based on month
  const month = period.startDate.getMonth();
  let seasonalMultiplier = 1.0;

  // Q4 (Oct-Dec) typically higher for sales
  if (month >= 9) {
    seasonalMultiplier = 1.15;
  }
  // Q1 (Jan-Mar) typically lower
  else if (month <= 2) {
    seasonalMultiplier = 0.85;
  }
  // Q2 (Apr-Jun)
  else if (month >= 3 && month <= 5) {
    seasonalMultiplier = 1.05;
  }
  // Q3 (Jul-Sep)
  else {
    seasonalMultiplier = 0.95;
  }

  // Period 1 is typically slightly lower than current (historical)
  // Period 2 is closer to current or slightly higher
  const periodMultiplier = periodType === "period1" ? 0.88 : 1.02;

  // Add small random variance
  const variance = (seededRandom(seed) - 0.5) * 0.1; // ±5% variance

  const mockValue =
    currentValue * seasonalMultiplier * periodMultiplier * (1 + variance);

  return Math.round(mockValue);
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(
  period1Value: number,
  period2Value: number
): { percentage: string; isIncrease: boolean } {
  if (period1Value === 0 && period2Value === 0) {
    return { percentage: "0.0%", isIncrease: false };
  }

  if (period1Value === 0) {
    return { percentage: "100.0%", isIncrease: true };
  }

  const change = ((period2Value - period1Value) / period1Value) * 100;
  const isIncrease = change >= 0;

  return {
    percentage: `${Math.abs(change).toFixed(1)}%`,
    isIncrease,
  };
}

/**
 * Format date range for display
 */
export function formatDateRange(dateRange: DateRange): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const startStr = dateRange.startDate.toLocaleDateString("en-US", options);
  const endStr = dateRange.endDate.toLocaleDateString("en-US", options);

  // Add year if different from current year
  const currentYear = new Date().getFullYear();
  const yearStr =
    dateRange.startDate.getFullYear() !== currentYear
      ? `, ${dateRange.startDate.getFullYear()}`
      : "";

  return `${startStr} - ${endStr}${yearStr}`;
}

/**
 * Determine chart granularity based on date range length
 */
export function getChartGranularity(dateRange: DateRange): ChartGranularity {
  const diffTime = Math.abs(
    dateRange.endDate.getTime() - dateRange.startDate.getTime()
  );
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) return "daily";
  if (diffDays <= 60) return "weekly";
  if (diffDays <= 365) return "monthly";
  return "quarterly";
}

/**
 * Generate chart data for a given period
 */
export function generateChartDataForPeriod(
  baseValue: number,
  dateRange: DateRange,
  periodLabel: string
): { name: string; data: number[]; categories: string[] } {
  const granularity = getChartGranularity(dateRange);
  const categories: string[] = [];
  const data: number[] = [];

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  switch (granularity) {
    case "daily":
      // Generate 7 days of data
      for (let i = 0; i < 7; i++) {
        const date = new Date(dateRange.startDate);
        date.setDate(date.getDate() + i);
        categories.push(dayNames[date.getDay()]);

        // Vary data by day (weekends typically lower)
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const dayMultiplier = isWeekend ? 0.7 : 1.0;
        const variance = (Math.random() - 0.5) * 0.2;
        data.push(Math.round(baseValue * dayMultiplier * (1 + variance)));
      }
      break;

    case "weekly":
      // Generate 4-8 weeks of data
      const weeks = Math.min(
        8,
        Math.ceil(
          (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
            (7 * 24 * 60 * 60 * 1000)
        )
      );
      for (let i = 1; i <= weeks; i++) {
        categories.push(`Week ${i}`);
        const variance = (Math.random() - 0.5) * 0.3;
        data.push(Math.round(baseValue * (1 + variance)));
      }
      break;

    case "monthly":
      // Generate monthly data
      const startMonth = dateRange.startDate.getMonth();
      const endMonth = dateRange.endDate.getMonth();
      const yearDiff =
        dateRange.endDate.getFullYear() - dateRange.startDate.getFullYear();
      const totalMonths = endMonth - startMonth + yearDiff * 12 + 1;

      for (let i = 0; i < Math.min(12, totalMonths); i++) {
        const monthIndex = (startMonth + i) % 12;
        categories.push(monthNames[monthIndex]);

        // Seasonal variation
        let seasonalMultiplier = 1.0;
        if (monthIndex >= 9) seasonalMultiplier = 1.2; // Q4
        else if (monthIndex <= 2) seasonalMultiplier = 0.8; // Q1

        const variance = (Math.random() - 0.5) * 0.2;
        data.push(
          Math.round(baseValue * seasonalMultiplier * (1 + variance))
        );
      }
      break;

    case "quarterly":
      // Generate quarterly data
      categories.push("Q1", "Q2", "Q3", "Q4");
      const quarterMultipliers = [0.85, 1.0, 0.95, 1.15];
      quarterMultipliers.forEach((mult) => {
        const variance = (Math.random() - 0.5) * 0.15;
        data.push(Math.round(baseValue * mult * (1 + variance)));
      });
      break;
  }

  return {
    name: periodLabel,
    data,
    categories,
  };
}

/**
 * Create a comparison object for a metric
 */
export function createMetricComparison(
  currentValue: number,
  period1: DateRange,
  period2: DateRange
): MetricComparison {
  const period1Value = generateMockHistoricalData(currentValue, period1, "period1");
  const period2Value = generateMockHistoricalData(currentValue, period2, "period2");
  const { percentage, isIncrease } = calculatePercentageChange(
    period1Value,
    period2Value
  );

  return {
    period1Value,
    period2Value,
    percentageChange: percentage,
    isIncrease,
  };
}
