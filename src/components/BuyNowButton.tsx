"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { createCart, getCartId, addToCart } from "@/lib/shopify";
import { useState } from "react";
import { cn } from "@/utils";

interface BuyNowButtonProps {
  variantId: string;
  productName: string;
  className?: string;
  isRTL?: boolean;
}

export function BuyNowButton({
  variantId,
  productName,
  className,
  isRTL = false,
}: BuyNowButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleBuyNow = async () => {
    if (!variantId) {
      alert(isRTL ? "מזהה מוצר חסר" : "Product variant not available");
      return;
    }

    setLoading(true);

    try {
      console.log("🛒 Starting purchase for:", productName);

      // Create new cart for instant checkout
      const cart = await createCart(variantId, 1);

      if (cart?.checkoutUrl) {
        console.log("✅ Redirecting to checkout:", cart.checkoutUrl);
        window.location.href = cart.checkoutUrl;
      } else {
        alert(
          isRTL
            ? "לא ניתן ליצור הזמנה. נסה שוב."
            : "Unable to create checkout. Please try again."
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Buy Now error:", error);
      alert(
        isRTL
          ? "משהו השתבש. נסה שוב."
          : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBuyNow}
      disabled={loading || !variantId}
      size="lg"
      className={cn(
        "bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xl transition-all duration-300 w-full group relative overflow-hidden",
        loading && "opacity-50 cursor-not-allowed",
        !variantId && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />

      <ShoppingCart
        className={cn(
          "w-5 h-5 relative z-10 group-hover:animate-pulse",
          isRTL ? "ml-2" : "mr-2"
        )}
      />
      <span className="relative z-10">
        {loading
          ? isRTL
            ? "טוען..."
            : "Processing..."
          : isRTL
          ? "קנה עכשיו"
          : "Buy Now"}
      </span>
    </Button>
  );
}
