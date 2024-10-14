// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/StorageExtended.sol";
import {Test, console} from "forge-std/Test.sol";

contract StorageExtendedTest is Test {
    StorageExtended public counter;

    function setUp() public {
        counter = new StorageExtended();
        counter.setNumber(0);
    }

}
