const router = require("express").Router();
const axios = require("axios")
const CryptoCoinPrice = require("../models/CoinSchema")


router.get("/stats", async(req,res)=>{
    const name = req.query.coin;

    try{
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
              ids: name,
              vs_currencies: 'usd',
              include_market_cap: 'true',
              include_24hr_change: 'true',
            },
          });
        const data = response.data

        // const { usd, usd_market_cap, usd_24h_change } = data.name;
        console.log( data)

        res.status(200).json({data})
    }catch(err){
        console.log("failed to fetch the details", err)
    }
})



// Function to calculate the standard deviation
const calculateStandardDeviation = (prices) => {
    const n = prices.length;
    const mean = prices.reduce((acc, price) => acc + price, 0) / n;
    const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / n;
    return Math.sqrt(variance);
  };

  
router.get("/deviation", async(req,res)=>{
    let name = req.query.coin;
    if(name == "matic-network"){
        name = "matic"
    }

    try{
        const prices = await CryptoCoinPrice.find({ coin: name })
        .sort({ createdAt: -1 })
        .limit(100);
  
    
            if (!prices || prices.length === 0) {
            return res.status(404).json({ message: 'No prices found in the database' });
            }

            const coinprice = prices.map(price => price.price);
            // console.log('Prices:', coinprice);

            const standardDeviation = calculateStandardDeviation(coinprice);

            res.status(200).json({name, standardDeviation: standardDeviation.toFixed(2)});
    }catch(err){
        console.log("failed to fetch the details", err)
        res.status(500).json({ error: "Failed to fetch coin deviation price" });
    }
})

module.exports =  router;