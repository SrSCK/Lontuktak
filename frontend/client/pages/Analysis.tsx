import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HistoricalSales from "../components/analysis/HistoricalSales";
import PerformanceComparison from "../components/analysis/PerformanceComparison";
import BestSellers from "../components/analysis/BestSellers";
import TotalIncome from "../components/analysis/TotalIncome";

export default function Analysis() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("historical");
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
    ), active: false, path: "/predict" },
    { name: "Analysis", icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.0002 6.417C11.0002 5.444 10.6139 4.512 9.9262 3.824C9.2386 3.136 8.3059 2.75 7.3335 2.75H1.8335V16.5H8.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ), active: true, path: "/analysis" },
    { name: "Notifications", icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.014 18.375c-.153.265-.374.485-.64.638-.266.154-.566.235-.873.235-.307 0-.608-.081-.874-.235-.266-.153-.487-.373-.64-.638M15.75 7c0-1.393-.553-2.728-1.537-3.713A3.786 3.786 0 0 0 10.5 1.75C9.108 1.75 7.772 2.303 6.788 3.288C5.803 4.272 5.25 5.608 5.25 7c0 6.125-2.625 7.875-2.625 7.875H18.375S15.75 13.125 15.75 7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ), active: false, path: "/notifications" }
  ];

  const analysisCards = [
    {
      id: "historical",
      title: "Historical Sales",
      description: "View sales & trends over time",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 16.6668V8.3335M10 16.6668V3.3335M5 16.6668V11.6668" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: activeTab === "historical" ? "bg-[#CECABF]" : "bg-[#FAFBFC]"
    },
    {
      id: "performance",
      title: "Performance Comparison",
      description: "Compare top SKU performance",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.3335 17.5V11.6667M3.3335 8.33333V2.5M10.0002 17.5V10M10.0002 6.66667V2.5M16.6668 17.5V13.3333M16.6668 10V2.5M0.833496 11.6667H5.8335M7.50016 6.66667H12.5002M14.1668 13.3333H19.1668" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: activeTab === "performance" ? "bg-[#CECABF]" : "bg-[#FAFBFC]"
    },
    {
      id: "bestsellers",
      title: "Best Sellers",
      description: "Top 10 performing products",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.3335 12.4998C3.3335 12.4998 4.16683 11.6665 6.66683 11.6665C9.16683 11.6665 10.8335 13.3332 13.3335 13.3332C15.8335 13.3332 16.6668 12.4998 16.6668 12.4998V2.49984C16.6668 2.49984 15.8335 3.33317 13.3335 3.33317C10.8335 3.33317 9.16683 1.6665 6.66683 1.6665C4.16683 1.6665 3.3335 2.49984 3.3335 2.49984V12.4998ZM3.3335 12.4998V18.3332" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: activeTab === "bestsellers" ? "bg-[#CECABF]" : "bg-[#FAFBFC]"
    },
    {
      id: "totalincome",
      title: "Total Income",
      description: "Income growth analysis",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0.833496V19.1668M14.1667 4.16683H7.91667C7.14312 4.16683 6.40125 4.47412 5.85427 5.0211C5.30729 5.56808 5 6.30995 5 7.0835C5 7.85704 5.30729 8.59891 5.85427 9.14589C6.40125 9.69287 7.14312 10.0002 7.91667 10.0002H12.0833C12.8569 10.0002 13.5987 10.3075 14.1457 10.8544C14.6927 11.4014 15 12.1433 15 12.9168C15 13.6904 14.6927 14.4322 14.1457 14.9792C13.5987 15.5262 12.8569 15.8335 12.0833 15.8335H5" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: activeTab === "totalincome" ? "bg-[#CECABF]" : "bg-[#FAFBFC]"
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "historical":
        return <HistoricalSales />;
      case "performance":
        return <PerformanceComparison />;
      case "bestsellers":
        return <BestSellers />;
      case "totalincome":
        return <TotalIncome />;
      default:
        return <HistoricalSales />;
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  Toogtons
                </p>
                <p className="text-black/70 font-['Georama'] text-sm font-normal tracking-[0.28px]">
                  Toogtons@gmail.com
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Analysis Content */}
        <main className="flex-1 p-8">
          {/* Analysis Overview Header */}
          <div className="mb-8">
            <h1 className="text-black font-['Georama'] text-3xl font-bold tracking-[0.48px] mb-2">
              Analyze Sales
            </h1>
            <p className="text-black/80 font-['Georama'] text-base font-normal tracking-[0.225px]">
              Gain insights into sales trends, top performers, and total income growth
            </p>
          </div>

          {/* Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {analysisCards.map((card, index) => (
              <div 
                key={index} 
                className={`${card.bgColor} rounded-xl p-5 w-full cursor-pointer transition-all duration-200 hover:shadow-md`}
                onClick={() => setActiveTab(card.id)}
              >
                {/* Header */}
                <div className="bg-[#EFECE3] rounded-lg flex items-center justify-between p-3 mb-4">
                  <span className="text-black font-['Georama'] text-xs font-medium tracking-[0.24px]">
                    {card.title}
                  </span>
                  <div className="w-5 h-5 flex items-center justify-center">
                    {card.icon}
                  </div>
                </div>

                {/* Description */}
                <div className="text-black font-['Georama'] text-xs font-light tracking-[0.22px]">
                  {card.description}
                </div>
              </div>
            ))}
          </div>

          {/* Active Component */}
          <div className="bg-white rounded-2xl border border-[#CECABF] shadow-sm">
            {renderActiveComponent()}
          </div>
        </main>
      </div>
    </div>
  );
}
