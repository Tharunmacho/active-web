import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, UserPlus } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Actv Portal</h1>
          <p className="text-xl text-muted-foreground">Member & Admin Management System</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Member Portal */}
          <Card className="shadow-strong gradient-card border-0 hover:scale-105 transition-smooth">
            <CardContent className="pt-8 pb-8 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Member Portal</h2>
                <p className="text-muted-foreground mb-6">
                  Access your member dashboard and submit applications
                </p>
              </div>
              <div className="space-y-3">
                <Link to="/member/login" className="block">
                  <Button className="w-full" size="lg">
                    Member Login
                  </Button>
                </Link>
                <Link to="/member/register" className="block">
                  <Button variant="outline" className="w-full" size="lg">
                    <UserPlus className="w-4 h-4 mr-2" />
                    New Registration
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="shadow-strong gradient-card border-0 hover:scale-105 transition-smooth">
            <CardContent className="pt-8 pb-8 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                <Shield className="w-12 h-12 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Admin Portal</h2>
                <p className="text-muted-foreground mb-6">
                  Review and manage member applications
                </p>
              </div>
              <div className="space-y-3">
                <Link to="/admin/block/login" className="block">
                  <Button variant="secondary" className="w-full" size="lg">
                    Admin Login
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground">
                  Block / District / State / Super Admin
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Actv Member & Admin Portal - Secure Access System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
