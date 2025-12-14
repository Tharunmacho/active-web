import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Download, Printer, FileText } from "lucide-react";
import MemberSidebar from "./MemberSidebar";

interface Certificate {
  id: string;
  title: string;
  issueDate: string;
  expiryDate: string;
  certificateNumber: string;
  status: "valid" | "expired" | "pending";
  downloadUrl: string;
}

const MemberCertificate = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const userName = localStorage.getItem("userName") || "User";

  // Load certificates from localStorage
  useEffect(() => {
    const savedCertificates = localStorage.getItem("userCertificates");
    if (savedCertificates) {
      try {
        setCertificates(JSON.parse(savedCertificates));
      } catch (error) {
        // Use mock data if parsing fails
        setMockCertificates();
      }
    } else {
      setMockCertificates();
    }
  }, []);

  const setMockCertificates = () => {
    const mockCerts: Certificate[] = [
      {
        id: "1",
        title: "Basic Training Certificate",
        issueDate: "2024-01-15",
        expiryDate: "2025-01-15",
        certificateNumber: "Actv-2024-001",
        status: "valid",
        downloadUrl: "#",
      },
      {
        id: "2",
        title: "Advanced Development Certificate",
        issueDate: "2023-06-20",
        expiryDate: "2024-06-20",
        certificateNumber: "Actv-2023-042",
        status: "expired",
        downloadUrl: "#",
      },
      {
        id: "3",
        title: "Professional Development Program",
        issueDate: "2024-09-01",
        expiryDate: "2025-09-01",
        certificateNumber: "Actv-2024-089",
        status: "valid",
        downloadUrl: "#",
      },
    ];
    setCertificates(mockCerts);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleDownload = (cert: Certificate) => {
    // In a real app, this would trigger actual PDF download
    const element = document.createElement("a");
    const file = new Blob(
      [
        `Certificate: ${cert.title}\nCertificate Number: ${cert.certificateNumber}\nIssued To: ${userName}\nIssue Date: ${cert.issueDate}\n\nThis is a mock certificate. In production, this would be a PDF file.`,
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${cert.certificateNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = (cert: Certificate) => {
    const printWindow = window.open("", "", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${cert.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .certificate { border: 3px solid #0066cc; padding: 40px; text-align: center; }
              .title { font-size: 28px; font-weight: bold; margin: 20px 0; color: #0066cc; }
              .content { margin: 20px 0; font-size: 14px; }
              .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="certificate">
              <div class="title">${cert.title}</div>
              <div class="content">
                <p><strong>Issued To:</strong> ${userName}</p>
                <p><strong>Certificate Number:</strong> ${cert.certificateNumber}</p>
                <p><strong>Issue Date:</strong> ${new Date(cert.issueDate).toLocaleDateString()}</p>
                <p><strong>Expiry Date:</strong> ${new Date(cert.expiryDate).toLocaleDateString()}</p>
              </div>
              <div class="footer">
                <p>This certificate is valid and authentic.</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for desktop */}

      {/* Mobile menu */}
      <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Certificates</h1>
          <div className="w-10" />
        </div>

        {/* Main content */}
        <div className="flex-1 p-3 md:p-4 overflow-auto bg-white">
          <div className="w-full space-y-4">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold mb-1">My Certificates</h1>
              <p className="text-gray-600">View, download, and manage your certificates</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="rounded-xl border-0 shadow-md">
                <CardContent className="pt-5 pb-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {certificates.filter((c) => c.status === "valid").length}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Valid Certificates</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-xl border-0 shadow-md">
                <CardContent className="pt-5 pb-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">
                      {certificates.filter((c) => c.status === "expired").length}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Expired Certificates</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-xl border-0 shadow-md">
                <CardContent className="pt-5 pb-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-600">
                      {certificates.filter((c) => c.status === "pending").length}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Pending Certificates</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Certificates List */}
            {certificates.length > 0 ? (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <Card key={cert.id} className="overflow-hidden hover:shadow-lg transition-shadow rounded-xl border-0 shadow-md">
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-base">{cert.title}</h3>
                                <Badge className={getStatusColor(cert.status)}>
                                  {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                Certificate #: <span className="font-mono">{cert.certificateNumber}</span>
                              </p>
                              <p className="text-xs text-gray-500">
                                Issued: {new Date(cert.issueDate).toLocaleDateString()} • Expires:{" "}
                                {new Date(cert.expiryDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(cert)}
                            className="flex-1 md:flex-none"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrint(cert)}
                            className="flex-1 md:flex-none"
                          >
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No certificates yet</p>
                  <p className="text-muted-foreground">
                    Complete courses and programs to earn certificates
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

export default MemberCertificate;
