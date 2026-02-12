import { createStorefrontApiClient } from "@shopify/storefront-api-client";

const client = createStorefrontApiClient({
  storeDomain: "painto-israel-dev.myshopify.com",
  apiVersion: "2025-01",
  publicAccessToken: "04ea0a84982ae43ca8db2cb1a9a5f864",
});

console.log("🔧 Shopify client initialized");

// ============================================
// PRODUCTS QUERY
// ============================================
const PRODUCTS_QUERY = `
  query GetProducts {
    products(first: 10) {
      edges {
        node {
          id
          title
          description
          handle          # ✅ IMPORTANT: Yeh field add karo
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getAllProducts() {
  try {
    console.log("📡 Making request to Shopify...");
    const { data, errors } = await client.request(PRODUCTS_QUERY);

    if (errors) {
      console.error("❌ GraphQL errors:", errors);
      return [];
    }

    if (!data?.products?.edges) {
      console.error("❌ No products.edges in response");
      return [];
    }

    const products = data.products.edges.map((edge: any) => {
      const product = {
        id: edge.node.id,
        title: edge.node.title,
        description: edge.node.description || "",
        handle: edge.node.handle || "", // ✅ Fallback to empty string
        price: edge.node.priceRange.minVariantPrice.amount,
        compareAtPrice:
          edge.node.compareAtPriceRange?.minVariantPrice?.amount ||
          edge.node.priceRange.minVariantPrice.amount,
        currencyCode: edge.node.priceRange.minVariantPrice.currencyCode,
        image: edge.node.images.edges[0]?.node.url || null,
        imageAlt: edge.node.images.edges[0]?.node.altText || edge.node.title,
        variantId: edge.node.variants.edges[0]?.node.id || null,
      };

      // ✅ Debug log for each product
      console.log(`📦 Product: ${product.title} → handle: "${product.handle}"`);

      return product;
    });

    console.log(`✅ Fetched ${products.length} products from Shopify`);
    return products;
  } catch (error) {
    console.error("❌ Shopify fetch error:", error);
    return [];
  }
}

// ============================================
// CART MUTATIONS & QUERIES
// ============================================

// Create new cart
const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    featuredImage {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

// Add items to existing cart
const ADD_CART_LINES_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    featuredImage {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

// Get cart by ID
const GET_CART_QUERY = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                product {
                  title
                  featuredImage {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
  }
`;

// Update cart line quantity
const UPDATE_CART_LINES_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Remove cart lines
const REMOVE_CART_LINES_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        totalQuantity
        lines(first: 10) {
          edges {
            node {
              id
              quantity
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// ============================================
// CART FUNCTIONS
// ============================================

/**
 * Create a new cart with initial items
 */
export async function createCart(variantId: string, quantity: number = 1) {
  try {
    console.log("🛒 Creating new cart...");
    console.log("📦 Variant ID:", variantId);

    const variables = {
      input: {
        lines: [
          {
            merchandiseId: variantId,
            quantity: quantity,
          },
        ],
        buyerIdentity: {
          countryCode: "IL",
        },
      },
    };

    const { data, errors } = await client.request(CREATE_CART_MUTATION, {
      variables,
    });

    if (errors) {
      console.error("❌ GraphQL Errors:", errors);
      return null;
    }

    if (data?.cartCreate?.userErrors?.length > 0) {
      console.error("❌ User Errors:", data.cartCreate.userErrors);
      return null;
    }

    const cart = data?.cartCreate?.cart;
    console.log("✅ Cart created:", cart?.id);

    // Store cart ID in localStorage
    if (cart?.id && typeof window !== "undefined") {
      localStorage.setItem("shopify_cart_id", cart.id);
    }

    return cart;
  } catch (error: any) {
    console.error("❌ Cart creation failed:", error);
    return null;
  }
}

/**
 * Add items to existing cart
 */
export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1
) {
  try {
    console.log("➕ Adding to cart:", cartId);

    const variables = {
      cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity: quantity,
        },
      ],
    };

    const { data, errors } = await client.request(ADD_CART_LINES_MUTATION, {
      variables,
    });

    if (errors) {
      console.error("❌ Add to cart errors:", errors);
      return null;
    }

    if (data?.cartLinesAdd?.userErrors?.length > 0) {
      console.error("❌ User Errors:", data.cartLinesAdd.userErrors);
      return null;
    }

    console.log("✅ Added to cart successfully");
    return data?.cartLinesAdd?.cart;
  } catch (error) {
    console.error("❌ Add to cart failed:", error);
    return null;
  }
}

/**
 * Get cart by ID
 */
export async function getCart(cartId: string) {
  try {
    console.log("📥 Fetching cart:", cartId);

    const { data, errors } = await client.request(GET_CART_QUERY, {
      variables: { cartId },
    });

    if (errors) {
      console.error("❌ Get cart errors:", errors);
      return null;
    }

    return data?.cart;
  } catch (error) {
    console.error("❌ Get cart failed:", error);
    return null;
  }
}

/**
 * Update cart line item quantity
 */
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
) {
  try {
    console.log("🔄 Updating cart line:", lineId, "to quantity:", quantity);

    const variables = {
      cartId,
      lines: [
        {
          id: lineId,
          quantity: quantity,
        },
      ],
    };

    const { data, errors } = await client.request(UPDATE_CART_LINES_MUTATION, {
      variables,
    });

    if (errors || data?.cartLinesUpdate?.userErrors?.length > 0) {
      console.error(
        "❌ Update errors:",
        errors || data.cartLinesUpdate.userErrors
      );
      return null;
    }

    console.log("✅ Cart line updated");
    return data?.cartLinesUpdate?.cart;
  } catch (error) {
    console.error("❌ Update cart line failed:", error);
    return null;
  }
}

/**
 * Remove items from cart
 */
export async function removeFromCart(cartId: string, lineIds: string[]) {
  try {
    console.log("🗑️ Removing from cart:", lineIds);

    const variables = {
      cartId,
      lineIds,
    };

    const { data, errors } = await client.request(REMOVE_CART_LINES_MUTATION, {
      variables,
    });

    if (errors || data?.cartLinesRemove?.userErrors?.length > 0) {
      console.error(
        "❌ Remove errors:",
        errors || data.cartLinesRemove.userErrors
      );
      return null;
    }

    console.log("✅ Removed from cart");
    return data?.cartLinesRemove?.cart;
  } catch (error) {
    console.error("❌ Remove from cart failed:", error);
    return null;
  }
}

/**
 * Get cart ID from localStorage
 */
export function getCartId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("shopify_cart_id");
}

/**
 * Clear cart from localStorage
 */
export function clearCart(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("shopify_cart_id");
  }
}

// Backward compatibility
export async function createCheckout(variantId: string, quantity: number = 1) {
  const cart = await createCart(variantId, quantity);
  return cart?.checkoutUrl || null;
}

export { client as shopifyClient };
