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
const web3_1 = __importDefault(require("web3"));
const ethersc_Abi_1 = __importDefault(require("../../../../utils/ethersc_Abi"));
const alchemy_sdk_1 = require("alchemy-sdk");
const express_validator_1 = require("express-validator");
class Ethereum_Classe {
    constructor(apikey) {
        this.apikey = apikey;
        this.provider = `https://eth-mainnet.g.alchemy.com/v2/${this.apikey}`;
        this.web3 = new web3_1.default(this.provider);
        this.alchemy = new alchemy_sdk_1.Alchemy({
            apiKey: this.apikey,
            network: alchemy_sdk_1.Network.ETH_SEPOLIA, //TODO: Change this to the network you want to use
        });
    }
    getEthereumGasPrice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gasPriceWei = yield this.web3.eth.getGasPrice();
                const gasPriceGwei = this.web3.utils.fromWei(gasPriceWei, "gwei");
                const gasPriceEthEquivalent = this.web3.utils.fromWei(gasPriceWei, "ether");
                res.status(200).json({
                    gasPriceWei: gasPriceWei.toString(),
                    gasPriceGwei: gasPriceGwei.toString(),
                    gasPriceEthEquivalent: gasPriceEthEquivalent.toString(),
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: `Une erreur est survenue : ${error}` });
            }
        });
    }
    sendEthereum(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { privateKey, destinationAddress, amount } = (0, express_validator_1.matchedData)(req);
                const wallet = new alchemy_sdk_1.Wallet(privateKey);
                const nonce = yield this.alchemy.core.getTransactionCount(wallet.address, "latest");
                const transaction = {
                    to: destinationAddress,
                    value: alchemy_sdk_1.Utils.parseEther(amount),
                    gasLimit: "21000",
                    maxPriorityFeePerGas: alchemy_sdk_1.Utils.parseUnits("5", "gwei"),
                    maxFeePerGas: alchemy_sdk_1.Utils.parseUnits("20", "gwei"),
                    nonce: nonce,
                    type: 2,
                    chainId: 11155111, //TODO: change this to the network id 1
                };
                const rawTransaction = yield wallet.signTransaction(transaction);
                const tx = yield this.alchemy.core.sendTransaction(rawTransaction);
                res.status(200).json({ transactionHash: tx.hash });
            }
            catch (error) {
                const errorMessage = `Une erreur est survenue : ${error}`;
                res.status(500).json({ message: errorMessage });
            }
        });
    }
    sendToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { privateKey, tokenContractAddress, destinationAddress, amount } = (0, express_validator_1.matchedData)(req);
                const wallet = new alchemy_sdk_1.Wallet(privateKey);
                const tokenContractABI = ethersc_Abi_1.default;
                const tokenContract = new this.web3.eth.Contract(tokenContractABI, tokenContractAddress);
                const senderBalance = yield tokenContract.methods
                    .balanceOf()
                    .call();
                const amountInWei = this.web3.utils.toWei(amount, "ether");
                if (senderBalance < amount) {
                    res.status(400).json({
                        message: "Solde insuffisant dans le portefeuille expéditeur.",
                    });
                }
                const transferData = tokenContract.methods
                    .transfer()
                    .encodeABI();
                const nonce = yield this.alchemy.core.getTransactionCount(wallet.address, "latest");
                const gasPriceHex = this.web3.utils.toHex("21000");
                const latestBlock = yield this.web3.eth.getBlock("latest");
                const maxGasLimit = latestBlock.gasLimit;
                const gasLimit = Math.min(parseInt(maxGasLimit.toString()), 60000);
                const transaction = {
                    nonce: nonce,
                    from: wallet.address,
                    to: destinationAddress,
                    gasPrice: gasPriceHex,
                    gasLimit: this.web3.utils.toHex(gasLimit),
                    data: transferData,
                    chainId: 11155111, //TODO: Change this to the correct network ID
                };
                const signedTransaction = yield wallet.signTransaction(transaction);
                const tx = yield this.alchemy.core.sendTransaction(signedTransaction);
                res.status(200).json({ transactionHash: tx.hash });
            }
            catch (error) {
                const errorMessage = `Une erreur est survenue : ${error}`;
                res.status(500).json({ message: errorMessage });
            }
        });
    }
    getContractBalance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tokenContractAddress, userAddress } = (0, express_validator_1.matchedData)(req);
                const response = yield this.alchemy.core.getTokenBalances(userAddress, [
                    tokenContractAddress,
                ]);
                const balanceString = response.tokenBalances.map((token) => { var _a; return alchemy_sdk_1.Utils.formatUnits((_a = token.tokenBalance) !== null && _a !== void 0 ? _a : "0", "ether"); });
                res.status(200).json({ solde: balanceString[0] });
            }
            catch (error) {
                console.log(error);
                const errorMessage = `Une erreur est survenue : ${error}`;
                res.status(500).json({ message: errorMessage });
            }
        });
    }
    getBalance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userAddress } = (0, express_validator_1.matchedData)(req);
                const balanceHex = yield this.alchemy.core.getBalance(userAddress);
                const balanceEther = alchemy_sdk_1.Utils.formatUnits(balanceHex, "ether");
                res.status(200).json({ solde: balanceEther });
            }
            catch (error) {
                const errorMessage = `Une erreur est survenue : ${error}`;
                res.status(500).json({ message: errorMessage });
            }
        });
    }
    getAllBalances(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userAddress = req.body.userAddress;
                const tokenTable = req.body.tokenTable;
                const balancesTable = tokenTable.map((token) => __awaiter(this, void 0, void 0, function* () {
                    if (token.chainId.trim().toLowerCase() === "eth_native") {
                        const balanceHex = yield this.alchemy.core.getBalance(userAddress.eth);
                        const balanceEther = alchemy_sdk_1.Utils.formatUnits(balanceHex, "ether");
                        balanceEther;
                    }
                    else if (token.chainId === "eth") {
                        const balanceHex = yield this.alchemy.core.getTokenBalances(userAddress.eth, [token.address_contract]);
                        const balanceEther = balanceHex.tokenBalances.map((token) => { var _a; return alchemy_sdk_1.Utils.formatUnits((_a = token.tokenBalance) !== null && _a !== void 0 ? _a : "0", "ether"); });
                        balanceEther[0];
                    }
                    else {
                        ("0");
                    }
                }));
                const balances = yield Promise.all(balancesTable);
                res.status(200).json({ solde: balances });
            }
            catch (error) {
                const message = `Une erreur est survenue: ${error}`;
                console.log(error);
                res.status(500).json({ message });
            }
        });
    }
    getHistorique(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userAddress, asset } = (0, express_validator_1.matchedData)(req);
                const data_from = yield this.alchemy.core.getAssetTransfers({
                    fromBlock: "0x0",
                    fromAddress: userAddress,
                    category: [
                        alchemy_sdk_1.AssetTransfersCategory.EXTERNAL,
                        alchemy_sdk_1.AssetTransfersCategory.INTERNAL,
                        alchemy_sdk_1.AssetTransfersCategory.ERC20,
                        alchemy_sdk_1.AssetTransfersCategory.ERC721,
                        alchemy_sdk_1.AssetTransfersCategory.ERC1155,
                    ],
                });
                const data_to = yield this.alchemy.core.getAssetTransfers({
                    fromBlock: "0x0",
                    toAddress: userAddress,
                    category: [
                        alchemy_sdk_1.AssetTransfersCategory.EXTERNAL,
                        alchemy_sdk_1.AssetTransfersCategory.INTERNAL,
                        alchemy_sdk_1.AssetTransfersCategory.ERC20,
                        alchemy_sdk_1.AssetTransfersCategory.ERC721,
                        alchemy_sdk_1.AssetTransfersCategory.ERC1155,
                    ],
                });
                const historique_from = data_to.transfers
                    .filter((transaction) => transaction.asset === asset)
                    .map((transaction) => ({
                    from: transaction.from,
                    to: transaction.to,
                    value: transaction.value,
                    asset: transaction.asset,
                }));
                const historique_to = data_from.transfers
                    .filter((transaction) => transaction.asset === asset)
                    .map((transaction) => ({
                    from: transaction.from,
                    to: transaction.to,
                    value: transaction.value,
                    asset: transaction.asset,
                }));
                const historique = historique_from.concat(historique_to);
                res.status(200).json(historique);
            }
            catch (error) {
                const message = `Une erreur est survenue: ${error}`;
                res.status(500).json({ message });
            }
        });
    }
}
const apiKey = "6mn2xblL6xvsbFUylnJGBkiaypKd4yl6";
const ethereumClasse = new Ethereum_Classe(apiKey);
exports.default = ethereumClasse;
