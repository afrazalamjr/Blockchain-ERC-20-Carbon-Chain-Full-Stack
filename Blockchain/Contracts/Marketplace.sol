// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CarbonC.sol";
import "./Registry.sol";

contract Marketplace {
    struct Transaction {
        address customer;
        address creditHolder;
        uint256 tokenAmount;
        uint256 energyUnits;
        uint256 timestamp;
        bool verified;
    }

    CarbonC public carbonToken;
    Registry public registry;
    mapping(uint256 => Transaction) public transactions;
    mapping(address => uint256[]) public customerTransactions;
    mapping(address => uint256[]) public creditHolderTransactions;

    uint256 public nextTransactionId;

    event TransactionRecorded(
        uint256 indexed transactionId,
        address indexed creditor,
        address indexed customer,
        address creditHolder,
        uint256 tokenAmount,
        uint256 energyUnits
    );
    event TransactionVerified(uint256 indexed transactionId, bool verified);

    constructor(address _carbonToken, address _registry) {
        carbonToken = CarbonC(_carbonToken);
        registry = Registry(_registry);
        nextTransactionId = 1;
    }

    modifier onlyVerifier() {
        require(registry.isVerifier(msg.sender), "Only verifiers can call this function");
        _;
    }

    modifier onlyCustomer() {
        require(registry.isCustomer(msg.sender), "Only customers can call this function");
        _;
    }

    modifier onlyCreditHolder() {
        require(registry.isCreditHolder(msg.sender), "Only credit holders can call this function");
        _;
    }

    function createTokens(address _to, uint256 _amount) public onlyCreditHolder {
        require(carbonToken.mint(_to, _amount), "Token minting failed");
    }

    function calculateCarbonCredits(uint256 emissions) public pure returns (uint256) {
        uint256 factor = 5000;
        return (emissions * factor) / 10000; // Corrected to match the divisor in the question.
    }

    function buyCarbonCredits(uint256 emissions, address creditHolder) public payable onlyCustomer {
        uint256 creditsNeeded = calculateCarbonCredits(emissions);
       
      

        uint256 transactionId = nextTransactionId++;
        transactions[transactionId] = Transaction({
            customer: msg.sender,
            creditHolder: creditHolder,
            tokenAmount: creditsNeeded,
            energyUnits: emissions,
            timestamp: block.timestamp,
            verified: false
        });

        customerTransactions[msg.sender].push(transactionId);
        creditHolderTransactions[creditHolder].push(transactionId);

        emit TransactionRecorded(transactionId, msg.sender, msg.sender, creditHolder, creditsNeeded, emissions);
    }

   function verifyAndCompletePurchase(uint256 transactionId) public onlyCreditHolder {
    Transaction storage txn = transactions[transactionId];
    
    // Check that the transaction has not already been verified
    require(!txn.verified, "Transaction already verified");

    // Ensure that the credit holder is verifying their own transaction
    require(txn.creditHolder == msg.sender, "Only the credit holder can verify this transaction");

    uint256 creditsNeeded = txn.tokenAmount;

    // Check that the credit holder has enough balance
    require(carbonToken.balanceOf(txn.creditHolder) >= creditsNeeded, "Credit holder does not have enough carbon credits");

    // Check that the recipient is not the zero address
    require(txn.customer != address(0), "Cannot transfer to the zero address");
    
    // Transfer the tokens from the credit holder to the customer
    carbonToken.transferFrom(txn.creditHolder,txn.customer, creditsNeeded);

    // Mark the transaction as verified
    txn.verified = true;
    
    // Emit an event that the transaction has been verified
    emit TransactionVerified(transactionId, true);
}


    function getAllTransactions() public view returns (Transaction[] memory) {
        Transaction[] memory allTransactions = new Transaction[](nextTransactionId - 1);

        for (uint256 i = 1; i < nextTransactionId; i++) {
            allTransactions[i - 1] = transactions[i];
        }

        return allTransactions;
    }
}