
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");



module.exports = buildModule("Marketplace", (m) => {


  const Marketplace = m.contract("Marketplace", [1]);

  return {Marketplace };
});


