import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CollectionsFilterProps {
  value: string;
  onChange: (value: string) => void;
  showAllOption?: boolean;
}

const CollectionsFilter = ({ value, onChange, showAllOption = true }: CollectionsFilterProps) => {
  return (
    <div className="w-[180px] bg-white border rounded-md">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && <SelectItem value="all">All Status</SelectItem>}
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CollectionsFilter; 