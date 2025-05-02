import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from 'react-router-dom';

interface TableTabsProps {
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

const TableTabs: React.FC<TableTabsProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
    navigate(`/students/${value}`);
  };

  return (
    <Tabs
      defaultValue={activeTab || 'active'}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="active">Active Students</TabsTrigger>
        <TabsTrigger value="booking">Booking</TabsTrigger>
        <TabsTrigger value="old">Old Students</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TableTabs; 