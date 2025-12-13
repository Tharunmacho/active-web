import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";

const Members = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const members: any[] = [
    // Empty array - can be populated from API
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - always visible */}
      <div className="w-16 lg:w-64 border-r bg-white">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 md:p-6 overflow-auto bg-background">
          <div className="w-full max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Members</h1>

            {/* Search Bar */}
            <Card className="shadow-medium border-0">
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder="Search members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Empty State */}
            {members.length === 0 && (
              <Card className="shadow-medium border-0">
                <CardContent className="pt-12 pb-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No members found</h3>
                    <p className="text-sm text-muted-foreground">
                      There are no members to display yet.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Members list will go here when populated */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;