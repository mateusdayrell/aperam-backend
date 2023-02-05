const { Model, DataTypes } = require('sequelize');
const bcryptjs = require('bcryptjs');

class User extends Model {
  static init(sequelize) { // init User
    super.init(
      { // init Model
        name: {
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
        email: {
          type: DataTypes.STRING,
          defaultValue: '',
          allowNull: false,
          unique: {
            args: true,
            msg: 'O e-mail informado já está sendo utilizado.',
          },
          validate: {
            isEmail: {
              msg: 'Email inválido.',
            },
          },
        },
        password_hash: { // senha COM hash
          type: DataTypes.STRING,
          defaultValue: '',
        },
        password: { // senha SEM hash
          type: DataTypes.VIRTUAL,
          defaultValue: '',
          validate: {
            len: {
              args: [8, 50],
              msg: 'A senha deve ter entre 8 e 50 caracteres.',
            },
          },
        },
      },
      {
        // defaultScope: {
        //   attributes: { exclude: ['password_reset_token', 'password_reset_expires'] },
        // },
        // scopes: {
        //   resetPassword: {
        //     attributes: { include: ['password_reset_token', 'password_reset_expires'] },
        //   },
        // },
        sequelize,
      },
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcryptjs.hash(user.password, 8);
      }
    });

    return this;
  }

  passwordIsValid(password) {
    return bcryptjs.compare(password, this.password_hash);
  }

  static associate(models) {
    this.hasMany(models.Image, {
      as: 'images',
      foreignKey: 'user_id',
    });
  }
}

module.exports = User;
