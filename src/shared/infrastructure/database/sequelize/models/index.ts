import fs from "fs";
import path from "path";
import process from "process";
import { Sequelize } from "sequelize";

import { getSSLConfig } from "../config"; // Import the function
import { initializeUserModel } from "./user";

const basename = path.basename(__filename);
const DATABASE_URL = process.env.DATABASE_URL;

//const db: any = {};

interface Db {
  [key: string]: any;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

const db: Db = {
  sequelize: {} as Sequelize,
  Sequelize: Sequelize,
};

const sequelize: Sequelize = new Sequelize(DATABASE_URL as string, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: getSSLConfig(),
  },
});

initializeUserModel(sequelize);

fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach(async (file: string) => {
    const model = await import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName: string) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
