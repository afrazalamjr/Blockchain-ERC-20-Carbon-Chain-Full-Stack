import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Carbon Credits Marketplace</h1>
      <p className="text-xl mb-8 max-w-2xl">
        A decentralized platform for trading verified carbon credits to offset emissions
      </p>
      <button
        onClick={() => navigate('/auth')}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg"
      >
        Connect Wallet
      </button>
    </div>
  );
}