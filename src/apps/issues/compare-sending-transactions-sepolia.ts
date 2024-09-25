import { ethers } from "ethers";

export async function sendTransactionSepolia(chainId: string, metamaskPrivateKey: string, sepoliaRpcUrl: string) {
    const provider = new ethers.JsonRpcProvider(sepoliaRpcUrl);
    const signer = new ethers.Wallet(metamaskPrivateKey, provider);
    const transactionHash = await signer.sendTransaction({
        from: "0xa701afD383E5c9f85a07A228a4837B2E31aDaC9a",
        to: "0x404c1F180e3D41167e83Ba7ef9C0cC3215C6B4Df",
        chainId: chainId,
        value: ethers.parseUnits("0.001")
        });
    console.log('transactionHash is ' + transactionHash.hash);
}

export async function sendTransactionHedera(chainId: string, privateKey: string, hederaRpcUrl: string) {
    console.log(hederaRpcUrl);
    const provider = new ethers.JsonRpcProvider(hederaRpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);
    const transactionHash = await signer.sendTransaction({
        from: "0xcdaD5844f865F379beA057fb435AEfeF38361B68",
        to: "0x6e5D3858f53FC66727188690946631bDE0466B1A",
        chainId: chainId,
        value: ethers.parseUnits("1")
        });
    console.log('transactionHash is ' + transactionHash.hash);
}