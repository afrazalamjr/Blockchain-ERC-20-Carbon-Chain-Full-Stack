import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import AuthPage from './Pages/AuthPage';
import { CreditorPage } from './Pages/Creditor';
import { CustomerPage } from './pages/Customer';
import { VerifierPage } from './Pages/Verifier';
import { getUserInfo } from './utils/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const address = localStorage.getItem('walletAddress');
      if (address) {
        try {
          const { user } = await getUserInfo(address);
          if (user) {
            setUser({ address, role: user.role });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('walletAddress');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/auth"
          element={
            user ? <Navigate to={`/${user.role.toLowerCase()}`} /> : <AuthPage onAuthComplete={setUser} />
          }
        />
        <Route
          path="/creditor"
          element={
            user?.role === 'CreditHolder' ? <CreditorPage address={user.address} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/customer"
          element={
            user?.role === 'Customer' ? <CustomerPage address={user.address} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/verifier"
          element={
            user?.role === 'Verifier' ? <VerifierPage address={user.address} /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
