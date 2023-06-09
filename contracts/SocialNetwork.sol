// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// import "./User.sol";


contract SocialNetwork {
    //User contractUser;
    mapping(address => address) public accounts; //将用户的公钥映射为一个新的地址，保护用户隐私安全。
    struct User {
        string name; // 用户名
        string email; // 电子邮件地址
        uint256 age; // 年龄
        address wallet; // 以太坊钱包地址
        bool isVerified; // 是否已验证
    }
    mapping(address => User) public users; //存储account的信息,account => User

    struct Friend {
        //用于存储两个用户的朋友关系信息，如是否朋友，朋友时间等。
        bool exists; //是否存在过好友关系
        uint256 addedAt; //好友建立的时间
        string message; //好友申请信息
        bool deleted; //是否删除好友
    }
    mapping(address => mapping(address => Friend)) public friends; //记录没两个用户是否为朋友关系,以及两个人的朋友信息
    mapping(address => address[]) public myFriends; //记录某个用户的所有朋友地址

    struct Article{
        string title;
        string article;
        uint256 addedAt;
    }

    mapping(address => Article[]) articles; //记录每个用户的帖子
    // mapping(address => mapping(string[] => address)) articles
    // 在您的 Solidity 合约中，mapping(address => mapping(string[] => address)) articles 这个数据结构并不是有效的结构，因为 string[] 类型无法作为映射的键，只有以下数据类型可以作为映射的键：
    // 所有整型类型（不包括 Bytes32）
    // Address
    // Enum
    // String, 不超过 32 字节
    // Bytes，不超过 32 字节


    function checkAddressSigned(address adr) public view returns (bool) {
        if (accounts[adr] != address(0)) {
            return true; //注册过，返回true
        } else {
            return false; //地址未注册过，返回false
        }
    }

    function join() public {
        if (checkAddressSigned(msg.sender)) return; //已经注册过，则直接返回。

        address newAddress = address(
            uint160(
                uint256(
                    keccak256(abi.encodePacked(msg.sender, block.timestamp))
                )
            )
        ); // 生成新地址
        accounts[msg.sender] = newAddress; // 将新地址与公钥地址映射
    }

    function getAccountByAddress(address adr) public view returns (address) {
        return accounts[adr];
    }

    function registerUser(
        string memory name,
        string memory email,
        uint256 age,
        address wallet,
        bool isVerified
    ) public {
        User memory user = User(name, email, age, wallet, isVerified);
        users[accounts[msg.sender]] = user; //使用虚拟address映射信息，不暴露公钥
    }

    function getUserByAccount(address account)
        public
        view
        returns (User memory)
    {
        return users[account];
    }

    function updateUser(
        address account,
        string memory name,
        string memory email,
        uint256 age,
        address wallet,
        bool isVerified
    ) public {
        User storage user = users[account];
        user.name = name;
        user.email = email;
        user.age = age;
        user.wallet = wallet;
        user.isVerified = isVerified;
    }

    function addFriend(address friendAddress, string memory message) public {
        address myAccount = accounts[msg.sender]; //将自己的私钥转换为 account 地址

        require(
            users[friendAddress].wallet != address(0),
            "Your friend's Address doesn't exist"
        );
        //如果给定的地址不在映射中，则 Solidity 会默认返回该映射中元素的默认值，例如 User 结构体的默认值是其成员变量的默认值。
        //在本例中，User 结构体的默认值是其公共钱包地址成员变量 wallet 的默认值 address(0)。
        //因此，如果您按照上面的代码运行 require(users[friendAddress].wallet != address(0), "Your friend's Address doesn't exist");
        //则如果给定地址不存在于 users 映射中，则其 wallet 成员变量将默认为 address(0)，从而使条件 users[friendAddress].wallet != address(0) 不成立，require 会抛出异常并回滚。
        require(!isFriend(friendAddress), "He/She is already your friend");

        friends[myAccount][friendAddress] = Friend({
            exists: true,
            addedAt: block.timestamp,
            message: message,
            deleted: false
        });
        myFriends[myAccount].push(friendAddress);
        //此处只是单项添加好友，应对方接受后再次调用，即可双向。
    }

    function getMyFriends() public view returns (address[] memory) {
        address myAccount = accounts[msg.sender];
        return myFriends[myAccount];
    }

    // Get number of friends for the sender
    function getMyFriendsCount() public view returns (uint256) {
        address myAccount = accounts[msg.sender];
        return myFriends[myAccount].length;
    }

    // Check if an address is a friend of the sender
    function isFriend(address friendAddress) public view returns (bool) {
        address myAccount = accounts[msg.sender];
        return friends[myAccount][friendAddress].exists;
        //如果你使用一个不存在的地址作为 friendAddress 参数来调用 isFriend 函数，程序不会直接报错，而是返回默认值。
        //在 Solidity 中，如果你在 mapping 中使用一个不存在的键去查找值，返回值的默认值将取决于值的数据类型。
        //对于 bool 类型的值，默认值为 false，对于数值类型的值，默认值为 0，对于引用类型（如 string 和 address）的值，默认值为对应类型的 “0 值”，即空字符串和 0 地址。
    }

    function removeFriend(address friendAddress) public {
        address myAccount = accounts[msg.sender]; //将自己的私钥转换为 account 地址
        require(isFriend(friendAddress), "Not a friend");
        friends[myAccount][friendAddress] = Friend({
            exists: true,
            addedAt: block.timestamp,
            message: "",
            deleted: true
        });
    }

    function getFriendIndex(address friendAddress)
        public
        view
        returns (uint256)
    {
        address myAccount = accounts[msg.sender]; //将自己的私钥转换为 account 地址
        require(isFriend(friendAddress), "Not a friend");
        address[] storage friendsPointer = myFriends[myAccount];
        uint256 friendIndex = uint256(0);
        for (uint256 i = 0; i < friendsPointer.length; i++) {
            if (friendsPointer[i] == friendAddress) {
                friendIndex = i;
                break;
            }
        }
        return friendIndex;
        //在 Solidity 中，使用指针来访问数组可以节约 gas，
        //因为指针只是存储了数组的起始位置，而不是整个数组。这种方法只需要更少的代码和更少的存储器访问，可以提高代码的执行效率，并显著降低 gas 费用。
    }

    // function addFriend(address friendAddress, string memory message) public {
    //     require(friendAddress != msg.sender, "Cannot add yourself as a friend");
    //     require(!isFriend(friendAddress), "Already a friend");

    //     // Add friend to sender's friend list
    //     friends[msg.sender][friendAddress] = Friend({exists: true, addedAt: block.timestamp, message: message});
    //     myFriends[msg.sender].push(friendAddress);

    //     // Add sender to friend's friend list
    //     friends[friendAddress][msg.sender] = Friend({exists: true, addedAt: block.timestamp, message: message});
    //     myFriends[friendAddress].push(msg.sender);
    // }

    // function getMyFriendsCount() public view returns(uint) {
    //     return myFriends[msg.sender].length;
    // }

    // Get a specific friend address for the sender by index
    // function getMyFriendAtIndex(uint index) public view returns(address) {
    //     require(index < myFriends[msg.sender].length, "Invalid index for friend");
    //     return myFriends[msg.sender][index];
    // }

    // Get friend message for the sender and a specific friend
    // function getFriendMessage(address friendAddress) public view returns(string memory) {
    //     require(isFriend(friendAddress), "Not a friend");
    //     return friends[msg.sender][friendAddress].message;
    // }
}
