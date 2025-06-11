
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Registry {
    struct Verifier {
        address VerifierAdd;
        bool isVerifier;
        uint256 registeredAt;
    }

    struct Customer {
        address CustomerAdd;
        bool isCustomer;
        uint256 registeredAt;
    }

    struct CreditHolder {
        address CreditHolderAdd;
        bool isCreditHolder;
        uint256 registeredAt;
    }

    mapping(address => Verifier) public verifiers;
    mapping(address => Customer) public customers;
    mapping(address => CreditHolder) public creditHolders;

    modifier onlyVerifier() {
        require(verifiers[msg.sender].isVerifier, "Only verifiers can call this function");
        _;
    }

   

    function registerVerifier(address _verifier) external {
        require(!verifiers[_verifier].isVerifier, "Already registered");
        verifiers[_verifier] = Verifier(_verifier, true, block.timestamp);
    }

    function registerCustomer(address _customer) external {
        require(!customers[_customer].isCustomer, "Already registered");
        customers[_customer] = Customer(_customer, true, block.timestamp);
    }

    function registerCreditHolder(address _creditHolder) external onlyVerifier {
        require(!creditHolders[_creditHolder].isCreditHolder, "Already registered");
        creditHolders[_creditHolder] = CreditHolder(_creditHolder, true, block.timestamp);
    }

    function isVerifier(address _verifier) external view returns (bool) {
        return verifiers[_verifier].isVerifier;
    }

    function isCreditHolder(address _creditHolder) external view returns (bool) {
        return creditHolders[_creditHolder].isCreditHolder;
    }

    function isCustomer(address _customer) external view returns (bool) {
        return customers[_customer].isCustomer;
    }
}