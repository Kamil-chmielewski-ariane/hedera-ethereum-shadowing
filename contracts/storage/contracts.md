# #1 State comparison state case: Same states - contract address for sepolia will be 0x5b000f50d4272f0874573e9365d0cbb386235ead and for hedera 0x50887fcc55040f4bc302c8add72cb6286d1fd838

Deployment to sepolia

```shell
$ forge script script/Storage.s.sol:StorageScript --rpc-url https://rpc2.sepolia.org --private-key <your_sepolia_private_key> --broadcast
```

Deployment to hedera

```shell
$ forge script script/Storage.s.sol:StorageScript --rpc-url http://localhost:7546 --private-key <your_hedera_private_key> --broadcast
```

Send transaction to contracts sepolia
```shell
$ cast send <contract_address> "store(uint256)" 256 --rpc-url https://rpc2.sepolia.org --private-key <your_sepolia_private_key> 

$ cast send <contract_address> "set(address, uint256)" 0x1234567890123456789012345678901234567890 256 --rpc-url https://rpc2.sepolia.org --private-key <your_sepolia_private_key> 

$ cast send <contract_address> "set(address, uint256)" 0x1234567890123456789012345678901234567891 512 --rpc-url https://rpc2.sepolia.org --private-key <your_sepolia_private_key> 

$ cast send <contract_address> "remove(address)" 0x1234567890123456789012345678901234567890 --rpc-url https://rpc2.sepolia.org --private-key <your_sepolia_private_key> 
```

Send transaction to contracts hedera
```shell
$ cast send <contract_address> "store(uint256)" 256 --rpc-url http://localhost:7546 --private-key <your_hedera_private_key> 

$ cast send <contract_address> "set(address, uint256)" 0x1234567890123456789012345678901234567890 256 --rpc-url http://localhost:7546 --private-key <your_hedera_private_key> 

$ cast send <contract_address> "set(address, uint256)" 0x1234567890123456789012345678901234567890 512 --rpc-url http://localhost:7546 --private-key <your_hedera_private_key> 

$ cast send <contract_address> "remove(address)" 0x1234567890123456789012345678901234567890 --rpc-url http://localhost:7546 --private-key <your_hedera_private_key> 
```


# #2 State comparison state case: One state more in hedera -> hedera contract 0x65f1ac5c7ad89d830451772423871f253800ae14 and sepolia 0x1362dc92648f47a294a033892e8c7a67d37ed318

Deployment to sepolia

```shell
$ forge script script/Storage.s.sol:StorageScript --rpc-url https://rpc2.sepolia.org --private-key <your_sepolia_private_key> --broadcast
```

Deployment to hedera

```shell
$ forge script script/Storage.s.sol:StorageScript --rpc-url http://localhost:7546 --private-key <your_hedera_private_key> --broadcast
```

Send transaction to contracts sepolia
```shell
$ cast send <contract_address> "store(uint256)" 256 --rpc-url https://rpc2.sepolia.org --private-key <your_sepolia_private_key> 

$ cast send <contract_address> "set(address, uint256)" 0x1234567890123456789012345678901234567890 256 --rpc-url https://rpc2.sepolia.org --private-key <your_sepolia_private_key> 

$ cast send <contract_address> "set(address, uint256)" 0x1234567890123456789012345678901234567891 512 --rpc-url https://rpc2.sepolia.org --private-key <your_sepolia_private_key> 

$ cast send <contract_address> "remove(address)" 0x1234567890123456789012345678901234567890 --rpc-url https://rpc2.sepolia.org --private-key <your_sepolia_private_key> 
```

Send transaction to contracts hedera
```shell
$ cast send <contract_address> "store(uint256)" 256 --rpc-url http://localhost:7546 --private-key <your_hedera_private_key> 

$ cast send <contract_address> "set(address, uint256)" 0x1234567890123456789012345678901234567890 256 --rpc-url http://localhost:7546 --private-key <your_hedera_private_key> 

$ cast send <contract_address> "set(address, uint256)" 0x1234567890123456789012345678901234567890 512 --rpc-url http://localhost:7546 --private-key <your_hedera_private_key>
```