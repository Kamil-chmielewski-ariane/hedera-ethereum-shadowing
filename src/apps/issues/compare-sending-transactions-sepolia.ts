import { JsonRpcProvider, Transaction, TransactionRequest, TransactionResponse, Wallet, ethers } from "ethers";
import { AccountId, Client, EthereumTransaction, Hbar, PrivateKey, TransactionId } from "@hashgraph/sdk";
import { getRawTransaction } from "@/api/get-raw-transaction";
import { sendHbarToAlias } from "../shadowing/send-hbar-to-alias";
import { getTransactionErigon } from "@/api/get-transaction";

// const tableOfTxHash = [
//     "0x1009199f804a4c75d266627548dc154989eec8385c7b3a67e2bd50a5db5063c9",
//     "0xf610415432536b090f219ed834e71540a8a5a2967905efdcd02e55e35ed5958f",
//     "0x924fbeaac12d61557ebd0276ba68babcbb769adea3b09b1d5869a6a00246fdd5",
//     "0x76eda1c97fc2ce2bfc69cf300dfb28776446f05cc2a1d47c534640e94a7a27eb",
//     "0xd42e0945337a445dd1e93e8d77528b9174f66306574975a7ba4acd4ea57c357d",
//     "0x2974937220d8bfca08207824ff15462735570e9827c2584b84d37ae362adaa00",
//     "0x52dcba3e29b4c5060124b52f1356d6a6c57af3494f177282d22dec3b72c94d4b",
//     "0x4f7ff178327faffb2506707d9a2147b834cc417885f0ae45ca4c08a74ac2cfbd",
//     "0x1b352e76caf6851e23a5561f0ace599206d08e1db82a9d0ff0bcf33a35f28658",
//     "0xbd19856f9ad0bb31fae78d6317a4fea0a10410d1c35f44476cf919a6d9025406",
//     "0x8ccfebe033350f63ee49a429f6f783d982b6547df9fb3f927ad02ef73842f577",
//     "0x60e14f181e95a38a63fe74df356cde7cdcd80903d01b6f4023e14b221dead23e",
//     "0x775b6226b889c54bc2b384288dae51d33fd8c17b481697a590376970b290e268",
//     "0x8ae1f307db28c862a0d58a3172a95145abfedcc2fea629161a94b5eb94c24d1b",
//     "0x63ec523097c8b5c8fc51924a157125ea19d20930ca74387b29319ed6e20453d1",
//     "0x046c24ecf5f229913746807eaa3af74ab2a5605b3ad149b94ca855c51c27a4e3",
//     "0x69c029bfdfb8f0a70192efef3a911e0ac111183081ba8f53b5fb32d3b06b0841",
//     "0xaf85ca1eefae870ab64b65bb678564c1cf0ca8e71e946adbe66253f32c2c3124",
//     "0x75fee1a1be85202cfb2070f9a30f39239be06802a3c63a5b1a2bb0583e24ef01",
//     "0xbac95565a5846e984abe4be735a3ccd3924e423a2f26be3ebad8a63be9253b17",
//     "0x55490dd83c3c0ddfaaa02d7a70905447701db3d87beba8defb0a5c59da1043c0",
//     "0x91a2059d0ad7c841960bad4b8217af0f7a2f15eebc2308760c8c12058b2dfa21",
//     "0xb26b2e936044d5a60c129e03fdc3fac3d8e7f98c4c56c8f207eaaefe8519e608",
//     "0x4ea27538e04515f4eaec33794d44f7a1b89737a74b61e75774e4a6eddd2e031f",
//     "0x85e339d06c16000ed326c10bff2cdc6163c89ac4fea66e97c2cf4c29348e4016",
//     "0xb560462e14338322e2670883991e8bc687203c0980ce856e2d6d2ad2ef5538a4",
//     "0x3b53080a61d92bb19340cc68174506c2f355332bf9c9aa4fb3b2d3286ee2d9b6",
//     "0x47d9cd56fdf342a53b097ad4e7e048c489fb6bc419494016d723136af34b7a09",
//     "0xd19ee946a03db24f85147da06aef9f31f412259bb162aa215fbfb6803b4a9d87",
//     "0x8494952d2fc431833f81c870e6ba481bb499546640f235448617a514aba4726f",
//     "0x1d5703eb6b77205ec0c51d0087c8cc10854c9ced1b2dc635a74346cd62ce14a9",
//     "0xdbef18b126376681e192491dd5da3066f582ede08cd920c679d93ff160026b7e",
//     "0x7978bee18d79678cdf3d9b23cf8f165a5a3f0ea7a9051d431a64797c4e3b5250",
//     "0x7679570d96be0838fd86b6b53ec592ef5a6ffb047a2237b05ceb0b63470b6aec"
// ]

const tableOfTxHash = [
    "0x7afaa1366e0a6273b29a6d8d7c932e939dc681ef70dfdeed2fd1a66f582d000c",
    "0xca8b16fea090ff958938c0108ddf119d572692cb4c365bd2f157baefdc3c78cb",
    "0xd212c7375380654d8cff7bc1108108e9005373f6a63a837659b8c8bb2d7b0640",
    "0xc1923e125b41b7e61ce6c17fa2d675d079112c98f5c58f2757b005e1933c8e55",
    "0x70b559c2fa0f377cb82745851b05e561c1c16a6b4a56e050af036675747b79c4",
]

export async function sendTransactionSepolia(chainId: string, metamaskPrivateKey: string, sepoliaRpcUrl: string, type: number) {
    const provider = new ethers.JsonRpcProvider(sepoliaRpcUrl);
    const signer = new ethers.Wallet(metamaskPrivateKey, provider);
    const transactionHash = await signer.sendTransaction({
        from: "0xa701afD383E5c9f85a07A228a4837B2E31aDaC9a",
        to: "0x404c1F180e3D41167e83Ba7ef9C0cC3215C6B4Df",
        chainId: chainId,
        value: ethers.parseUnits("0.001"),
        type: type
    });
    console.log('transactionHash is ' + transactionHash.hash);
    return transactionHash.hash;
}

export async function sendTransactionHederaTestnet(chainId: string, hederaPrivateKey: string, hederaRpcUrl: string, type: number) {
    const provider = new ethers.JsonRpcProvider(hederaRpcUrl);
    const signer = new ethers.Wallet(hederaPrivateKey, provider);
    const transactionHash = await sendTransaction({
        from: "0x6038237195332cb437683ab4e6c35d9d147e1a14",
        to: "0x542125efa564a67c0d9be3297b214a85152d07b6",
        chainId: chainId,
        value: ethers.parseUnits("1"),
        type: type
    }, provider, signer, chainId);
    console.log('transactionHash is ' + transactionHash.hash);
    return transactionHash.hash;
}

export async function sendTransactionHederaLocalWithEthersjs(chainId: string, hederaPrivateKey: string, hederaRpcUrl: string, type: number) {
    const provider = new ethers.JsonRpcProvider(hederaRpcUrl, undefined, {batchMaxSize: 1});
    const signer = new ethers.Wallet(hederaPrivateKey, provider);
    const transactionHash = await sendTransaction({
        from: "0xe64fac7f3df5ab44333ad3d3eb3fb68be43f2e8c",
        to: "0xe64fac7f3df5ab44333ad3d3eb3fb68be43f2e8c",
        chainId: chainId,
        value: ethers.parseUnits("1"),
        type: type
    }, provider, signer, chainId);
    console.log('transactionHash is ' + transactionHash.hash);
    return transactionHash.hash;
}

// PUBLIC HEDERA
// leading 0 type 2
// leading 0 type legacy
// no leading type 2 
// no leading type legacy

export async function prepareAndSendTransactionFromSepoliaToHedera(txHash: string, hederaPrivateKey: string, hederaRpcUrl: string, accountId: AccountId, client: Client) {
    await sendHbarToAlias(accountId, "0xea1b261fb7ec1c4f2beea2476f17017537b4b507", 200, client);
    const transactionDataSepolia = await getTransactionErigon(txHash);
    if (transactionDataSepolia && transactionDataSepolia.type && transactionDataSepolia.type == "0x0") {
        console.log("SENDING LEGACY TRANSACTION IN PROGRESS....");
        const provider = new ethers.JsonRpcProvider(hederaRpcUrl);
        const signer = new ethers.Wallet(hederaPrivateKey, provider);
        const transactionHash = await signer.sendTransaction({
            from: "0xea1b261fb7ec1c4f2beea2476f17017537b4b507",
            to: "0xe64fac7f3df5ab44333ad3d3eb3fb68be43f2e8c",
            chainId: parseInt(String(transactionDataSepolia.chainId), 16),
            value: ethers.toBigInt(transactionDataSepolia.value),
            nonce: transactionDataSepolia.nonce,
            gasPrice: ethers.toBigInt(transactionDataSepolia.gasPrice),
            gasLimit: 21000,
            type: 0
        });
        console.log('transactionHash is ' + transactionHash.hash);
        return transactionHash.hash;
    }
    
}

export async function sendTransactionFromSepoliaToHedera(txHash: string, accountId: AccountId, client: Client, prKey: string) {
    await sendHbarToAlias(accountId, "0x404c1F180e3D41167e83Ba7ef9C0cC3215C6B4Df", 200, client);
    await createEthereumTransaction({txHash: txHash, gas: 100}, accountId, client, prKey);
}

export async function sendTransactionHedera(accountId: AccountId, client: Client, prKey: string) {
	// await sendHbarToAlias(accountId, "0xa701afD383E5c9f85a07A228a4837B2E31aDaC9a", 200, client); // type 2
	// await sendHbarToAlias(accountId, "0xe64FAC7f3DF5aB44333ad3D3Eb3fB68Be43F2E8C", 200, client); // type legacy
	// await sendHbarToAlias(accountId, "0xeA1B261FB7Ec1C4F2BEeA2476f17017537b4B507", 200, client); // type legacy
    await createEthereumTransaction(
        {
            txHash: "0x7afaa1366e0a6273b29a6d8d7c932e939dc681ef70dfdeed2fd1a66f582d000c",
            gas: 100,
        },
        accountId,
        client,
        prKey
    );
    // for (const txHash of tableOfTxHash) {
    //     await createEthereumTransaction(
    //         {
    //             txHash: txHash,
    //             gas: 100,
    //         },
    //         accountId,
    //         client,
    //         prKey
    //     );
    // }
    
}

async function createEthereumTransaction(transactionData: {txHash: string, gas: number}, accountId: AccountId, client: Client, prKey: string) {
	// const rawBody = await getRawTransaction(
	// 	transactionData.txHash
	// );
    const rawBody = "0xf86b048503ff9aca0782520f94e64fac7f3df5ab44333ad3d3eb3fb68be43f2e8c830fffff808401546d71a026cf0758fda122862a4de71a82a3210ef7c172ee13eae42997f5d32b747ec78ca03587c5c2eee373b1e45693544edcde8dde883d2be3e211b3f0f3c840d6389c8a";
	const txId = TransactionId.generate(accountId);
    console.log(rawBody);
    console.log(rawBody.substring(2));
	const transaction = await new EthereumTransaction()
		.setTransactionId(txId)
		.setEthereumData(Uint8Array.from(Buffer.from(rawBody.substring(2), 'hex')))
		.setMaxGasAllowanceHbar(new Hbar(transactionData.gas))
		.freezeWith(client)
		.sign(PrivateKey.fromStringDer(String("302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137")));
	const txResponse = await transaction.execute(client);

	console.log('txResponse', txResponse.toJSON());
}

async function sendTransaction(tx: TransactionRequest, provider: JsonRpcProvider, signer: Wallet, chainId: string): Promise<TransactionResponse> {
    const pop = await signer.populateTransaction(tx);
    console.log(pop.chainId);
    pop.chainId = chainId;
    console.log(pop.chainId);
    delete pop.from;
    const txObj = Transaction.from(pop);
    return await provider.broadcastTransaction(await signer.signTransaction(txObj));
}
