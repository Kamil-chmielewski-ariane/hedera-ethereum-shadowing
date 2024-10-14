// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/StorageExtended.sol";
import {Script, console} from "forge-std/Script.sol";

contract StorageExtendedScript is Script {
    StorageExtended public counter;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        counter = new StorageExtended();

        vm.stopBroadcast();
    }
}
