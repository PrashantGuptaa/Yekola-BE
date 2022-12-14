import Sequelize, { DataTypes } from "sequelize";
import UsersModel from "./user";

async function sequelizeConnection() {
  const sequelize = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
      host: process.env.PG_HOST,
      dialect: "postgres",

      // pool: {max: 5,min:0,idle: 10000}
    }
  );
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connected with Postgres using Sequeize ORM");
    })
    .catch((err) => {
      console.log("Error", err);
    });

  const database = {};
  database.Sequelize = Sequelize;
  database.sequelize = sequelize;
  database.Users = UsersModel(sequelize, DataTypes);
  database.sequelize.sync({ force: false }).then(() => {
    console.log("Successfully Synced database with models");
  });
  return database;
};

const database = await sequelizeConnection();

export default database;