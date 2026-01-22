require('dotenv').config();
const TradingBot = require('./bot');

async function main() {
  console.log('Starting Crypto Trading Bot...');
  
  const bot = new TradingBot({
    exchange: process.env.EXCHANGE || 'binance',
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    tradingPair: process.env.TRADING_PAIR || 'BTC/USDT',
    tradeAmount: parseFloat(process.env.TRADE_AMOUNT) || 100
  });

  try {
    await bot.start();
  } catch (error) {
    console.error('Error starting bot:', error.message);
    process.exit(1);
  }
}

main();
