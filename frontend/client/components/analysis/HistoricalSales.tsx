import React from "react";

export default function HistoricalSales() {
  // Sample data for historical sales with 4 sizes per month
  const salesData = [
    { month: "Jan", S: 150, M: 200, L: 180, XL: 120 },
    { month: "Feb", S: 180, M: 220, L: 190, XL: 140 },
    { month: "Mar", S: 120, M: 160, L: 145, XL: 100 },
    { month: "Apr", S: 200, M: 250, L: 220, XL: 170 },
    { month: "May", S: 170, M: 210, L: 195, XL: 150 },
    { month: "Jun", S: 220, M: 280, L: 240, XL: 190 },
    { month: "Jul", S: 190, M: 240, L: 210, XL: 160 },
    { month: "Aug", S: 210, M: 270, L: 230, XL: 180 },
    { month: "Sep", S: 180, M: 230, L: 200, XL: 155 },
    { month: "Oct", S: 240, M: 290, L: 260, XL: 200 },
    { month: "Nov", S: 220, M: 280, L: 245, XL: 185 },
    { month: "Dec", S: 260, M: 320, L: 290, XL: 220 }
  ];

  // Sample table data
  const tableData = [
    { date: "2025-02-05", S: 3, M: 5, L: 2, XL: 1 },
    { date: "2025-03-12", S: 4, M: 3, L: 6, XL: 2 },
    { date: "2025-04-08", S: 2, M: 6, L: 4, XL: 3 }
  ];

  // Colors for different sizes
  const sizeColors = {
    S: "#CECABF",
    M: "#938D7A", 
    L: "#E8E5DE",
    XL: "#EFECE3"
  };

  const maxValue = 350; // Maximum value for scaling

  return (
    <div className="p-6">
      <h2 className="text-black font-['Georama'] text-base font-normal mb-6">
        Historical Sales
      </h2>

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
                style={{ bottom: `${i * 20}%` }}
              />
            ))}
            {/* Vertical grid lines */}
            {salesData.map((_, i) => (
              <div
                key={i}
                className="absolute h-full border-l border-dashed border-[#F1F5F9]"
                style={{ left: `${(i + 1) * (100 / (salesData.length + 1))}%` }}
              />
            ))}
          </div>

          {/* Chart Area */}
          <div className="relative h-80 flex items-end justify-around px-4">
            {salesData.map((data, monthIndex) => (
              <div key={monthIndex} className="flex items-end gap-1">
                {/* S Size Bar */}
                <div
                  className="w-3 rounded-t"
                  style={{
                    height: `${(data.S / maxValue) * 100}%`,
                    backgroundColor: sizeColors.S,
                    border: `1px solid ${sizeColors.S}`
                  }}
                />
                {/* M Size Bar */}
                <div
                  className="w-3 rounded-t"
                  style={{
                    height: `${(data.M / maxValue) * 100}%`,
                    backgroundColor: sizeColors.M,
                    border: `1px solid ${sizeColors.M}`
                  }}
                />
                {/* L Size Bar */}
                <div
                  className="w-3 rounded-t"
                  style={{
                    height: `${(data.L / maxValue) * 100}%`,
                    backgroundColor: sizeColors.L,
                    border: `1px solid ${sizeColors.L}`
                  }}
                />
                {/* XL Size Bar */}
                <div
                  className="w-3 rounded-t"
                  style={{
                    height: `${(data.XL / maxValue) * 100}%`,
                    backgroundColor: sizeColors.XL,
                    border: `1px solid ${sizeColors.XL}`
                  }}
                />
              </div>
            ))}
          </div>

          {/* Y-Axis Labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#64748B] py-2">
            <span>600</span>
            <span>450</span>
            <span>300</span>
            <span>150</span>
            <span>0</span>
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-around mt-4 text-xs text-[#64748B]">
            {salesData.map((data) => (
              <span key={data.month}>{data.month}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6">
          {Object.entries(sizeColors).map(([size, color]) => (
            <div key={size} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-600">Size {size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-gray-100 rounded-lg overflow-hidden">
        <div className="bg-white">
          {/* Table Header (Sizes S/M/L/XL) */}
          <div className="flex items-center py-3 px-4 border-b border-gray-100 bg-gray-50">
            <div className="w-1/5 text-left">
              <span className="text-[#0A0A0A] font-['Inter'] text-sm font-medium">Date</span>
            </div>
            <div className="w-1/5 text-center">
              <span className="text-[#0A0A0A] font-['Inter'] text-sm font-medium">S</span>
            </div>
            <div className="w-1/5 text-center">
              <span className="text-[#0A0A0A] font-['Inter'] text-sm font-medium">M</span>
            </div>
            <div className="w-1/5 text-center">
              <span className="text-[#0A0A0A] font-['Inter'] text-sm font-medium">L</span>
            </div>
            <div className="w-1/5 text-center">
              <span className="text-[#0A0A0A] font-['Inter'] text-sm font-medium">XL</span>
            </div>
          </div>

          {/* Table Body (Sizes columns) */}
          {tableData.map((row, index) => (
            <div key={index} className="flex items-center py-3 px-4 border-b border-gray-100 last:border-b-0">
              <div className="w-1/5 text-left">
                <span className="text-[#0A0A0A] font-['Inter'] text-sm">{row.date}</span>
              </div>
              <div className="w-1/5 text-center">
                <span className="text-[#0A0A0A] font-['Inter'] text-sm">{row.S}</span>
              </div>
              <div className="w-1/5 text-center">
                <span className="text-[#0A0A0A] font-['Inter'] text-sm">{row.M}</span>
              </div>
              <div className="w-1/5 text-center">
                <span className="text-[#0A0A0A] font-['Inter'] text-sm">{row.L}</span>
              </div>
              <div className="w-1/5 text-center">
                <span className="text-[#0A0A0A] font-['Inter'] text-sm">{row.XL}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
