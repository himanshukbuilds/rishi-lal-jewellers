const mongoose = require('mongoose');

const gemstoneSchema = new mongoose.Schema({
  type: { type: String, default: 'Natural Diamond' },
  carat: { type: Number },
  clarity: { type: String, default: 'VVS-VS' },
  color: { type: String, default: 'E-F' },
  count: { type: Number, default: 1 }
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required']
    },
    categorySlug: {
      type: String,
      required: true,
      lowercase: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative']
    },
    discountPercentage: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    craftsmanshipStory: {
      type: String,
      default: 'Handcrafted by master royal artisans using heritage filigree, die-struck repoussé, and microscopic stone setting techniques perfected over generations.'
    },
    metal: {
      type: String,
      required: true,
      default: '22K Yellow Gold'
    },
    purity: {
      type: String,
      required: true,
      default: '22KT (916 Hallmarked)'
    },
    grossWeight: {
      type: Number,
      required: true
    },
    netGoldWeight: {
      type: Number
    },
    gemstones: [gemstoneSchema],
    availableSizes: [{ type: String }],
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A product must have at least one image'
      }
    },
    stock: {
      type: Number,
      required: true,
      default: 5,
      min: [0, 'Stock cannot be negative']
    },
    isBestseller: {
      type: Boolean,
      default: false
    },
    isNewArrival: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isBridal: {
      type: Boolean,
      default: false
    },
    gender: {
      type: String,
      enum: ['women', 'men', 'kids', 'unisex'],
      default: 'women'
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 18
    },
    certification: {
      type: String,
      default: 'BIS Hallmarked & IGI Certified'
    },
    makingChargesRate: {
      type: Number,
      default: 12.5 // percentage of gold value
    },
    tags: [{ type: String }]
  },
  {
    timestamps: true
  }
);

// Text index for search
productSchema.index({ name: 'text', description: 'text', category: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);

