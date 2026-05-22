export class BalanceManager {
  private balances: Map<string, Record<string, number>>;

  constructor() {
    this.balances = new Map();
  }

 
  initUser(userId: string, asset: Record<string, number>) {
    const current = this.balances.get(userId) ?? {};
    this.balances.set(userId, { ...current, ...asset });
  }

  getBalance(userId: string, asset: string): number {
    return this.balances.get(userId)?.[asset] ?? 0;
  }

  lock(userId: string, asset: string, amount: number) {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }
    const user = this.balances.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const available = user[asset] ?? 0;
    if (available < amount) {
      throw new Error("Insufficient balance");
    }
    user[asset] = available - amount;
  }

  release(userId: string, asset: string, amount: number) {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }
    const user = this.balances.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user[asset] = (user[asset] ?? 0) + amount;
  }

  transfer(fromUserId: string, toUserId: string, asset: string, amount: number) {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }
    const sender = this.balances.get(fromUserId);
    if (!sender) {
      throw new Error("Sender not found");
    }
    const senderBal = sender[asset] ?? 0;
    if (senderBal < amount) {
      throw new Error("Insufficient balance");
    }
    sender[asset] = senderBal - amount;

    const receiver = this.balances.get(toUserId);
    if (!receiver) {
      throw new Error("Receiver not found");
    }
    receiver[asset] = (receiver[asset] ?? 0) + amount;
  }

  getUserBalances(userId: string): Record<string, number> {
    const row = this.balances.get(userId);
    return row ? { ...row } : {};
  }

}
// Singleton — one instance for whole app
export const balanceManager = new BalanceManager()
