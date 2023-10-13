import Web3 from "web3";
import abi from "../../../../utils/ethersc_Abi";
import { Alchemy, Network, Wallet, Utils, AssetTransfersCategory } from "alchemy-sdk";
import { matchedData } from "express-validator";
import { Request, Response } from "express";

interface tokenTable {
  chainId: string;
  address_contract: string;
}

interface userAddress {
  eth: string;
  btc: string;
}

class Ethereum_Classe {
  private apikey: string;
  private provider: string;
  private web3: Web3;
  private alchemy: Alchemy;

  constructor(apikey: string) {
    this.apikey = apikey;
    this.provider = `https://eth-mainnet.g.alchemy.com/v2/${this.apikey}`;
    this.web3 = new Web3(this.provider);
    this.alchemy = new Alchemy({
      apiKey: this.apikey,
      network: Network.ETH_SEPOLIA, //TODO: Change this to the network you want to use
    });
  }

  async getEthereumGasPrice(req: Request, res: Response): Promise<void> {
    try {
      const gasPriceWei: bigint = await this.web3.eth.getGasPrice();
      const gasPriceGwei: string = this.web3.utils.fromWei(gasPriceWei, "gwei");
      const gasPriceEthEquivalent: string = this.web3.utils.fromWei(
        gasPriceWei,
        "ether"
      );

      res.status(200).json({
        gasPriceWei: gasPriceWei.toString(),
        gasPriceGwei: gasPriceGwei.toString(),
        gasPriceEthEquivalent: gasPriceEthEquivalent.toString(),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: `Une erreur est survenue : ${error}` });
    }
  }

  async sendEthereum(req: Request, res: Response): Promise<void> {
    try {
      const { privateKey, destinationAddress, amount } = matchedData(req);
      const wallet = new Wallet(privateKey);
      const nonce = await this.alchemy.core.getTransactionCount(
        wallet.address,
        "latest"
      );
      const transaction = {
        to: destinationAddress,
        value: Utils.parseEther(amount),
        gasLimit: "21000",
        maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
        maxFeePerGas: Utils.parseUnits("20", "gwei"),
        nonce: nonce,
        type: 2,
        chainId: 11155111, //TODO: change this to the network id 1
      };
      const rawTransaction = await wallet.signTransaction(transaction);
      const tx = await this.alchemy.core.sendTransaction(rawTransaction);
      res.status(200).json({ transactionHash: tx.hash });
    } catch (error) {
      const errorMessage = `Une erreur est survenue : ${error}`;
      res.status(500).json({ message: errorMessage });
    }
  }

  async sendToken(req: Request, res: Response): Promise<void> {
    try {
      const { privateKey, tokenContractAddress, destinationAddress, amount } =
        matchedData(req);

      const wallet = new Wallet(privateKey);
      const tokenContractABI = abi;
      const tokenContract = new this.web3.eth.Contract(
        tokenContractABI,
        tokenContractAddress
      );
      const senderBalance = await tokenContract.methods
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

      const nonce = await this.alchemy.core.getTransactionCount(
        wallet.address,
        "latest"
      );
      const gasPriceHex = this.web3.utils.toHex("21000");
      const latestBlock = await this.web3.eth.getBlock("latest");
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

      const signedTransaction = await wallet.signTransaction(transaction);
      const tx = await this.alchemy.core.sendTransaction(signedTransaction);

      res.status(200).json({ transactionHash: tx.hash });
    } catch (error) {
      const errorMessage = `Une erreur est survenue : ${error}`;
      res.status(500).json({ message: errorMessage });
    }
  }

  async getContractBalance(req: Request, res: Response): Promise<void> {
    try {
      const { tokenContractAddress, userAddress } = matchedData(req);

      const response = await this.alchemy.core.getTokenBalances(userAddress, [
        tokenContractAddress,
      ]);

      const balanceString = response.tokenBalances.map((token) =>
        Utils.formatUnits(token.tokenBalance ?? "0", "ether")
      );

      res.status(200).json({ solde: balanceString[0] });
    } catch (error) {
      console.log(error);
      const errorMessage = `Une erreur est survenue : ${error}`;
      res.status(500).json({ message: errorMessage });
    }
  }

  async getBalance(req: Request, res: Response): Promise<void> {
    try {
      const { userAddress } = matchedData(req);
      const balanceHex = await this.alchemy.core.getBalance(userAddress);
      const balanceEther = Utils.formatUnits(balanceHex, "ether");
      res.status(200).json({ solde: balanceEther });
    } catch (error) {
      const errorMessage = `Une erreur est survenue : ${error}`;
      res.status(500).json({ message: errorMessage });
    }
  }

  async getAllBalances(req: Request, res: Response): Promise<void> {
    try {
      const userAddress: userAddress = req.body.userAddress;
      const tokenTable: tokenTable[] = req.body.tokenTable;
      const balancesTable = tokenTable.map(async (token) => {
        if (token.chainId.trim().toLowerCase() === "eth_native") {
          const balanceHex = await this.alchemy.core.getBalance(
            userAddress.eth
          );
          const balanceEther = Utils.formatUnits(balanceHex, "ether");
          balanceEther;
        } else if (token.chainId === "eth") {
          const balanceHex = await this.alchemy.core.getTokenBalances(
            userAddress.eth,
            [token.address_contract]
          );
          const balanceEther = balanceHex.tokenBalances.map((token) =>
            Utils.formatUnits(token.tokenBalance ?? "0", "ether")
          );
          balanceEther[0];
        } else {
          ("0");
        }
      });
      const balances = await Promise.all(balancesTable);
      res.status(200).json({ solde: balances });
    } catch (error) {
      const message = `Une erreur est survenue: ${error}`;
      console.log(error);
      res.status(500).json({ message });
    }
  }

  async getHistorique(req: Request, res: Response): Promise<void> {
    try {
      const { userAddress, asset } = matchedData(req);
      const data_from = await this.alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: userAddress,
        category: [
          AssetTransfersCategory.EXTERNAL,
          AssetTransfersCategory.INTERNAL,
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC721,
          AssetTransfersCategory.ERC1155,
        ],
      });
      const data_to = await this.alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toAddress: userAddress,
        category: [
          AssetTransfersCategory.EXTERNAL,
          AssetTransfersCategory.INTERNAL,
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC721,
          AssetTransfersCategory.ERC1155,
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
    } catch (error) {
      const message = `Une erreur est survenue: ${error}`;
      res.status(500).json({ message });
    }
  }
}

const apiKey: string = "6mn2xblL6xvsbFUylnJGBkiaypKd4yl6";
const ethereumClasse: Ethereum_Classe = new Ethereum_Classe(apiKey);

export default ethereumClasse;