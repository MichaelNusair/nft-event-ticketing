import { ethers } from "hardhat";
import { config } from "dotenv";

// Load environment variables
config();

async function main() {
  console.log("Deploying TicketNFT contract to Sepolia...");

  // Get the ContractFactory and Signers here
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Contract deployment parameters
  const name = "Event Ticket";
  const symbol = "TICKET";
  const maxTickets = 1000;
  const ticketPrice = ethers.parseEther("0.01"); // 0.01 ETH per ticket
  const eventName = "Sample Event";
  const eventDate = "2024-12-31";
  const eventLocation = "New York, NY";

  // Deploy contract
  const TicketNFT = await ethers.getContractFactory("TicketNFT");
  const ticketNFT = await TicketNFT.deploy(
    name,
    symbol,
    maxTickets,
    ticketPrice,
    eventName,
    eventDate,
    eventLocation
  );

  await ticketNFT.waitForDeployment();

  const deployedAddress = await ticketNFT.getAddress();
  console.log("TicketNFT deployed to:", deployedAddress);

  // Save deployment info
  const deploymentInfo = {
    contract: "TicketNFT",
    address: deployedAddress,
    network: "sepolia",
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    parameters: {
      name,
      symbol,
      maxTickets,
      ticketPrice: ticketPrice.toString(),
      eventName,
      eventDate,
      eventLocation
    }
  };

  console.log("Deployment completed successfully!");
  console.log("Contract address:", deployedAddress);

  // TODO: Save deployment info to a file or database
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
