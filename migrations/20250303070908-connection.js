'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'connection',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING(36),
          },
          user_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          first_name: {
            allowNull: true,
            type: Sequelize.STRING,
          },
          last_name: {
            allowNull: true,
            type: Sequelize.STRING,
          },
          headline: {
            allowNull: true,
            type: Sequelize.STRING,
          },
          profile_picture: {
            allowNull: true,
            type: Sequelize.STRING,
          },
          public_identifier: {
            allowNull: true,
            type: Sequelize.STRING,
          },
          entity_urn: {
            allowNull: true,
            type: Sequelize.STRING,
          },
          connection_status: {
            allowNull: false,
            type: Sequelize.BOOLEAN,
            default: false,
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
      await queryInterface.dropTable('connection', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
