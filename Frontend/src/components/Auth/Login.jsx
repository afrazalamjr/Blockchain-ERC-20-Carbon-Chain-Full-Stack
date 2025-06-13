import { useState } from "react";
import { getSigner } from "../../web3";
import { requestNonce, verifySignature } from "../../utils/api";
import { Button } from "../ui/Button";

export const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();
      
      // Get nonce from backend
      const { nonce } = await requestNonce(address);
      
      // Sign nonce with wallet
      const signature = await signer.signMessage(nonce);
      
      // Verify signature with backend
      const { success } = await verifySignature(address, signature);
      
      if (success) {
        const { user } = await getUserInfo(address);
        onLogin({ address, role: user.role });
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Carbon Credits Marketplace</h1>
      <Button onClick={handleLogin} disabled={loading}>
        {loading ? "Connecting..." : "Connect with MetaMask"}
      </Button>
    </div>
  );
};