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
const axios_1 = __importDefault(require("axios"));
class Global {
    constructor() {
        this.CryptoCmparApiKey =
            "fa975e9c5a92a7add155777722e7badd01a820b6b14b3e4c575e01f476cec5a8";
    }
    getPriceOfCrypto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cryptosTable = req.body.cryptosTable;
                const devise = req.body.devise;
                const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptosTable.join(",")}&tsyms=${devise}`;
                const response = yield axios_1.default.get(url);
                const cryptoData = response.data;
                // Extract detailed information about cryptocurrencies
                const cryptoObjects = cryptosTable.map((cryptoSymbol) => {
                    if (cryptoData.RAW &&
                        cryptoData.RAW[cryptoSymbol] &&
                        cryptoData.RAW[cryptoSymbol][devise]) {
                        const rawInfo = cryptoData.RAW[cryptoSymbol][devise];
                        const displayInfo = cryptoData.DISPLAY[cryptoSymbol][devise];
                        // Calculate the percentage change and format it to two decimal places
                        const percentChange = parseFloat(rawInfo.CHANGEPCT24HOUR).toFixed(2);
                        return {
                            symbol: cryptoSymbol,
                            name: displayInfo.FROMSYMBOL,
                            price: rawInfo.PRICE,
                            marketCap: rawInfo.MKTCAP,
                            percentChange: percentChange,
                            // Add more properties as needed
                        };
                    }
                    else {
                        return {
                            symbol: cryptoSymbol,
                            name: "",
                            price: 0,
                            marketCap: 0,
                            percentChange: "0.0", // Default to two decimal places
                            // Add more default properties as needed
                        };
                    }
                });
                res.status(200).json({ price: cryptoObjects });
            }
            catch (error) {
                const message = `Une erreur est survenue : ${error}`;
                console.log(message);
                res.status(500).json({ message });
            }
        });
    }
    getNews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get("https://min-api.cryptocompare.com/data/v2/news/?lang=EN");
                const newsBrt = response.data;
                const news = newsBrt.Data.map((news) => ({
                    title: news.title,
                    url: news.url,
                    image: news.imageurl,
                    body: news.body,
                    source: news.source,
                    tags: news.tags.trim().split("|"),
                }));
                res.status(200).json(news);
            }
            catch (error) {
                const message = `Une erreur est survenue : ${error}`;
                console.log(message);
                res.status(500).json({ message });
            }
        });
    }
    getTopList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
                const response = yield axios_1.default.get(url);
                const topList = response.data;
                res.status(200).json(topList);
            }
            catch (error) {
                const message = `Une erreur est survenue : ${error}`;
                console.log(message);
                res.status(500).json({ message });
            }
        });
    }
    termsUse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { politiqueGenerals, confidentialite, uuid } = req.body;
                res.status(200).json({ message: "ok" });
            }
            catch (error) {
                const message = `Une erreur est survenue : ${error}`;
                console.log(message);
                res.status(500).json({ message });
            }
        });
    }
}
const global = new Global();
exports.default = global;
