"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(sequelize, dataTypes) {
    return sequelize.define("utilisatueur", {
        id: {
            autoIncrement: true,
            type: dataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        uuid: {
            type: dataTypes.STRING(50),
            allowNull: false,
        },
        nom: {
            type: dataTypes.STRING(50),
            allowNull: false,
        },
        prenom: {
            type: dataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: dataTypes.STRING(100),
            allowNull: false,
        },
        mdp: {
            type: dataTypes.STRING(50),
            allowNull: false,
        },
        line_state: {
            type: dataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: "utilisatueur",
        timestamps: true,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [{ name: "id" }],
            },
        ],
    });
}
exports.default = default_1;
