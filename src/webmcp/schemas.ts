import { MACHINE_SPEC_KEY_NAMES } from "../shared/machineSpecKeys";

export const CATEGORY_ENUM = [
  "MACHINE",
  "GRINDER",
  "PORTAFILTER",
  "BASKET",
  "TAMPER",
  "PUCK_SCREEN",
  "DOSING_FUNNEL",
  "WDT_TOOL",
  "WATER_FILTER",
  "ACCESSORY",
] as const;

export const searchProductsSchema = {
  type: "object",
  properties: {
    query: {
      type: "string",
      description:
        "Free-text search over product names, brands and descriptions.",
    },
    category: {
      type: "string",
      enum: [...CATEGORY_ENUM],
      description: "Filter to one product category.",
    },
  },
  additionalProperties: false,
} as const;

export const getProductDetailsSchema = {
  type: "object",
  properties: {
    slug: {
      type: "string",
      description: "The product's slug, as returned by search_products.",
    },
  },
  required: ["slug"],
  additionalProperties: false,
} as const;

export const getProductImageSchema = {
  type: "object",
  properties: {
    productId: {
      type: "string",
      description:
        "Product slug returned by search_products. Used to retrieve one targeted image for visual evaluation.",
    },
  },
  required: ["productId"],
  additionalProperties: false,
} as const;

export const compareProductAestheticsSchema = {
  type: "object",
  properties: {
    productIds: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
      maxItems: 3,
      description: "2–3 product slugs to compare visually.",
    },
  },
  required: ["productIds"],
  additionalProperties: false,
} as const;

export const matchToUserPhotoSchema = {
  type: "object",
  properties: {
    photoUrl: {
      type: "string",
      description: "The user photo URL supplied by the photo upload panel.",
    },
    category: {
      type: "string",
      enum: [...CATEGORY_ENUM],
      description: "Optional catalog category to narrow visual candidates.",
    },
  },
  required: ["photoUrl"],
  additionalProperties: false,
} as const;

export const pickBestFitSchema = {
  type: "object",
  properties: {
    productIds: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
      maxItems: 3,
      description: "2–3 candidate product slugs.",
    },
    userPreference: {
      type: "string",
      minLength: 1,
      maxLength: 500,
      description: "The user's visual preference for the multimodal agent.",
    },
  },
  required: ["productIds", "userPreference"],
  additionalProperties: false,
} as const;

export const compareProductsSchema = {
  type: "object",
  properties: {
    slugs: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
      maxItems: 3,
      description: "2–3 product slugs to compare side by side.",
    },
  },
  required: ["slugs"],
  additionalProperties: false,
} as const;

export const emptySchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
} as const;

export const checkCompatibilitySchema = {
  type: "object",
  properties: {
    candidate_slug: {
      type: "string",
      description: "Slug of the product you're considering buying.",
    },
    against_slugs: {
      type: "array",
      items: { type: "string" },
      description:
        "Optional: check against these specific product slugs instead of everything the user owns.",
    },
  },
  required: ["candidate_slug"],
  additionalProperties: false,
} as const;

export const setCompareListSchema = {
  type: "object",
  properties: {
    slugs: {
      type: "array",
      items: { type: "string" },
      maxItems: 3,
      description: "0–3 product slugs to show in the Compare view.",
    },
  },
  required: ["slugs"],
  additionalProperties: false,
} as const;

export const addToCartSchema = {
  type: "object",
  properties: {
    slug: {
      type: "string",
      description: "Slug of the product to add.",
    },
    quantity: {
      type: "integer",
      minimum: 1,
      maximum: 9,
      description: "How many to add (default 1).",
    },
    color: {
      type: "string",
      description:
        "Color choice, for products with color options. If omitted, the first option is used and reported back.",
    },
  },
  required: ["slug"],
  additionalProperties: false,
} as const;

export const updateCartQuantitySchema = {
  type: "object",
  properties: {
    slug: { type: "string", description: "Slug of the product in the cart." },
    color: {
      type: "string",
      description:
        "Color of the cart line, when the product is in the cart in more than one color.",
    },
    quantity: {
      type: "integer",
      minimum: 0,
      maximum: 9,
      description: "New quantity; 0 removes the line.",
    },
  },
  required: ["slug", "quantity"],
  additionalProperties: false,
} as const;

export const removeFromCartSchema = {
  type: "object",
  properties: {
    slug: { type: "string", description: "Slug of the product in the cart." },
    color: {
      type: "string",
      description:
        "Color of the cart line, when the product is in the cart in more than one color.",
    },
  },
  required: ["slug"],
  additionalProperties: false,
} as const;

export const applyCouponSchema = {
  type: "object",
  properties: {
    code: {
      type: "string",
      description: "Coupon code, e.g. from get_my_coupons.",
    },
  },
  required: ["code"],
  additionalProperties: false,
} as const;

export const highlightDifferencesSchema = {
  type: "object",
  properties: {
    spec_keys: {
      type: "array",
      items: { type: "string", enum: MACHINE_SPEC_KEY_NAMES },
      minItems: 1,
      description:
        "The spec row keys to highlight — use the `key` values returned by compare_products.",
    },
    note: {
      type: "string",
      description:
        "Optional one-sentence explanation shown to the user above the table.",
    },
  },
  required: ["spec_keys"],
  additionalProperties: false,
} as const;
