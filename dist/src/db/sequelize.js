var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Sequelize } from "sequelize";
import initModels from "../models/init-models";
import mysql2 from "mysql2";
import dotenv from "dotenv";
dotenv.config();
// Connexion à la base de données
const sequelize = new Sequelize(process.env.DB_NAME || "eko", process.env.DB_USER || "root", process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectModule: mysql2,
    dialectOptions: {
    // Options supplémentaires spécifiques au dialecte si nécessaire
    },
    logging: false,
});
// Création des modèles en utilisant la fonction initModels
const models = initModels(sequelize);
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
export { initDb, models };
