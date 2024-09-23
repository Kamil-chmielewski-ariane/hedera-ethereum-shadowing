## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Storage.s.sol:StorageScript --rpc-url <your_rpc_url> --private-key <your_private_key> --broadcast
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

# Hedera smart contract 

``` shell
cast send 0xd314effaa94b02ccc5c02194e6ea3e8052c48f2d "store(uint256)" 256 --rpc-url http://localhost:7546 --private-key 0xeae4e00ece872dd14fb6dc7a04f390563c7d69d16326f2a703ec8e0934060cc7
```

# Sepolia smart contract
``` shell
cast send 0x4452d56aba7907e92936d7ade0151be5c57f09a1 "store(uint256)" 256 --rpc-url https://rpc2.sepolia.org --private-key <private-key>
```


