const { ethers } = require("hardhat");
import "dotenv/config";

async function main() {
  console.log("Deploying TicketNFT contract to Sepolia...");

  // Check if environment variables are set
  if (!process.env.SEPOLIA_RPC_URL || process.env.SEPOLIA_RPC_URL.includes("YOUR_INFURA_PROJECT_ID")) {
    console.error("❌ SEPOLIA_RPC_URL is not set correctly in .env file");
    console.error("Please update your .env file with your actual Infura project ID");
    process.exit(1);
  }

  if (!process.env.SEPOLIA_PRIVATE_KEY || process.env.SEPOLIA_PRIVATE_KEY.includes("your_actual_private_key")) {
    console.error("❌ SEPOLIA_PRIVATE_KEY is not set correctly in .env file");
    console.error("Please update your .env file with your actual wallet private key");
    process.exit(1);
  }

  // Get the ContractFactory and Signers here
  const [deployer] = await ethers.getSigners();

  if (!deployer) {
    console.error("❌ No deployer account found. Please check your SEPOLIA_PRIVATE_KEY in .env file");
    process.exit(1);
  }

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
