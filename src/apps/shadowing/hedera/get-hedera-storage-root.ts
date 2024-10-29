import { keccak256, toBuffer } from "ethereumjs-util";
import { BaseTrie } from "merkle-patricia-tree";
import { getContractStateByTimestamp } from '@/api/hedera-mirror-node/get-contract-state-by-timestamp';

export async function getHederaStorageRoot(contractAddress: any, timestamp: any) {
    const hederaStateData = await getContractStateByTimestamp(contractAddress, timestamp);
    if (!hederaStateData) {
        console.error("Failed to fetch contract state.");
        return;
    }
    return { hederaStorageRoot: await calculateStorageRoot(hederaStateData), hederaStateData };
}

async function calculateStorageRoot(stateData: any) {
  const trie = new BaseTrie();
  for (const entry of stateData) {
    await trie.put(keccak256(toBuffer(entry.slot)), toBuffer(entry.value));
  }
  return trie.root;
}
