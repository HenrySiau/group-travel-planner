'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      name: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'Henry',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'Mike',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', [{ name: 'John Doe' }, { name: 'Henry' }, { name: 'Mike' }], {});
  }
};
