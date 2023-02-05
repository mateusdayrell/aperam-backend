const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
const User = require('../models/User');
require('dotenv').config();

module.exports = {
  async store(req, res) {
    const { email = '', password = '' } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        erros: ['E-mail e/ou senha inválidos.'],
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        erros: ['E-mail e/ou senha inválidos.'],
      });
    }

    if (!(await user.passwordIsValid(password))) {
      return res.status(401).json({
        erros: ['E-mail e/ou senha inválidos.'],
      });
    }

    const { id, name } = user;
    const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    return res.json({
      token,
      user: {
        id, email, name,
      },
    });
  },

  // async resetPassword(req, res) {
  //   try {
  //     // Conferir e validar dados
  //     const { id } = req.params;
  //     const { email } = req.body;

  //     if (!id) {
  //       return res.status(400).json({
  //         erros: ['ID não enviado.'],
  //       });
  //     }

  //     const user = await User.scope('resetPassword').findByPk(cpf);

  //     if (!user) {
  //       return res.status(400).json({
  //         erros: ['Usuário não existe.'],
  //       });
  //     }

  //     if (!email || email !== user.email) {
  //       return res.status(400).json({
  //         erros: ['Dados incorretos!'],
  //       });
  //     }
  //     // Conferir e validar dados

  //     // Criar e atualizar token
  //     const token = crypto.randomBytes(5).toString('hex');

  //     const tokenExpiration = new Date(); // tempo de expiração do token de 15min
  //     tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 15);

  //     await user.update({ // atualizar token
  //       password_reset_token: token,
  //       password_reset_expires: tokenExpiration,
  //     });
  //     // Criar e atualizar token

  //     // const template = await forgotPasswordTemplate(token); // montar template de email
  //     // const enviado = await sendMail(email, 'Recuperação de senha', template); // enviar email

  //     // if (!enviado) {
  //     //   return res.status(400).json({
  //     //     erros: ['Falha ao enviar email'],
  //     //   });
  //     // }

  //     return res.json(true);
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(400).json({
  //       erros: ['Email não enviado!'],
  //     });
  //   }
  // },
};
