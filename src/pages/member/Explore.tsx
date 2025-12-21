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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 mb-6 md:mb-8">
              <Card
                onClick={() => setSelected("events")}
                className={`cursor-pointer transition-colors duration-300 rounded-2xl border-0 ${selected === "events"
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-500/50"
                  : "bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 shadow-lg hover:shadow-xl"
                  }`}>
                <CardHeader className="p-6">
                  <CardTitle className={`flex items-center gap-2 text-base font-bold ${selected === "events" ? "text-white" : "text-gray-800"}`}>
                    <span className="text-2xl">📅</span>
                    Events
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card
                onClick={() => setSelected("resources")}
                className={`cursor-pointer transition-colors duration-300 rounded-2xl border-0 ${selected === "resources"
                  ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-2xl shadow-purple-500/50"
                  : "bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 shadow-lg hover:shadow-xl"
                  }`}>
                <CardHeader className="p-6">
                  <CardTitle className={`flex items-center gap-2 text-base font-bold ${selected === "resources" ? "text-white" : "text-gray-800"}`}>
                    <span className="text-2xl">📚</span>
                    Resources
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card
                onClick={() => setSelected("groups")}
                className={`cursor-pointer transition-colors duration-300 rounded-2xl border-0 ${selected === "groups"
                  ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-2xl shadow-indigo-500/50"
                  : "bg-white hover:bg-gradient-to-br hover:from-indigo-50 hover:to-indigo-100 shadow-lg hover:shadow-xl"
                  }`}>
                <CardHeader className="p-6">
                  <CardTitle className={`flex items-center gap-2 text-base font-bold ${selected === "groups" ? "text-white" : "text-gray-800"}`}>
                    <span className="text-2xl">👥</span>
                    Groups
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Selected panel */}
            <div>
              <Card className="rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-4 px-6 pt-6">
                  <CardTitle className="capitalize text-gray-800 text-xl font-bold">
                    {selected === "events" ? "Upcoming Events" : selected === "resources" ? "Learning Resources" : "Community Groups"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-6 pb-6">{/* Results list */}
                  <div className="space-y-6">{selected === "events" && (
                    <div>
                      {filteredEvents.length === 0 ? (
                        <p className="text-gray-500 text-sm">No events match "{query}"</p>
                      ) : (
                        filteredEvents.map((e) => (
                          <div key={e.id} className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                            <h4 className="font-bold text-blue-900 text-base mb-3">{e.title}</h4>
                            <div className="text-sm text-blue-700 mb-3 font-medium">
                              📍 {e.location} • 📅 {e.date}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{e.description}</p>
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
                            <div key={g.id} className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-bold text-indigo-900 text-base mb-3">{g.name}</h4>
                                  <p className="text-sm text-indigo-700 leading-relaxed">{g.description}</p>
                                </div>
                                <div className="text-sm text-indigo-600 font-bold bg-white px-4 py-2 rounded-full whitespace-nowrap">👥 {g.members}</div>
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
                            <div key={r.id} className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-bold text-purple-900 text-base mb-3">{r.title}</h4>
                                  <p className="text-sm text-purple-700 font-medium">📚 {r.source}</p>
                                </div>
                                <div className="text-sm text-purple-600 font-bold bg-white px-4 py-2 rounded-full whitespace-nowrap">Free</div>
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