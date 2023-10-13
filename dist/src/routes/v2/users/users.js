var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { matchedData } from "express-validator";
import { models } from "../../../db/sequelize";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
class Users {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nom, prenom, email } = matchedData(req);
                let { mdp } = matchedData(req);
                const hash = yield bcrypt.hash(mdp, 10);
                const newUser = yield models.utilisatueur.create({
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
            }
            catch (error) {
                const message = `Une erreur est survenue : ${error}`;
                return res.status(500).json({ message });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = matchedData(req);
                const user = yield models.utilisatueur.findByPk(id);
                return res.status(200).json({
                    uuid: user === null || user === void 0 ? void 0 : user.uuid,
                    nom: user === null || user === void 0 ? void 0 : user.nom,
                    prenom: user === null || user === void 0 ? void 0 : user.prenom,
                    email: user === null || user === void 0 ? void 0 : user.email,
                });
            }
            catch (error) {
                const message = `Une erreur est survenue : ${error}`;
                return res.status(500).json({ message });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield models.utilisatueur.findAll();
                return res.status(200).json(users);
            }
            catch (error) {
                const message = `Une erreur est survenue : ${error}`;
                return res.status(500).json({ message });
            }
        });
    }
    updateUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = matchedData(req);
                const { user } = matchedData(req);
                const updatedUser = yield models.utilisatueur.update(user, {
                    where: { id },
                });
                return res.status(200).json(updatedUser);
            }
            catch (error) {
                const message = `Une erreur est survenue : ${error}`;
                return res.status(500).json({ message });
            }
        });
    }
    deleteUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = matchedData(req);
                const deletedUser = yield models.utilisatueur.destroy({
                    where: { id },
                });
                return res.status(200).json(deletedUser);
            }
            catch (error) {
                const message = `Une erreur est survenue : ${error}`;
                return res.status(500).json({ message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mdp, email } = matchedData(req);
                const user = yield models.utilisatueur.findOne({
                    where: { mdp, email },
                });
                return res.status(200).json(user);
            }
            catch (error) { }
        });
    }
}
const users = new Users();
export default users;
