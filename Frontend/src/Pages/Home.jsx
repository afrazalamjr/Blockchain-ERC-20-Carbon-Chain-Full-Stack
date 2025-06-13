import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { getCarbonCContract, formatEther } from "../web3";
import { getTransactions } from "../utils/api";

export const Home = ({ address, role, onLogout }) => {
  const [balance, setBalance] = useState(0);
  const [recentTxns, setRecentTxns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      fetchBalance();
      fetchTransactions();
    }
  }, [address]);

  const fetchBalance = async () => {
    const contract = getCarbonCContract();
    const bal = await contract.balanceOf(address);
    setBalance(formatEther(bal));
  };

  const fetchTransactions = async () => {
    const { txns } = await getTransactions();
    setRecentTxns(txns.slice(0, 3)); // Show only 3 most recent
  };

  const navigateToDashboard = () => {
    switch(role) {
      case "CreditHolder":
        navigate("/creditor");
        break;
      case "Customer":
        navigate("/customer");
        break;
      case "Verifier":
        navigate("/verifier");
        break;
      default:
        navigate("/register");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to Carbon Marketplace</h1>
        <Button variant="outline" onClick={onLogout}>Logout</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Your Carbon Balance</h2>
          <p className="text-2xl font-bold">{balance} CC</p>
        </div>

        {/* Role Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Your Role</h2>
          <p className="text-2xl font-bold capitalize">
            {role === "CreditHolder" ? "Creditor" : role}
          </p>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <Button onClick={navigateToDashboard} className="w-full mb-2">
            Go to Dashboard
          </Button>
          {role === "CreditHolder" && (
            <Button variant="outline" className="w-full" onClick={() => navigate("/creditor/mint")}>
              Mint Tokens
            </Button>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <Button variant="ghost" onClick={() => navigate(`/${role.toLowerCase()}/transactions`)}>
            View All
          </Button>
        </div>
        
        {recentTxns.length > 0 ? (
          <div className="space-y-3">
            {recentTxns.map((tx, index) => (
              <div key={index} className="border p-4 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {tx.type} • {tx.from === address ? "Sent" : "Received"}
                  </span>
                  <span className={tx.from === address ? "text-red-500" : "text-green-500"}>
                    {tx.from === address ? "-" : "+"}{tx.amount} CC
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(tx.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No transactions yet</p>
        )}
      </div>

      {/* Role-Specific Tips */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
        {role === "CreditHolder" && (
          <ul className="list-disc pl-5 space-y-2">
            <li>Mint new carbon credits to your wallet</li>
            <li>Track your credit inventory and sales</li>
            <li>Verify customer purchases</li>
          </ul>
        )}
        {role === "Customer" && (
          <ul className="list-disc pl-5 space-y-2">
            <li>Purchase credits to offset your emissions</li>
            <li>View your transaction history</li>
            <li>Monitor your carbon footprint</li>
          </ul>
        )}
        {role === "Verifier" && (
          <ul className="list-disc pl-5 space-y-2">
            <li>Review pending transactions</li>
            <li>Verify legitimate carbon credit purchases</li>
            <li>Monitor marketplace activity</li>
          </ul>
        )}
      </div>
    </div>
  );
};