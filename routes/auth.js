const router = require('express').Router()
const User = require('../models/User.js')
const bcrypt =require('bcryptjs')

const Joi = require('joi')

router.post('/register', async (req, res) => {
  //Hash password
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  })
  try {
    const savedUser = await user.save()
    res.send(savedUser)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

router.post('/login', async (req, res) => {
  const user = await User.findOne({email: req.body.email})
  if (!user) return res.status(400).send('Email is not found.')
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) return res.status(400).send('Invalid password')

  res.send('Logged In')
})

module.exports = router
