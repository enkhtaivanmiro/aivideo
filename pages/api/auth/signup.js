import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" })
  }

  const client = await clientPromise
  const db = client.db()

  const existingUser = await db.collection("users").findOne({ email })

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.collection("users").insertOne({ email, password: hashedPassword })

  res.status(201).json({ message: "User created" })
}
