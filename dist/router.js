"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const Ethereum_Classe_1 = __importDefault(require("./src/routes/v1/Transation/Ethereum/Ethereum_Classe"));
const walletClasse_1 = __importDefault(require("./src/routes/v1/wallet/walletClasse"));
const globalClasse_1 = __importDefault(require("./src/routes/v1/globale/globalClasse"));
const users_1 = __importDefault(require("./src/routes/v2/users/users"));
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.json("Bienvenue sur EKO Wallet");
});
// ------------------------------------------WALLET----------------------------
router.get("/api/v1/getSecretPhrase", (req, res) => {
    walletClasse_1.default.getMnemonic(req, res);
});
router.get("/api/v1/createwallet", (req, res) => {
    walletClasse_1.default.generaleWallet(req, res);
});
router.post("/api/v1/createwallet", (0, express_validator_1.body)("mnemonic").notEmpty().escape(), (req, res) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json(result);
    }
    else {
        walletClasse_1.default.generateWalletsFromMnemonic(req, res);
    }
});
// -------------------------------------------TRANSACTIONS----------------------------
// envoyer de l'ethereum pure
router.post("/api/v1/send/eth_native", [
    (0, express_validator_1.body)("privateKey").notEmpty().escape(),
    (0, express_validator_1.body)("amount").notEmpty().escape(),
    (0, express_validator_1.body)("destinationAddress").notEmpty().escape(),
], (req, res) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json(result);
    }
    else {
        Ethereum_Classe_1.default.sendToken(req, res);
    }
});
// envoyer des tokens [ERC20]
router.post("/api/v1/send/eth", [
    (0, express_validator_1.body)("privateKey").notEmpty().escape(),
    (0, express_validator_1.body)("amount").notEmpty().escape(),
    (0, express_validator_1.body)("destinationAddress").notEmpty().escape(),
    (0, express_validator_1.body)("tokenContractAddress").notEmpty().escape(),
], (req, res) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json(result);
    }
    else {
        Ethereum_Classe_1.default.sendToken(req, res);
    }
});
// obtenir le prix du gas
router.get("/api/v1/getGasPrice", (req, res) => {
    Ethereum_Classe_1.default.getEthereumGasPrice(req, res);
});
// -------------------------------------------HISTORIQUE---------------------------------------------------
router.post("/api/v1/getHistorique/eth", [(0, express_validator_1.body)("userAddress").notEmpty().escape(), (0, express_validator_1.body)("asset").notEmpty().escape()], (req, res) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json(result);
    }
    else {
        Ethereum_Classe_1.default.getHistorique(req, res);
    }
});
router.post("/api/v1/getHistorique/eth_native", [(0, express_validator_1.body)("userAddress").notEmpty().escape(), (0, express_validator_1.body)("asset").notEmpty().escape()], (req, res) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json(result);
    }
    else {
        Ethereum_Classe_1.default.getHistorique(req, res);
    }
});
router.post("/api/v1/getHistorique/btc_native", (req, res) => {
    Ethereum_Classe_1.default.getHistorique(req, res);
});
// ------------------------------------------Balances---------------------------------------------
router.post("/api/v1/getBalance/eth_native", [(0, express_validator_1.body)("userAddress").notEmpty().escape()], (req, res) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json(result);
    }
    else {
        Ethereum_Classe_1.default.getBalance(req, res);
    }
});
router.post("/api/v1/getBalance/eth", [
    (0, express_validator_1.body)("userAddress").notEmpty().escape(),
    (0, express_validator_1.body)("tokenContractAddress").notEmpty().escape(),
], (req, res) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json(result);
    }
    else {
        Ethereum_Classe_1.default.getContractBalance(req, res);
    }
});
// router.post("/api/v1/getBalance/btc_native", getBlanceBTCNAtive);
router.post("/api/v1/getAllBalance", (req, res) => {
    Ethereum_Classe_1.default.getAllBalances(req, res);
});
//----------------------------------globale--------------------------------
router.post("/api/v1/getPrice", (req, res) => {
    globalClasse_1.default.getPriceOfCrypto(req, res);
});
router.get("/api/v1/getNews", (req, res) => {
    globalClasse_1.default.getNews(req, res);
});
router.get("/api/v1/getTopList", (req, res) => {
    globalClasse_1.default.getTopList(req, res);
});
router.post("/api/v1/termsUse", (req, res) => {
    globalClasse_1.default.termsUse(req, res);
});
//--------------------------- V2----------------------------------------------V2-----------------------V2---------------------------------------------
// ----------------------------------------------users--------------------------------
router.post("/api/v2/createUser", [
    (0, express_validator_1.body)("nom").notEmpty().escape(),
    (0, express_validator_1.body)("prenom").notEmpty().escape(),
    (0, express_validator_1.body)("email").notEmpty().escape(),
    (0, express_validator_1.body)("mdp").notEmpty().escape(),
], (req, res) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json(result);
    }
    else {
        users_1.default.createUser(req, res);
    }
});
exports.default = router;
