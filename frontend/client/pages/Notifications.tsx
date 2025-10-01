import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface NotificationItem {
  id: string;
  title: string;
  product: string;
  sku: string;
  status: "critical" | "warning" | "safe";
  statusLabel: string;
  description: string;
  timestamp: string;
  metrics?: {
    currentStock: number;
    minStock: number;
    decreaseRate: string;
    timeToRunOut: string;
    buffer: number;
    recommendedRestock: number;
  };
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Nearly Out of Stock",
    product: "Over Soft T-shirt (Embroidered)",
    sku: "SKU123",
    status: "critical",
    statusLabel: "Critical",
    description: "Estimated to run out in 1-3 weeks - Recommend reordering 6-7 units",
    timestamp: "5m ago",
    metrics: {
      currentStock: 3,
      minStock: 5,
      decreaseRate: "8/week",
      timeToRunOut: "2.5 days",
      buffer: 3,
      recommendedRestock: 50
    }
  },
  {
    id: "2",
    title: "Decreasing Rapidly",
    product: "Shinchan Boxers",
    sku: "SKU124",
    status: "warning",
    statusLabel: "Warning",
    description: "Estimated to run out in 3-5 weeks - Recommend reordering 7-8 units",
    timestamp: "12m ago",
    metrics: {
      currentStock: 15,
      minStock: 8,
      decreaseRate: "5/week",
      timeToRunOut: "3 weeks",
      buffer: 5,
      recommendedRestock: 30
    }
  },
  {
    id: "3",
    title: "Decreasing Rapidly",
    product: "Women's Tank Tops",
    sku: "SKU125",
    status: "warning",
    statusLabel: "Warning",
    description: "Estimated to run out in 3-5 weeks - Recommend reordering 7-8 units",
    timestamp: "18m ago",
    metrics: {
      currentStock: 22,
      minStock: 10,
      decreaseRate: "6/week",
      timeToRunOut: "3.5 weeks",
      buffer: 8,
      recommendedRestock: 40
    }
  },
  {
    id: "4",
    title: "Decreasing Rapidly",
    product: "Mickey Mouse Long Pants",
    sku: "SKU126",
    status: "warning",
    statusLabel: "Warning",
    description: "Estimated to run out in 3-5 weeks - Recommend reordering 7-8 units",
    timestamp: "25m ago",
    metrics: {
      currentStock: 18,
      minStock: 12,
      decreaseRate: "4/week",
      timeToRunOut: "4 weeks",
      buffer: 6,
      recommendedRestock: 35
    }
  },
  {
    id: "5",
    title: "Decreasing Rapidly",
    product: "Women's T-Shirt",
    sku: "SKU127",
    status: "warning",
    statusLabel: "Warning",
    description: "Estimated to run out in 3-5 weeks - Recommend reordering 7-8 units",
    timestamp: "32m ago",
    metrics: {
      currentStock: 25,
      minStock: 15,
      decreaseRate: "3/week",
      timeToRunOut: "8 weeks",
      buffer: 10,
      recommendedRestock: 45
    }
  },
  {
    id: "6",
    title: "Stock is Enough",
    product: "Men's Boxer Brief",
    sku: "SKU128",
    status: "safe",
    statusLabel: "Safe",
    description: "Estimated to run out in 15-7 weeks",
    timestamp: "45m ago",
    metrics: {
      currentStock: 85,
      minStock: 20,
      decreaseRate: "2/week",
      timeToRunOut: "42 weeks",
      buffer: 25,
      recommendedRestock: 0
    }
  },
  {
    id: "7",
    title: "Stock is Enough",
    product: "Shinchan Boxers",
    sku: "SKU129",
    status: "safe",
    statusLabel: "Safe",
    description: "Estimated to run out in 15-7 weeks",
    timestamp: "1h ago",
    metrics: {
      currentStock: 92,
      minStock: 25,
      decreaseRate: "1/week",
      timeToRunOut: "92 weeks",
      buffer: 30,
      recommendedRestock: 0
    }
  }
];

export default function Notifications() {
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredNotifications, setFilteredNotifications] = useState(mockNotifications);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["critical", "warning", "safe"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    ), active: false, path: "/analysis" },
    { name: "Notifications", icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.014 18.375c-.153.265-.374.485-.64.638-.266.154-.566.235-.873.235-.307 0-.608-.081-.874-.235-.266-.153-.487-.373-.64-.638M15.75 7c0-1.393-.553-2.728-1.537-3.713A3.786 3.786 0 0 0 10.5 1.75C9.108 1.75 7.772 2.303 6.788 3.288C5.803 4.272 5.25 5.608 5.25 7c0 6.125-2.625 7.875-2.625 7.875H18.375S15.75 13.125 15.75 7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ), active: true, path: "/notifications" }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getStatusColors = (status: string) => {
    switch (status) {
      case "critical":
        return {
          border: "border-l-red-500",
          bg: "bg-white",
          textColor: "text-red-600",
          badgeBg: "bg-red-100 border-red-200",
          badgeText: "text-red-700"
        };
      case "warning":
        return {
          border: "border-l-yellow-500",
          bg: "bg-white",
          textColor: "text-yellow-700",
          badgeBg: "bg-yellow-100 border-yellow-200",
          badgeText: "text-yellow-700"
        };
      case "safe":
        return {
          border: "border-l-green-500",
          bg: "bg-white",
          textColor: "text-green-600",
          badgeBg: "bg-green-100 border-green-200",
          badgeText: "text-green-700"
        };
      default:
        return {
          border: "border-l-gray-500",
          bg: "bg-white",
          textColor: "text-gray-600",
          badgeBg: "bg-gray-100 border-gray-200",
          badgeText: "text-gray-700"
        };
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    setSelectedNotification(notification);
  };

  const handleFilterApply = () => {
    let filtered = mockNotifications;
    
    // Filter by selected statuses
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(notification => 
        selectedStatuses.includes(notification.status)
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(notification =>
        notification.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredNotifications(filtered);
    setIsFilterModalOpen(false);
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile.name);
      setSelectedFile(null);
      setIsUploadModalOpen(false);
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

        {/* Notifications Content */}
        <main className="flex-1 p-8">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-black font-['Georama'] text-3xl font-bold tracking-[0.48px] mb-2">
                Notifications
              </h1>
              <p className="text-black/80 font-['Georama'] text-base font-normal tracking-[0.225px]">
                Stay updated with your inventory alerts
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 items-end">
              <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-[#EFECE3] hover:bg-[#E5E1D7] text-black font-['Georama'] text-base font-normal tracking-[0.24px] px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.8332 18.6667V9.15835L9.79984 12.1917L8.1665 10.5L13.9998 4.66669L19.8332 10.5L18.1998 12.1917L15.1665 9.15835V18.6667H12.8332ZM6.99984 23.3334C6.35817 23.3334 5.80906 23.1051 5.3525 22.6485C4.89595 22.192 4.66728 21.6425 4.6665 21V17.5H6.99984V21H20.9998V17.5H23.3332V21C23.3332 21.6417 23.1049 22.1912 22.6483 22.6485C22.1918 23.1059 21.6423 23.3341 20.9998 23.3334H6.99984Z" fill="black"/>
              </svg>
              <span className="text-black font-['Georama'] text-base font-medium">Upload</span>
            </button>

              <Button
                onClick={() => setIsFilterModalOpen(true)}
                className="bg-[#EFECE3] hover:bg-[#E5E1D7] text-black font-['Georama'] text-base font-normal tracking-[0.24px] px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Filter Notifications
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const colors = getStatusColors(notification.status);
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`bg-white rounded-2xl border-l-8 ${colors.border} p-6 cursor-pointer hover:shadow-lg transition-all duration-200 ${colors.bg}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`px-2 py-1 rounded border ${colors.badgeBg} ${colors.badgeText}`}>
                          <span className="text-xs font-medium">{notification.statusLabel}</span>
                        </div>
                        <span className="text-sm text-gray-500">{notification.timestamp}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-black mb-1">
                        {notification.title} - {notification.product}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-2">
                        {notification.description}
                      </p>
                      
                      <p className="text-xs text-gray-500">
                        SKU: {notification.sku}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Detail View Modal */}
      {selectedNotification && (
        <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
          <DialogContent className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl shadow-[#938D7A]/30">
            <DialogHeader className="border-b border-black/10 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded border ${getStatusColors(selectedNotification.status).badgeBg} ${getStatusColors(selectedNotification.status).badgeText}`}>
                    <span className="text-sm font-medium capitalize">{selectedNotification.status}</span>
                  </div>
                  <DialogTitle className="text-2xl font-bold text-[#101828]">
                    {selectedNotification.product} || {selectedNotification.sku}
                  </DialogTitle>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Inventory alert • Updated {selectedNotification.timestamp}
              </p>
            </DialogHeader>
            
            {selectedNotification.metrics && (
              <div className="py-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* Current Stock */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm text-gray-600 mb-2">Current Stock</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{selectedNotification.metrics.currentStock}</p>
                    <p className="text-xs text-gray-500">units remaining</p>
                    <div className="mt-4">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.6401 44.2498C23.2482 44.6009 23.938 44.7857 24.6401 44.7857C25.3423 44.7857 26.0321 44.6009 26.6401 44.2498L40.6401 36.2498C41.2476 35.8991 41.7522 35.3948 42.1032 34.7875C42.4543 34.1802 42.6394 33.4913 42.6401 32.7898V16.7898C42.6394 16.0884 42.4543 15.3995 42.1032 14.7922C41.7522 14.1849 41.2476 13.6806 40.6401 13.3298L26.6401 5.32984C26.0321 4.97877 25.3423 4.79395 24.6401 4.79395C23.938 4.79395 23.2482 4.97877 22.6401 5.32984L8.64014 13.3298C8.03266 13.6806 7.5281 14.1849 7.17706 14.7922C6.82602 15.3995 6.64086 16.0884 6.64014 16.7898V32.7898C6.64086 33.4913 6.82602 34.1802 7.17706 34.7875C7.5281 35.3948 8.03266 35.8991 8.64014 36.2498L22.6401 44.2498Z" stroke="#938D7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M24.6401 44.79V24.79" stroke="#938D7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7.22021 14.79L24.6402 24.79L42.0602 14.79" stroke="#938D7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Decrease Rate */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm text-gray-600 mb-2">Decrease Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{selectedNotification.metrics.decreaseRate}</p>
                    <p className="text-xs text-gray-500">trending down</p>
                    <div className="mt-4">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32.6401 34.79H44.6401V22.79" stroke="#938D7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M44.6401 34.79L27.6401 17.79L17.6401 27.79L4.64014 14.79" stroke="#938D7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Time to Run Out */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm text-gray-600 mb-2">Time to Run Out</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{selectedNotification.metrics.timeToRunOut}</p>
                    <p className="text-xs text-gray-500">at current rate</p>
                    <div className="mt-4">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 4H28" stroke="#938D7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M24 28L30 22" stroke="#938D7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M24 44C32.8366 44 40 36.8366 40 28C40 19.1634 32.8366 12 24 12C15.1634 12 8 19.1634 8 28C8 36.8366 15.1634 44 24 44Z" stroke="#938D7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Min Stock */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm text-gray-600 mb-2">Min Stock</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{selectedNotification.metrics.minStock}</p>
                    <p className="text-xs text-gray-500">threshold</p>
                    <div className="mt-4">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40.6499 26.79C40.6499 36.79 33.6499 41.79 25.3299 44.69C24.8942 44.8376 24.421 44.8305 23.9899 44.67C15.6499 41.79 8.6499 36.79 8.6499 26.79V12.79C8.6499 12.2595 8.86062 11.7508 9.23569 11.3757C9.61076 11.0007 10.1195 10.79 10.6499 10.79C14.6499 10.79 19.6499 8.38996 23.1299 5.34996C23.5536 4.98796 24.0926 4.78906 24.6499 4.78906C25.2072 4.78906 25.7462 4.98796 26.1699 5.34996C29.6699 8.40996 34.6499 10.79 38.6499 10.79C39.1803 10.79 39.689 11.0007 40.0641 11.3757C40.4392 11.7508 40.6499 12.2595 40.6499 12.79V26.79Z" stroke="#938D7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Buffer */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm text-gray-600 mb-2">Buffer</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{selectedNotification.metrics.buffer}</p>
                    <p className="text-xs text-gray-500">safety stock</p>
                    <div className="mt-4">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.6401 44.79C35.6858 44.79 44.6401 35.8357 44.6401 24.79C44.6401 13.7443 35.6858 4.79004 24.6401 4.79004C13.5944 4.79004 4.64014 13.7443 4.64014 24.79C4.64014 35.8357 13.5944 44.79 24.6401 44.79Z" stroke="#938D7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M24.6401 36.79C31.2676 36.79 36.6401 31.4175 36.6401 24.79C36.6401 18.1626 31.2676 12.79 24.6401 12.79C18.0127 12.79 12.6401 18.1626 12.6401 24.79C12.6401 31.4175 18.0127 36.79 24.6401 36.79Z" stroke="#938D7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M24.6401 28.79C26.8493 28.79 28.6401 26.9992 28.6401 24.79C28.6401 22.5809 26.8493 20.79 24.6401 20.79C22.431 20.79 20.6401 22.5809 20.6401 24.79C20.6401 26.9992 22.431 28.79 24.6401 28.79Z" stroke="#938D7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Recommended Restock */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm text-gray-600 mb-2">Recommended restock</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{selectedNotification.metrics.recommendedRestock}</p>
                    <p className="text-xs text-gray-500">units suggested</p>
                    <div className="mt-4">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 24C6 27.5601 7.05568 31.0402 9.03355 34.0003C11.0114 36.9603 13.8226 39.2675 17.1117 40.6298C20.4008 41.9922 24.02 42.3487 27.5116 41.6541C31.0033 40.9596 34.2106 39.2453 36.7279 36.7279C39.2453 34.2106 40.9596 31.0033 41.6541 27.5116C42.3487 24.02 41.9922 20.4008 40.6298 17.1117C39.2675 13.8226 36.9603 11.0114 34.0003 9.03355C31.0402 7.05568 27.5601 6 24 6C18.9679 6.01893 14.1379 7.98245 10.52 11.48L6 16" stroke="#938D7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 6V16H16" stroke="#938D7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="border-t border-black/10 pt-6">
              <div className="flex gap-4 w-full">
                <Button variant="outline" className="flex-1 h-12 font-['Georama'] text-sm font-medium">
                  Reset
                </Button>
                <Button className="flex-1 h-12 bg-[#CECABF] hover:bg-[#C4BEAF] text-black font-['Georama'] text-sm font-medium">
                  Export Excel
                </Button>
                <Button className="flex-[2] h-12 bg-[#CECABF] hover:bg-[#C4BEAF] text-black font-['Georama'] text-sm font-medium">
                  Apply Filters
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl shadow-[#938D7A]/30">
          <DialogHeader>
            <DialogTitle className="text-black font-['Georama'] text-2xl font-bold tracking-[0.45px] text-left">
              Upload - Notifications
            </DialogTitle>
          </DialogHeader>

          <div className="py-8">
            <div
              className={`border-2 border-dashed rounded-lg p-16 text-center transition-colors duration-200 ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mb-8 flex justify-center">
                <svg width="187" height="187" viewBox="0 0 187 187" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M99.3438 157.781V122.719H122.719L93.5 87.6562L64.2812 122.719H87.6562V157.781H58.4375V157.489C57.4558 157.548 56.5208 157.781 55.5156 157.781C43.8917 157.781 32.7438 153.164 24.5245 144.944C16.3051 136.725 11.6875 125.577 11.6875 113.953C11.6875 91.4664 28.6928 73.1404 50.5134 70.6276C52.4265 60.6265 57.7649 51.6047 65.6103 45.1138C73.4556 38.623 83.3176 35.0687 93.5 35.0625C103.684 35.0681 113.548 38.6219 121.395 45.1126C129.242 51.6034 134.583 60.6255 136.498 70.6276C158.319 73.1404 175.301 91.4664 175.301 113.953C175.301 125.577 170.683 136.725 162.464 144.944C154.244 153.164 143.097 157.781 131.473 157.781C130.491 157.781 129.544 157.548 128.551 157.489V157.781H99.3438Z" fill="#C5C5C5"/>
                </svg>
              </div>

              <p className="text-[#717182] font-['Georama'] text-base font-normal tracking-[0.24px] mb-4">
                {selectedFile ? `Selected: ${selectedFile.name}` : "Drag a file here"}
              </p>

              {!selectedFile && (
                <p className="text-[#717182] font-['Georama'] text-sm font-normal mb-4">
                  or
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-black/10 pt-6">
            <div className="flex gap-4 w-full">
              <Button
                variant="outline"
                className="flex-1 h-12 font-['Georama'] text-sm font-medium"
                onClick={() => document.getElementById('notifications-file-input')?.click()}
              >
                Browse
              </Button>
              <Button
                className="flex-[2] h-12 bg-[#CECABF] hover:bg-[#C4BEAF] text-black font-['Georama'] text-sm font-medium"
                onClick={handleUpload}
                disabled={!selectedFile}
              >
                Upload
              </Button>
            </div>
          </DialogFooter>

          <input
            id="notifications-file-input"
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="*/*"
          />
        </DialogContent>
      </Dialog>

      {/* Filter Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl shadow-[#938D7A]/30">
          <DialogHeader className="border-b border-black/10 pb-6">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold text-[#0A0A0A]">
                Filters
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="py-6 space-y-8">
            {/* Time Range */}
            <div>
              <h3 className="text-sm font-medium text-[#0A0A0A] mb-4">Time Range</h3>
              <div className="flex gap-2">
                <Button className="bg-[#CECABF] text-black hover:bg-[#C4BEAF] h-8 px-3 text-sm">
                  Last 7 days
                </Button>
                <Button variant="outline" className="h-8 px-3 text-sm">
                  Last 30 days
                </Button>
                <Button variant="outline" className="h-8 px-3 text-sm">
                  Custom
                </Button>
              </div>
            </div>

            <div className="border-t border-black/10"></div>

            {/* Product/SKU Search */}
            <div>
              <h3 className="text-sm font-medium text-[#0A0A0A] mb-4">Product / SKU</h3>
              <div className="relative">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 h-9"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-medium text-[#0A0A0A] mb-4">Category</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="long-pants" />
                    <label htmlFor="long-pants" className="text-sm text-gray-700">Long pants</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="men-boxers" />
                    <label htmlFor="men-boxers" className="text-sm text-gray-700">Men Boxers</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="women-boxers" />
                    <label htmlFor="women-boxers" className="text-sm text-gray-700">Women Boxers</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="t-shirt" />
                    <label htmlFor="t-shirt" className="text-sm text-gray-700">T Shirt</label>
                  </div>
                </div>
              </div>

              {/* Size */}
              <div>
                <h3 className="text-sm font-medium text-[#0A0A0A] mb-4">Size</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="small" />
                    <label htmlFor="small" className="text-sm text-gray-700">Small</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="medium" />
                    <label htmlFor="medium" className="text-sm text-gray-700">Medium</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="large" />
                    <label htmlFor="large" className="text-sm text-gray-700">Large</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="extra-large" />
                    <label htmlFor="extra-large" className="text-sm text-gray-700">Extra Large</label>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div>
                <h3 className="text-sm font-medium text-[#0A0A0A] mb-4">Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sku" />
                    <label htmlFor="sku" className="text-sm text-gray-700">SKU</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="last-week-stock" />
                    <label htmlFor="last-week-stock" className="text-sm text-gray-700">Last week stock</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="min-stock" />
                    <label htmlFor="min-stock" className="text-sm text-gray-700">Min stock</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Status */}
            <div>
              <h3 className="text-sm font-medium text-[#0A0A0A] mb-4">Inventory Status</h3>
              <div className="space-y-2">
                <div 
                  onClick={() => handleStatusToggle("critical")}
                  className={`w-80 h-8 px-3 flex items-center rounded border cursor-pointer transition-colors ${
                    selectedStatuses.includes("critical") 
                      ? "bg-red-50 border-red-200" 
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    selectedStatuses.includes("critical") ? "text-red-600" : "text-gray-700"
                  }`}>
                    Critical
                  </span>
                </div>
                <div 
                  onClick={() => handleStatusToggle("warning")}
                  className={`w-80 h-8 px-3 flex items-center rounded border cursor-pointer transition-colors ${
                    selectedStatuses.includes("warning") 
                      ? "bg-yellow-50 border-yellow-200" 
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    selectedStatuses.includes("warning") ? "text-yellow-600" : "text-gray-700"
                  }`}>
                    Warning
                  </span>
                </div>
                <div 
                  onClick={() => handleStatusToggle("safe")}
                  className={`w-80 h-8 px-3 flex items-center rounded border cursor-pointer transition-colors ${
                    selectedStatuses.includes("safe") 
                      ? "bg-green-50 border-green-200" 
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    selectedStatuses.includes("safe") ? "text-green-600" : "text-gray-700"
                  }`}>
                    Safe
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-black/10 pt-6">
            <div className="flex gap-4 w-full">
              <Button 
                variant="outline" 
                className="h-9 px-4 font-['Georama'] text-sm font-medium"
                onClick={() => {
                  setSelectedStatuses(["critical", "warning", "safe"]);
                  setSearchQuery("");
                }}
              >
                Reset
              </Button>
              <Button variant="outline" className="h-9 px-4 font-['Georama'] text-sm font-medium">
                Export Excel
              </Button>
              <Button 
                className="flex-1 h-9 bg-[#CECABF] hover:bg-[#C4BEAF] text-black font-['Georama'] text-sm font-medium"
                onClick={handleFilterApply}
              >
                Apply Filters
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
