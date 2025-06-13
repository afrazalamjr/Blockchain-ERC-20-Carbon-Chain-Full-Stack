import { useState, useEffect } from "react";
import { getMarketplaceContract, getSigner, formatEther } from "../../web3";
import { createTransaction, getTransactions } from "../../utils/api";

export const CustomerPage = ({ address }) => {
  const [emissions, setEmissions] = useState("");
  const [creditor, setCreditor] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, [address]);

  const fetchTransactions = async () => {
    const { txns } = await getTransactions();
    setTransactions(txns);
  };

  const buyCredits = async () => {
    try {
      const contract = getMarketplaceContract(await getSigner());
      const tx = await contract.buyCarbonCredits(emissions, creditor, { value: 0 });
      await tx.wait();
      
      await createTransaction({
        type: "PURCHASE",
        from: address,
        to: creditor,
        amount: emissions,
        timestamp: new Date().toISOString()
      });
      
      alert("Purchase completed successfully");
      fetchTransactions();
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed: " + error.message);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Buy Carbon Credits</h2>
        <div className="space-y-4">
          <input
            className="w-full p-2 border rounded"
            type="number"
            placeholder="Emission value"
            value={emissions}
            onChange={(e) => setEmissions(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            type="text"
            placeholder="Creditor address"
            value={creditor}
            onChange={(e) => setCreditor(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={buyCredits}
          >
            Buy Credits
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Transactions</h2>
        <div className="space-y-2">
          {transactions
            .filter(tx => tx.from === address)
            .map((tx, index) => (
              <div key={index} className="border p-3 rounded">
                <p>Type: {tx.type}</p>
                <p>To: {tx.to}</p>
                <p>Amount: {tx.amount}</p>
                <p>Date: {new Date(tx.timestamp).toLocaleString()}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};