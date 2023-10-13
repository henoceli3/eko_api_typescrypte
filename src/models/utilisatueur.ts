import { DataTypes, Model, ModelOptions, Sequelize } from "sequelize";


interface UserAttributes {
  id?: number;
  uuid: string;
  nom: string;
  prenom: string;
  email: string;
  mdp: string;
  line_state: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserModel extends Model<UserAttributes>, UserAttributes {}

export default function (sequelize: Sequelize, dataTypes: typeof DataTypes) {
  return sequelize.define<UserModel>(
    "utilisatueur",
    {
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
    },
    {
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
    } as ModelOptions
  );
}