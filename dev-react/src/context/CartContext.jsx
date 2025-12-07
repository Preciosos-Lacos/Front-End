import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext({
  count: 0,
  setCount: () => {},
  recomputeFromItens: () => {},
});

export function CartProvider({ children }) {
  const [count, setCount] = useState(0);

  const recomputeFromItens = useCallback((itens = []) => {
    try {
      const total = Array.isArray(itens)
        ? itens.reduce((acc, it) => acc + Number(it.quantidade || 1), 0)
        : 0;
      setCount(total);
    } catch {
      setCount(0);
    }
  }, []);

  return (
    <CartContext.Provider value={{ count, setCount, recomputeFromItens }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
