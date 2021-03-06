const router = require('express').Router()
const {Product} = require('../db/models')
const {adminsOnly} = require('../auth/privileges')
const {calculateLimitAndOffset} = require('paginate-info')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const pageNum = Number(req.query.pageNum) + 1
    const pageSize = 12
    const {limit, offset} = calculateLimitAndOffset(pageNum, pageSize)

    const products = await Product.findAll()

    if (products) {
      const pageCount = Math.ceil(products.length / pageSize)
      const paginatedData = products.slice(offset, offset + limit)
      res.status(200).json({
        result: paginatedData,
        pageCount
      })
    } else {
      res.status(404).send('No products found')
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:productId', async (req, res, next) => {
  try {
    let productId = req.params.productId
    let product = await Product.findByPk(productId)
    if (product) {
      res.json(product)
    } else {
      res.status(404).send('No product found')
    }
  } catch (err) {
    next(err)
  }
})

//Admin only access: api/products
router.post('/', adminsOnly, async (req, res, next) => {
  try {
    let product = await Product.create(req.body)
    if (product) {
      res.status(201).json(product)
    }
  } catch (err) {
    res.status(500).send(err)
  }
})

router.delete('/:productId', adminsOnly, async (req, res, next) => {
  try {
    let productId = req.params.productId
    let product = await Product.findByPk(productId)
    if (!product) {
      res.sendStatus(404)
    } else {
      await product.destroy()
      res.sendStatus(204)
    }
  } catch (err) {
    res.status(500).send(err)
  }
})

router.put('/:productId', adminsOnly, async (req, res, next) => {
  try {
    let productId = req.params.productId
    let product = await Product.findByPk(productId)
    if (!product) {
      res.sendStatus(404)
    } else {
      let newProduct = await product.update(req.body)
      res.status(200).json(newProduct)
    }
  } catch (err) {
    res.status(500).send(err)
  }
})
