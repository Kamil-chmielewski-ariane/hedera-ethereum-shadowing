[//]: # (## Setup tunnel to the Node VM)

[//]: # ()
[//]: # (1. Set env variable with remote host)

[//]: # (```bash)

[//]: # (export TUNNEL_HOST=user@IP_ADDR)

[//]: # (```)

[//]: # ()
[//]: # (2. Setup SSH tunnel)

[//]: # (```bash)

[//]: # (ssh -L  8080:localhost:8080 -fN $TUNNEL_HOST && \)

[//]: # (ssh -L  9545:localhost:9545 -fN $TUNNEL_HOST && \)

[//]: # (ssh -L  5600:localhost:5600 -fN $TUNNEL_HOST && \)

[//]: # (ssh -L  5551:localhost:5551 -fN $TUNNEL_HOST && \)

[//]: # (ssh -L  7546:localhost:7546 -fN $TUNNEL_HOST && \)

[//]: # (ssh -L  50211:localhost:50211 -fN $TUNNEL_HOST)

[//]: # (```)

# Hedera Shadowing

Goal of Hedera shadowing is research the Hedera EVM and Ethereum EVM equivalence.
Script achieve this re-executing all Ethereum transaction on by one on local Hedera network. Each transaction is verified by states match 

## Recommend tools
* [Hedera local node](https://github.com/hashgraph/hedera-local-node)
* [Eirgon api](https://erigon.gitbook.io/erigon/basic-usage/getting-started)

## Requirements
* [Node.js](https://nodejs.org/en) >= 22.x
* [PNPM](https://pnpm.io/) >= 9.x
* [Docker](https://www.docker.com/) > 24.x
* [Docker Compose](https://docs.docker.com/compose/) > 2.22.0
* [PM2](https://pm2.keymetrics.io/) - Optional
* Minimum 16GB RAM

## Usage

Create a ```.env``` file in the root of project and add all variables as in ```.env.example```. Api key for ```OPERATOR_PRIVATE``` is in this article
[@hashgraph/sdk - client](https://docs.hedera.com/hedera/sdks-and-apis/sdks/client)

Add ```logs``` directory in the root of the project for logs

````
OPERATOR_PRIVATE="OPERATOR_PRIVATE"
````

## Instalation

To run this project you have first download and install all require packages and turn on the hedera local node tool. Also connection to erigon api is required for the app to work.

##### PNPM

```
pnpm install
```

```pnpm run dev``` to start shadowing app

##### PM2 - Optional

You can also run this app using pm2 tool. The config file is a ```ecosystem.config.js```

```
pm2 start ecosystem.config.js
```

#### Creating logs

The hedera shadowing app is always creating logs for
   - Errors
   - Blocks with transactions
