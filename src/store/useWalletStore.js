import { create } from 'zustand'

const INITIAL_STATIC_WALLET = 5000.00

export const useWalletStore = create((set) => ({
  wallet: INITIAL_STATIC_WALLET,

  deductWallet: (amount) =>
    set((state) => ({
      wallet: Math.max(0, Number((state.wallet - amount).toFixed(2))),
    })),

  addWallet: (amount) =>
    set((state) => ({
      wallet: Number((state.wallet + amount).toFixed(2)),
    })),

  setWallet: (amount) =>
    set({
      wallet: Number(Number(amount).toFixed(2)),
    }),

  resetWallet: () =>
    set({
      wallet: INITIAL_STATIC_WALLET,
    }),
}))
