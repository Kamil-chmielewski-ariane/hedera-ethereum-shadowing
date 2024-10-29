export type Account = Record<string, { balance: string }>;

export type Genesis = {
	toAccount: string;
	amount: number;
};

export interface StateData {
	slot: string;
	value: string;
	timestamp: string;
	address: string;
}
