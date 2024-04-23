const express = require('express')
const router = express.Router();
const prisma = require('../db/prisma-client.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

router.post("/register", async (req, res, next) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.User.create({
      data: {
        username: req.body.username,
        password
      }
    })

    const token = jwt.sign({ id: user.id }, process.env.JWT);
    res.status(201).send({ token });
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const user = await prisma.User.findUnique({
      where: {
        username: req.body.username,
      }
    })
    const isPasswordMatch = await bcrypt.compare(req.body.password, user?.password);

    if (!user || !isPasswordMatch) {
      return res.status(401).send('WE DONT KNOW YOU');
    }
    const token = jwt.sign({id: user.id}, process.env.JWT)
    res.send({token})
    
  } catch (error) {
    
  }
})




module.exports = router;