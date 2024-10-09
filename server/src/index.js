const express = require("express");
const axios = require("axios");
const cron = require('node-cron');

const responseRoutes = require("./routes/responseRoutes")
const connectDB = require("./config")
const CryptoCoinPrice = require("./models/CoinSchema")

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json());  
app.use("/api", responseRoutes )

app.get("/", (req,res)=>{
    res.send("hi workinggg");
})


const cryptoData = async() =>{
    try{
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
              ids: 'bitcoin,ethereum,matic-network',
              vs_currencies: 'usd',
              include_market_cap: 'true',
              include_24hr_change: 'true',
            },
          });

          const data = response.data;
        //   console.log(data.bitcoin.usd_market_cap)

        const cryptocoins = [
            {
                name: "bitcoin",
                data: data.bitcoin
            },
            {
                name: "ethereum",
                data: data.ethereum
            },
            {
                name: 'matic',
                data: data['matic-network']
            }
        ]


        for (let i = 0; i < cryptocoins.length; i++) {
            const crypto = cryptocoins[i];
            const { usd, usd_market_cap, usd_24h_change } = crypto.data;
            // console.log(usd, usd_market_cap, usd_24h_change)

            const newCryptoPrice = new CryptoCoinPrice({
              coin: crypto.name,
              price: usd,
              market_cap: usd_market_cap,
              change_24h: usd_24h_change,
            });
            await newCryptoPrice.save();
          }

    }catch(err){
        console.log(err)
    }
}



cron.schedule('0 */2 * * *', () => {
    console.log('Fetching and storing crypto data...');
    cryptoData();
  });




const port = process.env.PORT || 4000;

app.listen(port, async () => {
    await connectDB();
    console.log(`Server is running on port ${port}`);

    cryptoData();
  });