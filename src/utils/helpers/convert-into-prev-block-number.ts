export function convertIntoAfterBlockNumber(blockNumber: string) {
	const afterBlockNumberDec = parseInt(blockNumber, 16) + 1;
	return afterBlockNumberDec.toString(16);
}
