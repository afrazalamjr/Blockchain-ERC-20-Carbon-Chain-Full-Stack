import React from "react";
import Navbar from "./Navbar";

const Creditor = () => {
    return (
        <div style={{ fontFamily: "Arial, sans-serif" }}>
            {/* Navbar at the top */}
            <Navbar />
            
            {/* Content below the navbar */}
            <div style={{ padding: "20px", textAlign: "center" }}>
                <h2>Welcome, Creditor!</h2>
                <p style={styles.paragraph}>
                    You are now connected as a creditor. Here you can manage your credits and view your balances.
                </p>
                <p style={styles.paragraph}>
                    If you wish to add or withdraw tokens, please use the options in the sidebar.
                </p>
            </div>
        </div>
    );
};

const styles = {

    Navbar:{
        marginTop: "0px"
    },
    paragraph: {
        fontSize: "16px",
        color: "#2c3e50",
        marginTop: "10px",
    },
};

export default Creditor;
