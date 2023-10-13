import axios, { AxiosResponse } from "axios";

interface CryptoObject {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  percentChange: string;
}

class Global {
  private CryptoCmparApiKey: string;

  constructor() {
    this.CryptoCmparApiKey =
      "fa975e9c5a92a7add155777722e7badd01a820b6b14b3e4c575e01f476cec5a8";
  }

  async getPriceOfCrypto(req: any, res: any): Promise<void> {
    try {
      const cryptosTable: string[] = req.body.cryptosTable;
      const devise: string = req.body.devise;

      const url: string = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptosTable.join(
        ","
      )}&tsyms=${devise}`;

      const response: AxiosResponse = await axios.get(url);

      const cryptoData: any = response.data;

      // Extract detailed information about cryptocurrencies
      const cryptoObjects: CryptoObject[] = cryptosTable.map(
        (cryptoSymbol: string) => {
          if (
            cryptoData.RAW &&
            cryptoData.RAW[cryptoSymbol] &&
            cryptoData.RAW[cryptoSymbol][devise]
          ) {
            const rawInfo: any = cryptoData.RAW[cryptoSymbol][devise];
            const displayInfo: any = cryptoData.DISPLAY[cryptoSymbol][devise];

            // Calculate the percentage change and format it to two decimal places
            const percentChange: string = parseFloat(
              rawInfo.CHANGEPCT24HOUR
            ).toFixed(2);

            return {
              symbol: cryptoSymbol,
              name: displayInfo.FROMSYMBOL,
              price: rawInfo.PRICE,
              marketCap: rawInfo.MKTCAP,
              percentChange: percentChange,
              // Add more properties as needed
            };
          } else {
            return {
              symbol: cryptoSymbol,
              name: "",
              price: 0,
              marketCap: 0,
              percentChange: "0.0", // Default to two decimal places
              // Add more default properties as needed
            };
          }
        }
      );

      res.status(200).json({ price: cryptoObjects });
    } catch (error) {
      const message: string = `Une erreur est survenue : ${error}`;
      console.log(message);
      res.status(500).json({ message });
    }
  }

  async getNews(req: any, res: any): Promise<void> {
    try {
      const response: AxiosResponse = await axios.get(
        "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"
      );
      const newsBrt: any = response.data;
      const news: any[] = newsBrt.Data.map((news: any) => ({
        title: news.title,
        url: news.url,
        image: news.imageurl,
        body: news.body,
        source: news.source,
        tags: news.tags.trim().split("|"),
      }));
      res.status(200).json(news);
    } catch (error) {
      const message: string = `Une erreur est survenue : ${error}`;
      console.log(message);
      res.status(500).json({ message });
    }
  }

  async getTopList(req: any, res: any): Promise<void> {
    try {
      const url: string =
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
      const response: AxiosResponse = await axios.get(url);
      const topList: any = response.data;
      res.status(200).json(topList);
    } catch (error) {
      const message: string = `Une erreur est survenue : ${error}`;
      console.log(message);
      res.status(500).json({ message });
    }
  }

  async termsUse(req: any, res: any): Promise<void> {
    try {
      const { politiqueGenerals, confidentialite, uuid }: any = req.body;
      res.status(200).json({ message: "ok" });
    } catch (error) {
      const message: string = `Une erreur est survenue : ${error}`;
      console.log(message);
      res.status(500).json({ message });
    }
  }
}

const global: Global = new Global();
export default global;