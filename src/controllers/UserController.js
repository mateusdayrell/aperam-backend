const User = require('../models/User');

module.exports = {
  async index(req, res) {
    try {
      const users = await User.findAll();
      return res.json(users);
    } catch (error) {
      return res.status(400).json({
        errors: error.errors.map((err) => err.message),
      });
    }
  },

  async show(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(400).json({
          errors: ['Usuário não encontrado'],
        });
      }

      return res.json(user);
    } catch (error) {
      return res.status(400).json({
        errors: error.errors.map((err) => err.message),
      });
    }
  },

  async store(req, res) {
    try {
      const newUser = await User.create(req.body);

      return res.json(newUser);
    } catch (error) {
      return res.status(400).json({
        errors: error.errors.map((err) => err.message),
      });
    }
  },

  async update(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(400).json({
          errors: ['Usuário não encontrado'],
        });
      }

      const updatedUser = await user.update(req.body);

      return res.json(updatedUser);
    } catch (error) {
      return res.status(400).json({
        errors: error.errors.map((err) => err.message),
      });
    }
  },

  async delete(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(400).json({
          errors: ['Usuário não encontrado.'],
        });
      }

      await user.destroy();
      return res.json({ message: 'Usuário excluído com sucesso.' });
    } catch (error) {
      return res.status(400).json({
        errors: error.errors.map((err) => err.message),
      });
    }
  },
};
