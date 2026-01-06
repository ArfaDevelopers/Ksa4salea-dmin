import React, { ReactNode } from "react";

interface ComparisonCardDataStatsProps {
  title: string;
  period1Label: string;
  period1Value: string;
  period2Label: string;
  period2Value: string;
  percentageChange: string;
  isIncrease: boolean;
  children: ReactNode;
}

const ComparisonCardDataStats: React.FC<ComparisonCardDataStatsProps> = ({
  title,
  period1Label,
  period1Value,
  period2Label,
  period2Value,
  percentageChange,
  isIncrease,
  children,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Icon and Title */}
      <div className="flex items-center justify-between">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          {children}
        </div>
        <span className="text-sm font-medium text-black dark:text-white">
          {title}
        </span>
      </div>

      {/* Comparison Values */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Period 1 */}
        <div>
          <p className="text-xs font-medium text-bodydark dark:text-bodydark">
            {period1Label}
          </p>
          <h4 className="mt-1 text-xl font-bold text-black dark:text-white">
            {period1Value}
          </h4>
        </div>

        {/* Period 2 */}
        <div>
          <p className="text-xs font-medium text-bodydark dark:text-bodydark">
            {period2Label}
          </p>
          <h4 className="mt-1 text-xl font-bold text-black dark:text-white">
            {period2Value}
          </h4>
        </div>
      </div>

      {/* Percentage Change */}
      <div className="mt-4 flex items-center justify-center">
        <span
          className={`flex items-center gap-1 text-base font-bold ${
            isIncrease ? "text-meta-3" : "text-meta-5"
          }`}
        >
          {percentageChange}

          {isIncrease ? (
            <svg
              className="fill-meta-3"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                fill=""
              />
            </svg>
          ) : (
            <svg
              className="fill-meta-5"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
                fill=""
              />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
};

export default ComparisonCardDataStats;
