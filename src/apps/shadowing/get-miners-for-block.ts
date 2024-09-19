import { getBlockByHash } from "@/api/get-block-by-hash";

export async function getMinersForBlock(block: any): Promise<any> {
    let miners = [];
    miners.push(block.miner);
    for (const hash of block.uncles) {
        const uncle = await getBlockByHash(hash);
        miners.push(uncle.miner);
    }
    return miners;
}