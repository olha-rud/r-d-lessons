import { Sequelize } from "sequelize";

const isTest = process.env.NODE_ENV === "test";

const databaseName = isTest ? "tasks_test" : "tasks_dev";

const sequelize = new Sequelize(databaseName, "rud", "", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: isTest ? false : console.log,
});

export default sequelize;
