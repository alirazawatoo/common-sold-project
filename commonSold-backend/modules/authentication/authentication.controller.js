const bcrypt = require('bcrypt')
const db = require('../../models')
const jwt = require('../../utils/jwt')

const Users = db.users

exports.login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { email: req.body.email.trim() },
      attributes: ['id', 'name', 'email', 'password_hash']
    })
    const passwordMatches = user && await bcrypt.compare(req.body.password, user.password_hash)

    if (!passwordMatches) return res.status(403).send({ message: 'Incorrect Logins' })

    const token = jwt.signToken({ userId: user.id, name: user.name, email: user.email })
    res.status(200).send({ token })
  } catch (err) {
    res.status(500).send({ message: 'Some error occurred while logging in.' })
  }
}
