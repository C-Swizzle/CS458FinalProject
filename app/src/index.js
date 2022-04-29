import Web3 from "web3";
import priceCoinArtifact from "../../build/contracts/PriceCoin.json";
import priceExchangeArtifact from "../../build/contracts/PriceExchange.json";

const App = {
  web3: null,
  account: null,
  coin: null,
  exchange: null,

  start: async function() {
    const { web3 } = this;

    try {
      const networkId = await web3.eth.net.getId();
      const deployedNetworkCoin = priceCoinArtifact.networks[networkId];
      const deployedNetworkExchange = priceExchangeArtifact.networks[networkId];
      
      this.exchange = new web3.eth.Contract(
        priceExchangeArtifact.abi,
        deployedNetworkExchange.address
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.refreshBalance();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  refreshBalance: async function() {
    const balance = await this.exchange.methods.balanceOf(this.account).call();

    const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance;
  },

  buyPrice: async function() {
    const amount = document.getElementById("buyAmount").value;

    this.setStatus("Executing transaction, please accept MetaMask confirmation.");

    console.log(await this.exchange.methods.buyPrice()
      .send({from: this.account, value: Web3.utils.toWei(amount, "ether")}));

    this.setStatus("Transaction complete!");
    this.refreshBalance();
  },

  sellPrice: async function() {
    const amount = document.getElementById("sellAmount").value;

    this.setStatus("Executing transaction, please accept MetaMask confirmation.");

    console.log(await this.exchange.methods.sellPrice(this.account, amount).send({ from: this.account}));

    this.setStatus("Transaction complete!");
    this.refreshBalance();
  },

  play: async function() {
    const betAmount = document.getElementById("betAmount").value;
    const leeway = document.getElementById("leeway").value;
    const guess = document.getElementById("guess").value;

    const results = await this.exchange.methods.play(this.account, betAmount, guess, leeway).send({from: this.account});
    const won = results["events"]["Outcome"]["returnValues"][0]; // Boolean - whether user won or not.
    const payout = results["events"]["Outcome"]["returnValues"][1]; // Payout amount 
    const randomNum = results["events"]["Outcome"]["returnValues"][2] // Random number that was generated.
    console.log(results);

    let outcome = document.getElementById("outcome");
    outcome.innerHTML = won ? "You won " + payout + " PRC!": "You lost " + betAmount + " PRC!";

    let number = document.getElementById("number");
    number.innerHTML = "The random number was: " + randomNum;

    this.refreshBalance();
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:9545"),
    );
  }

  App.start();
});
