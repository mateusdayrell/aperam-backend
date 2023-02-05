const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      erros: ['Realize login para prosseguir.'],
    });
  }

  const [, token] = authorization.split(' ');

  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, email } = data;

    // Verifica se os dados do token sao os mesmos do usuario logado
    const user = User.findOne({
      where: { id, email },
    });

    if (!user) {
      return res.status(401).json({
        errors: ['Usuário inválido'],
      });
    }

    req.userId = user.id;
    req.userEmail = email;
    req.userName = user.name;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      erros: ['Token expirado ou inválido, faça login para continuar.'],
    });
  }
};
