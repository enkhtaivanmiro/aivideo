import jwt from "jsonwebtoken"

export default function handler(req, res) {
  const { token } = req.cookies

  if (!token) return res.status(401).json({ user: null })

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    res.status(200).json({ user })
  } catch (err) {
    res.status(401).json({ user: null })
  }
}
