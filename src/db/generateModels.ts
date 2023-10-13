import { AutoOptions, SequelizeAuto } from "sequelize-auto";

const option: AutoOptions = {
  host: "localhost",
  dialect: "mysql",
  directory: "../models",
  additional: {
    timestamps: false,
  },
  singularize: false,
  useDefine: false,
};
const auto = new SequelizeAuto("eko", "root", "", option);

auto.run();
