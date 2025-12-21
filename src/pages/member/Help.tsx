import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu, Send, HelpCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import MemberSidebar from "./MemberSidebar";

const MemberHelp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const faqs = [
    {
      id: 1,
      question: "How do I register as a member?",
      answer:
        "You can register by clicking on 'New Registration' on the home page. Fill in your personal details and location information, then submit the form. You'll receive a confirmation email with your Member ID.",
    },
    {
      id: 2,
      question: "How do I reset my password?",
      answer:
        "Click on 'Forgot Password' on the login page. Enter your registered email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password.",
    },
    {
      id: 3,
      question: "What is an ADF Form?",
      answer:
        "ADF (Application Development Form) is a comprehensive form that collects information about your professional background, qualifications, and learning objectives. It helps us understand your needs better.",
    },
    {
      id: 4,
      question: "How do I download my certificate?",
      answer:
        "Once your course or program is completed and approved, your certificate will be available in the 'Certificates' section. You can download it as a PDF or print it directly from there.",
    },
    {
      id: 5,
      question: "How long is my membership valid?",
      answer:
        "Your membership is valid for 1 year from the date of registration. You can renew it before expiry to continue accessing member benefits and programs.",
    },
    {
      id: 6,
      question: "Can I edit my profile after registration?",
      answer:
        "Yes, you can edit your profile anytime. Go to 'My Profile' section and click 'Edit Profile'. Make the necessary changes and save them.",
    },
    {
      id: 7,
      question: "How do I register for events?",
      answer:
        "Visit the 'Events' section to see all upcoming events. Click on an event and click 'Register' to sign up. You'll receive a confirmation email with event details.",
    },
    {
      id: 8,
      question: "How do I contact support?",
      answer:
        "You can use the 'Contact Us' form on this page to send us a message, or email us at support@Actvportal.com. We typically respond within 24 hours.",
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      toast.error("Please fill in all fields");
      return;
    }

    // Save support ticket to localStorage
    const ticket = {
      id: `TKT-${Date.now()}`,
      ...contactForm,
      createdAt: new Date().toISOString(),
      status: "open",
    };

    const existingTickets = localStorage.getItem("supportTickets");
    const tickets = existingTickets ? JSON.parse(existingTickets) : [];
    tickets.push(ticket);
    localStorage.setItem("supportTickets", JSON.stringify(tickets));

    toast.success(
      `Support ticket created! Ticket ID: ${ticket.id}. We'll get back to you soon.`
    );

    // Reset form
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          <h1 className="text-xl font-bold text-gray-800">Help & Support</h1>
          <div className="w-10" />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-5 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-5">
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-xl md:text-2xl font-bold mb-1 text-gray-800">Help & Support Center</h1>
              <p className="text-gray-600 text-sm">
                Find answers to common questions and get help from our support team
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="faqs" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-5 h-auto p-1 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                <TabsTrigger value="faqs" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg font-medium">
                  <HelpCircle className="w-4 h-4" />
                  FAQs
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg font-medium">
                  <Mail className="w-4 h-4" />
                  Contact Us
                </TabsTrigger>
              </TabsList>

              {/* FAQs Tab */}
              <TabsContent value="faqs" className="space-y-3">
                {faqs.map((faq, index) => (
                  <Card key={faq.id} className="overflow-hidden rounded-xl border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-3 px-5 pt-4">
                      <CardTitle className="text-sm md:text-base text-left font-bold text-gray-900 flex items-start gap-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        {faq.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-4">
                      <p className="text-gray-700 text-xs md:text-sm leading-relaxed pl-8">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Contact Us Tab */}
              <TabsContent value="contact">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Contact Info Cards */}
                  <div className="lg:col-span-1 space-y-3">
                    <Card className="rounded-xl border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-shadow">
                      <CardContent className="pt-4 p-4">
                        <div className="flex gap-3">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-lg shadow-md flex-shrink-0">
                            <Mail className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold mb-1.5 text-sm text-gray-900">Email</h4>
                            <p className="text-xs text-gray-700 font-medium">
                              support@Actvportal.com
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              Response: 24 hours
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-xl border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-shadow">
                      <CardContent className="pt-4 p-4">
                        <div className="flex gap-3">
                          <div className="bg-gradient-to-br from-green-500 to-green-600 p-2.5 rounded-lg shadow-md flex-shrink-0">
                            <HelpCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold mb-1.5 text-sm text-gray-900">Support Hours</h4>
                            <p className="text-xs text-gray-700 font-medium">
                              Mon - Fri: 9 AM - 6 PM
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              IST (India Standard Time)
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Contact Form */}
                  <div className="lg:col-span-2">
                    <Card className="rounded-xl border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-base md:text-lg font-bold text-gray-900">Send us a Message</CardTitle>
                        <CardDescription className="text-xs md:text-sm">
                          Fill out the form and we'll get back to you as soon as possible
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name*</Label>
                              <Input
                                id="name"
                                name="name"
                                placeholder="Your name"
                                value={contactForm.name}
                                onChange={handleInputChange}
                                required
                                className="border-2 border-gray-300 rounded-lg"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address*</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={contactForm.email}
                                onChange={handleInputChange}
                                required
                                className="border-2 border-gray-300 rounded-lg"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">Subject*</Label>
                            <Input
                              id="subject"
                              name="subject"
                              placeholder="What is your message about?"
                              value={contactForm.subject}
                              onChange={handleInputChange}
                              required
                              className="border-2 border-gray-300 rounded-lg"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="message" className="text-sm font-semibold text-gray-700">Message*</Label>
                            <Textarea
                              id="message"
                              name="message"
                              placeholder="Describe your issue or question in detail..."
                              rows={5}
                              value={contactForm.message}
                              onChange={handleInputChange}
                              required
                              className="border-2 border-gray-300 rounded-lg resize-none"
                            />
                          </div>

                          <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl font-semibold">
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberHelp;
