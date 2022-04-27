// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

import "./PriceCoin.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract PriceExchange is PriceCoin() {

    event Buy(uint256 priceRequested, uint256 etherPaid);
    event Sell(uint256 pricePaid, uint256 etherRequested);

    function buyPrice() external payable {
        require(msg.value >= 0, "You must send some ether.");
        uint256 priceRequested = SafeMath.mul(msg.value, _rate); 
        _mint(msg.sender, priceRequested);
        emit Buy(priceRequested, msg.value);
    }

    function sellPrice(address payable _to, uint256 amount) external payable {
        uint256 priceToSell = SafeMath.mul(amount, 10**_decimals);
        uint256 etherRequested = SafeMath.div(priceToSell, _rate);

        require(_balances[_to] >= priceToSell, "You must hold an equal or lesser value of price coin to sell this much.");
        _burn(_to, priceToSell);
        (bool paid, ) =_to.call{value: etherRequested}("");
        require(paid, "Transaction failed");
        emit Sell(priceToSell, etherRequested);
    }
}