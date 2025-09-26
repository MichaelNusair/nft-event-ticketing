# NFT Event Ticketing - Nx Monorepo

This is an Nx + pnpm monorepo for NFT event ticketing smart contracts and frontend applications.

## Project Structure

```
├── apps/                    # Frontend applications
├── packages/
│   ├── contracts/          # Hardhat smart contract project
│   │   ├── contracts/      # Solidity contracts
│   │   ├── scripts/        # Deployment and utility scripts
│   │   ├── test/          # Contract tests
│   │   ├── hardhat.config.ts
│   │   └── project.json   # Nx project configuration
│   └── shared/            # Shared TypeScript package
│       ├── src/
│       │   ├── abi/       # Generated contract ABIs
│       │   └── constants/ # Contract addresses and constants
│       ├── package.json
│       └── project.json   # Nx project configuration
├── pnpm-workspace.yaml    # pnpm workspace configuration
└── nx.json               # Nx workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 22.10.0 or later
- pnpm

### Installation

```bash
pnpm install
```

### Available Commands

#### Development
```bash
pnpm dev          # Build all packages
pnpm nx graph     # View project dependency graph
```

#### Contracts
```bash
pnpm build        # Compile contracts and generate ABIs
pnpm test         # Run contract tests
pnpm deploy       # Deploy to Sepolia network
```

#### Individual Packages
```bash
pnpm nx build contracts    # Build contracts package
pnpm nx test contracts     # Test contracts package
pnpm nx build shared       # Build shared package
```

## Usage in Frontend

The frontend can import ABIs and constants from the shared package:

```typescript
import { TicketNFTABI } from '@nft-event-ticketing/shared/abi';
import { CONTRACT_ADDRESSES, NETWORKS } from '@nft-event-ticketing/shared/constants';
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with:

```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
SEPOLIA_PRIVATE_KEY=your_private_key_here
```

### Adding New Contracts

1. Add your Solidity contract to `packages/contracts/contracts/`
2. Update the Hardhat config to copy artifacts to `packages/shared/src/abi/`
3. Update `packages/shared/src/abi/index.ts` to export the new ABI
4. Update `packages/shared/src/constants/index.ts` with the contract address

## Development Workflow

1. **Smart Contract Development**: Work in `packages/contracts/`
2. **Build Process**: Run `pnpm build` to compile contracts and generate ABIs
3. **Frontend Development**: Import from `@nft-event-ticketing/shared` in your frontend apps
4. **Deployment**: Use `pnpm deploy` to deploy contracts to networks

## Nx Benefits

- **Fast builds**: Nx caches build artifacts and only rebuilds what's changed
- **Dependency management**: Clear visibility of project dependencies
- **Scalability**: Easy to add new packages and applications
- **Remote caching**: Share build cache with your team (optional)