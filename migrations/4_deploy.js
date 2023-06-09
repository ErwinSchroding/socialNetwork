const Contacts = artifacts.require("data/ServiceContract.sol");

module.exports = function (deployer) {
    // deployer.deploy(Contacts,"0x9c6BCfB876b53b7D4d51783bb49f1018a4f99d74");
    deployer.deploy(Contacts);
};


//可以使用如下格式合并
// const Storage = artifacts.require("Storage.sol");
// const SocialNetwork = artifacts.require("SocialNetwork.sol");

// module.exports = function(deployer) {
//   deployer.deploy(Storage);
//   deployer.deploy(SocialNetwork);
// };
