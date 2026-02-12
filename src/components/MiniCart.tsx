"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import { getCart, getCartId, removeFromCart } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext"; // ✅ Import context
import { useTranslations } from "../app/hooks/useTranslations"; // ✅ Import hook

export function MiniCart() {
  const [cart, setCart] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Get language from context
  const { currentLang, isRTL } = useLanguage();

  // ✅ Get translations with current language
  const { t, loading: translationLoading } = useTranslations(currentLang);

  const fetchCart = async () => {
    const cartId = getCartId();
    if (cartId) {
      const cartData = await getCart(cartId);
      setCart(cartData);
    }
  };

  useEffect(() => {
    fetchCart();

    const handleCartUpdate = () => {
      console.log("🔔 Cart updated event received");
      fetchCart();
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  const handleRemoveItem = async (lineId: string) => {
    const cartId = getCartId();
    if (!cartId) return;

    setLoading(true);
    const updatedCart = await removeFromCart(cartId, [lineId]);
    if (updatedCart) {
      setCart(updatedCart);
      window.dispatchEvent(new Event("cart-updated"));
    }
    setLoading(false);
  };

  const totalItems = cart?.totalQuantity || 0;

  return (
    <>
      {/* ✅ Floating Cart Button - RTL Aware */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 z-[9999] bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 transition-all duration-300 group ${
          isRTL ? "left-6" : "right-6"
        }`}
        aria-label={t("cart.openCart", "Open cart")}
        style={{ zIndex: 9999 }}
      >
        <ShoppingCart className="w-6 h-6 group-hover:animate-bounce" />

        {/* Cart Count Badge - RTL Aware */}
        {totalItems > 0 && (
          <span
            className={`absolute -top-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse shadow-lg ${
              isRTL ? "-left-2" : "-right-2"
            }`}
          >
            {totalItems}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* ✅ Drawer - RTL Aware Position */}
          <div
            className={`fixed top-0 h-full w-full max-w-md bg-white shadow-2xl z-[9999] overflow-y-auto transform transition-transform duration-300 ease-out ${
              isRTL ? "left-0" : "right-0"
            }`}
            style={{ direction: isRTL ? "rtl" : "ltr" }} // ✅ Set text direction
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-800">
                {t("cart.title", "Your Cart")} ({totalItems})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={t("cart.close", "Close cart")}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Content */}
            {!cart || totalItems === 0 ? (
              // ✅ Empty Cart State - Translated
              <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] px-6">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <ShoppingCart className="w-16 h-16 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {t("cart.empty.title", "Your cart is empty")}
                </h3>
                <p className="text-gray-500 text-center mb-6">
                  {t(
                    "cart.empty.description",
                    "Add some products to get started"
                  )}
                </p>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  {t("cart.continueShopping", "Continue Shopping")}
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="p-6 space-y-4">
                  {cart.lines.edges.map(({ node }: any) => (
                    <div
                      key={node.id}
                      className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
                    >
                      {/* Product Image */}
                      {node.merchandise.product.featuredImage && (
                        <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={node.merchandise.product.featuredImage.url}
                            alt={node.merchandise.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                          {node.merchandise.product.title}
                        </h3>
                        {/* <p className="text-xs text-gray-500 mb-2">
                          {node.merchandise.title}
                        </p> */}
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-gray-800">
                            ₪
                            {parseFloat(
                              node.merchandise.priceV2.amount
                            ).toFixed(2)}
                          </p>
                          <span className="text-xs text-gray-500">
                            {t("cart.quantity", "Qty")}: {node.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(node.id)}
                        disabled={loading}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                        aria-label={t("cart.remove", "Remove item")}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Cart Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-700">
                      {t("cart.subtotal", "Subtotal")}:
                    </span>
                    <span className="font-bold text-gray-900">
                      ₪{parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xl border-t pt-4">
                    <span className="font-bold text-gray-800">
                      {t("cart.total", "Total")}:
                    </span>
                    <span className="font-bold text-blue-600">
                      ₪{parseFloat(cart.cost.totalAmount.amount).toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={() => {
                      if (cart?.checkoutUrl) {
                        window.location.href = cart.checkoutUrl;
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg shadow-xl hover:shadow-2xl transition-all"
                    size="lg"
                  >
                    {t("cart.checkout", "Proceed to Checkout")} →
                  </Button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    {t("cart.continueShopping", "Continue Shopping")}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
