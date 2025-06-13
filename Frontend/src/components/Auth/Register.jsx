import { useState } from "react";
import { Button } from "../ui/Button";
import { setUserRole } from "../../utils/api";

export const Register = ({ address, onRegister }) => {
  const [selectedRole, setSelectedRole] = useState("");

  const handleRegister = async () => {
    if (!selectedRole) {
      alert("Please select a role");
      return;
    }

    try {
      // Set role in backend
      await setUserRole(address, selectedRole);
      
      // Set role in blockchain (optional)
      // const contract = getRegistryContract(await getSigner());
      // await contract[`register${selectedRole}`](address);
      
      onRegister(selectedRole);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Complete Registration</h2>
      <p className="mb-6">Connected wallet: {address}</p>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-center">
          <input
            type="radio"
            id="customer"
            checked={selectedRole === "Customer"}
            onChange={() => setSelectedRole("Customer")}
          />
          <label htmlFor="customer" className="ml-2">Customer</label>
        </div>
        
        <div className="flex items-center">
          <input
            type="radio"
            id="creditor"
            checked={selectedRole === "CreditHolder"}
            onChange={() => setSelectedRole("CreditHolder")}
          />
          <label htmlFor="creditor" className="ml-2">Credit Holder</label>
        </div>
        
        <div className="flex items-center">
          <input
            type="radio"
            id="verifier"
            checked={selectedRole === "Verifier"}
            onChange={() => setSelectedRole("Verifier")}
          />
          <label htmlFor="verifier" className="ml-2">Verifier</label>
        </div>
      </div>
      
      <Button onClick={handleRegister}>Complete Registration</Button>
    </div>
  );
};