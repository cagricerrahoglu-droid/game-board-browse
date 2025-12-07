import { ArrowLeft, Download, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const PaymentReceipts = () => {
  const navigate = useNavigate();

  // Mock receipts data
  const receipts = [
    { id: 1, date: "Nov 20, 2025", game: "Pandemic", amount: "$12.99", status: "paid" },
    { id: 2, date: "Nov 5, 2025", game: "Codenames", amount: "$9.99", status: "paid" },
    { id: 3, date: "Oct 15, 2025", game: "Catan", amount: "$14.99", status: "paid" },
    { id: 4, date: "Sep 28, 2025", game: "Ticket to Ride", amount: "$11.99", status: "paid" },
  ];

  const handleDownload = (receipt: typeof receipts[0]) => {
    const receiptContent = `
PAYMENT RECEIPT
=====================================

Game Rental: ${receipt.game}
Date: ${receipt.date}
Amount: ${receipt.amount}
Status: ${receipt.status.toUpperCase()}

=====================================
Thank you for your rental!
    `.trim();

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${receipt.game.toLowerCase().replace(/\s+/g, "-")}-${receipt.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Receipt downloaded");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <button onClick={() => navigate('/profile')} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Payment Receipts</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {receipts.length > 0 ? (
          receipts.map((receipt) => (
            <Card key={receipt.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{receipt.game}</p>
                      <p className="text-sm text-muted-foreground">{receipt.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{receipt.amount}</p>
                      <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                        {receipt.status}
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => handleDownload(receipt)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No payment receipts yet</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default PaymentReceipts;
