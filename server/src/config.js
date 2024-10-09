const mongoose = require("mongoose");

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected succesfullyy")
    }catch(err){
        console.log("database not connected", err)
    }
}

module.exports = connectDB;


















// router.get('/fetch-crypto', async (req, res) => {
    
//     try{
//         const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
//             params: {
//               ids: 'bitcoin,ethereum,matic-network',
//               vs_currencies: 'usd',
//               include_market_cap: 'true',
//               include_24hr_change: 'true',
//             },
//           });

//           const data = response.data;

//           res.json({ message: data });

//     }catch(err){
//         console.log(err)
//     }


//   });
  

