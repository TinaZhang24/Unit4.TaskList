const express = require("express");
const router = express.Router();
module.exports = router;
const { authenticate } = require("./auth");

const prisma = require("../prisma");

// GET/tasks should send an array of all tasks.
router.get("/", authenticate, async (req, res, next) => {
  console.log(req.user);
  try {
    const users = await prisma.task.findMany({
      where: { ownerId: req.user.id },
    });
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// POST/tasks should make a new task for the user.
router.post("/", authenticate, async (req, res, next) => {
  const { name, done } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        name,
        done,
        ownerId: req.user.id,
      },
    });
    res.status(201).json(task);
  } catch (e) {
    next(e);
  }
});

// DELETE/tasks/:id deletes the specific task owned by the logged-in user
router.delete("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the task exists
    const task = await prisma.task.findUnique({ where: { id: +id } });
    if (!task) {
      return next({
        status: 404,
        message: `Task with id ${id} does not exist.`,
      });
    }
    // Check if the token matches/ check if the user is authorized to the task
    if (task.ownerId !== req.user.id) {
      return next({
        status: 403,
        message: "You do not own this task.",
      });
    }
    // Delete the task
    await prisma.task.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// PUT /tasks/:id updates the specific task owned by the logged-in user
router.put("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { name, done } = req.body;

  // Check if name was provided
  if (!name) {
    return next({
      status: 400,
      message: "A new name must be provided.",
    });
  }

  // Check if done status was provided
  if (!done) {
    return next({
      status: 400,
      message: "A new done status must be provided.",
    });
  }

  try {
    // Check if the task exists
    const task = await prisma.task.findUnique({ where: { id: +id } });
    if (!task) {
      return next({
        status: 404,
        message: `Task with id ${id} does not exist.`,
      });
    }

    // Check if the token matches/ check if the user is authorized to the task
    if (task.ownerId !== req.user.id) {
      return next({
        status: 403,
        message: "You do not own this task.",
      });
    }

    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id: +id },
      data: { name, done },
    });
    res.json(updatedTask);
  } catch (e) {
    next(e);
  }
});
