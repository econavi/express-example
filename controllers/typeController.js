const { Type } = require('../models/models')

const ApiError = require('../error/ApiError')

class TypeController {
  async create(req, res, next) {
    try {
      const { id, name } = req.body
      const type = await Type.create({ id, name })

      return res.json(type)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req, res) {
    const types = await Type.findAll()
    return res.json(types)
  }
}

module.exports = new TypeController()
