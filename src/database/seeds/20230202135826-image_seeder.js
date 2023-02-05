/* eslint-disable no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'images',
      [
        {
          filename: '1664570936837_1209.jpg',
          originalname: 'html.jpg',
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],

      {},
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('images', null, {});
  },
};
