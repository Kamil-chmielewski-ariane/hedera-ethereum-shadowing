import { getRawTransaction } from "@/api/get-raw-transaction";
import { ethers } from "ethers";

export async function createEthereumTransaction() {
    const rawBody = await getRawTransaction(
		"0xc1923e125b41b7e61ce6c17fa2d675d079112c98f5c58f2757b005e1933c8e55"
	);
    const etherTransaciton = ethers.Transaction.from(rawBody);
    console.log(etherTransaciton.chainId);
    console.log(JSON.stringify(etherTransaciton));

    const rawBodyType2 = await getRawTransaction(
		"0x1009199f804a4c75d266627548dc154989eec8385c7b3a67e2bd50a5db5063c9"
	);
    const etherTransacitonType2 = ethers.Transaction.from(rawBodyType2);
    console.log(etherTransacitonType2.chainId);
    console.log(JSON.stringify(etherTransacitonType2));
}