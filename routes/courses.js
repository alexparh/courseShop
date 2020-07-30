const { Router } = require("express")
const Course = require("../models/course")
const auth = require("../middleware/auth")
const { validationResult } = require("express-validator")
const { courseValidators } = require("../utils/validators")
const { commands } = require("npm")
const router = Router()

function isOwner(course, req) {
	return course.userId.toString() === req.user._id.toString()
}

router.get("/", async (req, res) => {
	try {
		const courses = await Course.find()
			.populate("userId", "email, name")
			.select("price title imgUrl") //Забираем все курсы из БД
		res.render("courses", {
			title: "Courses",
			isCourses: true,
			userId: req.user ? req.user._id.toString() : null,
			courses
		})
	} catch (e) {
		console.log(e)
	}
})

router.get("/:id/edit", auth, async (req, res) => {
	if (!req.query.allow) {
		return res.redirect("/")
	}

	try {
		const course = await Course.findById(req.params.id)

		if (!isOwner(course, req)) {
			return res.redirect("/courses")
		}

		res.render("edit", {
			course
		})
	} catch (e) {
		console.log(e)
	}
})

router.post("/edit", auth, courseValidators, async (req, res) => {
	try {
		const { id } = req.body
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(422).redirect(`/courses/${id}/edit?allow=true`)
		}

		delete req.body.id
		const course = await Course.findById(id)
		if (!isOwner(course)) {
			return res.redirect("/courses")
		}
		Object.assign(course, req.body)
		await course.save()
		res.redirect("/courses")
	} catch (e) {
		console.log(e)
	}
})

router.post("/remove", auth, async (req, res) => {
	try {
		await Course.deleteOne({
			_id: req.body.id,
			userId: req.user._id
		})
		res.redirect("/courses")
	} catch (e) {
		console.log(e)
	}
})

router.get("/:id", async (req, res) => {
	try {
		const course = await Course.findById(req.params.id)
		res.render("course", {
			layout: "empty",
			title: `Курс ${course.title}`,
			course
		})
	} catch (e) {
		console.log(e)
	}
})

module.exports = router
