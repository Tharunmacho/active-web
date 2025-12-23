import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Calendar, MapPin, Users, Clock } from "lucide-react";
import { toast } from "sonner";
import MemberSidebar from "./MemberSidebar";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  attendees: number;
  capacity: number;
  registered: boolean;
  image?: string;
}

const MemberEvents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<string>("all");

  // Initialize with mock events
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: "1",
        title: "Introduction to Web Development",
        date: "2024-12-15",
        time: "10:00 AM",
        location: "Chennai, Tamil Nadu",
        category: "Workshop",
        description:
          "Learn the basics of HTML, CSS, and JavaScript in this beginner-friendly workshop.",
        attendees: 45,
        capacity: 100,
        registered: false,
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
      },
      {
        id: "2",
        title: "Advanced Python Programming",
        date: "2024-12-20",
        time: "2:00 PM",
        location: "Online",
        category: "Course",
        description:
          "Deep dive into advanced Python concepts including OOP, decorators, and async programming.",
        attendees: 32,
        capacity: 50,
        registered: false,
        image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop",
      },
      {
        id: "3",
        title: "Digital Marketing Masterclass",
        date: "2024-12-25",
        time: "11:00 AM",
        location: "Bangalore, Karnataka",
        category: "Seminar",
        description:
          "Master the latest digital marketing strategies including SEO, social media, and content marketing.",
        attendees: 78,
        capacity: 120,
        registered: false,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
      },
      {
        id: "4",
        title: "Mobile App Development with React Native",
        date: "2025-01-05",
        time: "3:00 PM",
        location: "Online",
        category: "Workshop",
        description:
          "Build cross-platform mobile applications using React Native. Perfect for developers.",
        attendees: 56,
        capacity: 75,
        registered: false,
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop",
      },
      {
        id: "5",
        title: "Data Science & Machine Learning",
        date: "2025-01-10",
        time: "9:00 AM",
        location: "Mumbai, Maharashtra",
        category: "Course",
        description:
          "Comprehensive course on data science, machine learning algorithms, and real-world applications.",
        attendees: 89,
        capacity: 100,
        registered: false,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      },
      {
        id: "6",
        title: "Cloud Computing Fundamentals",
        date: "2025-01-15",
        time: "4:00 PM",
        location: "Online",
        category: "Webinar",
        description:
          "Introduction to cloud platforms: AWS, Azure, and Google Cloud. Ideal for beginners.",
        attendees: 120,
        capacity: 150,
        registered: false,
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
      },
    ];

    // Load registered events from localStorage
    const savedRegistrations = localStorage.getItem("eventRegistrations");
    if (savedRegistrations) {
      try {
        const registered = JSON.parse(savedRegistrations);
        const updatedEvents = mockEvents.map((event) => ({
          ...event,
          registered: registered.includes(event.id),
        }));
        setEvents(updatedEvents);
      } catch (error) {
        setEvents(mockEvents);
      }
    } else {
      setEvents(mockEvents);
    }
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Workshop":
        return "bg-blue-100 text-blue-800";
      case "Course":
        return "bg-green-100 text-green-800";
      case "Seminar":
        return "bg-purple-100 text-purple-800";
      case "Webinar":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleRegister = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    if (event.attendees >= event.capacity) {
      toast.error("This event is at full capacity");
      return;
    }

    const updatedEvents = events.map((e) => {
      if (e.id === eventId) {
        return {
          ...e,
          registered: !e.registered,
          attendees: e.registered ? e.attendees - 1 : e.attendees + 1,
        };
      }
      return e;
    });

    setEvents(updatedEvents);

    // Save to localStorage
    const registeredEventIds = updatedEvents
      .filter((e) => e.registered)
      .map((e) => e.id);
    localStorage.setItem("eventRegistrations", JSON.stringify(registeredEventIds));

    const message = event.registered
      ? "You've unregistered from the event"
      : "Successfully registered for the event!";
    toast.success(message);
  };

  const filteredEvents =
    filter === "all"
      ? events
      : filter === "registered"
        ? events.filter((e) => e.registered)
        : events.filter((e) => e.category === filter);

  const categories = ["all", "Workshop", "Course", "Seminar", "Webinar", "registered"];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-white">
      {/* Sidebar for desktop */}

      {/* Mobile menu */}
      <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800">Events</h1>
          <div className="w-10" />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-5 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-5">
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-xl md:text-2xl font-bold mb-1 text-gray-800">Upcoming Events</h1>
              <p className="text-gray-600 text-sm">
                Discover and register for events, workshops, and seminars
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filter === category ? "default" : "outline"}
                  onClick={() => setFilter(category)}
                  size="sm"
                  className={`font-medium transition-all ${filter === category
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                    : "hover:shadow-md"
                    }`}
                >
                  {category === "registered"
                    ? "My Events"
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-shadow rounded-xl border-0 shadow-lg flex flex-col bg-gradient-to-br from-white to-gray-50">
                    <div className="h-40 relative overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <Badge className={`${getCategoryColor(event.category)} font-semibold px-3 py-1 shadow-md`}>{event.category}</Badge>
                      </div>
                    </div>

                    <CardHeader className="flex-1 pb-3 px-4 pt-4">
                      <CardTitle className="text-sm md:text-base font-bold text-gray-900">{event.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs md:text-sm mt-1">
                        {event.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0 px-4 pb-4">
                      {/* Event Details */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-blue-600" />
                          <span className="font-medium">{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-green-600" />
                          <span className="font-medium">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Users className="w-3.5 h-3.5 flex-shrink-0 text-purple-600" />
                          <span className="font-medium">
                            {event.attendees} / {event.capacity} attendees
                          </span>
                        </div>
                      </div>

                      {/* Capacity Bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm transition-all"
                            style={{
                              width: `${(event.attendees / event.capacity) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 text-right font-medium">
                          {event.capacity - event.attendees} spots left
                        </p>
                      </div>

                      {/* Register Button */}
                      <Button
                        onClick={() => handleRegister(event.id)}
                        className={`w-full text-xs font-semibold shadow-md hover:shadow-lg transition-all ${event.registered
                          ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                          }`}
                        disabled={!event.registered && event.attendees >= event.capacity}
                      >
                        {event.registered ? "✓ Registered - Click to Unregister" : "Register Now"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="rounded-xl border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                <CardContent className="pt-6 text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-bold mb-2 text-gray-800">
                    {filter === "registered" ? "No registrations yet" : "No events found"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {filter === "registered"
                      ? "Register for events to see them here"
                      : "Check back soon for more events"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberEvents;
