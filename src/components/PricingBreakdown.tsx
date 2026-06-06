import { AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateGamePricing, RentalPricingDetails } from "@/data/gamePricingStrategy";

interface PricingBreakdownProps {
  gameId: string;
  gameName: string;
  avgSalePrice?: number;
  monthlyPrice: number;
  className?: string;
}

const PricingBreakdown = ({
  gameId,
  gameName,
  avgSalePrice,
  monthlyPrice,
  className,
}: PricingBreakdownProps) => {
  // If we have the sale price, calculate full pricing details
  const pricing = avgSalePrice
    ? calculateGamePricing(gameId, gameName, avgSalePrice)
    : null;

  if (!pricing) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("space-y-3", className)}>
        {/* Main Price Display */}
        <div className="flex items-center justify-between py-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Monthly Rental</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Standard monthly rental fee</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="text-lg font-bold text-primary">£{pricing.monthly_rental_price.toFixed(2)}</span>
        </div>

        {/* Security Deposit */}
        <div className="flex items-center justify-between text-sm bg-amber-50 dark:bg-amber-950/30 p-2 rounded-md border border-amber-200 dark:border-amber-900/50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Security Deposit (Refundable)</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Required upfront, refunded after return in good condition</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <span className="font-semibold text-amber-700 dark:text-amber-400">£{pricing.security_deposit.toFixed(2)}</span>
        </div>

        {/* Late Fees */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Late Fee (per day)</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3 h-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">50% of daily rate for each day late</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="font-semibold text-foreground">£{pricing.late_fee_per_day.toFixed(2)}</span>
        </div>

        {/* Damage Waiver */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Damage Waiver (Optional Insurance)</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3 h-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Optional insurance against wear & tear</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="font-semibold text-foreground">+£{pricing.damage_waiver_fee.toFixed(2)}</span>
        </div>

        {/* Pricing Breakdown Info */}
        <div className="bg-muted/50 rounded-md p-2 text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Pricing Details:</p>
          <ul className="space-y-0.5 ml-2">
            <li>• Game Value: £{pricing.avg_sale_price.toFixed(2)}</li>
            <li>• Rental: {pricing.breakdown.rental_percentage}% of game value</li>
            <li>• Deposit: {pricing.breakdown.deposit_percentage}% of game value</li>
          </ul>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PricingBreakdown;
