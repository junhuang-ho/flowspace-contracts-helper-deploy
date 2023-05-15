import path from "path";
import fs from "fs/promises";
import hre, { ethers } from "hardhat";
import { ZERO_BYTES, networkConfig } from "../utils/common";

async function isExists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function writeFile(filePath: string, data: any) {
  try {
    const dirname = path.dirname(filePath);
    const exist = await isExists(dirname);
    if (!exist) {
      await fs.mkdir(dirname, { recursive: true });
    }

    await fs.appendFile(filePath, data, "utf8");
  } catch (err: any) {
    throw new Error(err);
  }
} // ref: https://stackoverflow.com/a/65615651

async function main() {
  const chainId = hre.network.config.chainId;
  if (!chainId) return;

  const contractName = "Deploy";
  const Contract = await ethers.getContractFactory(contractName);
  const contract = await Contract.deploy();

  await contract.deployed();

  console.log(`Address: ${contract.address}`);

  const dir = "./addresses";
  const file = `${dir}/${networkConfig[chainId]["name"]}_${Date.now()}.txt`;
  try {
    await writeFile(file, `${contract.address} - ${contractName}\n`);
  } catch (error: any) {
    console.error(error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// npx hardhat run scripts/deploy.ts --network mumbai

// verify
// npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS
// npx hardhat verify --network mumbai 0x8c5dCA45b16E0c73b5bE0fc877E7d9Fda70d40b5
