import { useState, useEffect } from "react";
import { getMarketplaceContract, getSigner } from "../../web3";
import { getTransactions } from "../../utils/api";

export const VerifierPage = ({ address }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, [address]);

  const fetchTransactions = async () => {
    const { txns } = await getTransactions();
    setTransactions(txns);
  };

  const verifyTransaction = async (txId) => {
    try {
      const contract = getMarketplaceContract(await getSigner());
      const tx = await contract.verifyTransaction(txId);
      await tx.wait();
      alert("Transaction verified successfully");
      fetchTransactions();
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Verification failed: " + error.message);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Verifier Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Pending Verifications</h2>
        <div className="space-y-2">
          {transactions
            .filter(tx => !tx.verified)
            .map((tx, index) => (
              <div key={index} className="border p-3 rounded">
                <p>Type: {tx.type}</p>
                <p>From: {tx.from}</p>
                <p>To: {tx.to}</p>
                <p>Amount: {tx.amount}</p>
                <p>Date: {new Date(tx.timestamp).toLocaleString()}</p>
                <button
                  className="bg-purple-500 text-white px-3 py-1 rounded mt-2 hover:bg-purple-600"
                  onClick={() => verifyTransaction(tx.id)}
                >
                  Verify
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};