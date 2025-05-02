import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import { PropertySelector } from "./PropertySelector";
import { properties } from "@/data/properties";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(properties[0]?.id || "default");
  const mainContentRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handlePropertyChange = (value: string) => {
    setSelectedProperty(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mainContentRef.current && !mainContentRef.current.contains(event.target as Node)) {
        setIsCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex min-h-screen h-screen bg-background overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div ref={mainContentRef} className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <PropertySelector 
            selectedProperty={selectedProperty} 
            onPropertyChange={handlePropertyChange} 
          />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
