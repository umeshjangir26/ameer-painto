import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://painto-israel-dev.myshopify.com/admin/api/2024-10/products.json",
      {
        headers: {
          "X-Shopify-Access-Token": "04ea0a84982ae43ca8db2cb1a9a5f864",
        },
      }
    );

    const data = await response.json();

    return NextResponse.json({
      status: response.status,
      data: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
