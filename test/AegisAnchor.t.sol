// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AegisAnchor} from "../src/AegisAnchor.sol";

contract AegisAnchorTest {
    function testStoresActionHash() public {
        AegisAnchor anchor = new AegisAnchor(address(this));
        bytes32 actionHash = keccak256("aegis-action-1");
        anchor.anchor(actionHash);
        require(anchor.anchoredAt(actionHash) != 0, "timestamp missing");
    }

    function testRejectsDuplicateHash() public {
        AegisAnchor anchor = new AegisAnchor(address(this));
        bytes32 actionHash = keccak256("aegis-action-2");
        anchor.anchor(actionHash);
        (bool ok,) = address(anchor).call(abi.encodeCall(anchor.anchor, (actionHash)));
        require(!ok, "duplicate accepted");
    }
}

