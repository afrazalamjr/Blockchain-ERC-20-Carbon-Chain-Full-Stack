import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!walletAddress || !role) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      setIsLoading(true);

      // Make API request to register the user
      await axios.post('http://localhost:3000/user', {
        walletAddress,
        role,
      });

      alert('Sign-up successful! Redirecting to login...');
      navigate('/'); // Redirect to the login page or desired route
    } catch (error) {
      console.error('Sign-up failed:', error.message);
      alert('Sign-up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <label>
          Wallet Address:
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter your wallet address"
            required
          />
        </label>
        <br />
        <label>
          Select Your Role:
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Choose Role</option>
            <option value="customer">Customer</option>
            <option value="creditor">Creditor</option>
          </select>
        </label>
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
