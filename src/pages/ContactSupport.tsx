import { useState, useRef } from "react";
import { ArrowLeft, HelpCircle, RotateCcw, CreditCard, Paperclip, X, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const subjectOptions = [
  { value: "rental", label: "Rental issue" },
  { value: "missing", label: "Missing/damaged pieces" },
  { value: "payment", label: "Payment/billing problem" },
  { value: "account", label: "Account issue" },
  { value: "bug", label: "App bug or technical issue" },
  { value: "delivery", label: "Delivery or return issue" },
  { value: "general", label: "General question" },
];

const quickLinks = [
  { icon: HelpCircle, label: "FAQs", description: "Find answers quickly" },
  { icon: RotateCcw, label: "Return instructions", description: "How to return games" },
  { icon: CreditCard, label: "Billing & payments help", description: "Payment questions" },
];

const ContactSupport = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock user data (would come from auth context in real app)
  const mockUser = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    subject: "",
    message: "",
  });

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const validFiles = newFiles.filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          return false;
        }
        return true;
      });

      if (attachedFiles.length + validFiles.length > 5) {
        toast.error("Maximum 5 photos allowed");
        return;
      }

      setAttachedFiles((prev) => [...prev, ...validFiles]);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    toast.success("Thanks! Our support team will get back to you shortly.");

    // Reset form
    setFormData({
      name: mockUser.name,
      email: mockUser.email,
      subject: "",
      message: "",
    });
    setAttachedFiles([]);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => navigate("/profile")}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Contact Support</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Links */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Quick help</h2>
          <div className="grid gap-3">
            {quickLinks.map((link) => (
              <button
                key={link.label}
                className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:bg-muted/50 transition-colors text-left shadow-sm"
              >
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <link.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{link.label}</p>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="rounded-xl bg-muted/30 border-border focus:border-primary"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="rounded-xl bg-muted/30 border-border focus:border-primary"
                />
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-foreground">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, subject: value }))}
                >
                  <SelectTrigger className="rounded-xl bg-muted/30 border-border focus:border-primary">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {subjectOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">
                  Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us what's going on, and we'll get back to you as soon as possible."
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  className="rounded-xl bg-muted/30 border-border focus:border-primary min-h-[120px] resize-none"
                />
              </div>

              {/* Photo Attachments */}
              <div className="space-y-3">
                <Label className="text-foreground">Attach photos (optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {attachedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-border bg-muted/30"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-1 -right-1 p-1 bg-destructive rounded-full shadow-sm"
                      >
                        <X className="h-3 w-3 text-destructive-foreground" />
                      </button>
                    </div>
                  ))}
                  {attachedFiles.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center"
                    >
                      <Paperclip className="h-5 w-5 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  Max 5 photos, 5MB each
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default ContactSupport;
