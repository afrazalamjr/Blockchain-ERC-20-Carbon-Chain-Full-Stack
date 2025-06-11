import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";

const Navbar = () => {
    const [walletAddress, setWalletAddress] = useState("Not Connected");
    const [tokens, setTokens] = useState(0);

    // Connect to MetaMask
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []); // Request wallet connection
                const signer = provider.getSigner();
                const address = await signer.getAddress(); // Get the wallet address
                setWalletAddress(address);
                // Fetch tokens associated with the wallet from backend
                const response = await axios.get(`http://localhost:3000/user/${address}`);
                setTokens(response.data.tokens);
            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this feature.");
        }
    };

    // Auto-connect if wallet is already connected
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    // Fetch tokens associated with the wallet
                    axios.get(`http://localhost:3000/user/${accounts[0]}`).then((response) => {
                        setTokens(response.data.tokens);
                    });
                }
            });
        }
    }, []);

    return (
        <nav style={styles.navbar}>
            <h1 style={styles.title}> Dashboard</h1>
            <div style={styles.walletInfo}>
                <p style={styles.walletAddress}>{walletAddress}</p>
                <p style={styles.tokens}>Tokens: {tokens}</p>
                <button style={styles.button} onClick={connectWallet}>
                    {walletAddress === "Not Connected" ? "Connect Wallet" : "Wallet Connected"}
                </button>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: "#2c3e50",
        padding: "10px 20px",
        color: "#ecf0f1",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
    },
    title: {
        margin: "0",
        fontSize: "24px",
    },
    walletInfo: {
        display: "flex",
        alignItems: "center",
    },
    walletAddress: {
        marginRight: "10px",
        fontWeight: "bold",
        fontSize: "16px",
    },
    tokens: {
        marginRight: "20px",
        fontSize: "16px",
    },
    button: {
        padding: "8px 16px",
        fontSize: "16px",
        backgroundColor: "#3498db",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
    },
};

export default Navbar;
