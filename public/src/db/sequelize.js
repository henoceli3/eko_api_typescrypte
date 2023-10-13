"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = exports.initDb = void 0;
const sequelize_1 = require("sequelize");
const init_models_1 = __importDefault(require("../models/init-models"));
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Connexion à la base de données
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || "eko", process.env.DB_USER || "root", process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectModule: mysql2_1.default,
    dialectOptions: {
    // Options supplémentaires spécifiques au dialecte si nécessaire
    },
    logging: false,
});
// Création des modèles en utilisant la fonction initModels
const models = (0, init_models_1.default)(sequelize);
exports.models = models;
// Synchronisation de la base de données
const initDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        yield sequelize.sync({ force: false });
        console.log("Connexion à la base de données réussie et synchronisée");
    }
    catch (error) {
        console.error("Échec de la connexion à la base de données :", error);
    }
});
exports.initDb = initDb;
