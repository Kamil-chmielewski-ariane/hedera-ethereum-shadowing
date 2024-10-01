A script was created using TypeScript and Node.js, whose purpose is to extract the raw transaction hex from a provided transaction hash (txn hash).

The function takes a parameter transactionToken, which represents the transaction hash (txn hash).
Using the getTransaction function, we retrieve an object based on the provided transaction hash.
We then assign the elements retrieved from the getTransaction function to two objects: unsignedTx and signature.
Finally, using the serializeTransaction function, we serialize the unsignedTx and signature objects into a hex string format.

1. Initialize a Hedera local node based on the genesis block -> Create a function for minting tokens based on the balance of a given account -> The local Hedera node should have debugging enabled

2. Fetch all transactions from block n

3. For each transaction in the block, check if the account from which the transaction was executed exists:
   - If no, create the account
   - If yes, ignore
4. Get the getRawTransactionBody from Erigon
5. Send the getRawTransaction to the Hedera local node
6. Handle the block reward
7. Repeat for block n + 1

- Check how to increase the gas price in the local node -> Priority, we cannot proceed without this.
- Check if there are any issues with transactions after increasing the gas price.
- Handle the refund of the fee after a transaction is executed.
- Handle the distribution of the block reward after creating the next block.
- Find an RPC method to check if a given account exists.

## Setup tunnel to the Node VM

1. Set env variable with remote host
```bash
export TUNNEL_HOST=user@IP_ADDR
```

2. Setup SSH tunnel
```bash
ssh -L  8080:localhost:8080 -fN $TUNNEL_HOST && \
ssh -L  9545:localhost:9545 -fN $TUNNEL_HOST && \
ssh -L  5600:localhost:5600 -fN $TUNNEL_HOST && \
ssh -L  5551:localhost:5551 -fN $TUNNEL_HOST && \
ssh -L  7546:localhost:7546 -fN $TUNNEL_HOST && \
ssh -L  50211:localhost:50211 -fN $TUNNEL_HOST
```
