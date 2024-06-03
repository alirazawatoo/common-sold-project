const jsonwebtoken = require('jsonwebtoken')

exports.signToken = (data, expiresIn = process.env.JWT_EXPIRES_IN || '8h') => (
  jsonwebtoken.sign(data, process.env.JWT_SECRET, { expiresIn })
)

exports.protect = (req, res, next) => {
  const token = req.headers['access-token']

  if (!token) return res.status(401).send({ message: 'No Access Token' })

  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)
    Object.assign(req, {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      superadmin: Boolean(decoded.superadmin)
    })
    next()
  } catch (err) {
    res.status(401).send({ message: 'Session has expired or the token is invalid.' })
  }
}
