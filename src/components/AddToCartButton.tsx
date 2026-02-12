"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { createCart, addToCart, getCartId } from "@/lib/shopify";
import { useState } from "react";
import { cn } from "@/utils";

interface AddToCartButtonProps {
  variantId: string;
  productName: string;
  quantity?: number;
  className?: string;
  isRTL?: boolean;
  onSuccess?: () => void;
}

export function AddToCartButton({
  variantId,
  productName,
  quantity = 1,
  className,
  isRTL = false,
  onSuccess,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!variantId) {
      alert(isRTL ? "מזהה מוצר חסר" : "Product variant not available");
      return;
    }

    setLoading(true);

    try {
      console.log("🛒 Adding to cart:", productName);

      // Check if cart exists in localStorage
      const existingCartId = getCartId();

      let cart;
      if (existingCartId) {
        // Add to existing cart
        console.log("📦 Adding to existing cart:", existingCartId);
        cart = await addToCart(existingCartId, variantId, quantity);
      } else {
        // Create new cart
        console.log("🆕 Creating new cart");
        cart = await createCart(variantId, quantity);
      }

      if (cart) {
        console.log("✅ Added to cart successfully");
        setAdded(true);

        // Show success state for 2 seconds
        setTimeout(() => setAdded(false), 2000);

        // Trigger callback if provided
        if (onSuccess) {
          onSuccess();
        }

        // Dispatch custom event for cart update
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        alert(
          isRTL
            ? "לא ניתן להוסיף לעגלה. נסה שוב."
            : "Unable to add to cart. Please try again."
        );
      }
    } catch (error) {
      console.error("❌ Add to cart error:", error);
      alert(
        isRTL
          ? "משהו השתבש. נסה שוב."
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading || !variantId || added}
      size="lg"
      variant="outline"
      className={cn(
        "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold shadow-md transition-all duration-300 w-full group relative overflow-hidden",
        loading && "opacity-50 cursor-not-allowed",
        added && "bg-green-50 border-green-600 text-green-600",
        !variantId && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      {added ? (
        <>
          <Check
            className={cn("w-5 h-5 relative z-10", isRTL ? "ml-2" : "mr-2")}
          />
          <span className="relative z-10">
            {isRTL ? "נוסף לעגלה!" : "Added!"}
          </span>
        </>
      ) : (
        <>
          <ShoppingCart
            className={cn(
              "w-5 h-5 relative z-10 group-hover:animate-bounce",
              isRTL ? "ml-2" : "mr-2"
            )}
          />
          <span className="relative z-10">
            {loading
              ? isRTL
                ? "מוסיף..."
                : "Adding..."
              : isRTL
              ? "הוסף לעגלה"
              : "Add to Cart"}
          </span>
        </>
      )}
    </Button>
  );
}
