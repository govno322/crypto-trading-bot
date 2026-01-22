const ccxt = require('ccxt');

class TradingBot {
  constructor(config) {
    this.config = config;
    this.exchange = null;
    this.isRunning = false;
  }

  async start() {
    console.log('Initializing exchange connection...');
    
    // Initialize exchange
    const ExchangeClass = ccxt[this.config.exchange];
    if (!ExchangeClass) {
      throw new Error(`Exchange ${this.config.exchange} not supported`);
    }

    this.exchange = new ExchangeClass({
      apiKey: this.config.apiKey,
      secret: this.config.apiSecret,
      enableRateLimit: true
    });

    // Test connection
    await this.testConnection();
    
    this.isRunning = true;
    console.log(`Bot started successfully on ${this.config.exchange}`);
    console.log(`Trading pair: ${this.config.tradingPair}`);
    
    // Start monitoring
    this.monitorMarket();
  }

  async testConnection() {
    try {
      const balance = await this.exchange.fetchBalance();
      console.log('Exchange connection successful');
      return true;
    } catch (error) {
      throw new Error(`Failed to connect to exchange: ${error.message}`);
    }
  }

  async monitorMarket() {
    while (this.isRunning) {
      try {
        const ticker = await this.exchange.fetchTicker(this.config.tradingPair);
        console.log(`${this.config.tradingPair} - Price: ${ticker.last}`);
        
        // Wait before next check (e.g., 10 seconds)
        await this.sleep(10000);
      } catch (error) {
        console.error('Error monitoring market:', error.message);
        await this.sleep(5000);
      }
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop() {
    console.log('Stopping bot...');
    this.isRunning = false;
  }
}

module.exports = TradingBot;
