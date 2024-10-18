const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const prisma = require("../prisma");
const seed = async () => {
  const tasks = Array.from({ length: 3 }, () => ({
    name: faker.commerce.productName(),
  }));

  const hash = await bcrypt.hash("123456", 10);

  await prisma.user.create({
    data: {
      username: "puppy",
      password: hash,
      tasks: { create: tasks },
    },
  });
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
