'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'user',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING(36),
          },
          email: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: true,
          },
          session_token: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          refresh_token: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('user', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
