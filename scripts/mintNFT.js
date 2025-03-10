require("dotenv").config();

const { TOKEN_URI, CONTRACT_ADDRESS, PUBLIC_ADDRESS } = process.env;

// Loading the compiled contract Json
const contractJson = require("../build/contracts/MyNFT.json");

module.exports = async function (callback) {
  // web3 is injected by Truffle
  const contract = new web3.eth.Contract(
    contractJson.abi,
    CONTRACT_ADDRESS // this is the address generated when running migrate
  );

  // get the current network name to display in the log
  const network = await web3.eth.net.getNetworkType();

  // Generate a transaction to calls the `mintNFT` method
  const tx = contract.methods.mintNFT(PUBLIC_ADDRESS, TOKEN_URI);
  // Send the transaction to the network
  const receipt = await tx
    .send({
      from: (await web3.eth.getAccounts())[0], // uses the first account in the HD wallet
      gas: await tx.estimateGas(),
    })
    .on("transactionHash", (txhash) => {
      console.log(`Mining transaction ...`);
      console.log(`https://mumbai.polygonscan.com/tx/${txhash}`);
      //console.log(`https://goerli.lineascan.build/tx/${txhash}`);
      //Examples
      //https://mumbai.polygonscan.com/tx/0xe021db7d1dfd874cea45ee377b0d69b6ced7e279a54b8f5b1a31420b55210037
      //https://goerli.etherscan.io/tx/0xe021db7d1dfd874cea45ee377b0d69b6ced7e279a54b8f5b1a31420b55210037
    })
    .on("error", function (error) {
      console.error(`An error happened: ${error}`);
      callback();
    })
    .then(function (receipt) {
      // Success, you've minted the NFT. The transaction is now on chain!
      console.log(
        `Success: The NFT has been minted and mined in block ${receipt.blockNumber}`
      );
      callback();
    });
};
