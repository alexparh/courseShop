const { Router } = require("express")
const Course = require("../models/course")
const auth = require("../middleware/auth")
const { validationResult } = require("express-validator")
const { courseValidators } = require("../utils/validators")
const router = Router()

router.get("/", auth, (req, res) => {
  res.render("add", {
    title: "Add",
    isAdd: true,
  })
})

router.post("/", auth, courseValidators, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render("add", {
      title: "Add",
      isAdd: true,
      error: errors.array()[0].msg,
      data:{
        title: req.body.title,
        price: req.body.price,
        imgUrl: req.body.imgUrl
      }
    })
  }

  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    imgUrl: req.body.imgUrl,
    userId: req.user, //Посоклько в модели описываем как ObjectID, такая запись возможна, mongoose делает это за нас
  })
  try {
    await course.save()
    res.redirect("/courses")
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
