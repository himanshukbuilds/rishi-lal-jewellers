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
      required: false,
      default: undefined
    },
    grossWeight: {
      type: Number,
      required: false,
      default: undefined
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
    // Optional path or URL to an authentic glTF/GLB product model.
    modelUrl: {
      type: String,
      trim: true,
      default: undefined
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
      default: undefined
    },
    makingChargesRate: {
      type: Number,
      default: 12.5 // percentage of gold value
    },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true, index: true },
    metalType: { type: String, enum: ['Gold', 'Diamond', 'Silver'], default: undefined },
    subcategory: { type: String, trim: true, default: undefined },
    weightClass: { type: String, enum: ['Lightweight', 'Medium', 'Heavy'], default: undefined },
    netMetalWeight: { type: Number, min: 0, default: undefined },
    diamondWeight: { type: Number, min: 0, default: undefined },
    diamondShape: { type: String, trim: true, default: undefined },
    diamondColor: { type: String, trim: true, default: undefined },
    diamondClarity: { type: String, trim: true, default: undefined },
    imageType: { type: String, enum: ['Real Product Photograph', 'AI-Generated Concept Image'], default: undefined },
    imageSource: { type: String, trim: true, default: undefined },
    imageRights: { type: String, trim: true, default: undefined },
    pricingType: { type: String, enum: ['market-based', 'business-set', 'price-on-request', 'indicative'], default: undefined },
    // Checkout requires an explicitly approved selling price. Legacy products remain
    // governed by their established pricingType and verified stock fields.
    priceStatus: { type: String, enum: ['approved', 'indicative'], default: undefined, index: true },
    isOrderable: { type: Boolean, default: undefined, index: true },
    availability: { type: String, enum: ['in-stock', 'made-to-order', 'contact-for-availability', 'design-enquiry'], default: undefined },
    makingCharge: { type: Number, min: 0, default: undefined },
    wastageCharge: { type: Number, min: 0, default: undefined },
    stoneCharge: { type: Number, min: 0, default: undefined },
    otherCharges: { type: Number, min: 0, default: undefined },
    gstRate: { type: Number, min: 0, max: 100, default: undefined }
  },
  {
    timestamps: true
  }
);

// Text index for search
productSchema.index({ name: 'text', description: 'text', category: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);

