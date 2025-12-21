import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Menu, Bell, Calendar, BookOpen, Users, MapPin, Clock, ChevronRight, User, ArrowRight } from "lucide-react";
import { useState } from "react";
import MemberSidebar from "./MemberSidebar";

const Explore = () => {
  const [selected, setSelected] = useState<"events" | "resources" | "groups">("events");
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const events = [
    { id: "e1", title: "React Bangalore Meetup", date: "Dec 05, 2025", location: "Bengaluru", description: "An in-person meetup about React patterns and best practices.", attendees: 45 },
    { id: "e2", title: "AI for Good Workshop", date: "Dec 12, 2025", location: "Chennai", description: "Hands-on workshop on applying AI to social problems.", attendees: 32 },
    { id: "e3", title: "Community Hackathon", date: "Jan 20, 2026", location: "Hyderabad", description: "A weekend hackathon to build community-first apps.", attendees: 128 },
  ];

  const groups = [
    { id: "g1", name: "Frontend Builders", description: "A group for frontend engineers and designers to collaborate.", members: 124 },
    { id: "g2", name: "AI & Data Science", description: "Discussions and projects for machine learning practitioners.", members: 87 },
    { id: "g3", name: "Community Organizers", description: "Organizers and volunteers planning local events and meetups.", members: 54 },
  ];

  const resources = [
    { id: "r1", title: "React Patterns Course", source: "LearnJS Academy", type: "Course" },
    { id: "r2", title: "Intro to Machine Learning", source: "OpenLearn", type: "Tutorial" },
    { id: "r3", title: "Organizing Community Events", source: "Community Hub", type: "Guide" },
  ];

  const filterText = (text: string) => text.toLowerCase().includes(query.trim().toLowerCase());

  const filteredEvents = events.filter((e) => filterText(e.title) || filterText(e.description) || filterText(e.location));
  const filteredGroups = groups.filter((g) => filterText(g.name) || filterText(g.description));
  const filteredResources = resources.filter((r) => filterText(r.title) || filterText(r.source));

  const categories = [
    { key: "events", label: "Events", icon: Calendar, count: events.length, color: "#0ea5e9", gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)" },
    { key: "resources", label: "Resources", icon: BookOpen, count: resources.length, color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" },
    { key: "groups", label: "Groups", icon: Users, count: groups.length, color: "#10b981", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
  ];

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif"
      }}
    >
      {/* Sidebar */}
      <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div
          className="md:hidden sticky top-0 z-40 backdrop-blur-md px-4 py-3 flex items-center justify-between"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </Button>
          <h1 className="font-bold text-gray-900">Explore</h1>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Bell className="w-5 h-5 text-gray-700" />
          </Button>
        </div>

        {/* Desktop Header */}
        <div
          className="hidden md:block sticky top-0 z-40 backdrop-blur-md px-6 py-4"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <h1 className="text-xl font-bold text-gray-900">Explore</h1>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)' }}
              >
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search events, resources, or groups..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 py-5 border-0 bg-white"
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px -4px rgba(0, 0, 0, 0.08)'
                }}
              />
            </div>

            {/* Category Tabs */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selected === cat.key;
                return (
                  <div
                    key={cat.key}
                    onClick={() => setSelected(cat.key as "events" | "resources" | "groups")}
                    className="cursor-pointer transition-all duration-300"
                    style={{ transform: isActive ? 'scale(1.02)' : 'scale(1)' }}
                  >
                    <Card
                      className="border-0 overflow-hidden"
                      style={{
                        borderRadius: '16px',
                        boxShadow: isActive
                          ? `0 10px 30px -8px ${cat.color}50`
                          : '0 4px 16px -4px rgba(0, 0, 0, 0.08)',
                        background: isActive ? cat.gradient : '#ffffff'
                      }}
                    >
                      <CardContent className="p-4 md:p-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center"
                            style={{
                              background: isActive ? 'rgba(255, 255, 255, 0.2)' : `${cat.color}15`
                            }}
                          >
                            <Icon
                              className="w-5 h-5"
                              style={{ color: isActive ? '#ffffff' : cat.color }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-bold text-sm md:text-base"
                              style={{ color: isActive ? '#ffffff' : '#1f2937' }}
                            >
                              {cat.label}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: isActive ? 'rgba(255, 255, 255, 0.8)' : '#9ca3af' }}
                            >
                              {cat.count} available
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Card
                  className="border-0"
                  style={{
                    borderRadius: '20px',
                    boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <CardContent className="p-5 md:p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="font-bold text-gray-900">
                        {selected === "events" ? "Upcoming Events" : selected === "resources" ? "Learning Resources" : "Community Groups"}
                      </h2>
                      <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                        View All <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {/* Events */}
                      {selected === "events" && (
                        filteredEvents.length === 0 ? (
                          <p className="text-gray-500 text-sm py-8 text-center">No events found for "{query}"</p>
                        ) : (
                          filteredEvents.map((e) => (
                            <div
                              key={e.id}
                              className="p-4 md:p-5 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                              style={{
                                background: '#f0f9ff',
                                border: '1px solid #bae6fd'
                              }}
                            >
                              <div className="flex items-start gap-4">
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                  style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}
                                >
                                  <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-gray-900 mb-1">{e.title}</h4>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-2">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" /> {e.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {e.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users className="w-3 h-3" /> {e.attendees} attending
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 line-clamp-2">{e.description}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                              </div>
                            </div>
                          ))
                        )
                      )}

                      {/* Groups */}
                      {selected === "groups" && (
                        filteredGroups.length === 0 ? (
                          <p className="text-gray-500 text-sm py-8 text-center">No groups found for "{query}"</p>
                        ) : (
                          filteredGroups.map((g) => (
                            <div
                              key={g.id}
                              className="p-4 md:p-5 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                              style={{
                                background: '#ecfdf5',
                                border: '1px solid #a7f3d0'
                              }}
                            >
                              <div className="flex items-start gap-4">
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                >
                                  <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-gray-900">{g.name}</h4>
                                    <span
                                      className="px-2 py-1 rounded-full text-xs font-medium"
                                      style={{ background: '#d1fae5', color: '#065f46' }}
                                    >
                                      {g.members} members
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">{g.description}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                              </div>
                            </div>
                          ))
                        )
                      )}

                      {/* Resources */}
                      {selected === "resources" && (
                        filteredResources.length === 0 ? (
                          <p className="text-gray-500 text-sm py-8 text-center">No resources found for "{query}"</p>
                        ) : (
                          filteredResources.map((r) => (
                            <div
                              key={r.id}
                              className="p-4 md:p-5 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                              style={{
                                background: '#f5f3ff',
                                border: '1px solid #c4b5fd'
                              }}
                            >
                              <div className="flex items-start gap-4">
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                  style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}
                                >
                                  <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-gray-900">{r.title}</h4>
                                    <span
                                      className="px-2 py-1 rounded-full text-xs font-medium"
                                      style={{ background: '#ede9fe', color: '#5b21b6' }}
                                    >
                                      {r.type}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">By {r.source}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                              </div>
                            </div>
                          ))
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Desktop Only */}
              <div className="hidden lg:block lg:col-span-1 space-y-5">
                {/* Quick Stats */}
                <Card
                  className="border-0"
                  style={{
                    borderRadius: '20px',
                    boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <CardContent className="p-5">
                    <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                      <div
                        className="flex items-center justify-between p-3 rounded-xl"
                        style={{ background: '#f8fafc' }}
                      >
                        <span className="text-sm text-gray-600">Total Events</span>
                        <span className="font-bold text-gray-900">{events.length}</span>
                      </div>
                      <div
                        className="flex items-center justify-between p-3 rounded-xl"
                        style={{ background: '#f8fafc' }}
                      >
                        <span className="text-sm text-gray-600">Total Groups</span>
                        <span className="font-bold text-gray-900">{groups.length}</span>
                      </div>
                      <div
                        className="flex items-center justify-between p-3 rounded-xl"
                        style={{ background: '#f8fafc' }}
                      >
                        <span className="text-sm text-gray-600">Resources</span>
                        <span className="font-bold text-gray-900">{resources.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;