const { Model, DataTypes } = require('sequelize');
require('dotenv').config();
const moment = require('moment/moment');

class Image extends Model {
  static init(sequelize) { // init User
    super.init(
      { // init Model
        filename: {
          type: DataTypes.STRING,
          defaultValue: '',
          allowNull: false,
          validate: {
            len: {
              args: [3, 255],
              msg: 'O nome deve ter entre 3 e 255 caracteres.',
            },
          },
        },
        originalname: {
          type: DataTypes.STRING,
          defaultValue: '',
          allowNull: false,
          validate: {
            len: {
              args: [3, 255],
              msg: 'O nome deve ter entre 3 e 255 caracteres.',
            },
          },
        },
        file_url: {
          type: DataTypes.VIRTUAL,
          // eslint-disable-next-line consistent-return
          get() {
            // if (this.getDataValue('file_url')) {
            return `${process.env.FILE_URL}/images/${this.getDataValue('filename')}`;
            // }
          },
        },
        month: {
          type: DataTypes.VIRTUAL,
          get() {
            const month = moment(this.getDataValue('created_at')).locale('pt-br').format('MMM');
            const year = moment(this.getDataValue('created_at')).locale('pt-br').format('YYYY');
            return `${month}/${year}`;
          },
        },
        day: {
          type: DataTypes.VIRTUAL,
          get() {
            const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
            const day = moment(this.getDataValue('created_at')).day();
            return weekDays[day];
          },
        },
        user_id: {
          type: DataTypes.INTEGER,
          defaultValue: '',
          allowNull: false,
        },
      },
      {
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

module.exports = Image;
