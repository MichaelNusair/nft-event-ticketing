import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("TicketNFT", function () {
  it("Should deploy with correct initial values", async function () {
    const [deployer] = await ethers.getSigners();

    const name = "Event Ticket";
    const symbol = "TICKET";
    const maxTickets = 1000;
    const ticketPrice = ethers.parseEther("0.01");
    const eventName = "Sample Event";
    const eventDate = "2024-12-31";
    const eventLocation = "New York, NY";

    const ticketNFT = await ethers.deployContract("TicketNFT", [
      name,
      symbol,
      maxTickets,
      ticketPrice,
      eventName,
      eventDate,
      eventLocation,
    ]);

    expect(await ticketNFT.name()).to.equal(name);
    expect(await ticketNFT.symbol()).to.equal(symbol);
    expect(await ticketNFT.maxTickets()).to.equal(maxTickets);
    expect(await ticketNFT.ticketPrice()).to.equal(ticketPrice);
    expect(await ticketNFT.eventName()).to.equal(eventName);
    expect(await ticketNFT.eventDate()).to.equal(eventDate);
    expect(await ticketNFT.eventLocation()).to.equal(eventLocation);
    expect(await ticketNFT.owner()).to.equal(deployer.address);
  });

  it("Should mint tickets correctly", async function () {
    const [deployer, user] = await ethers.getSigners();

    const ticketNFT = await ethers.deployContract("TicketNFT", [
      "Event Ticket",
      "TICKET",
      1000,
      ethers.parseEther("0.01"),
      "Sample Event",
      "2024-12-31",
      "New York, NY",
    ]);

    const tokenURI = "ipfs://sample-token-uri";

    // Mint first ticket
    await expect(
      ticketNFT
        .connect(user)
        .mintTicket(tokenURI, { value: ethers.parseEther("0.01") })
    )
      .to.emit(ticketNFT, "Transfer")
      .withArgs(ethers.ZeroAddress, user.address, 0n);

    expect(await ticketNFT.ownerOf(0n)).to.equal(user.address);
    expect(await ticketNFT.tokenURI(0n)).to.equal(tokenURI);
    expect(await ticketNFT.nextTicketId()).to.equal(1n);
  });

  it("Should reject minting when not enough ETH is sent", async function () {
    const [_, user] = await ethers.getSigners();

    const ticketNFT = await ethers.deployContract("TicketNFT", [
      "Event Ticket",
      "TICKET",
      1000,
      ethers.parseEther("0.01"),
      "Sample Event",
      "2024-12-31",
      "New York, NY",
    ]);

    await expect(
      ticketNFT
        .connect(user)
        .mintTicket("ipfs://sample-token-uri", {
          value: ethers.parseEther("0.005"),
        })
    ).to.be.revertedWith("Not enough ETH sent");
  });
});
