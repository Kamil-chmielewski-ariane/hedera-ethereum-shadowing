import { getContractState } from "@/api/hedera-mirror-node/get-contract-state";

export class StateData {
	slot: string;
	value: string;
	timestamp: string

	constructor(_slot: string, _value: string, _timestamp: string) {
		this.slot = _slot;
		this.value = _value;
		this.timestamp = _timestamp
	}
}

export async function getHederaContractStates(contractAddress: string): Promise<StateData[]> {
	let states: StateData[] = [];
	const data = await getContractState(contractAddress);
	if (data && data.state) {
		for (const state of data.state) {
			const stateSlot = state.slot;
			const stateValue = state.value;
			const timestamp = state.timestamp;
			states.push(new StateData(stateSlot, stateValue, timestamp))
		}
	}
	return states;
}
