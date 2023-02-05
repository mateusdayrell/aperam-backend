/* eslint-disable no-unused-vars */
const bcryptjs = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Mateus',
          email: 'mateus@email.com',
          password_hash: await bcryptjs.hash('12345678', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],

      {},
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  },
};
