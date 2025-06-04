import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import * as cookie from 'cookie'

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { email, password } = req.body

  // Connect to MongoDB
  const client = await clientPromise
  const db = client.db()

  // Find user by email
  const user = await db.collection("users").findOne({ email })

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" })
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" })
  }
console.log(cookie)

  // Check that JWT secret exists
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Missing JWT secret" })
  }

  // Create JWT token
  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  // Set cookie with token, HTTP-only and secure flags
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
      path: "/",
    })
  )
  
  res.status(200).json({ message: "Logged in successfully" })
}
