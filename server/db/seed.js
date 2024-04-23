const prisma = require('./prisma-client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt')


const syncNSeed = async () => {
  console.log(`SEEDING DB`)
  try {
    for (let i = 0; i < 3; ++i) {
      await prisma.User.create({
        data: {
          username: faker.internet.userName(),
          password: await bcrypt.hash(faker.internet.password(), 10)
        }
      })
      for (let j = 0; j < 3; j++) {
        await prisma.post.create({
          data: {
            title: faker.person.middleName(),
            content: faker.string.alphanumeric(),
            userId: (i % 5) + 1

          }
        })
      }
    }

    console.log(`DB SEEDED!`)



  } catch (error) {

  }
}

syncNSeed()

