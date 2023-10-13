"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_auto_1 = require("sequelize-auto");
const option = {
    host: "localhost",
    dialect: "mysql",
    directory: "../models",
    additional: {
        timestamps: false,
    },
    singularize: false,
    useDefine: false,
};
const auto = new sequelize_auto_1.SequelizeAuto("eko", "root", "", option);
auto.run();
