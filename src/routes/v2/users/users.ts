import { matchedData } from "express-validator";
import { models } from "../../../db/sequelize";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

class Users {
  async createUser(req: Request, res: Response) {
    try {
      const { nom, prenom, email } = matchedData(req);
      let { mdp } = matchedData(req);
      const hash = await bcrypt.hash(mdp, 10);
      const newUser = await models.utilisatueur.create({
        uuid: uuidv4(),
        nom: nom,
        prenom: prenom,
        email: email,
        mdp: hash,
        line_state: 0,
      });
      return res
        .status(200)
        .json({
          message: `utilisatueur ${newUser} a bien été créé`,
          data: newUser,
        });
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = matchedData(req);
      const user = await models.utilisatueur.findByPk(id);
      return res.status(200).json({
        uuid: user?.uuid,
        nom: user?.nom,
        prenom: user?.prenom,
        email: user?.email,
      });
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await models.utilisatueur.findAll();
      return res.status(200).json(users);
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }

  async updateUserById(req: Request, res: Response) {
    try {
      const { id } = matchedData(req);
      const { user } = matchedData(req);
      const updatedUser = await models.utilisatueur.update(user, {
        where: { id },
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }

  async deleteUserById(req: Request, res: Response) {
    try {
      const { id } = matchedData(req);
      const deletedUser = await models.utilisatueur.destroy({
        where: { id },
      });
      return res.status(200).json(deletedUser);
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { mdp, email } = matchedData(req);
      const user = await models.utilisatueur.findOne({
        where: { mdp, email },
      });
      return res.status(200).json(user);
    } catch (error) {}
  }
}

const users = new Users();
export default users;
