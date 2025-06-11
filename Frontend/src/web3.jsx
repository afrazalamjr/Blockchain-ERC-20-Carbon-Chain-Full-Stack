import { ethers } from "ethers";
import CarbonC from "./abi/CarbonC.json";
import Marketplace from "./abi/Marketplace.json";
import Registry from "./abi/Registry.json";
import { CARBON_C_ADDRESS, MARKETPLACE_ADDRESS, REGISTRY_ADDRESS } from "./constants";

// Get ethers.js provider from user's browser wallet
export function getProvider() {
  return new ethers.providers.Web3Provider(window.ethereum);
}

export function getSigner() {
  const provider = getProvider();
  return provider.getSigner();
}

// Contract helpers
export function getCarbonCContract(signerOrProvider) {
  return new ethers.Contract(CARBON_C_ADDRESS, CarbonC, signerOrProvider || getProvider());
}

export function getMarketplaceContract(signerOrProvider) {
  return new ethers.Contract(MARKETPLACE_ADDRESS, Marketplace, signerOrProvider || getProvider());
}

export function getRegistryContract(signerOrProvider) {
  return new ethers.Contract(REGISTRY_ADDRESS, Registry, signerOrProvider || getProvider());
}