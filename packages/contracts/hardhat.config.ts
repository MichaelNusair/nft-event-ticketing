import type { HardhatUserConfig } from "hardhat/config";
import * as fs from "fs";
import * as path from "path";

import { config } from "dotenv";
config();

// Function to copy artifacts to shared package
function copyArtifactsToShared() {
  const artifactsDir = path.join(__dirname, "contracts");
  const sharedAbiDir = path.join(__dirname, "..", "shared", "src", "abi");

  if (!fs.existsSync(artifactsDir)) {
    console.log("No artifacts found to copy");
    return;
  }

  // Create shared ABI directory if it doesn't exist
  if (!fs.existsSync(sharedAbiDir)) {
    fs.mkdirSync(sharedAbiDir, { recursive: true });
  }

  // Copy all contract artifacts
  const contractFiles = fs.readdirSync(artifactsDir);

  for (const contractFile of contractFiles) {
    if (contractFile.endsWith(".json")) {
      const contractName = path.basename(contractFile, ".json");
      const sourcePath = path.join(artifactsDir, contractFile);
      const targetPath = path.join(sharedAbiDir, `${contractName}.ts`);

      try {
        const artifact = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

        // Generate TypeScript export file
        const tsContent = `// Auto-generated ABI for ${contractName}
// This file is generated automatically by the build process
export const ${contractName}ABI = ${JSON.stringify(
          artifact.abi,
          null,
          2
        )} as const;

export const ${contractName}Bytecode = "${artifact.bytecode}";

export default ${contractName}ABI;
`;

        fs.writeFileSync(targetPath, tsContent);
        console.log(`Copied ABI for ${contractName} to shared package`);
      } catch (error) {
        console.error(`Error copying artifact for ${contractName}:`, error);
      }
    }
  }
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url:
        process.env.SEPOLIA_RPC_URL ||
        "https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
      accounts:
        process.env.SEPOLIA_PRIVATE_KEY &&
        process.env.SEPOLIA_PRIVATE_KEY !== "your_private_key_here" &&
        process.env.SEPOLIA_PRIVATE_KEY !==
          "your_actual_private_key_without_0x_prefix_here"
          ? [process.env.SEPOLIA_PRIVATE_KEY]
          : [],
    },
  },
};

export default config;
