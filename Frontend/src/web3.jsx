import { BrowserProvider, Contract, ethers } from "ethers";
import CarbonC from "./abi/CarbonC.json";
import Marketplace from "./abi/Marketplace.json";
import Registry from "./abi/Registry.json";
import { 
  CARBON_C_ADDRESS, 
  MARKETPLACE_ADDRESS, 
  REGISTRY_ADDRESS 
} from "./constants";

// Authentication
export const getProvider = () => {
  if (!window.ethereum) throw new Error("No Ethereum provider found");
  return new BrowserProvider(window.ethereum);
};

export async function getSigner() {
  const provider = getProvider();
  return await provider.getSigner();
}

export async function getAddress() {
  const signer = await getSigner();
  return await signer.getAddress();
}

// Contract instances
export function getCarbonCContract(signerOrProvider) {
  return new Contract(CARBON_C_ADDRESS, CarbonC.abi, signerOrProvider || getProvider());
}

export function getMarketplaceContract(signerOrProvider) {
  return new Contract(MARKETPLACE_ADDRESS, Marketplace.abi, signerOrProvider || getProvider());
}

export function getRegistryContract(signerOrProvider) {
  return new Contract(REGISTRY_ADDRESS, Registry.abi, signerOrProvider || getProvider());
}

// Utility functions
export const formatEther = ethers.formatEther;
export const parseEther = ethers.parseEther;