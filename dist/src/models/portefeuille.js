export default function (sequelize, dataTypes) {
    return sequelize.define("portefeuille", {
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
        user_id: {
            type: dataTypes.INTEGER,
            allowNull: false,
        },
        nom: {
            type: dataTypes.STRING(100),
            allowNull: false,
        },
        mnemonic: {
            type: dataTypes.STRING(250),
            allowNull: false,
        },
        line_state: {
            type: dataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: "portefeuille",
        timestamps: true,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [{ name: "id" }],
            },
            {
                name: "user_id",
                using: "BTREE",
                fields: [{ name: "user_id" }],
            },
        ],
    });
}
