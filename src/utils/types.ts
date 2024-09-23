export type Account = Record<string, { balance: string }>;

export type Genesis = {
	toAccount: string;
	amount: number;
};
