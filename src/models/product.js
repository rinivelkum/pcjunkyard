const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true,
      maxLength: 150,
      minLength: 10,
    },
    description: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      validate(value) {
        if (value.length !== 11) {
          throw new Error('SKU trebuie sa fie de 11 caractere!')
        }
      },
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Pretul nu poate fi negativ!'],
      max: [100000, 'Pretul nu poate fi mai mare decat 100000'],
    },
    discount: {
      type: Number,
      min: [0, 'Procentajul de discount trebuie sa fie pozitiv'],
      max: [100, 'Discountul nu poate fi mai mult decat 100%'],
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Cantitatea produsului nu poate fi negativa!'],
      get: (v) => Math.round(v),
      set: (v) => Math.round(v),
    },
    reviews: [
      {
        grade: { type: Number, min: 0, max: 5 },
        review: { type: String },
      },
    ],
    overallGrade: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

// productSchema.statics.deleteSku(sku)
// productSchema.statics.deleteGroup(group)

// productSchema.statics.discountSku(sku)
// productSchema.statics.discountGroup(group)
const Product = mongoose.model('Product', productSchema)

module.exports = Product
