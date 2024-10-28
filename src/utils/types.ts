export type Account = Record<string, { balance: string }>;

export type Genesis = {
	toAccount: string;
	amount: number;
};

export interface StateData {
	stateSlot: string;
	stateValue: string;
	timestamp: string;
}
