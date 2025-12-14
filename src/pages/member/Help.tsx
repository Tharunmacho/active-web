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
          <h1 className="text-xl font-bold">Help & Support</h1>
          <div className="w-10" />
        </div>

        {/* Main content */}
        <div className="flex-1 p-3 md:p-4 overflow-auto bg-white">
          <div className="w-full space-y-4">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold mb-1">Help & Support Center</h1>
              <p className="text-gray-600">
                Find answers to common questions and get help from our support team
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="faqs" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="faqs" className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  FAQs
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Us
                </TabsTrigger>
              </TabsList>

              {/* FAQs Tab */}
              <TabsContent value="faqs" className="space-y-3">
                {faqs.map((faq, index) => (
                  <Card key={faq.id} className="overflow-hidden rounded-xl border-0 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-left">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Contact Us Tab */}
              <TabsContent value="contact">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Contact Info Cards */}
                  <div className="lg:col-span-1 space-y-3">
                    <Card className="rounded-xl border-0 shadow-md">
                      <CardContent className="pt-5">
                        <div className="flex gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Mail className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1 text-sm">Email</h4>
                            <p className="text-xs text-gray-600">
                              support@Actvportal.com
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Response: 24 hours
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-xl border-0 shadow-md">
                      <CardContent className="pt-5">
                        <div className="flex gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <HelpCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1 text-sm">Support Hours</h4>
                            <p className="text-xs text-gray-600">
                              Mon - Fri: 9 AM - 6 PM
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              IST (India Standard Time)
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Contact Form */}
                  <div className="lg:col-span-2">
                    <Card className="rounded-xl border-0 shadow-md">
                      <CardHeader>
                        <CardTitle className="text-lg">Send us a Message</CardTitle>
                        <CardDescription className="text-sm">
                          Fill out the form and we'll get back to you as soon as possible
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleContactSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name*</Label>
                              <Input
                                id="name"
                                name="name"
                                placeholder="Your name"
                                value={contactForm.name}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email Address*</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={contactForm.email}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="subject">Subject*</Label>
                            <Input
                              id="subject"
                              name="subject"
                              placeholder="What is your message about?"
                              value={contactForm.subject}
                              onChange={handleInputChange}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="message">Message*</Label>
                            <Textarea
                              id="message"
                              name="message"
                              placeholder="Describe your issue or question in detail..."
                              rows={5}
                              value={contactForm.message}
                              onChange={handleInputChange}
                              required
                            />
                          </div>

                          <Button type="submit" className="w-full bg-blue-600 text-white">
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
