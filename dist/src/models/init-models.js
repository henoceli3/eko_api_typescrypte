"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const portefeuille_js_1 = __importDefault(require("./portefeuille.js"));
const utilisatueur_js_1 = __importDefault(require("./utilisatueur.js"));
function initModels(sequelize) {
    const portefeuille = (0, portefeuille_js_1.default)(sequelize, sequelize_1.DataTypes);
    const utilisatueur = (0, utilisatueur_js_1.default)(sequelize, sequelize_1.DataTypes);
    return {
        portefeuille,
        utilisatueur,
    };
}
exports.default = initModels;
