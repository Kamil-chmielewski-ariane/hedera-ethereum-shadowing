export function convertIntoAfterBlockNumber(blockNumber: string) {
	const prevBlockNumberDec = parseInt(blockNumber, 16) + 1;
	return prevBlockNumberDec.toString(16);
}
