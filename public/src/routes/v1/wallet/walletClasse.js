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
const bip39_1 = __importDefault(require("bip39"));
const ethers_1 = require("ethers");
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const express_validator_1 = require("express-validator");
dotenv_1.default.config();
class WalletGenerator {
    constructor() { }
    generateEthereumWallet(mnemonic) {
        const ethereumWallet = ethers_1.Wallet.fromPhrase(mnemonic);
        return {
            publicKey: ethereumWallet.publicKey,
            privateKey: ethereumWallet.privateKey,
            address: ethereumWallet.address,
        };
    }
    generateBitcoinWallet(mnemonic) {
        // const bitcoinMnemonic = bip39.mnemonicToSeedSync(mnemonic).toString("hex");
        // const bitcoinRootKey = bitcore.HDPrivateKey.fromSeed(
        //   bitcore.crypto.Hash.sha256(Buffer.from(bitcoinMnemonic, "hex"))
        // );
        // const bitcoinDerivedKey = bitcoinRootKey.derive("m/0'/0'/0'/0/0");
        // const bitcoinAddress = bitcoinDerivedKey.privateKey.toAddress().toString();
        // const bitcoinPrivateKey = bitcoinDerivedKey.privateKey.toString();
        // const bitcoinPublicKey = bitcoinDerivedKey.publicKey.toString();
        return {
            publicKey: "bitcoinPublicKey",
            privateKey: "bitcoinPrivateKey",
            address: "bitcoinAddress",
        };
    }
    generateWallets(mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniqueId = (0, uuid_1.v4)();
            const ethereumWallet = this.generateEthereumWallet(mnemonic);
            const bitcoinWallet = this.generateBitcoinWallet(mnemonic);
            return {
                id: uniqueId,
                walletName: `Portfeuille ${uniqueId}`,
                mnemonic: mnemonic,
                bitcoinPublicKey: bitcoinWallet.publicKey,
                bitcoinPrivateKey: bitcoinWallet.privateKey,
                bitcoinAddress: bitcoinWallet.address,
                ethereumPublicKey: ethereumWallet.publicKey,
                ethereumPrivateKey: ethereumWallet.privateKey,
                ethereumAddress: ethereumWallet.address,
            };
        });
    }
    generateMnemonic(bits) {
        return __awaiter(this, void 0, void 0, function* () {
            return bip39_1.default.generateMnemonic(bits);
        });
    }
    generateWalletsFromMnemonic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mnemonic } = (0, express_validator_1.matchedData)(req);
                const wallets = yield this.generateWallets(mnemonic.trim());
                res.status(200).json(wallets);
            }
            catch (error) {
                const message = `Une erreur est survenue : ${error}`;
                console.log(message);
                res.status(500).json({ message });
            }
        });
    }
    getMnemonic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mnemonic = yield this.generateMnemonic(128);
                res.status(200).json({ mnemonic });
            }
            catch (error) {
                const message = `Une erreur est survenue : ${error}`;
                res.status(500).json({ message });
            }
        });
    }
    generaleWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mnemonic = yield this.generateMnemonic(128);
                const wallets = yield this.generateWallets(mnemonic);
                res.status(200).json(wallets);
            }
            catch (error) {
                const message = `Une erreur est survenue : ${error}`;
                res.status(500).json({ message: message });
            }
        });
    }
}
const walletGenerator = new WalletGenerator();
exports.default = walletGenerator;
