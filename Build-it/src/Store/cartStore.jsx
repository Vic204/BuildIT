import { create } from "zustand";

export const usecartStore = create((set) => ({
  cart: [],
  addtocart: (product) => set((state) => ({ cart: [...state.cart, product] })),
  removefromcart: (productid) =>
    set((state) => ({
      cart: state.cart.filter((product) => product.id !== productid),
    })),
  clearcart: () => set({ cart: [] }),
  qtysetter: (productid, qty) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === productid || item.cartid === productid ? { ...item, qty } : item
      ),
    })),
}));
