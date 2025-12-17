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
          <h1 className="text-xl font-bold text-gray-800">Certificates</h1>
          <div className="w-10" />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-5 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-5">
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-xl md:text-2xl font-bold mb-1 text-gray-800">My Certificates</h1>
              <p className="text-gray-600 text-sm">View, download, and manage your professional certificates</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-5">
              <Card className="rounded-2xl border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-2xl md:text-4xl font-bold text-green-600 mb-1">
                      {certificates.filter((c) => c.status === "valid").length}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">Valid</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-2xl md:text-4xl font-bold text-red-600 mb-1">
                      {certificates.filter((c) => c.status === "expired").length}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">Expired</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-2xl md:text-4xl font-bold text-orange-600 mb-1">
                      {certificates.filter((c) => c.status === "pending").length}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">Pending</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Certificates List */}
            {certificates.length > 0 ? (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <Card key={cert.id} className="overflow-hidden hover:shadow-xl transition-shadow rounded-xl border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-4 md:p-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
                              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <h3 className="font-bold text-sm md:text-base text-gray-900">{cert.title}</h3>
                                <Badge className={`${getStatusColor(cert.status)} font-semibold px-2 py-0.5 text-xs`}>
                                  {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-700 mb-1.5 font-medium">
                                Certificate #: <span className="font-mono text-blue-600">{cert.certificateNumber}</span>
                              </p>
                              <p className="text-xs text-gray-600">
                                <span className="font-semibold">📅 Issued:</span> {new Date(cert.issueDate).toLocaleDateString()}
                                <span className="mx-2">•</span>
                                <span className="font-semibold">⏰ Expires:</span> {new Date(cert.expiryDate).toLocaleDateString()}
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
                            className="flex-1 md:flex-none shadow-sm hover:shadow-md transition-shadow text-xs font-medium px-3 py-2"
                          >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 md:flex-none bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg text-xs font-medium px-3 py-2"
                            onClick={() => handlePrint(cert)}
                          >
                            <Printer className="w-3.5 h-3.5 mr-1.5" />
                            Print
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="rounded-xl border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                <CardContent className="pt-6 text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold mb-2 text-gray-800">No certificates yet</p>
                  <p className="text-gray-600 text-sm">
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
