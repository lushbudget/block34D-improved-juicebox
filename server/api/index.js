const router = require('express').Router();
const prisma = require('../db/prisma-client.js')
const jwt = require('jsonwebtoken')


router.get('/posts', async (req, res, next) => {

  try {
    const allPosts = await prisma.Post.findMany();
    console.log(allPosts)
    res.send(allPosts);
  } catch (error) {
    next(error)

  }
})

router.get('/posts/:id', async (req, res, next) => {
  const inputId = parseInt(req.params.id);
  try {
    const postById = await prisma.Post.findUnique({
      where: {
        id: inputId
      }
    })
    console.log(postById)
    res.send(postById)

  } catch (error) {
    next(error)

  }
})

//MY AUTHENTICATION MIDDLEWARE: I need to get my post a Post function up first so i can know the password

router.use(async (req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  try {
    req.user = await jwt.verify(token, process.env.JWT);
  } catch (error) {
    req.user = null
  }
  next()

})

router.post('/posts', async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send("Invalid login credentials.");
  } else {
    const title = req.body.title;
    const content = req.body.content;
    const userId = req.body.userId;
    try {
      const post = await prisma.Post.create({
        data: {
          title,
          content,
          userId
        }
      })
      res.send(post);

    } catch (error) {
      next(error)

    }

  }
})

router.put('/posts/:id', async (req, res, next) => {
  console.log(`TEST`)

  
  if (!req.user) {
    return res.status(401).send("Invalid login credentials.");
  } else {
    const inputId = parseInt(req.params.id);
    const title = req.body.title;
    const content = req.body.content;
    const userId = req.body.userId
    try {
      await prisma.Post.update({
        where: {
          id: inputId,
          userId: req.user.id
        },
        data: {
          title,
          content,
          userId
        }

      })
      res.status(204).send("SUCESSFULY UPDATED")
      
    } catch (error) {
      res.status(400).send("FAILED TO UPDATE")
      
    }
}
})



router.delete('/posts/:id', async (req, res, next) => {
  
  if (!req.user) {
    return res.status(401).send("Invalid login credentials.");
  } else {
    const inputId = parseInt(req.params.id);
    try {
      await prisma.Post.delete({
        where: {
          id: inputId,
          userId: req.user.id
        }
      })
      res.status(201).send(`Post successfully deleted!`)
    } catch (error) {
      res.status(400).send("FAILED TO DELETE")
    }
  }
})

module.exports = router
