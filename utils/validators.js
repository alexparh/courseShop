const bcrypt = require("bcryptjs")
const { body } = require("express-validator")
const User = require("../models/user")

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Введите корректный email")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value })
        if (user) {
          return Promise.reject("Пользователь с таким email уже существует")
        }
      } catch (e) {
        console.log(e)
      }
    }),
  body("password", "Пароль должен быть минимум 6 символов")
    .isLength({ min: 6, max: 50 })
    .isAlphanumeric(),
  body("confirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Пароли должны совпадать")
    }
    return true
  }),
]

exports.loginValidators = [
  body("email").custom(async (value, { req }) => {
    try {
      const user = await User.findOne({ email: value })
      if (!user) {
        return Promise.reject("Email или пароль введены не правильно")
      }

      const areSame = await bcrypt.compare(req.body.password, user.password)
      if (!areSame) {
        return Promise.reject("Email или пароль введены не правильно")
      }
      req.body.user = user
    } catch (e) {
      console.log(e)
    }
  }),
]

exports.courseValidators = [
  body("price", "Введите корректную цену").isNumeric(),
  body("imgUrl", "Введите корректный URL картинки").isURL(),
]
