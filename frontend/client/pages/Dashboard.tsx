import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const statsCards = [
    {
      title: "Total Stock Items",
      value: "3456",
      change: "+7% from last month",
      changeColor: "bg-[#00A63E]",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.725 5.79996L10 10.0083L17.275 5.79996M10 18.4V9.99996M17.5 13.3333V6.66663C17.4997 6.37435 17.4225 6.0873 17.2763 5.83426C17.13 5.58122 16.9198 5.37109 16.6667 5.22496L10.8333 1.89163C10.58 1.74535 10.2926 1.66833 10 1.66833C9.70744 1.66833 9.42003 1.74535 9.16667 1.89163L3.33333 5.22496C3.08022 5.37109 2.86998 5.58122 2.72372 5.83426C2.57745 6.0873 2.5003 6.37435 2.5 6.66663V13.3333C2.5003 13.6256 2.57745 13.9126 2.72372 14.1657C2.86998 14.4187 3.08022 14.6288 3.33333 14.775L9.16667 18.1083C9.42003 18.2546 9.70744 18.3316 10 18.3316C10.2926 18.3316 10.58 18.2546 10.8333 18.1083L16.6667 14.775C16.9198 14.6288 17.13 14.4187 17.2763 14.1657C17.4225 13.9126 17.4997 13.6256 17.5 13.3333Z" stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Low Stock Alerts",
      value: "7",
      change: "+2 from last month",
      changeColor: "bg-[#F76666]",
      icon: (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_3312_369)">
            <path d="M11.3332 11.3333C11.3332 11.3333 10.2707 9.91663 8.49984 9.91663C6.729 9.91663 5.6665 11.3333 5.6665 11.3333M6.37484 6.37496H6.38192M10.6248 6.37496H10.6319M15.5832 8.49996C15.5832 12.412 12.4119 15.5833 8.49984 15.5833C4.58782 15.5833 1.4165 12.412 1.4165 8.49996C1.4165 4.58794 4.58782 1.41663 8.49984 1.41663C12.4119 1.41663 15.5832 4.58794 15.5832 8.49996Z" stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_3312_369">
              <rect width="17" height="17" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      title: "Sales This Month",
      value: "54,000 Baht",
      change: "+15% from last month",
      changeColor: "bg-[#00A63E]",
      icon: (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.2918 4.25L9.56266 10.9792L6.021 7.4375L0.708496 12.75M16.2918 4.25H12.0418M16.2918 4.25V8.5" stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Out of Stock",
      value: "4",
      change: "same as last month",
      changeColor: "bg-black/80",
      icon: (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.2918 12.75L9.56266 6.02083L6.021 9.5625L0.708496 4.25M16.2918 12.75H12.0418M16.2918 12.75V8.5" stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  const quickActions = [
    { title: "Add New Items", icon: (
      <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.725 5.8L10 10.008L17.275 5.8M10 18.4V10M17.5 13.333V6.666C17.5 6.374 17.422 6.087 17.276 5.834C17.13 5.581 16.92 5.371 16.667 5.225L10.833 1.892C10.58 1.745 10.293 1.668 10 1.668C9.707 1.668 9.42 1.745 9.167 1.892L3.333 5.225C3.08 5.371 2.87 5.581 2.724 5.834C2.578 6.087 2.5 6.374 2.5 6.667V13.333C2.5 13.626 2.578 13.913 2.724 14.166C2.87 14.419 3.08 14.629 3.333 14.775L9.167 18.108C9.42 18.255 9.707 18.332 10 18.332C10.293 18.332 10.58 18.255 10.833 18.108L16.667 14.775C16.92 14.629 17.13 14.419 17.276 14.166C17.422 13.913 17.5 13.626 17.5 13.333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) },
    { title: "Generate Report", icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ) },
    { title: "Check Trends", icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17l4-4 4 4 6-10 4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ) },
    { title: "View Alerts", icon: (
      <svg width="24" height="24" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.014 18.375c-.153.265-.374.485-.64.638-.266.154-.566.235-.873.235-.307 0-.608-.081-.874-.235-.266-.153-.487-.373-.64-.638M15.75 7c0-1.392-.553-2.727-1.537-3.712A3.786 3.786 0 0 0 10.5 1.75C9.108 1.75 7.772 2.303 6.788 3.288 5.803 4.272 5.25 5.608 5.25 7c0 6.125-2.625 7.875-2.625 7.875H18.375S15.75 13.125 15.75 7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ) },
    { title: "Analyze Sales", icon: (
      <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 16.667V8.333M10 16.667V3.333M5 16.667V11.667" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ) },
    { title: "Predict Sales", icon: (
      <svg width="24" height="24" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.125 5.25L11.812 13.563 7.437 9.188 0.875 15.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ) }
  ];

  const sidebarItems = [
    { name: "Home", icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.625 7.875L10.5 1.75L18.375 7.875V17.5C18.375 17.9641 18.1906 18.4092 17.8624 18.7374C17.5342 19.0656 17.0891 19.25 16.625 19.25H4.375C3.9109 19.25 3.4658 19.0656 3.1376 18.7374C2.8094 18.4092 2.625 17.9641 2.625 17.5V7.875Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ), active: true, path: "/dashboard" },
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
    ), active: false, path: "/analysis" },
    { name: "Notifications", icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.014 18.375c-.153.265-.374.485-.64.638-.266.154-.566.235-.873.235-.307 0-.608-.081-.874-.235-.266-.153-.487-.373-.64-.638M15.75 7c0-1.393-.553-2.728-1.537-3.713A3.786 3.786 0 0 0 10.5 1.75C9.108 1.75 7.772 2.303 6.788 3.288C5.803 4.272 5.25 5.608 5.25 7c0 6.125-2.625 7.875-2.625 7.875H18.375S15.75 13.125 15.75 7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ), active: false, path: "/notifications" }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
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

        {/* Dashboard Content */}
        <main className="flex-1 p-8">
          {/* Dashboard Overview Header */}
          <div className="mb-8">
            <h1 className="text-black font-['Georama'] text-3xl font-bold tracking-[0.48px] mb-2">
              Dashboard Overview
            </h1>
            <p className="text-black/80 font-['Georama'] text-base font-normal tracking-[0.225px]">
              Monitor your inventory status and performance
            </p>
          </div>

          <div className="flex gap-8">
            {/* Main Content Area */}
            <div className="flex-1">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statsCards.map((card, index) => (
                  <div key={index} className="bg-[#FAFBFC] rounded-xl p-5 w-full">
                    {/* Header */}
                    <div className="bg-[#EFECE3] rounded-lg flex items-center justify-between p-3 mb-4">
                      <span className="text-black font-['Georama'] text-xs font-medium tracking-[0.24px]">
                        {card.title}
                      </span>
                      <div className="w-5 h-5 flex items-center justify-center">
                        {card.icon}
                      </div>
                    </div>

                    {/* Value */}
                    <div className="mb-4">
                      <span className="text-black/90 font-['Georama'] text-xl font-bold tracking-[0.4px]">
                        {card.value}
                      </span>
                    </div>

                    {/* Change Indicator */}
                    <div className={`${card.changeColor} rounded-md px-3 py-1 inline-block`}>
                      <span className="text-white font-['Georama'] text-xs font-bold">
                        {card.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="border border-[#CECABF] rounded-lg p-8">
                <h2 className="text-black font-['Georama'] text-2xl font-bold tracking-[0.36px] mb-8">
                  Quick Actions
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      className="border border-[#CECABF] rounded-lg p-8 hover:bg-[#EFECE3]/20 transition-colors duration-200 cursor-pointer text-center"
                    >
                      <div className="text-4xl mb-4">{action.icon}</div>
                      <span className="text-black font-['Georama'] text-xl font-medium tracking-[0.3px]">
                        {action.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity Sidebar */}
            <div className="w-80">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-black font-['Georama'] text-lg font-bold tracking-[0.27px]">
                    Recent Activity
                  </h3>
                  <div className="bg-[#F4F5F9] rounded-lg px-3 py-2 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.6666 7.99992C14.6666 11.6799 11.6799 14.6666 7.99992 14.6666C4.31992 14.6666 1.33325 11.6799 1.33325 7.99992C1.33325 4.31992 4.31992 1.33325 7.99992 1.33325C11.6799 1.33325 14.6666 4.31992 14.6666 7.99992Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.4734 10.12L8.40675 8.88671C8.04675 8.67338 7.75342 8.16005 7.75342 7.74005V5.00671" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-black font-['Georama'] text-xs font-bold tracking-[-0.54px]">
                      24 h
                    </span>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.00001 5.59996C3.76667 5.59996 3.53334 5.50996 3.35667 5.3333L1.18334 3.15996C1.08667 3.0633 1.08667 2.9033 1.18334 2.80663C1.28001 2.70996 1.44001 2.70996 1.53667 2.80663L3.71001 4.97996C3.87001 5.13996 4.13001 5.13996 4.29001 4.97996L6.46334 2.80663C6.56001 2.70996 6.72001 2.70996 6.81667 2.80663C6.91334 2.9033 6.91334 3.0633 6.81667 3.15996L4.64334 5.3333C4.46667 5.50996 4.23334 5.59996 4.00001 5.59996Z" fill="#292D32" stroke="#292D32"/>
                    </svg>
                  </div>
                </div>
                
                <div className="text-center py-16">
                  <p className="text-black font-['Georama'] text-xl font-medium tracking-[0.3px]">
                    Done!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
