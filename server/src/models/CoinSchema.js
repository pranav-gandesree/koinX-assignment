const mongoose = require("mongoose");

const coinSchema = new mongoose.Schema({
    coin: String,
    price: Number,
    market_cap: Number,
    change_24h: Number,
    fetched_at: {
        type: Date,
        default: Date.now()
    }
})
  

module.exports = mongoose.model('CryptoCoinPrice', coinSchema);