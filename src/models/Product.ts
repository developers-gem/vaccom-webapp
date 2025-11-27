import mongoose, { Schema, Document, Model } from "mongoose";
import slugify from "slugify";

export interface IProduct extends Document {
  name: string;
  price: number;
  salePrice?: number;
  shortDesc: string;
  longDesc: string;
  brand: string;
  category: string;
    categorySlug: string;   // ⭐ ADD THIS

  images: string[];
  slug: string;
  isTodayDeal?: boolean;
  stock: number;
  isOutOfStock: boolean;
  isActive: boolean;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },

    shortDesc: { type: String, required: true },
    longDesc: { type: String, required: true },

    brand: { type: String, required: true },
    category: { type: String, required: true },
categorySlug: { type: String, required: true },

    images: { type: [String], default: [] },

    slug: { type: String, unique: true },   // ❗ removed required:true

    isTodayDeal: { type: Boolean, default: false },

    stock: { type: Number, required: true, default: 0 },
    isOutOfStock: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

/* -------------------------------------------- */
/*  PRE-SAVE HOOK (for create only)             */
/* -------------------------------------------- */
ProductSchema.pre<IProduct>("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  this.isOutOfStock = this.stock <= 0;

  next();
});

/* -------------------------------------------- */
/*  PRE-UPDATE HOOK (for PUT / findOneAndUpdate)*/
/* -------------------------------------------- */
ProductSchema.pre("findOneAndUpdate", function (next) {
  const update: any = this.getUpdate();

  // Auto-set out-of-stock value
  if (update.stock !== undefined) {
    update.isOutOfStock = update.stock <= 0;
  }

  // Regenerate slug if name changes
  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }

  next();
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
