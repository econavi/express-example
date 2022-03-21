const Router = require('express')
const router = new Router()

const releaseRouter = require('./releaseRouter')
const typeRouter = require('./typeRouter')
const userRouter = require('./userRouter')

router.use('/release', releaseRouter)
router.use('/type', typeRouter)
router.use('/user', userRouter)

module.exports = router
