import { getAllProducts } from "@/lib/shopify";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔄 API Route: Fetching products...");

    const products = await getAllProducts();

    // ✅ Debug: Check if handles exist
    console.log(
      "📦 API Route Products:",
      products.map((p: { title: any; handle: any; }) => ({
        title: p.title,
        handle: p.handle || "❌ MISSING",
        hasHandle: !!p.handle,
      }))
    );

    if (!products || products.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No products found",
        products: [],
      });
    }

    return NextResponse.json({
      success: true,
      products: products, // ✅ Pass full product objects with handle
      count: products.length,
    });
  } catch (error: any) {
    console.error("❌ API Route Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch products",
        products: [],
      },
      { status: 500 }
    );
  }
}
