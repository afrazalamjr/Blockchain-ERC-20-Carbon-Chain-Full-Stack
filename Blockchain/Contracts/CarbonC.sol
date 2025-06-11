
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Registry.sol";

contract CarbonC {
    string public name = "CarbonToken";
    string public symbol = "CC";
    uint256 public totalSupply = 1000000;
    
    Registry public registry;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 amount);

    constructor(address _registryAddress) {
        registry = Registry(_registryAddress);
        balanceOf[msg.sender] = totalSupply;
    }

    modifier onlyCreditHolder() {
        require(registry.isCreditHolder(msg.sender), "Only credit holder can call this function");
        _;
    }

    modifier onlyVerifier() {
        require(registry.isVerifier(msg.sender), "Only verifier can call this function");
        _;
    }

    /// @notice Mints new tokens to a specified address
    /// @param _to The address to receive the new tokens
    /// @param _amount The amount of tokens to mint
    /// @return success Returns true if the operation was successful
    function mint(address _to, uint256 _amount) public returns (bool success) {
        totalSupply += _amount;
        balanceOf[_to] += _amount;
        emit Mint(_to, _amount);
        return true;
    }

    /// @notice Transfers tokens from the caller's address to another address
    /// @param _to The address of the recipient
    /// @param _value The amount of tokens to transfer
    /// @return success Returns true if the operation was successful
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "Cannot transfer to the zero address");
        require(_value <= balanceOf[msg.sender], "Not enough balance");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    /// @notice Approves another address to spend tokens on behalf of the caller
    /// @param _spender The address authorized to spend
    /// @param _value The maximum amount of tokens that can be spent
    /// @return success Returns true if the operation was successful
    function approve(address _spender, uint256 _value) public returns (bool success) {
        require(_spender != address(0), "Cannot approve the zero address");

        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /// @notice Transfers tokens from one address to another using an allowance
    /// @param _from The address from which tokens are transferred
    /// @param _to The address of the recipient
    /// @param _value The amount of tokens to transfer
    /// @return success Returns true if the operation was successful
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "Cannot transfer to the zero address");
        require(_value <= balanceOf[_from], "Not enough balance");
        require(_value <= allowance[_from][msg.sender], "Allowance exceeded");
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    /// @notice Gets the balance of the specified address
    /// @param _owner The address to query the balance of
    /// @return balance Returns the balance of the specified address
    function getbalanceOf(address _owner) public view returns (uint256 balance) {
        return balanceOf[_owner];
    }

    /// @notice Gets the current allowance for a spender on behalf of an owner
    /// @param _owner The address of the token owner
    /// @param _spender The address of the spender
    /// @return remaining Returns the remaining amount of tokens the spender is allowed to spend
    function getallowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowance[_owner][_spender];
    }
}
