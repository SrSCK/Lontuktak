import React from "react";

export default function BestSellers() {
  // Sample data for top 10 best sellers
  const bestSellersData = [
    { rank: 1, name: "asdasd", size: "M", quantity: 1245, income: "฿730", progress: 100 },
    { rank: 2, name: "fdsfd", size: "L", quantity: 892, income: "฿730", progress: 72 },
    { rank: 3, name: "sfds", size: "M", quantity: 567, income: "฿730", progress: 46 },
    { rank: 4, name: "sfds", size: "L", quantity: 445, income: "฿730", progress: 36 },
    { rank: 5, name: "sdf", size: "S", quantity: 398, income: "฿730", progress: 32 },
    { rank: 6, name: "sdfds", size: "M", quantity: 356, income: "฿730", progress: 29 },
    { rank: 7, name: "sdf", size: "M", quantity: 289, income: "฿730", progress: 23 },
    { rank: 8, name: "fdsa", size: "L", quantity: 267, income: "฿730", progress: 21 },
    { rank: 9, name: "qwer", size: "S", quantity: 234, income: "฿730", progress: 19 },
    { rank: 10, name: "zxcv", size: "XL", quantity: 198, income: "฿730", progress: 16 }
  ];

  return (
    <div className="p-6">
      <h2 className="text-black font-['Georama'] text-base font-normal mb-6">
        Top 10 Best Sellers
      </h2>

      {/* Best Sellers List */}
      <div className="space-y-4">
        {bestSellersData.map((item, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm border border-gray-100"
          >
            {/* Rank Circle */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#938D7A]/50 flex items-center justify-center">
                <span className="text-[#030213] font-['Inter'] text-sm font-medium">
                  {item.rank}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <span className="text-[#0A0A0A] font-['Georama'] text-sm font-medium">
                  {item.name}
                </span>
                <span className="text-[#717182] font-['Georama'] text-xs">
                  Size: {item.size}
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-col items-center min-w-[80px]">
              <span className="text-[#0A0A0A] font-['Georama'] text-sm font-medium">
                {item.quantity}
              </span>
              <span className="text-[#717182] font-['Georama'] text-xs">
                Quantity
              </span>
            </div>

            {/* Income */}
            <div className="flex flex-col items-center min-w-[80px]">
              <span className="text-[#0A0A0A] font-['Inter'] text-sm">
                {item.income}
              </span>
              <span className="text-[#717182] font-['Georama'] text-xs">
                Income
              </span>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center min-w-[200px]">
              <div className="w-full bg-[#938D7A]/50 rounded-full h-2 relative overflow-hidden">
                <div 
                  className="bg-[#938D7A] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {bestSellersData.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}
          </div>
          <div className="text-sm text-blue-800 font-medium">Total Units Sold</div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            ฿{(bestSellersData.length * 730).toLocaleString()}
          </div>
          <div className="text-sm text-green-800 font-medium">Total Revenue</div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            {bestSellersData[0].quantity}
          </div>
          <div className="text-sm text-purple-800 font-medium">Best Performer</div>
        </div>
      </div>

      {/* Size Distribution Chart */}
      <div className="mt-8 bg-white rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Size Distribution</h3>
        
        <div className="space-y-3">
          {['S', 'M', 'L', 'XL'].map((size) => {
            const sizeCount = bestSellersData.filter(item => item.size === size).length;
            const percentage = (sizeCount / bestSellersData.length) * 100;
            
            return (
              <div key={size} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-gray-600">Size {size}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-16 text-sm text-gray-600">{sizeCount} items</div>
                <div className="w-12 text-sm text-gray-500">{percentage.toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Performance Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                <strong>{bestSellersData[0].name}</strong> is your top performer with {bestSellersData[0].quantity} units sold
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Size <strong>M</strong> appears most frequently in top sellers
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Average revenue per product: <strong>฿730</strong>
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Top 3 products account for <strong>68%</strong> of total performance
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Consider restocking <strong>{bestSellersData[0].name}</strong> and <strong>{bestSellersData[1].name}</strong>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Performance gap: <strong>{bestSellersData[0].quantity - bestSellersData[9].quantity}</strong> units between #1 and #10
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
