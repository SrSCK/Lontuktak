import React from "react";

export default function TotalIncome() {
  // Sample data for total income growth over 12 months
  const incomeData = [
    { month: 1, income: 25000, label: "Jan" },
    { month: 2, income: 32000, label: "Feb" },
    { month: 3, income: 28000, label: "Mar" },
    { month: 4, income: 45000, label: "Apr" },
    { month: 5, income: 38000, label: "May" },
    { month: 6, income: 55000, label: "Jun" },
    { month: 7, income: 48000, label: "Jul" },
    { month: 8, income: 67000, label: "Aug" },
    { month: 9, income: 59000, label: "Sep" },
    { month: 10, income: 78000, label: "Oct" },
    { month: 11, income: 72000, label: "Nov" },
    { month: 12, income: 85000, label: "Dec" }
  ];

  // Sample table data
  const summaryData = [
    { sku: "asdas", monthsActive: 12, totalIncome: "฿730", avgMonthlyIncome: "฿730" },
    { sku: "asd", monthsActive: 10, totalIncome: "฿730", avgMonthlyIncome: "฿730" },
    { sku: "sad", monthsActive: 12, totalIncome: "฿730", avgMonthlyIncome: "฿730" }
  ];

  const maxIncome = 100000; // Maximum value for scaling
  const minIncome = 0;

  // Calculate percentage position for each point
  const getYPosition = (income: number) => {
    return ((maxIncome - income) / (maxIncome - minIncome)) * 100;
  };

  // Calculate growth metrics
  const totalIncome = incomeData.reduce((sum, data) => sum + data.income, 0);
  const avgMonthlyIncome = totalIncome / incomeData.length;
  const growthRate = ((incomeData[incomeData.length - 1].income - incomeData[0].income) / incomeData[0].income) * 100;

  return (
    <div className="p-6">
      <h2 className="text-black font-['Georama'] text-base font-normal mb-6">
        Total Income Growth
      </h2>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            ฿{totalIncome.toLocaleString()}
          </div>
          <div className="text-sm text-blue-800 font-medium">Total Annual Income</div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            ฿{Math.round(avgMonthlyIncome).toLocaleString()}
          </div>
          <div className="text-sm text-green-800 font-medium">Average Monthly Income</div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            +{Math.round(growthRate)}%
          </div>
          <div className="text-sm text-purple-800 font-medium">Annual Growth Rate</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="mb-8 bg-white border border-gray-100 rounded-lg p-6">
        <div className="relative">
          {/* Grid Lines */}
          <div className="absolute inset-0">
            {/* Horizontal grid lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="absolute w-full border-t border-dashed border-[#F1F5F9]"
                style={{ top: `${i * 20}%` }}
              />
            ))}
            {/* Vertical grid lines */}
            {incomeData.map((_, i) => (
              <div
                key={i}
                className="absolute h-full border-l border-dashed border-[#F1F5F9]"
                style={{ left: `${(i + 1) * (100 / (incomeData.length + 1))}%` }}
              />
            ))}
          </div>

          {/* Chart Area */}
          <div className="relative h-80">
            {/* Line Path */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="black"
                strokeWidth="0.2"
                points={incomeData.map((data, index) => 
                  `${(index + 1) * (100 / (incomeData.length + 1))},${getYPosition(data.income)}`
                ).join(' ')}
              />
            </svg>

            {/* Data Points */}
            {incomeData.map((data, index) => (
              <div
                key={index}
                className="absolute w-3 h-3 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(index + 1) * (100 / (incomeData.length + 1))}%`,
                  top: `${getYPosition(data.income)}%`
                }}
                title={`Month ${data.month}: ฿${data.income.toLocaleString()}`}
              />
            ))}
          </div>

          {/* Y-Axis Labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#0A0A0A] py-2">
            <span>฿200k</span>
            <span>฿150k</span>
            <span>฿100k</span>
            <span>฿50k</span>
            <span>฿0</span>
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-around mt-4 text-xs text-[#64748B]">
            {incomeData.map((data, index) => (
              <span key={index}>{data.month}</span>
            ))}
          </div>
        </div>

        {/* X-Axis Title */}
        <div className="text-center mt-4">
          <span className="text-[#808080] font-['Georama'] text-base">Months Active</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-gray-100 rounded-lg overflow-hidden mb-8">
        <div className="bg-white">
          {/* Table Header */}
          <div className="flex items-center py-3 px-4 border-b border-gray-100 bg-gray-50">
            <div className="w-1/4 text-left">
              <span className="text-[#0A0A0A] font-['Inter'] text-sm font-medium">SKU</span>
            </div>
            <div className="w-1/4 text-center">
              <span className="text-[#0A0A0A] font-['Inter'] text-sm font-medium">Months Active</span>
            </div>
            <div className="w-1/4 text-center">
              <span className="text-[#0A0A0A] font-['Inter'] text-sm font-medium">Total Income</span>
            </div>
            <div className="w-1/4 text-center">
              <span className="text-[#0A0A0A] font-['Inter'] text-sm font-medium">Avg Monthly Income</span>
            </div>
          </div>

          {/* Table Body */}
          {summaryData.map((row, index) => (
            <div key={index} className="flex items-center py-3 px-4 border-b border-gray-100 last:border-b-0">
              <div className="w-1/4 text-left">
                <span className="text-[#0A0A0A] font-['Inter'] text-sm font-medium">{row.sku}</span>
              </div>
              <div className="w-1/4 text-center">
                <span className="text-[#0A0A0A] font-['Inter'] text-sm">{row.monthsActive}</span>
              </div>
              <div className="w-1/4 text-center">
                <span className="text-[#0A0A0A] font-['Inter'] text-sm">{row.totalIncome}</span>
              </div>
              <div className="w-1/4 text-center">
                <span className="text-[#0A0A0A] font-['Inter'] text-sm">{row.avgMonthlyIncome}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Income Breakdown</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeData.map((data, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{data.label}</span>
                <span className="text-lg font-bold text-gray-800">฿{data.income.toLocaleString()}</span>
              </div>
              
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(data.income / maxIncome) * 100}%` }}
                  />
                </div>
              </div>

              {/* Growth indicator */}
              {index > 0 && (
                <div className="mt-2 text-xs">
                  {incomeData[index].income > incomeData[index - 1].income ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <span>↗</span>
                      +{Math.round(((incomeData[index].income - incomeData[index - 1].income) / incomeData[index - 1].income) * 100)}%
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <span>↘</span>
                      {Math.round(((incomeData[index].income - incomeData[index - 1].income) / incomeData[index - 1].income) * 100)}%
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
