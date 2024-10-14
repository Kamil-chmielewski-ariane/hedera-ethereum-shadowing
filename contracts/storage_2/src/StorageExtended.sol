// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract StorageExtended {
    string public text = "Hello";
    uint256 public number;
    uint256 public num = 123;
    uint256[] public arr;
    uint256[] public arr2 = [1, 2, 3];
    mapping(address => uint256) public myMap;
    // Nested mapping (mapping from address to another mapping)
    mapping(address => mapping(uint256 => bool)) public nested;
    address public owner;

    constructor(){
        owner = msg.sender;
    }

    function getNested(address _addr1, uint256 _i) public view returns (bool) {
        // You can get values from a nested mapping
        // even when it is not initialized
        return nested[_addr1][_i];
    }

    function setNested(address _addr1, uint256 _i, bool _boo) public {
        nested[_addr1][_i] = _boo;
    }

    function removeNested(address _addr1, uint256 _i) public {
        delete nested[_addr1][_i];
    }


    function get(address _addr) public view returns (uint256) {
        // Mapping always returns a value.
        // If the value was never set, it will return the default value.
        return myMap[_addr];
    }

    function set(address _addr, uint256 _i) public {
        // Update the value at this address
        myMap[_addr] = _i;
    }

    function remove(address _addr) public {
        // Reset the value to the default value.
        delete myMap[_addr];
    }

    function push(uint256 i) public {
        // Append to array
        // This will increase the array length by 1.
        arr.push(i);
    }

    function pop() public {
        // Remove last element from array
        // This will decrease the array length by 1
        arr.pop();
    }


    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }
}
