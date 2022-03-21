// Что бы сервер смог считывать файл .env импортируем конфиг из модуля dotenv,
// который установили в самом начале
require('dotenv').config()

const path = require('path')

// Ипортируем express
const express = require('express')

// Импорт конфига ORM
const sequelize = require('./db')

// cors что бы могли посылать запросы из браузера
const cors = require('cors')

// Импорт таблиц BD
const models = require('./models/models')

// Основной роутер
const router = require('./routes/index')

const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const fileUpload = require('express-fileupload')

// Порт на котором будет работать приложение
const PORT = process.env.PORT || 3000

// Создадим объект вызвав функцию express
// С него будет запускаться приложение
const app = express()
// Можем делать запросы из браузера
app.use(cors())
// Можем парсить json-формат
app.use(express.json())
// Указываем серверу, что файлы из папки static нужно раздавать, как статику
app.use(express.static(path.resolve(__dirname, 'static')))
// Для работы с картинками. В вызов fileUpload нужно передать пустой объект с опциями
app.use(fileUpload({}))
// Первый параметр — url по которому должен обрабатываться роутер
app.use('/api', router)
// middleware который работает с ошибками, обязательно должен подключаться в самом конце
app.use(errorHandler)

const start = async () => {
  try {
    // Устанавливам подключение к БД
    await sequelize.authenticate()
    // Сверяем состояние БД со схемой
    await sequelize.sync()
    // Вызываем ф-ию listen, в которой указываем какой порт должен прослушивать наш сервер
    // Второй параметр callback, которые отработает при успешном запуске сервера
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()
