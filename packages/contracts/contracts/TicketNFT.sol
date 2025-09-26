// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketNFT is ERC721URIStorage, Ownable {
    uint256 public nextTicketId;
    uint256 public maxTickets;
    uint256 public ticketPrice;
    string public eventName;
    string public eventDate;
    string public eventLocation;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxTickets,
        uint256 _ticketPrice,
        string memory _eventName,
        string memory _eventDate,
        string memory _eventLocation
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        maxTickets = _maxTickets;
        ticketPrice = _ticketPrice;
        eventName = _eventName;
        eventDate = _eventDate;
        eventLocation = _eventLocation;
    }

    function mintTicket(string memory tokenURI) public payable {
        require(nextTicketId < maxTickets, "All tickets sold out");
        require(msg.value >= ticketPrice, "Not enough ETH sent");

        uint256 ticketId = nextTicketId;
        _safeMint(msg.sender, ticketId);
        _setTokenURI(ticketId, tokenURI);

        nextTicketId++;
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
