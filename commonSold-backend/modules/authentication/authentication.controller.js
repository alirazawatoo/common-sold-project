const bcrypt = require('bcrypt')
const db = require('../../models')
const jwt = require('../../utils/jwt')

const Users = db.users

exports.login = async (req, res) => {
  const user = await Users.findOne({
    where: { email: req.body.email },
    attributes: ['id', 'name', 'email', 'superadmin', 'password_hash']
  })
  const passwordMatches = user && await bcrypt.compare(req.body.password, user.password_hash)

  if (!passwordMatches) return res.status(401).send({ message: 'Incorrect email or password.' })

  const token = jwt.signToken({
    userId: user.id, name: user.name, email: user.email, superadmin: user.superadmin
  })
  res.send({ token })
}
