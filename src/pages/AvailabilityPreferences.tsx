import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const daysOfWeek = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const defaultAvailability = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
  sunday: false,
};

const AvailabilityPreferences = () => {
  const navigate = useNavigate();
  
  const [availability, setAvailability] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("lender_availability");
    return saved ? JSON.parse(saved) : defaultAvailability;
  });

  const [instantBooking, setInstantBooking] = useState(() => {
    const saved = localStorage.getItem("lender_instant_booking");
    return saved ? JSON.parse(saved) : true;
  });

  const [advanceNotice, setAdvanceNotice] = useState(() => {
    return localStorage.getItem("lender_advance_notice") || "24";
  });

  const handleDayToggle = (day: string, checked: boolean) => {
    setAvailability(prev => ({ ...prev, [day]: checked }));
  };

  const handleSave = () => {
    localStorage.setItem("lender_availability", JSON.stringify(availability));
    localStorage.setItem("lender_instant_booking", JSON.stringify(instantBooking));
    localStorage.setItem("lender_advance_notice", advanceNotice);
    toast.success("Availability preferences saved!");
    navigate("/lender-profile");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <button 
            onClick={() => navigate('/lender-profile')} 
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Availability Preferences</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Weekly Availability */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Availability
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Set which days you're available for pickups and drop-offs
              </p>
            </CardHeader>
            <CardContent className="space-y-1">
              {daysOfWeek.map((day, index) => (
                <div key={day.key}>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-foreground">{day.label}</span>
                    <Switch
                      checked={availability[day.key]}
                      onCheckedChange={(checked) => handleDayToggle(day.key, checked)}
                    />
                  </div>
                  {index < daysOfWeek.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Booking Preferences */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Booking Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-foreground font-medium">Instant Booking</p>
                  <p className="text-sm text-muted-foreground">Allow renters to book without approval</p>
                </div>
                <Switch
                  checked={instantBooking}
                  onCheckedChange={setInstantBooking}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-foreground font-medium">Advance Notice Required</p>
                <p className="text-sm text-muted-foreground">Minimum time before a rental can start</p>
                <div className="flex gap-2 mt-3">
                  {["12", "24", "48"].map((hours) => (
                    <Button
                      key={hours}
                      variant={advanceNotice === hours ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAdvanceNotice(hours)}
                      className="flex-1"
                    >
                      {hours}h
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button className="w-full h-12" onClick={handleSave}>
            Save Preferences
          </Button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AvailabilityPreferences;
