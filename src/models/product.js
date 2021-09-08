const mongoose = require('mongoose')
const fs = require('fs').promises
const path = require('path')
const manufacturers = require('../utils/constants/manufacturers')
const types = require('../utils/constants/types')

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
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Cantitatea produsului nu poate fi negativa!'],
      get: (v) => Math.round(v),
      set: (v) => Math.round(v),
    },
    image: String,
    reviews: [
      {
        grade: { type: Number, min: 0, max: 5 },
        review: { type: String, maxLength: 1000 },
      },
    ],
    overallGrade: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

productSchema.statics.generateSku = async (manufacturer, category, model) => {
  //Sanitize data
  if (!manufacturers.has(manufacturer)) {
    throw new Error('Producatorul introdus nu exista')
  } else if (!types.has(category)) {
    throw new Error('Categoria introdusa nu exista')
  } else {
    const groups = await Product.getModels()
    if (model > groups.length) {
      throw new Error('Modelul introdus nu exista')
    }
  }

  if (model.length === 2) {
    model = '0' + model
  } else if (model.length === 1) {
    model = '00' + model
  }
  let sku = manufacturer + category + model
  // Find last product of a given set of categories, get next sequential no.
  const lastProduct = await Product.findOne(
    {
      sku: { $regex: sku, $options: 'i' },
    },
    'sku',
    { sort: { updatedAt: -1 } }
  ).lean()

  if (!lastProduct) {
    sku = sku + '0000'
  } else {
    let sequential = (+lastProduct.sku.slice(7) + 1).toString()

    if (sequential.length === 3) {
      sequential = '0' + sequential
    } else if (sequential.length === 2) {
      sequential = '00' + sequential
    } else if (sequential.length === 1) {
      sequential = '000' + sequential
    }
    sku = sku + sequential
  }
  return sku
}

productSchema.statics.getModels = async () => {
  try {
    const file = await fs.readFile(
      path.join(__dirname, '../utils/constants/groups.json')
    )
    return JSON.parse(file).groups
  } catch (e) {
    throw new Error(`S-a intamplat eroarea: ${e}`)
  }
}
// productSchema.statics.deleteSku(sku)
// productSchema.statics.deleteGroup(group)

// productSchema.statics.discountSku(sku)
// productSchema.statics.discountGroup(group)
const Product = mongoose.model('Product', productSchema)

module.exports = Product
