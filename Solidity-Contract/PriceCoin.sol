// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PriceCoin is ERC20("PriceCoin", "PRC") {
    address owner;

    uint public rate = 500*1e18;

    mapping (address => uint) balances;

    event BuyPrice(address user, uint amount, uint costWei, uint balance);
    event SellPrice(address user, uint amount, uint costWei, uint balance);    

    constructor() {
        owner = msg.sender;
        _mint(owner, 10000*rate);
    }

    fallback() external payable {}
    receive() external payable {}

    function buyCoin(uint amount) payable public returns (bool success) {
        uint costWei = (amount * 1 ether) / rate;

        require(msg.value >= costWei);
        assert(transfer(msg.sender, amount));
        emit BuyPrice(msg.sender, amount, costWei, balances[msg.sender]);
        
        // uint change = msg.value - costWei;
        // if(change >= 1) msg.sender.transfer(change);
        return true;
    }

    function balanceOfEth(address _owner) public view returns(uint) {
        return balanceOf(_owner) * 500;
    }
}
