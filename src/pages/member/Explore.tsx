import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Menu } from "lucide-react";
import { useState } from "react";
import MemberSidebar from "./MemberSidebar";

const Explore = () => {
  const [selected, setSelected] = useState<"events" | "resources" | "groups">("events");
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const events = [
    { id: "e1", title: "React Bangalore Meetup", date: "2025-12-05", location: "Bengaluru", description: "An in-person meetup about React patterns and best practices." },
    { id: "e2", title: "AI for Good Workshop", date: "2025-12-12", location: "Chennai", description: "Hands-on workshop on applying AI to social problems." },
    { id: "e3", title: "Community Hackathon", date: "2026-01-20", location: "Hyderabad", description: "A weekend hackathon to build community-first apps." },
  ];

  const groups = [
    { id: "g1", name: "Frontend Builders", description: "A group for frontend engineers and designers to collaborate.", members: 124 },
    { id: "g2", name: "AI & Data Science", description: "Discussions and projects for machine learning practitioners.", members: 87 },
    { id: "g3", name: "Community Organizers", description: "Organizers and volunteers planning local events and meetups.", members: 54 },
  ];

  const resources = [
    { id: "r1", title: "React Patterns Course", source: "LearnJS Academy" },
    { id: "r2", title: "Intro to Machine Learning", source: "OpenLearn" },
    { id: "r3", title: "Organizing Community Events", source: "Community Hub" },
  ];

  const filterText = (text: string) => text.toLowerCase().includes(query.trim().toLowerCase());

  const filteredEvents = events.filter((e) => filterText(e.title) || filterText(e.description) || filterText(e.location));
  const filteredGroups = groups.filter((g) => filterText(g.name) || filterText(g.description));
  const filteredResources = resources.filter((r) => filterText(r.title) || filterText(r.source));

  return (
    <div className="min-h-screen flex">
      {/* Sidebar menu for all screen sizes */}
      <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header with menu button - Only visible on mobile */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="p-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Explore</h1>
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-primary text-primary-foreground">EX</AvatarFallback>
          </Avatar>
        </div>

        {/* Page content */}
        <div className="flex-1 p-3 md:p-4 overflow-auto bg-white">
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-4 hidden md:block text-gray-800">Explore</h1>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for events, courses, or resources..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 py-5 rounded-2xl border-2 border-gray-200 focus:border-blue-500 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <Card
                onClick={() => setSelected("events")}
                className={`cursor-pointer transition-all rounded-xl border-0 ${selected === "events"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-50 hover:bg-gray-100 shadow-sm"
                  }`}>
                <CardHeader className="p-4">
                  <CardTitle className={`flex items-center gap-2 text-base ${selected === "events" ? "text-white" : "text-gray-800"}`}>
                    <span className="text-xl">📅</span>
                    Events
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card
                onClick={() => setSelected("resources")}
                className={`cursor-pointer transition-all rounded-xl border-0 ${selected === "resources"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-50 hover:bg-gray-100 shadow-sm"
                  }`}>
                <CardHeader className="p-4">
                  <CardTitle className={`flex items-center gap-2 text-base ${selected === "resources" ? "text-white" : "text-gray-800"}`}>
                    <span className="text-xl">📚</span>
                    Resources
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card
                onClick={() => setSelected("groups")}
                className={`cursor-pointer transition-all rounded-xl border-0 ${selected === "groups"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-50 hover:bg-gray-100 shadow-sm"
                  }`}>
                <CardHeader className="p-4">
                  <CardTitle className={`flex items-center gap-2 text-base ${selected === "groups" ? "text-white" : "text-gray-800"}`}>
                    <span className="text-xl">👥</span>
                    Groups
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Selected panel */}
            <div>
              <Card className="rounded-xl shadow-md border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="capitalize text-gray-800 text-lg">
                    {selected === "events" ? "Upcoming Events" : selected === "resources" ? "Learning Resources" : "Community Groups"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">{/* Results list */}
                  <div className="space-y-2">{selected === "events" && (
                    <div>
                      {filteredEvents.length === 0 ? (
                        <p className="text-gray-500 text-sm">No events match "{query}"</p>
                      ) : (
                        filteredEvents.map((e) => (
                          <div key={e.id} className="p-4 rounded-lg bg-blue-50 border border-blue-100 hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-blue-900 text-sm">{e.title}</h4>
                            <div className="text-xs text-blue-700 mt-1">
                              📍 {e.location} • 📅 {e.date}
                            </div>
                            <p className="text-xs text-gray-600 mt-2">{e.description}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                    {selected === "groups" && (
                      <div>
                        {filteredGroups.length === 0 ? (
                          <p className="text-gray-500 text-sm">No groups match "{query}"</p>
                        ) : (
                          filteredGroups.map((g) => (
                            <div key={g.id} className="p-4 rounded-lg bg-indigo-50 border border-indigo-100 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-indigo-900 text-sm">{g.name}</h4>
                                  <p className="text-xs text-indigo-700 mt-1">{g.description}</p>
                                </div>
                                <div className="text-xs text-indigo-600 font-medium ml-3">👥 {g.members}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {selected === "resources" && (
                      <div>
                        {filteredResources.length === 0 ? (
                          <p className="text-gray-500 text-sm">No resources match "{query}"</p>
                        ) : (
                          filteredResources.map((r) => (
                            <div key={r.id} className="p-4 rounded-lg bg-purple-50 border border-purple-100 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-purple-900 text-sm">{r.title}</h4>
                                  <p className="text-xs text-purple-700 mt-1">📚 {r.source}</p>
                                </div>
                                <div className="text-xs text-purple-600 font-medium">Free</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div >
      </div >
    </div >
  );
};

export default Explore;