import { DataTypes } from "sequelize";
import initPortefeuille from "./portefeuille.js";
import initUtilisateur from "./utilisatueur.js";
function initModels(sequelize) {
    const portefeuille = initPortefeuille(sequelize, DataTypes);
    const utilisatueur = initUtilisateur(sequelize, DataTypes);
    return {
        portefeuille,
        utilisatueur,
    };
}
export default initModels;
