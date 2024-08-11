
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");



module.exports = buildModule("NFT", (m) => {


  const NFT = m.contract("NFT", []);

  return { NFT };
});


