import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  status: "low_stock" | "out_of_stock" | "in_stock";
  statusLabel: string;
  statusColor: string;
}

const mockStockItems: StockItem[] = [
  {
    id: "1",
    name: "Mickey Mouse Collection",
    quantity: 15,
    status: "low_stock",
    statusLabel: "Low Stock",
    statusColor: "bg-orange-500"
  },
  {
    id: "2", 
    name: "Toogtons oxford soft boxers",
    quantity: 45,
    status: "in_stock",
    statusLabel: "In Stock",
    statusColor: "bg-green-500"
  },
  {
    id: "3",
    name: "Deep Sleep T Shirt",
    quantity: 0,
    status: "out_of_stock",
    statusLabel: "Out of Stock", 
    statusColor: "bg-red-500"
  },
  {
    id: "4",
    name: "Shin Chan Collection",
    quantity: 12,
    status: "low_stock",
    statusLabel: "Low Stock",
    statusColor: "bg-orange-500"
  }
];

export default function StockManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Products");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTarget, setUploadTarget] = useState<'product' | 'sale' | null>(null);

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
    ), active: true, path: "/stocks" },
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
      // TODO: Implement actual upload to backend
      console.log("Uploading file:", selectedFile.name);
      setSelectedFile(null);
      setIsUploadModalOpen(false);
      // Show success message
    }
  };

  const filteredItems = mockStockItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <path d="M7.66683 14.5C3.90016 14.5 0.833496 11.4333 0.833496 7.66665C0.833496 3.89998 3.90016 0.833313 7.66683 0.833313C11.4335 0.833313 14.5002 3.89998 14.5002 7.66665C14.5002 11.4333 11.4335 14.5 7.66683 14.5ZM7.66683 1.83331C4.44683 1.83331 1.8335 4.45331 1.8335 7.66665C1.8335 10.88 4.44683 13.5 7.66683 13.5C10.8868 13.5 13.5002 10.88 13.5002 7.66665C13.5002 4.45331 10.8868 1.83331 7.66683 1.83331Z" fill="#97A1B6"/>
                  <path d="M14.6666 15.1667C14.54 15.1667 14.4133 15.12 14.3133 15.02L12.98 13.6867C12.7866 13.4933 12.7866 13.1733 12.98 12.98C13.1733 12.7867 13.4933 12.7867 13.6866 12.98L15.02 14.3133C15.2133 14.5067 15.2133 14.8267 15.02 15.02C14.92 15.12 14.7933 15.1667 14.6666 15.1667Z" fill="#97A1B6"/>
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

        {/* Stock Management Content */}
        <main className="flex-1 p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-black font-['Georama'] text-3xl font-bold tracking-[0.48px] mb-2">
                  Stock Management
                </h1>
                <p className="text-black/80 font-['Georama'] text-base font-normal tracking-[0.225px]">
                  Monitor & manage your inventory levels
                </p>
              </div>
              
              {/* Upload Boxes: Product List & Sale Stock (duplicate) */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setIsUploadModalOpen(true); setUploadTarget('product'); }}
                  className="bg-[#EFECE3] hover:bg-[#E5E1D7] text-black font-['Georama'] text-sm font-normal tracking-[0.24px] px-4 py-3 rounded-lg shadow-md flex items-center gap-3"
                >
                  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.8332 18.6667V9.15835L9.79984 12.1917L8.1665 10.5L13.9998 4.66669L19.8332 10.5L18.1998 12.1917L15.1665 9.15835V18.6667H12.8332ZM6.99984 23.3334C6.35817 23.3334 5.80906 23.1051 5.3525 22.6485C4.89595 22.192 4.66728 21.6425 4.6665 21V17.5H6.99984V21H20.9998V17.5H23.3332V21C23.3332 21.6417 23.1049 22.1912 22.6483 22.6485C22.1918 23.1059 21.6423 23.3341 20.9998 23.3334H6.99984Z" fill="black"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-black font-['Georama'] text-sm font-medium">Product List</div>
                    <div className="text-black/60 text-xs">Upload</div>
                  </div>
                </button>

                <button
                  onClick={() => { setIsUploadModalOpen(true); setUploadTarget('sale'); }}
                  className="bg-[#EFECE3] hover:bg-[#E5E1D7] text-black font-['Georama'] text-sm font-normal tracking-[0.24px] px-4 py-3 rounded-lg shadow-md flex items-center gap-3"
                >
                  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.8332 18.6667V9.15835L9.79984 12.1917L8.1665 10.5L13.9998 4.66669L19.8332 10.5L18.1998 12.1917L15.1665 9.15835V18.6667H12.8332ZM6.99984 23.3334C6.35817 23.3334 5.80906 23.1051 5.3525 22.6485C4.89595 22.192 4.66728 21.6425 4.6665 21V17.5H6.99984V21H20.9998V17.5H23.3332V21C23.3332 21.6417 23.1049 22.1912 22.6483 22.6485C22.1918 23.1059 21.6423 23.3341 20.9998 23.3334H6.99984Z" fill="black"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-black font-['Georama'] text-sm font-medium">Sale Stock</div>
                    <div className="text-black/60 text-xs">Upload</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Search & Filters Section */}
          <div className="border border-[#E5E2D8] rounded-lg p-6 mb-8 bg-white/50">
            <h2 className="text-black font-['Georama'] text-base font-normal tracking-[0.24px] mb-4">
              Search & Filters
            </h2>
            
            <div className="flex gap-6 items-end">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="bg-[#EFECE3] rounded-lg px-6 py-4 shadow-md flex items-center gap-3">
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
              </div>

              {/* Filter Dropdown */}
              <div className="min-w-[250px]">
                <div className="bg-[#EFECE3] rounded-lg px-6 py-4 shadow-md flex items-center gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-black font-['Georama'] text-base font-normal tracking-[0.24px]">
                    {selectedFilter}
                  </span>
                  <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.75 11.625L15.5 19.375L23.25 11.625" stroke="#B3B3B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Items Section */}
          <div className="border border-[#E5E2D8] rounded-lg p-6 bg-white/50">
            <h2 className="text-black font-['Georama'] text-base font-normal tracking-[0.24px] mb-6">
              Stock Items ( {filteredItems.length} )
            </h2>

            {/* Stock Items List */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-6 border border-[#E5E2D8] flex items-center justify-between hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-4">
                    {/* Status Indicator */}
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === 'in_stock' ? 'bg-green-500' :
                      item.status === 'low_stock' ? 'bg-orange-500' : 'bg-red-500'
                    }`}></div>
                    
                    {/* Item Info */}
                    <div>
                      <h3 className="text-black font-['Georama'] text-lg font-medium tracking-[0.27px]">
                        {item.name}
                      </h3>
                      <p className="text-black/60 font-['Georama'] text-sm font-normal">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex gap-3">
                    <span className={`px-4 py-2 rounded-full text-white text-sm font-medium ${item.statusColor}`}>
                      {item.statusLabel}
                    </span>
                    <span className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-medium">
                      {item.status === 'low_stock' ? 'Low Stock' : item.status === 'in_stock' ? 'Active' : 'Check Status'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl shadow-[#938D7A]/30">
          <DialogHeader>
            <DialogTitle className="text-black font-['Georama'] text-2xl font-bold tracking-[0.45px] text-left">
              {uploadTarget === 'product' ? 'Upload - Product List' : uploadTarget === 'sale' ? 'Upload - Sale Stock' : 'Upload'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-8">
            {/* Drag & Drop Area */}
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
              {/* Upload Icon */}
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
                onClick={() => document.getElementById('file-input')?.click()}
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

          {/* Hidden File Input */}
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="*/*"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
