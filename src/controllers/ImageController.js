/* eslint-disable operator-assignment */
const { Op } = require('sequelize');
const fs = require('fs');
const { resolve } = require('path');
const moment = require('moment/moment');
const Image = require('../models/Image');
const User = require('../models/User');
const upload = require('../services/multer');

module.exports = {
  async index(req, res) {
    try {
      const images = await Image.findAll({
        include: {
          model: User,
          as: 'user',
        },
      });

      const months = [];
      const weeks = [
        { name: 'Segunda', atual: 0, passada: 0 },
        { name: 'Terça', atual: 0, passada: 0 },
        { name: 'Quarta', atual: 0, passada: 0 },
        { name: 'Quinta', atual: 0, passada: 0 },
        { name: 'Sexta', atual: 0, passada: 0 },
        { name: 'Sábado', atual: 0, passada: 0 },
        { name: 'Domingo', atual: 0, passada: 0 },
      ];

      images.forEach((image) => {
        let monthControl = false;

        months.forEach((el) => {
          if (el.name === image.month) {
            el.uploads = el.uploads + 1;
            monthControl = true;
          }
        });

        weeks.forEach((el) => {
          if (el.name === image.day) {
            const curretDay = moment().day();
            const date = moment(image.created_at).format('YYYY-MM-DD');

            const domingoAtual = moment().subtract(curretDay + 1, 'd').format('YYYY-MM-DD');
            const sabadoAtual = moment().add(curretDay + (6 - curretDay) + 1, 'd').format('YYYY-MM-DD');
            const domingoPassado = moment(domingoAtual, 'YYYY-MM-DD').subtract(7, 'd').format('YYYY-MM-DD');
            const sabadoPassado = moment(sabadoAtual, 'YYYY-MM-DD').subtract(7, 'd').format('YYYY-MM-DD');

            const atual = moment(date).isBetween(domingoAtual, sabadoAtual);
            const passada = moment(date).isBetween(domingoPassado, sabadoPassado);

            if (atual) el.atual = el.atual + 1;
            if (passada) el.passada = el.passada + 1;
          }
        });

        if (!monthControl) {
          months.push({ name: image.month, uploads: 1 });
        }
      });

      return res.json({ images, months, weeks });
    } catch (error) {
      return res.status(400).json({
        errors: error.errors.map((err) => err.message),
      });
    }
  },

  async charts(req, res) {
    try {
      const images = await Image.findAll({
        include: {
          model: User,
          as: 'user',
        },
      });
      const data = new Date('2023-02-02');

      data.setDate(data.getDate() + 1);

      return res.json(images);
    } catch (error) {
      return res.status(400).json({
        errors: error.errors.map((err) => err.message),
      });
    }
  },

  async store(req, res) {
    try {
      return upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            errors: [err.code],
          });
        }

        const { user_id } = req.body;
        // const files = [];

        // eslint-disable-next-line no-restricted-syntax
        // for (const file of req.files) {
        const { originalname, filename } = req.file;

        const newFile = await Image.create({
          filename, originalname, user_id,
        });

        // files.push(newFile);
        // }

        return res.json(newFile);
      });
    } catch (error) {
      return res.status(400).json({
        errors: error.errors.map((err) => err.message),
      });
    }
  },

  async update(req, res) {
    try {
      const image = await Image.findByPk(req.params.id);

      if (!image) {
        return res.status(400).json({
          errors: ['Foto não encontrado'],
        });
      }

      const updatedImage = await image.update(req.body);

      return res.json(updatedImage);
    } catch (error) {
      return res.status(400).json({
        errors: error.errors.map((err) => err.message),
      });
    }
  },

  async destroy(req, res) {
    try {
      const image = await Image.findByPk(req.params.id);

      if (!image) {
        return res.status(400).json({
          errors: ['Foto não encontrado.'],
        });
      }

      const filePath = resolve(__dirname, '..', '..', 'uploads', 'images', image.filename);
      fs.unlinkSync(filePath);

      await image.destroy();
      return res.json({ message: 'Foto excluída com sucesso.' });
    } catch (error) {
      return res.status(400).json({
        errors: error.errors.map((err) => err.message),
      });
    }
  },

  async search(req, res) {
    try {
      const { search } = req.params;
      const urlParams = new URLSearchParams(search);

      const from = new Date(urlParams.get('date'));
      const to = new Date(urlParams.get('date'));
      to.setDate(to.getDate() + 1);
      const images = await Image.findAll({
        where: {
          created_at: {
            [Op.lt]: to,
            [Op.gt]: from,
          },
        },
      });

      return res.json(images);
    } catch (error) {
      return res.status(400).json({
        errors: error.errors.map((err) => err.message),
      });
    }
  },
};
