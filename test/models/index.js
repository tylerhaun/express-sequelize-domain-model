const { Sequelize } = require('sequelize');

const sequelizeConfig = 'sqlite::memory:';
const sequelize = new Sequelize(sequelizeConfig);


class Db {

  async init() {
    this["User"] = require("./User")(sequelize);
    const result = await sequelize.sync();
  }

}


module.exports = new Db()

