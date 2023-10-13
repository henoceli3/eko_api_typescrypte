import express, { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import ethereumClasse from "./src/routes/v1/Transation/Ethereum/Ethereum_Classe";
import walletGenerator from "./src/routes/v1/wallet/walletClasse";
import global from "./src/routes/v1/globale/globalClasse";
import users from "./src/routes/v2/users/users";

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json("Bienvenue sur EKO Wallet");
});

// ------------------------------------------WALLET----------------------------
router.get("/api/v1/getSecretPhrase", (req: Request, res: Response) => {
  walletGenerator.getMnemonic(req, res);
});

router.get("/api/v1/createwallet", (req: Request, res: Response) => {
  walletGenerator.generaleWallet(req, res);
});

router.post(
  "/api/v1/createwallet",
  body("mnemonic").notEmpty().escape(),
  (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      walletGenerator.generateWalletsFromMnemonic(req, res);
    }
  }
);

// -------------------------------------------TRANSACTIONS----------------------------
// envoyer de l'ethereum pure
router.post(
  "/api/v1/send/eth_native",
  [
    body("privateKey").notEmpty().escape(),
    body("amount").notEmpty().escape(),
    body("destinationAddress").notEmpty().escape(),
  ],
  (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      ethereumClasse.sendToken(req, res);
    }
  }
);

// envoyer des tokens [ERC20]
router.post(
  "/api/v1/send/eth",
  [
    body("privateKey").notEmpty().escape(),
    body("amount").notEmpty().escape(),
    body("destinationAddress").notEmpty().escape(),
    body("tokenContractAddress").notEmpty().escape(),
  ],
  (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      ethereumClasse.sendToken(req, res);
    }
  }
);

// obtenir le prix du gas
router.get("/api/v1/getGasPrice", (req: Request, res: Response) => {
  ethereumClasse.getEthereumGasPrice(req, res);
});

// -------------------------------------------HISTORIQUE---------------------------------------------------
router.post(
  "/api/v1/getHistorique/eth",
  [body("userAddress").notEmpty().escape(), body("asset").notEmpty().escape()],
  (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      ethereumClasse.getHistorique(req, res);
    }
  }
);

router.post(
  "/api/v1/getHistorique/eth_native",
  [body("userAddress").notEmpty().escape(), body("asset").notEmpty().escape()],
  (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      ethereumClasse.getHistorique(req, res);
    }
  }
);

router.post(
  "/api/v1/getHistorique/btc_native",
  (req: Request, res: Response) => {
    ethereumClasse.getHistorique(req, res);
  }
);

// ------------------------------------------Balances---------------------------------------------
router.post(
  "/api/v1/getBalance/eth_native",
  [body("userAddress").notEmpty().escape()],
  (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      ethereumClasse.getBalance(req, res);
    }
  }
);

router.post(
  "/api/v1/getBalance/eth",
  [
    body("userAddress").notEmpty().escape(),
    body("tokenContractAddress").notEmpty().escape(),
  ],
  (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      ethereumClasse.getContractBalance(req, res);
    }
  }
);

// router.post("/api/v1/getBalance/btc_native", getBlanceBTCNAtive);

router.post("/api/v1/getAllBalance", (req: Request, res: Response) => {
  ethereumClasse.getAllBalances(req, res);
});

//----------------------------------globale--------------------------------
router.post("/api/v1/getPrice", (req: Request, res: Response) => {
  global.getPriceOfCrypto(req, res);
});

router.get("/api/v1/getNews", (req: Request, res: Response) => {
  global.getNews(req, res);
});

router.get("/api/v1/getTopList", (req: Request, res: Response) => {
  global.getTopList(req, res);
});

router.post("/api/v1/termsUse", (req: Request, res: Response) => {
  global.termsUse(req, res);
});

//--------------------------- V2----------------------------------------------V2-----------------------V2---------------------------------------------

// ----------------------------------------------users--------------------------------
router.post(
  "/api/v2/createUser",
  [
    body("nom").notEmpty().escape(),
    body("prenom").notEmpty().escape(),
    body("email").notEmpty().escape(),
    body("mdp").notEmpty().escape(),
  ],
  (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      users.createUser(req, res);
    }
  }
);

export default router;
