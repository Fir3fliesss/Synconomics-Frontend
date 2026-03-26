export interface Expense {
  id: number;
  business_id: number;
  title: string;
  amount: number;
  category: string;
  description?: string;
  expense_date: string;
  createdAt?: string;
}
