// Type definitions for date filter with comparison functionality

export type PresetType =
  | 'Q1vsQ2'
  | 'Q2vsQ3'
  | 'Q3vsQ4'
  | 'Q4vsQ1'
  | 'MonthToMonth'
  | 'YearToYear'
  | 'Custom';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface DateFilterState {
  preset: PresetType;
  period1: DateRange;
  period2: DateRange;
}

export interface MetricComparison {
  period1Value: number;
  period2Value: number;
  percentageChange: string;
  isIncrease: boolean;
}

export interface FilteredDashboardData {
  visitors: MetricComparison;
  profit: MetricComparison;
  products: MetricComparison;
  users: MetricComparison;
  conversionRatio: MetricComparison;
  roi: MetricComparison;
  leads: MetricComparison;
  calls: MetricComparison;
  whatsapp: MetricComparison;
  emails: MetricComparison;
  chartData: {
    period1: ChartDataSeries;
    period2: ChartDataSeries;
  };
}

export interface ChartDataSeries {
  name: string;
  data: number[];
  categories: string[];
}

export type ChartGranularity = 'daily' | 'weekly' | 'monthly' | 'quarterly';
