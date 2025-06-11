import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SignUp from './SignUp';

const Login = ({ setAccount, setRole }) => {
  const [selectedRole, setSelectedRole] = useState(''); // Stores selected role
  const [isLoading, setIsLoading] = useState(false); // Tracks MetaMask connection state
  const navigate = useNavigate(); // To programmatically navigate between routes

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed. Please install it.');

      setIsLoading(true);

      // Request accounts from MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const walletAddress = accounts[0];
      setAccount(walletAddress);

      // Check if the user exists in the backend
      const response = await axios.get(`http://localhost:3000/user/${walletAddress}`);

      if (response.data) {
        // User exists, navigate based on their role
        const { role } = response.data;
        setRole(role);
        navigate(`/${role}`);
      } else {
        // If user doesn't exist, move to register

        
        navigate(`/${SignUp}`);
      }
    } catch (error) {
      console.error('MetaMask connection or registration failed:', error.message);
      alert('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnter = () => {
    if (!selectedRole) {
      alert('Please select a role before proceeding.');
      return;
    }
    setRole(selectedRole); // Update role in the parent App component
    setAccount('dummyAccount'); // Simulate setting a MetaMask account
    navigate(`/${selectedRole}`); // Navigate to the role-based route
  };

  const navigateToSignUp = () => {
    navigate('/signup'); // Navigate to the SignUp page
  };

  return (
    <div>
      <h1>Login</h1>
      <label>
        Select Your Role:
        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
          <option value="">Choose Role</option>
          <option value="customer">Customer</option>
          <option value="creditor">Creditor</option>
        </select>
      </label>
      <button onClick={connectWallet} disabled={isLoading}>
        {isLoading ? 'Connecting...' : 'Connect with MetaMask'}
      </button>
      <button onClick={navigateToSignUp}>
        SignUp
      </button>
    </div>
  );
};

export default Login;
