export type Profile = {
    id: string;
    firstName: string;
    lastName: string;
    balance: number;
    profession: string;
};

export type Job = {
    id: string;
    description: string;
    price: number;
    paid: boolean;
    paymentDate: string;
    contractId: string;
    createdAt: string;
    updatedAt: string;
};
