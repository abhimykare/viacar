export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Transaction {
  id: string;
  user: User;
  date: string;
  from: string;
  to: string;
  status: "Completed" | "Pending" | "Cancelled";
  amount: string;
  image: string;
}

export interface PaymentRefund {
  id: string;
  user: User;
  date: string;
  from: string;
  to: string;
  status: "Completed" | "Pending" | "Cancelled";
  amount: string;
  image: string;
}
