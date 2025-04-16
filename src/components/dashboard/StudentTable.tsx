import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  ChevronUp,
  ChevronDown,
  Edit,
  UserCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Star,
  BookOpen,
  AlertTriangle,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronRight,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Student {
  id: string;
  name: string;
  email: string;
  photo?: string;
  status: string;
  priority: string;
  lastActive: string;
  phone?: string;
  address?: string;
  registeredOn?: string;
  idProof?: string;
  bookings?: number;
  violations?: number;
  notes?: string;
}

interface StudentTableProps {
  students: Student[];
  filteredAndSortedStudents: Student[];
  editStudent: (student: Student) => void;
}

const StudentTable = ({ students, filteredAndSortedStudents, editStudent }: StudentTableProps) => {
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [activeTabs, setActiveTabs] = useState<{[key: string]: string}>({});
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter students based on search query
  const filteredStudents = searchQuery.trim() === "" 
    ? filteredAndSortedStudents 
    : filteredAndSortedStudents.filter((student) => {
        const query = searchQuery.toLowerCase();
        return (
          student.name.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query) ||
          student.id.toLowerCase().includes(query)
        );
      });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleExpand = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
    if (!activeTabs[studentId]) {
      setActiveTabs(prev => ({...prev, [studentId]: "information"}));
    }
  };

  const handleTabChange = (studentId: string, value: string) => {
    setActiveTabs(prev => ({...prev, [studentId]: value}));
  };

  const handleImageError = (studentId: string) => {
    setImageError(prev => ({ ...prev, [studentId]: true }));
  };

  const shouldShowPlaceholder = (student: Student) => {
    return imageError[student.id] || !student.photo;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderPriorityBadge = (priority: string) => {
    const variants: {[key: string]: string} = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return (
      <Badge className={`${variants[priority] || 'bg-gray-100'} rounded-md px-2 py-1 text-xs flex items-center gap-1`}>
        <Star className="h-3 w-3" />
        <span className="capitalize">{priority}</span>
      </Badge>
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start sm:ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <SortAsc className="h-4 w-4 mr-2" />
                <span className="hidden xs:inline">Sort by:</span> {sortField.charAt(0).toUpperCase() + sortField.slice(1)}
                {sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSort("name")}>
                Name {sortField === "name" && (sortDirection === "asc" ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("id")}>
                ID {sortField === "id" && (sortDirection === "asc" ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("status")}>
                Status {sortField === "status" && (sortDirection === "asc" ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("lastActive")}>
                Last Active {sortField === "lastActive" && (sortDirection === "asc" ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex border rounded-md">
            <Button 
              variant={viewMode === "grid" ? "default" : "ghost"} 
              size="sm" 
              className="rounded-r-none px-2 sm:px-3"
              onClick={() => setViewMode("grid")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"} 
              size="sm" 
              className="rounded-l-none px-2 sm:px-3"
              onClick={() => setViewMode("list")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <Card className="w-full py-10">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <Search className="h-10 w-10 mb-2 opacity-20" />
            <h3 className="text-lg font-medium">No students found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredStudents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedStudents.map((student) => (
            <Card key={student.id} className={`overflow-hidden ${expandedStudent === student.id ? "ring-2 ring-primary" : ""}`}>
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-muted border-2 border-primary/20 flex-shrink-0">
                      {shouldShowPlaceholder(student) ? (
                        <UserCircle className="h-full w-full text-muted-foreground p-1" />
                      ) : (
                        <img 
                          src={student.photo} 
                          alt={student.name}
                          className="h-full w-full object-cover"
                          onError={() => handleImageError(student.id)}
                        />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base line-clamp-1">{student.name}</CardTitle>
                      <CardDescription className="line-clamp-1">{student.email}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge 
                      className={`${getStatusColor(student.status)} px-2 py-1 text-xs capitalize`}
                    >
                      {student.status}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => editStudent(student)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-muted-foreground">ID:</span> {student.id}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{student.lastActive}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{student.bookings || 0} bookings</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className={`h-4 w-4 ${Number(student.violations) > 0 ? "text-red-500" : "text-muted-foreground"}`} />
                      <span>{student.violations || 0} violations</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-0 border-t">
                <Collapsible open={expandedStudent === student.id}>
                  <CollapsibleTrigger asChild className="w-full">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-none h-10 w-full flex items-center justify-center gap-1"
                      onClick={() => toggleExpand(student.id)}
                    >
                      {expandedStudent === student.id ? "Less details" : "More details"}
                      {expandedStudent === student.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 pt-0 bg-muted/20">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium">Editable Information</h4>
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-start gap-2">
                              <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="text-sm font-medium">{student.email || "N/A"}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Phone</p>
                                <p className="text-sm font-medium">{student.phone || "N/A"}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Address</p>
                                <p className="text-sm font-medium">{student.address || "N/A"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 justify-end">
                          <Button 
                            onClick={() => editStudent(student)}
                            size="sm" 
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" /> Edit Student
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && filteredStudents.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="border-b">
              <div className="grid grid-cols-12 py-3 px-4 bg-muted/30 text-sm font-medium">
                <div className="col-span-1 text-center">Photo</div>
                <div className="col-span-4 md:col-span-3 border-l pl-3">Student</div>
                <div className="col-span-3 md:col-span-2 border-l pl-3">Status</div>
                <div className="col-span-2 hidden md:block border-l pl-3">Last Active</div>
                <div className="col-span-4 md:col-span-4 text-center border-l pl-3">Actions</div>
              </div>
            </div>
            <ScrollArea className="max-h-[550px]">
              <div>
                {paginatedStudents.map((student) => (
                  <Collapsible key={student.id} open={expandedStudent === student.id}>
                    <div className={`border-b transition-colors hover:bg-muted/40 ${expandedStudent === student.id ? "bg-muted/40" : ""}`}>
                      <div className="grid grid-cols-12 py-3 px-4 items-center">
                        <div className="col-span-1 flex justify-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0 border-2 border-primary/20">
                            {shouldShowPlaceholder(student) ? (
                              <UserCircle className="h-full w-full text-muted-foreground p-1" />
                            ) : (
                              <img 
                                src={student.photo} 
                                alt={student.name}
                                className="h-full w-full object-cover"
                                onError={() => handleImageError(student.id)}
                              />
                            )}
                          </div>
                        </div>
                        <div className="col-span-4 md:col-span-3 border-l pl-3">
                          <div>
                            <p className="line-clamp-1 font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{student.id}</p>
                          </div>
                        </div>
                        <div className="col-span-3 md:col-span-2 border-l pl-3">
                          <Badge 
                            className={`${getStatusColor(student.status)} px-2 py-1 text-xs capitalize`}
                          >
                            {student.status}
                          </Badge>
                        </div>
                        <div className="col-span-2 hidden md:block border-l pl-3">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{student.lastActive}</span>
                          </div>
                        </div>
                        <div className="col-span-4 md:col-span-4 flex items-center justify-center gap-1 border-l pl-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => editStudent(student)}
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => toggleExpand(student.id)}
                            >
                              {expandedStudent === student.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>
                    </div>
                    <CollapsibleContent>
                      <div className="px-4 py-3 bg-muted/20 border-b">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-16 w-16 rounded-full overflow-hidden bg-muted border-2 border-primary/20">
                              {shouldShowPlaceholder(student) ? (
                                <UserCircle className="h-full w-full text-muted-foreground p-2" />
                              ) : (
                                <img 
                                  src={student.photo} 
                                  alt={student.name}
                                  className="h-full w-full object-cover"
                                  onError={() => handleImageError(student.id)}
                                />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{student.name}</h3>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                          <h4 className="text-sm font-medium border-b pb-2">Editable Student Information</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-2 p-2 bg-background/50 rounded-md border">
                              <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="text-sm font-medium">{student.email || "N/A"}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2 p-2 bg-background/50 rounded-md border">
                              <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Phone</p>
                                <p className="text-sm font-medium">{student.phone || "N/A"}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2 p-2 bg-background/50 rounded-md border">
                              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Address</p>
                                <p className="text-sm font-medium">{student.address || "N/A"}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 p-2 bg-background/50 rounded-md border">
                              <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">ID Proof</p>
                                <p className="text-sm font-medium">{student.idProof || "Not submitted"}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 justify-end mt-2 pt-2 border-t">
                            <Button 
                              onClick={() => editStudent(student)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-4 w-4" /> Edit Student
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t py-3">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students
              {filteredStudents.length < filteredAndSortedStudents.length && ` (filtered from ${filteredAndSortedStudents.length})`}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default StudentTable;