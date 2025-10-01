import React, { useState } from "react";

export default function PerformanceComparison() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(["Product 1", "Product 2", "Product 3"]);
  const [searchQueries, setSearchQueries] = useState({ 
    product1: "", 
    product2: "", 
    product3: "" 
  });
  const [dropdownStates, setDropdownStates] = useState({
    product1: false,
    product2: false,
    product3: false
  });

  // Sample product list for dropdown
  const availableProducts = [
    "Shinchan Boxers", "Deep Sleep", "Long Pants", "Basic T-Shirt", 
    "Premium Shirt", "Classic Jeans", "Cotton Hoodie", "Sports Shorts",
    "Casual Jacket", "Summer Dress"
  ];

  // Sample comparison data for 6 months
  const comparisonData = [
    { month: "Jan", "Shinchan Boxers": 133, "Deep Sleep": 160, "Long Pants": 176 },
    { month: "Feb", "Shinchan Boxers": 107, "Deep Sleep": 142, "Long Pants": 160 },
    { month: "Mar", "Shinchan Boxers": 166, "Deep Sleep": 152, "Long Pants": 178 },
    { month: "Apr", "Shinchan Boxers": 50, "Deep Sleep": 107, "Long Pants": 128 },
    { month: "May", "Shinchan Boxers": 83, "Deep Sleep": 166, "Long Pants": 170 },
    { month: "Jun", "Shinchan Boxers": 26, "Deep Sleep": 95, "Long Pants": 118 }
  ];

  // Sample table data
  const tableData = [
    { sku: "sdakn", product: "Shinchan", quantity: 1245, income: "฿730" },
    { sku: "sdakn", product: "Deep sleep", quantity: 892, income: "฿730" },
    { sku: "JN003", product: "Long pants", quantity: 567, income: "฿730" }
  ];

  // Colors for different products
  const productColors = {
    "Shinchan Boxers": "#EA5457",
    "Deep Sleep": "#00A63E", 
    "Long Pants": "#EAAC54"
  };

  const maxValue = 200;

  const handleProductSelect = (productIndex: number, product: string) => {
    const newSelected = [...selectedProducts];
    newSelected[productIndex] = product;
    setSelectedProducts(newSelected);
    setDropdownStates(prev => ({
      ...prev,
      [`product${productIndex + 1}`]: false
    }));
  };

  const toggleDropdown = (productKey: string) => {
    setDropdownStates(prev => ({
      ...prev,
      [productKey]: !prev[productKey as keyof typeof prev]
    }));
  };

  const filterProducts = (searchQuery: string) => {
    return availableProducts.filter(product =>
      product.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-black font-['Georama'] text-base font-normal mb-6">
        Performance Comparison (Top 3 SKUs)
      </h2>

      {/* Product Selection Buttons */}
      <div className="flex gap-4 mb-8">
        {[1, 2, 3].map((num) => {
          const productKey = `product${num}` as keyof typeof searchQueries;
          const isOpen = dropdownStates[productKey];
          
          return (
            <div key={num} className="relative">
              <button
                onClick={() => toggleDropdown(productKey)}
                className="bg-[#EFECE3] rounded-lg px-6 py-3 flex items-center gap-3 shadow-md hover:shadow-lg transition-shadow"
              >
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.59375 3.23431H10.4219C10.6204 3.23431 10.7813 3.3952 10.7813 3.59369V10.4218C10.7813 10.6203 10.6204 10.7812 10.4219 10.7812H3.59375C3.39526 10.7812 3.23438 10.6203 3.23438 10.4218V3.59369C3.23438 3.3952 3.39526 3.23431 3.59375 3.23431ZM16.2688 2.66531L20.3346 6.73119C20.475 6.87153 20.475 7.09905 20.3346 7.23941L16.2687 11.3053C16.1284 11.4456 15.9009 11.4456 15.7605 11.3053L11.6947 7.23939C11.5543 7.09905 11.5543 6.87153 11.6947 6.73117L15.7605 2.66531C15.9009 2.52497 16.1284 2.52497 16.2688 2.66531ZM3.59375 12.2187H10.4219C10.6204 12.2187 10.7813 12.3796 10.7813 12.5781V19.4062C10.7813 19.6047 10.6204 19.7656 10.4219 19.7656H3.59375C3.39526 19.7656 3.23438 19.6047 3.23438 19.4062V12.5781C3.23438 12.3796 3.39526 12.2187 3.59375 12.2187ZM12.5781 12.2187H19.4063C19.6047 12.2187 19.7656 12.3796 19.7656 12.5781V19.4062C19.7656 19.6047 19.6047 19.7656 19.4063 19.7656H12.5781C12.3796 19.7656 12.2188 19.6047 12.2188 19.4062V12.5781C12.2188 12.3796 12.3796 12.2187 12.5781 12.2187Z" fill="black"/>
                </svg>
                <span className="text-black font-['Georama'] text-sm">{selectedProducts[num - 1]}</span>
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {/* Search Input */}
                  <div className="p-3 border-b border-gray-100">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQueries[productKey]}
                      onChange={(e) => setSearchQueries(prev => ({
                        ...prev,
                        [productKey]: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Product List */}
                  <div className="max-h-48 overflow-y-auto">
                    {filterProducts(searchQueries[productKey]).map((product, index) => (
                      <button
                        key={index}
                        onClick={() => handleProductSelect(num - 1, product)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        {product}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
                style={{ bottom: `${i * 20}%` }}
              />
            ))}
            {/* Vertical grid lines */}
            {comparisonData.map((_, i) => (
              <div
                key={i}
                className="absolute h-full border-l border-dashed border-[#F1F5F9]"
                style={{ left: `${(i + 1) * (100 / (comparisonData.length + 1))}%` }}
              />
            ))}
          </div>

          {/* Chart Area */}
          <div className="relative h-80">
            {comparisonData.map((data, monthIndex) => (
              <div key={monthIndex} className="absolute" style={{ left: `${(monthIndex + 1) * (100 / (comparisonData.length + 1))}%` }}>
                {/* Shinchan Boxers Point */}
                <div
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: productColors["Shinchan Boxers"],
                    bottom: `${(data["Shinchan Boxers"] / maxValue) * 100}%`,
                    left: '-6px'
                  }}
                />
                {/* Deep Sleep Point */}
                <div
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: productColors["Deep Sleep"],
                    bottom: `${(data["Deep Sleep"] / maxValue) * 100}%`,
                    left: '-6px'
                  }}
                />
                {/* Long Pants Point */}
                <div
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: productColors["Long Pants"],
                    bottom: `${(data["Long Pants"] / maxValue) * 100}%`,
                    left: '-6px'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Y-Axis Labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#64748B] py-2">
            <span>240</span>
            <span>180</span>
            <span>120</span>
            <span>60</span>
            <span>0</span>
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-around mt-4 text-xs text-[#64748B]">
            {comparisonData.map((data) => (
              <span key={data.month}>{data.month}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6">
          {Object.entries(productColors).map(([product, color]) => (
            <div key={product} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm" style={{ color }}>{product}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-gray-100 rounded-lg overflow-hidden">
        <div className="bg-white">
          {/* Table Header (Income column removed) */}
          <div className="flex items-center py-3 px-4 border-b border-gray-100 bg-gray-50">
            <div className="w-1/3 text-left">
              <span className="text-[#0A0A0A] font-['Inter'] text-sm font-medium">SKU</span>
            </div>
            <div className="w-1/3 text-center">
              <span className="text-[#0A0A0A] font-['Inter'] text-sm font-medium">Product</span>
            </div>
            <div className="w-1/3 text-center">
              <span className="text-[#0A0A0A] font-['Inter'] text-sm font-medium">Quantity</span>
            </div>
          </div>

          {/* Table Body (Income removed, columns adjusted) */}
          {tableData.map((row, index) => (
            <div key={index} className="flex items-center py-3 px-4 border-b border-gray-100 last:border-b-0">
              <div className="w-1/3 text-left">
                <span
                  className="font-['Inter'] text-sm font-medium"
                  style={{
                    color: index === 0 ? "#F76666" : index === 1 ? "#00A63E" : "#EAAC54"
                  }}
                >
                  {row.sku}
                </span>
              </div>
              <div className="w-1/3 text-center">
                <span className="text-[#0A0A0A] font-['Inter'] text-sm">{row.product}</span>
              </div>
              <div className="w-1/3 text-center">
                <span className="text-[#0A0A0A] font-['Inter'] text-sm">{row.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
