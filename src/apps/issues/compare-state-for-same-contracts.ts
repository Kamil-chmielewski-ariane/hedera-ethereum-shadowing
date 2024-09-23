import { getStorageAt } from "@/api/get-storage-at";
import { getHederaContractStates } from "@/apps/shadowing/get-hedera-contract-slots";
import fs from "fs";

export async function compareStateForSameContracts(contractAddressSepolia: string, contractAddressHedera: string) {
    const errorInBlock = []
    let statesFromHedera = await getHederaContractStates(contractAddressHedera);
    for (const stateHedera of statesFromHedera) {
        if (stateHedera.slot && stateHedera.value) {
            const stateValueSepolia = await getStorageAt(contractAddressSepolia, stateHedera.slot, "latest");
            console.log(stateValueSepolia);
            console.log(stateHedera.value);
            if (stateValueSepolia == stateHedera.value) {
                console.log(`Everything is looking good on slot ${stateHedera.slot}, sepolia and hedera have same values`);
            }
            else {
                const data = {
                    "contractAddressHedera": contractAddressHedera,
                    "contractAddressSepolia": contractAddressHedera,
                    "searchedSlot": stateHedera.slot,
                    "hederaValue": stateHedera.value,
                    "ethereumValue": stateValueSepolia
                }
                errorInBlock.push(data);
                console.log(`Different values on slot ${stateHedera.slot}, sepolia value is ${stateValueSepolia} and hedera value is ${stateHedera.value}`);
            }
        }
    }
    await writeLogFileForBlock(errorInBlock, Number("0xa345"));
}

async function writeLogFileForBlock(data: any, blockNumber: any) {
    const jsonData = JSON.stringify(data)
    fs.writeFile(`logs/${blockNumber}.json`, jsonData, 'utf-8', (err) => {
        if (err) {  console.error(err);  return; };
    });
}