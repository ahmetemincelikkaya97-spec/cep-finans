import React, { createContext, useContext, useState, useEffect } from 'react';

const ShoppingListContext = createContext();

export const useShoppingList = () => {
    return useContext(ShoppingListContext);
};

export const ShoppingListProvider = ({ children }) => {
    const [shoppingList, setShoppingList] = useState(() => {
        const saved = localStorage.getItem('shopping_list');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('shopping_list', JSON.stringify(shoppingList));
    }, [shoppingList]);

    const addItems = (items) => {
        setShoppingList(prev => {
            const newList = [...prev];
            items.forEach(item => {
                if (!newList.find(i => i.name === item.name)) {
                    newList.push({ ...item, checked: false, id: Date.now() + Math.random() });
                }
            });
            return newList;
        });
    };

    const toggleItem = (id) => {
        setShoppingList(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    };

    const removeItem = (id) => {
        setShoppingList(prev => prev.filter(item => item.id !== id));
    };

    const clearList = () => {
        setShoppingList([]);
    };

    return (
        <ShoppingListContext.Provider value={{ shoppingList, addItems, toggleItem, removeItem, clearList }}>
            {children}
        </ShoppingListContext.Provider>
    );
};
