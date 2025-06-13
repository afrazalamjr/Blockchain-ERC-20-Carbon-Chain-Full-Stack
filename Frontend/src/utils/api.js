const API_URL = "http://localhost:5001/api";

export const requestNonce = async (address) => {
  const response = await fetch(`${API_URL}/auth/request-nonce`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address })
  });
  return await response.json();
};

export const verifySignature = async (address, signature) => {
  const response = await fetch(`${API_URL}/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, signature })
  });
  return await response.json();
};

export const setUserRole = async (address, role) => {
  const response = await fetch(`${API_URL}/user/set-role`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, role })
  });
  return await response.json();
};

export const getUserInfo = async (address) => {
  const response = await fetch(`${API_URL}/user/${address}`);
  return await response.json();
};

export const createTransaction = async (txnData) => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(txnData)
  });
  return await response.json();
};

export const getTransactions = async () => {
  const response = await fetch(`${API_URL}/transactions`);
  return await response.json();
};