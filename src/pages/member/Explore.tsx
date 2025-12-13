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
        <div className="flex-1 p-4 md:p-6 overflow-auto bg-background">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 hidden md:block">Explore</h1>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for events, courses, or resources..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 py-6 rounded-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                onClick={() => setSelected("events")}
                className={`cursor-pointer transition-shadow ${selected === "events" ? "ring-2 ring-blue-300 shadow-lg" : "hover:shadow-md"}`}>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Discover events happening near you</p>
                </CardContent>
              </Card>

              <Card
                onClick={() => setSelected("resources")}
                className={`cursor-pointer transition-shadow ${selected === "resources" ? "ring-2 ring-blue-300 shadow-lg" : "hover:shadow-md"}`}>
                <CardHeader>
                  <CardTitle>Learning Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Access courses and training materials</p>
                </CardContent>
              </Card>

              <Card
                onClick={() => setSelected("groups")}
                className={`cursor-pointer transition-shadow ${selected === "groups" ? "ring-2 ring-blue-300 shadow-lg" : "hover:shadow-md"}`}>
                <CardHeader>
                  <CardTitle>Community Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Join groups based on your interests</p>
                </CardContent>
              </Card>
            </div>

            {/* Selected panel */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{selected === "events" ? "Upcoming Events" : selected === "resources" ? "Learning Resources" : "Community Groups"}</CardTitle>
                </CardHeader>
                <CardContent>
                  {selected === "events" && <p className="text-muted-foreground">Discover events happening near you</p>}
                  {selected === "resources" && <p className="text-muted-foreground">Access courses and training materials</p>}
                  {selected === "groups" && <p className="text-muted-foreground">Join groups based on your interests</p>}

                  {/* Results list */}
                  <div className="mt-4 space-y-4">
                    {selected === "events" && (
                      <div>
                        {filteredEvents.length === 0 ? (
                          <p className="text-muted-foreground">No events match "{query}"</p>
                        ) : (
                          filteredEvents.map((e) => (
                            <div key={e.id} className="p-4 border rounded-md mb-3 bg-white">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold">{e.title}</h4>
                                  <div className="text-sm text-muted-foreground">{e.location} • {new Date(e.date).toLocaleDateString()}</div>
                                </div>
                                <div className="text-sm text-muted-foreground">{e.date}</div>
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
                              <div className="mt-3 flex gap-2">
                                <button className="text-sm px-3 py-1 border rounded hover:bg-gray-50">Register</button>
                                <button className="text-sm px-3 py-1 border rounded hover:bg-gray-50">Remind me</button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {selected === "groups" && (
                      <div>
                        {filteredGroups.length === 0 ? (
                          <p className="text-muted-foreground">No groups match "{query}"</p>
                        ) : (
                          filteredGroups.map((g) => (
                            <div key={g.id} className="p-4 border rounded-md mb-3 bg-white flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{g.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{g.description}</p>
                              </div>
                              <div className="text-sm text-muted-foreground">{g.members} members</div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {selected === "resources" && (
                      <div>
                        {filteredResources.length === 0 ? (
                          <p className="text-muted-foreground">No resources match "{query}"</p>
                        ) : (
                          filteredResources.map((r) => (
                            <div key={r.id} className="p-4 border rounded-md mb-3 bg-white flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{r.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{r.source}</p>
                              </div>
                              <div className="text-sm text-muted-foreground">Free</div>
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
        </div>
      </div>
    </div>
  );
};

export default Explore;