// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Minimal, non-custodial anchor for Aegis action receipts.
contract AegisAnchor {
    address public immutable operator;
    mapping(bytes32 => uint64) public anchoredAt;

    event ActionAnchored(bytes32 indexed actionHash, address indexed actor, uint64 timestamp);

    constructor(address operator_) {
        require(operator_ != address(0), "operator is zero");
        operator = operator_;
    }

    function anchor(bytes32 actionHash) external {
        require(actionHash != bytes32(0), "hash is zero");
        require(anchoredAt[actionHash] == 0, "already anchored");
        uint64 timestamp = uint64(block.timestamp);
        anchoredAt[actionHash] = timestamp;
        emit ActionAnchored(actionHash, msg.sender, timestamp);
    }
}

