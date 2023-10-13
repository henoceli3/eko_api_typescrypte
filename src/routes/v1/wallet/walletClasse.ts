import bip39 from "bip39";
import { Wallet } from "ethers";
import bitcore from "bitcore-lib";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import { matchedData } from "express-validator";
dotenv.config();

class WalletGenerator {
  constructor() {}

  generateEthereumWallet(mnemonic: string): {
    publicKey: string;
    privateKey: string;
    address: string;
  } {
    const ethereumWallet = Wallet.fromPhrase(mnemonic);
    return {
      publicKey: ethereumWallet.publicKey,
      privateKey: ethereumWallet.privateKey,
      address: ethereumWallet.address,
    };
  }

  generateBitcoinWallet(mnemonic: string): {
    publicKey: string;
    privateKey: string;
    address: string;
  } {
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

  async generateWallets(mnemonic: string): Promise<{
    id: string;
    walletName: string;
    mnemonic: string;
    bitcoinPublicKey: string;
    bitcoinPrivateKey: string;
    bitcoinAddress: string;
    ethereumPublicKey: string;
    ethereumPrivateKey: string;
    ethereumAddress: string;
  }> {
    const uniqueId = nanoid(9);
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
  }

  async generateMnemonic(bits: number): Promise<string> {
    return bip39.generateMnemonic(bits);
  }

  async generateWalletsFromMnemonic(req: any, res: any): Promise<void> {
    try {
      const { mnemonic } = matchedData(req);
      const wallets = await this.generateWallets(mnemonic.trim());
      res.status(200).json(wallets);
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      console.log(message);
      res.status(500).json({ message });
    }
  }

  async getMnemonic(req: any, res: any): Promise<void> {
    try {
      const mnemonic = await this.generateMnemonic(128);
      res.status(200).json({ mnemonic });
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      res.status(500).json({ message });
    }
  }

  async generaleWallet(req: any, res: any): Promise<void> {
    try {
      const mnemonic = await this.generateMnemonic(128);
      const wallets = await this.generateWallets(mnemonic);
      res.status(200).json(wallets);
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      res.status(500).json({ message: message });
    }
  }
}

const walletGenerator = new WalletGenerator();
export default walletGenerator;
