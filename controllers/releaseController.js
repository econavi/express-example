const uuid = require('uuid')
const path = require('path')
const { Release } = require('../models/models')
const ApiError = require('../error/ApiError')

class ReleaseController {
  async create(req, res, next) {
    try {
      const { title, typeId } = req.body
      const { img } = req.files
      const fileName = uuid.v4() + '.jpeg'
      img.mv(path.resolve(__dirname, '..', 'static', fileName))

      const release = await Release.create({ title, typeId, img: fileName })

      return res.json(release)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req, res, next) {
    try {
      let { typeId, limit, page } = req.query

      page = page || 1

      limit = limit || 9

      let offset = page * limit - limit

      let releases

      if (typeId) {
        releases = await Release.findAndCountAll({ where: { typeId }, limit, offset })
      }

      if (!typeId) {
        releases = await Release.findAndCountAll({ limit, offset })
      }

      return res.json(releases)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      const release = await Release.findOne({ where: { id } })

      return res.json(release)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new ReleaseController()
