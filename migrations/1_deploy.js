const Contacts = artifacts.require("Storage.sol");

module.exports = function (deployer) {
  deployer.deploy(Contacts);
};


//可以使用如下格式合并
// const Storage = artifacts.require("Storage.sol");
// const SocialNetwork = artifacts.require("SocialNetwork.sol");

// module.exports = function(deployer) {
//   deployer.deploy(Storage);
//   deployer.deploy(SocialNetwork);
// };
