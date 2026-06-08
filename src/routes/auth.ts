import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../db/prisma'
import { config } from '../config/index'

const router = Router()

// Signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' })
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    })

    res.json({ message: 'User created', userId: user.id })
  } catch (e) {
    res.status(411).json({ message: 'Username already exists' })
  }
})

// Signin
router.post('/signin', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return res.status(403).json({ message: 'Invalid credentials' })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return res.status(403).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id },
      config.jwtSecret,
      { expiresIn: '15m' }
    )

    res.json({ token, userId: user.id })
  } catch (e) {
    res.status(500).json({ message: 'Internal server error' })
  }
})



export default router