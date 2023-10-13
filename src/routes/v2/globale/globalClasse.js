import axios from "axios";

class Global {
  constructor() {
    this.CryptoCmparApiKey =
      "fa975e9c5a92a7add155777722e7badd01a820b6b14b3e4c575e01f476cec5a8";
  }

  async getPriceOfCrypto(req, res) {
    try {
      const cryptosTable = req.body.cryptosTable;
      const devise = req.body.devise;

      const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptosTable.join(
        ","
      )}&tsyms=${devise}`;

      const response = await axios.get(url);

      const cryptoData = response.data;

      // Extract detailed information about cryptocurrencies
      const cryptoObjects = cryptosTable.map((cryptoSymbol) => {
        if (
          cryptoData.RAW &&
          cryptoData.RAW[cryptoSymbol] &&
          cryptoData.RAW[cryptoSymbol][devise]
        ) {
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
        } else {
          return {
            symbol: cryptoSymbol,
            name: "",
            price: 0,
            marketCap: 0,
            percentChange: 0.0, // Default to two decimal places
            // Add more default properties as needed
          };
        }
      });

      return res.status(200).json({ price: cryptoObjects });
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      console.log(message);
      res.status(500).json({ message });
    }
  }
  async getNews(req, res) {
    try {
      const response = await axios.get(
        "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"
      );
      const newsBrt = response.data;
      const news = newsBrt.Data.map((news) => ({
        title: news.title,
        url: news.url,
        image: news.imageurl,
        body: news.body,
        source: news.source,
        tags: news.tags.trim().split("|"),
      }));
      return res.status(200).json(news);
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      console.log(message);
      res.status(500).json({ message });
    }
  }

  async getTopList(req, res) {
    try {
      const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
      const response = await axios.get(url);
      const topList = response.data;
      return res.status(200).json(topList);
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      console.log(message);
      res.status(500).json({ message });
    }
  }

  async termsUse(req, res) {
    try {
      const { politiqueGenerals, confidentialite, uuid } = req.body;
      return res.status(200).json({message: "ok"});
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      console.log(message);
      res.status(500).json({ message });
    }
  }
}

const global = new Global();
export default global;
