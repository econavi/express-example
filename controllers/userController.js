const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models/models')

const generateJwt = (user) => {
  const { id, email, role } = user
  const tokenData = { id, email, role }
  const secretKey = process.env.SECRET_KEY
  const options = { expiresIn: '24h' }
  return jwt.sign(tokenData, secretKey, options)
}

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body

    if (!email || !password) {
      return next(ApiError.badRequest('Не корректный email или password'))
    }

    const candidate = await User.findOne({ where: { email } })
    if (candidate) {
      return next(ApiError.badRequest('Пользователь с таким email уже существует'))
    }

    const hashPassword = await bcrypt.hash(password, 5)

    const user = await User.create({ email, role, password: hashPassword })

    const token = generateJwt(user)

    return res.json({ token })
  }

  async login(req, res, next) {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
      return next(ApiError.internal('Пользователь не найден'))
    }

    const isPassMatch = bcrypt.compareSync(password, user.password)

    if (!isPassMatch) {
      return next(ApiError.internal('Указан не верный пароль'))
    }

    const token = generateJwt(user)

    return res.json({ token })
  }

  async check(req, res, next) {
    const { user } = req
    const token = generateJwt(user)
    res.json({ token })
  }
}

module.exports = new UserController()
