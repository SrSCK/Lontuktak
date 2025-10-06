import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from '@/shared/api-client';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface ForecastData {
  productSku: string;
  forecastDate: string;
  predictedSales: number;
  currentSale: number;
  date: string;
}

interface MonthlyOverview {
  month: string;
  amount: number;
  change: string;
  color: "green" | "red";
}

const mockForecastData: ForecastData[] = [
  { productSku: "SKU001", forecastDate: "Oct '25", predictedSales: 76500, currentSale: 72000, date: "2025-10-01" },
  { productSku: "SKU002", forecastDate: "Nov '25", predictedSales: 79200, currentSale: 75000, date: "2025-11-01" },
  { productSku: "SKU003", forecastDate: "Dec '25", predictedSales: 82300, currentSale: 78000, date: "2025-12-01" },
  { productSku: "SKU004", forecastDate: "Jan '26", predictedSales: 85100, currentSale: 81000, date: "2026-01-01" },
  { productSku: "SKU005", forecastDate: "Feb '26", predictedSales: 88900, currentSale: 84000, date: "2026-02-01" },
  { productSku: "SKU006", forecastDate: "Mar '26", predictedSales: 92700, currentSale: 87000, date: "2026-03-01" }
];

const mockMonthlyOverviews: MonthlyOverview[] = [
  { month: "October 2025", amount: 73500, change: "+2.7%", color: "green" },
  { month: "November 2025", amount: 75300, change: "+2.4%", color: "green" },
  { month: "December 2025", amount: 77800, change: "+3.3%", color: "green" },
  { month: "January 2026", amount: 76900, change: "-1.2%", color: "red" },
  { month: "February 2026", amount: 80500, change: "+4.7%", color: "green" },
  { month: "March 2026", amount: 82300, change: "+2.2%", color: "green" }
];

export default function Predict() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("1 Month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("1 Month");
  const [otherMonths, setOtherMonths] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: 0,
    date: '',
  });
  const navigate = useNavigate();

  const sidebarItems = [
    { name: "Home", icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.625 7.875L10.5 1.75L18.375 7.875V17.5C18.375 17.9641 18.1906 18.4092 17.8624 18.7374C17.5342 19.0656 17.0891 19.25 16.625 19.25H4.375C3.9109 19.25 3.4658 19.0656 3.1376 18.7374C2.8094 18.4092 2.625 17.9641 2.625 17.5V7.875Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ), active: false, path: "/dashboard" },
    { name: "Stocks", icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.861 6.09L10.5 10.509L18.139 6.09M10.5 19.32V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ), active: false, path: "/stocks" },
    { name: "Predict", icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.125 5.25L11.812 13.563 7.437 9.188 0.875 15.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ), active: true, path: "/predict" },
    { name: "Analysis", icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.0002 6.417C11.0002 5.444 10.6139 4.512 9.9262 3.824C9.2386 3.136 8.3059 2.75 7.3335 2.75H1.8335V16.5H8.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ), active: false, path: "/analysis" },
    { name: "Notifications", icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.014 18.375c-.153.265-.374.485-.64.638-.266.154-.566.235-.873.235-.307 0-.608-.081-.874-.235-.266-.153-.487-.373-.64-.638M15.75 7c0-1.393-.553-2.728-1.537-3.713A3.786 3.786 0 0 0 10.5 1.75C9.108 1.75 7.772 2.303 6.788 3.288C5.803 4.272 5.25 5.608 5.25 7c0 6.125-2.625 7.875-2.625 7.875H18.375S15.75 13.125 15.75 7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ), active: false, path: "/notifications" }
  ];

  const periodOptions = [
    "1 Month",
    "2 Months", 
    "3 Months",
    "6 Months",
    "Predict System",
    "1 Year"
  ];

  const timeRangeOptions = [
    "1 Month",
    "2 Month",
    "3 Month",
    "4 Month",
    "5 Month",
    "6 Month",
    "1 Year",
    "Other"
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handlePeriodChange = (value: string) => {
    if (value === "Predict System") {
      setIsModalOpen(true);
    } else {
      setSelectedPeriod(value);
    }
  };

  const formatCurrency = (amount: number) => {
    return `฿${(amount / 1000).toFixed(1)}k`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate summary stats
  const averageForecast = mockForecastData.reduce((sum, item) => sum + item.predictedSales, 0) / mockForecastData.length;
  const highestPrediction = Math.max(...mockForecastData.map(item => item.predictedSales));
  const totalGrowth = mockForecastData.reduce((sum, item) => {
    const growth = ((item.predictedSales - item.currentSale) / item.currentSale) * 100;
    return sum + growth;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await apiClient.getPredictions(formData);
      if (result.success) {
        toast({
          title: 'Prediction Success',
          description: 'Your prediction has been calculated.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get prediction',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex">
      {/* Sidebar */}
      <div className="w-80 bg-[#F8F5EE] border-r border-black/10 p-6">
        {/* Navigation Header */}
        <div className="mb-8">
          <p className="text-black/50 font-['Josefin_Sans'] text-sm font-medium tracking-[1.5px] text-center">
            Navigation
          </p>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-4 px-6 py-3 rounded-sm transition-colors duration-200 cursor-pointer ${
                item.active
                  ? "bg-[#EFECE3]"
                  : "hover:bg-[#EFECE3]/50"
              }`}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 text-black">{item.icon}</span>
              <span className="text-black font-['Georama'] text-base font-normal tracking-[0.8px]">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-32 border-b border-black/20 bg-[#F8F5EE] flex items-center px-8">
          <div className="flex items-center gap-8 w-full">
            {/* Logo */}
            <div className="flex flex-col items-center">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/aebca391e8b9e0af23ac6531beb569685852e1e7?width=266"
                alt="Logo"
                className="w-32 h-auto"
              />
              <p className="text-black/50 font-['Genos'] text-xs font-normal tracking-[2px] mt-1">
                Stock Management
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl">
              <div className="relative bg-white rounded-lg border px-4 py-4 flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.66683 14.4999C3.90016 14.4999 0.833496 11.4333 0.833496 7.66659C0.833496 3.89992 3.90016 0.833252 7.66683 0.833252C11.4335 0.833252 14.5002 3.89992 14.5002 7.66659C14.5002 11.4333 11.4335 14.4999 7.66683 14.4999ZM7.66683 1.83325C4.44683 1.83325 1.8335 4.45325 1.8335 7.66659C1.8335 10.8799 4.44683 13.4999 7.66683 13.4999C10.8868 13.4999 13.5002 10.8799 13.5002 7.66659C13.5002 4.45325 10.8868 1.83325 7.66683 1.83325Z" fill="#97A1B6"/>
                  <path d="M14.6666 15.1666C14.54 15.1666 14.4133 15.12 14.3133 15.02L12.98 13.6866C12.7866 13.4933 12.7866 13.1733 12.98 12.98C13.1733 12.7866 13.4933 12.7866 13.6866 12.98L15.02 14.3133C15.2133 14.5066 15.2133 14.8266 15.02 15.02C14.92 15.12 14.7933 15.1666 14.6666 15.1666Z" fill="#97A1B6"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search for stocks & more"
                  className="flex-1 bg-transparent text-[#B4BBCB] font-['Georama'] text-sm font-normal tracking-[0.28px] placeholder:text-[#B4BBCB] outline-none"
                />
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EBF9F3] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              </div>
              <div className="text-right">
                <p className="text-black font-['Georama'] text-sm font-normal tracking-[0.28px]">
                  Toogton
                </p>
                <p className="text-black/70 font-['Georama'] text-sm font-normal tracking-[0.28px]">
                  Toogtons@gmail.com
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Predict Content */}
        <main className="flex-1 p-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-black font-['Georama'] text-3xl font-bold tracking-[0.48px] mb-2">
              Predict Sales
            </h1>
            <p className="text-black/80 font-['Georama'] text-base font-normal tracking-[0.225px]">
              Monitor your sales forecast
            </p>
          </div>

          <div className="flex gap-8">
            {/* Left Side - Main Content */}
            <div className="flex-1">
              {/* Controls Section */}
              <div className="flex items-center justify-between mb-6">
                {/* Sales Forecast */}
                <div>
                  <h2 className="text-black font-['Georama'] text-xl font-medium tracking-[0.3px]">
                    Sales Forecast
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  {/* Search Products */}
                  <div className="bg-[#EFECE3] rounded-lg px-6 py-3 shadow-md flex items-center gap-3 min-w-[270px]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#B3B3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="bg-transparent border-none shadow-none text-[#B3B3B3] font-['Georama'] text-base font-normal tracking-[0.24px] placeholder:text-[#B3B3B3] focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0"
                    />
                  </div>

                  {/* Period Selection */}
                  <div className="bg-[#EFECE3] rounded-lg px-4 py-3 shadow-md flex items-center gap-3 min-w-[270px] w-full max-w-[320px] relative">
                    <svg className="flex-shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-auto text-left bg-[#EFECE3] border-none outline-none text-black font-['Georama'] text-sm font-normal tracking-[0.24px] px-3 py-1 rounded min-w-[140px] max-w-[220px]"
                    >
                      Predict System
                    </button>
                  </div>
                </div>
              </div>

              {/* Forecast Table */}
              <div className="bg-white rounded-2xl border border-black/10 shadow-sm mb-8">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15C12.8333 15 13.5417 14.7083 14.125 14.125C14.7083 13.5417 15 12.8333 15 12C15 11.1667 14.7083 10.4583 14.125 9.875C13.5417 9.29167 12.8333 9 12 9C11.1667 9 10.4583 9.29167 9.875 9.875C9.29167 10.4583 9 11.1667 9 12C9 12.8333 9.29167 13.5417 9.875 14.125C10.4583 14.7083 11.1667 15 12 15ZM12 17C10.6167 17 9.4375 16.5125 8.4625 15.5375C7.4875 14.5625 7 13.3833 7 12C7 10.6167 7.4875 9.4375 8.4625 8.4625C9.4375 7.4875 10.6167 7 12 7C13.3833 7 14.5625 7.4875 15.5375 8.4625C16.5125 9.4375 17 10.6167 17 12C17 13.3833 16.5125 14.5625 15.5375 15.5375C14.5625 16.5125 13.3833 17 12 17ZM5 13H1V11H5V13ZM23 13H19V11H23V13ZM11 5V1H13V5H11ZM11 23V19H13V23H11ZM6.4 7.75L3.875 5.325L5.3 3.85L7.7 6.35L6.4 7.75ZM18.7 20.15L16.275 17.625L17.6 16.25L20.125 18.675L18.7 20.15ZM16.25 6.4L18.675 3.875L20.15 5.3L17.65 7.7L16.25 6.4ZM3.85 18.7L6.375 16.275L7.75 17.6L5.325 20.125L3.85 18.7Z" fill="#1D1B20"/>
                    </svg>
                    <h3 className="text-[#0A0A0A] font-['Inter'] text-sm font-normal">
                      {selectedPeriod} Forecast
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product SKU</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Forecast Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Predicted Sales</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Current Sale</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Current Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockForecastData.map((item, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4 text-sm font-medium text-gray-900">{item.productSku}</td>
                            <td className="py-4 px-4 text-sm text-gray-900">{item.forecastDate}</td>
                            <td className="py-4 px-4 text-sm text-gray-900">{formatCurrency(item.predictedSales)}</td>
                            <td className="py-4 px-4 text-sm text-gray-900">{formatCurrency(item.currentSale)}</td>
                            <td className="py-4 px-4 text-sm text-gray-900">{formatDate(item.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-6">
                {/* Average Forecast */}
                <div className="bg-white rounded-2xl border border-[#CECABF] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15C12.8333 15 13.5417 14.7083 14.125 14.125C14.7083 13.5417 15 12.8333 15 12C15 11.1667 14.7083 10.4583 14.125 9.875C13.5417 9.29167 12.8333 9 12 9C11.1667 9 10.4583 9.29167 9.875 9.875C9.29167 10.4583 9 11.1667 9 12C9 12.8333 9.29167 13.5417 9.875 14.125C10.4583 14.7083 11.1667 15 12 15ZM12 17C10.6167 17 9.4375 16.5125 8.4625 15.5375C7.4875 14.5625 7 13.3833 7 12C7 10.6167 7.4875 9.4375 8.4625 8.4625C9.4375 7.4875 10.6167 7 12 7C13.3833 7 14.5625 7.4875 15.5375 8.4625C16.5125 9.4375 17 10.6167 17 12C17 13.3833 16.5125 14.5625 15.5375 15.5375C14.5625 16.5125 13.3833 17 12 17ZM5 13H1V11H5V13ZM23 13H19V11H23V13ZM11 5V1H13V5H11ZM11 23V19H13V23H11ZM6.4 7.75L3.875 5.325L5.3 3.85L7.7 6.35L6.4 7.75ZM18.7 20.15L16.275 17.625L17.6 16.25L20.125 18.675L18.7 20.15ZM16.25 6.4L18.675 3.875L20.15 5.3L17.65 7.7L16.25 6.4ZM3.85 18.7L6.375 16.275L7.75 17.6L5.325 20.125L3.85 18.7Z" fill="#1D1B20"/>
                    </svg>
                    <h4 className="text-black font-['Georama'] text-base font-medium tracking-[0.24px]">
                      Average Forecast
                    </h4>
                  </div>
                  <p className="text-[#0A0A0A] font-['Georama'] text-2xl font-bold mb-1">
                    {formatCurrency(averageForecast)}
                  </p>
                  <p className="text-[#717182] font-['Georama'] text-sm">
                    Oct '25 - Mar '26
                  </p>
                </div>

                {/* Highest Prediction */}
                <div className="bg-white rounded-2xl border border-[#CECABF] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 18L12 14.95L16 18L14.5 13.05L18.5 10.2H13.6L12 5L10.4 10.2H5.5L9.5 13.05L8 18ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22Z" fill="#1D1B20"/>
                    </svg>
                    <h4 className="text-black font-['Georama'] text-base font-medium tracking-[0.24px]">
                      Highest Prediction
                    </h4>
                  </div>
                  <p className="text-[#0A0A0A] font-['Georama'] text-2xl font-bold mb-1">
                    {formatCurrency(highestPrediction)}
                  </p>
                  <p className="text-[#717182] font-['Georama'] text-sm">
                    Mar 2026
                  </p>
                </div>

                {/* Expected Growth */}
                <div className="bg-white rounded-2xl border border-[#CECABF] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 6L13.5 15.5L8.5 10.5L1 18M23 6H17M23 6V12" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h4 className="text-black font-['Georama'] text-base font-medium tracking-[0.24px]">
                      Expected Growth
                    </h4>
                  </div>
                  <p className="text-[#00A63E] font-['Georama'] text-2xl font-bold mb-1">
                    +{(totalGrowth / mockForecastData.length).toFixed(1)}%
                  </p>
                  <p className="text-[#717182] font-['Georama'] text-sm">
                    vs previous 6 months
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Monthly Overviews */}
            <div className="w-80">
              <div className="mb-6">
                <h3 className="text-black font-['Georama'] text-xl font-medium tracking-[0.3px] mb-4">
                  Monthly Overviews
                </h3>
              </div>

              <div className="space-y-4">
                {mockMonthlyOverviews.map((overview, index) => (
                  <div key={index} className="bg-white rounded-2xl p-4 border border-[#CECABF]">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        overview.color === 'green' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        overview.color === 'green' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {overview.change}
                      </span>
                    </div>
                    <h4 className="text-black font-['Georama'] text-sm font-medium mb-1">
                      {overview.month}
                    </h4>
                    <p className="text-black font-['Georama'] text-lg font-bold">
                      {formatCurrency(overview.amount)}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Range: 80%-85%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Predict System Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/10">
              <div>
                <h2 className="text-[#101828] font-['Georama'] text-2xl font-bold mb-1">
                  Predict Function
                </h2>
                <p className="text-[#717182] font-['Georama'] text-sm">
                  Choose your parameter
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12" stroke="#0A0A0A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 4L12 12" stroke="#0A0A0A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Time Range Section */}
              <div className="mb-8">
                <h3 className="text-[#0A0A0A] font-['Georama'] text-base font-medium mb-4">
                  Time Range
                </h3>
                
                {/* Time Range Tabs */}
                <div className="bg-[#F7F7F7] rounded-full p-1 inline-flex items-center gap-2">
                  {timeRangeOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => { setSelectedTimeRange(option); if (option !== 'Other') setOtherMonths(null); }}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedTimeRange === option
                          ? 'bg-[#CECABF] text-black'
                          : 'text-[#404040] hover:text-black'
                      }`}
                    >
                      {option}
                    </button>
                  ))}

                  {/* If Other selected, show numeric input for months */}
                  {selectedTimeRange === 'Other' && (
                    <input
                      type="number"
                      min={1}
                      value={otherMonths ?? ''}
                      onChange={(e) => setOtherMonths(Number(e.target.value))}
                      placeholder="Months"
                      className="ml-3 w-24 px-3 py-2 rounded-md border border-gray-200 text-sm"
                    />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-black/10">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6"
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  className="px-6"
                >
                  Export Excel
                </Button>
                <Button
                  className="flex-1 bg-[#CECABF] hover:bg-[#BFBAB5] text-black font-medium"
                  onClick={() => {
                    // Apply predict: set selectedPeriod based on chosen time range or other months
                    if (selectedTimeRange === 'Other' && otherMonths && otherMonths > 0) {
                      setSelectedPeriod(`${otherMonths} Month`);
                    } else {
                      setSelectedPeriod(selectedTimeRange);
                    }
                    setIsModalOpen(false);
                  }}
                >
                  Predict
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prediction Form - Temporary Section */}
      <div className="container mx-auto p-4">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Product ID</label>
              <Input
                value={formData.product_id}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  product_id: e.target.value
                }))}
              />
            </div>
            <div>
              <label>Quantity</label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  quantity: parseInt(e.target.value)
                }))}
              />
            </div>
            <div>
              <label>Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  date: e.target.value
                }))}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Calculating...' : 'Get Prediction'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
