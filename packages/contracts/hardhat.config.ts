import type { HardhatUserConfig } from "hardhat/config";
import * as fs from "fs";
import * as path from "path";

import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable } from "hardhat/config";

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
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
};

// Add post-compile hook to copy artifacts
config.solidity = {
  ...config.solidity,
  onCompileComplete: copyArtifactsToShared,
};

export default config;
