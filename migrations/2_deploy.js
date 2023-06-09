const Contacts = artifacts.require("SocialNetwork.sol");

module.exports = function (deployer) {
  deployer.deploy(Contacts);
};
