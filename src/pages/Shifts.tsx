
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ShiftSchedule from "@/components/dashboard/ShiftSchedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Clock, Users, CalendarRange, Plus } from "lucide-react";

const ShiftsPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  // Form schema for creating a new shift
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Shift name must be at least 2 characters.",
    }),
    startTime: z.string(),
    endTime: z.string(),
    capacity: z.string().refine((val) => !isNaN(Number(val)), {
      message: "Capacity must be a number.",
    }),
    zone: z.string(),
  });

  // Form hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startTime: "08:00",
      endTime: "13:00",
      capacity: "120",
      zone: "reading-area",
    },
  });

  // Form submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Shift Created",
      description: `New shift "${values.name}" has been created successfully.`,
    });
    
    console.log(values);
    form.reset();
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Shift Management</h1>
          <p className="text-muted-foreground">
            Configure and manage library operating shifts
          </p>
        </div>

        <Tabs defaultValue="current">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
            <TabsTrigger value="current">Current Shifts</TabsTrigger>
            <TabsTrigger value="create">Create Shift</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          {/* Current Shifts Tab */}
          <TabsContent value="current" className="space-y-4">
            <ShiftSchedule />
          </TabsContent>

          {/* Create Shift Tab */}
          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Shift</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shift Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Morning Shift" {...field} />
                            </FormControl>
                            <FormDescription>
                              The name for the shift schedule.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a zone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="reading-area">Reading Area</SelectItem>
                                <SelectItem value="computer-zone">Computer Zone</SelectItem>
                                <SelectItem value="quiet-study">Quiet Study</SelectItem>
                                <SelectItem value="group-study">Group Study</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Zone where this shift applies.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seat Capacity</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Maximum number of seats available.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Shift
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar View Tab */}
          <TabsContent value="calendar">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Shift Schedule for {date?.toLocaleDateString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-muted/50 rounded-md">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <h4 className="font-medium">Morning Shift</h4>
                        <p className="text-sm text-muted-foreground">8:00 AM - 1:00 PM</p>
                      </div>
                      <div className="ml-auto flex gap-2">
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-1" />
                          Staff (3)
                        </Button>
                        <Button size="sm">Details</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-muted/50 rounded-md">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <h4 className="font-medium">Afternoon Shift</h4>
                        <p className="text-sm text-muted-foreground">1:00 PM - 6:00 PM</p>
                      </div>
                      <div className="ml-auto flex gap-2">
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-1" />
                          Staff (4)
                        </Button>
                        <Button size="sm">Details</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-muted/50 rounded-md">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <h4 className="font-medium">Evening Shift</h4>
                        <p className="text-sm text-muted-foreground">6:00 PM - 11:00 PM</p>
                      </div>
                      <div className="ml-auto flex gap-2">
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-1" />
                          Staff (3)
                        </Button>
                        <Button size="sm">Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ShiftsPage;
