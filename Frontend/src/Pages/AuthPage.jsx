import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSigner } from '../web3';
import { requestNonce, setUserRole, getUserInfo } from '../utils/api';

export default function AuthPage({ onAuthComplete }) {
  const [step, setStep] = useState('connect'); // 'connect' or 'register'
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    setLoading(true);
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();

      // Check if user exists
      const { user } = await getUserInfo(address);
      
      if (user) {
        // User exists - log them in
        localStorage.setItem('walletAddress', address);
        onAuthComplete({ address, role: user.role });
        navigate(`/${user.role.toLowerCase()}`);
      } else {
        // New user - proceed to registration
        setStep('register');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      alert('Authentication failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }

    setLoading(true);
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();

      // Set role in database
      await setUserRole(address, selectedRole);
      
      // Complete authentication
      localStorage.setItem('walletAddress', address);
      onAuthComplete({ address, role: selectedRole });
      navigate(`/${selectedRole.toLowerCase()}`);
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {step === 'connect' ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Connect Wallet</h2>
            <button
              onClick={handleConnect}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Connect with MetaMask'}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Complete Registration</h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="customer"
                  checked={selectedRole === 'Customer'}
                  onChange={() => setSelectedRole('Customer')}
                  className="mr-2"
                />
                <label htmlFor="customer">Customer (Buy carbon credits)</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="creditor"
                  checked={selectedRole === 'CreditHolder'}
                  onChange={() => setSelectedRole('CreditHolder')}
                  className="mr-2"
                />
                <label htmlFor="creditor">Credit Holder (Sell carbon credits)</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="verifier"
                  checked={selectedRole === 'Verifier'}
                  onChange={() => setSelectedRole('Verifier')}
                  className="mr-2"
                />
                <label htmlFor="verifier">Verifier (Validate transactions)</label>
              </div>
            </div>
            <button
              onClick={handleRegister}
              disabled={loading || !selectedRole}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}