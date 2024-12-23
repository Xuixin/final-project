import { createContext, useContext, useState, useEffect } from "react";

const PosContext = createContext();

export function PosProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [cartSet, setCartSet] = useState([]);

    useEffect(() => {
        console.log("cart", cart);
        console.log("cartSet|", cartSet)
    }, [cart, cartSet]);

    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.id === item.id);
            if (existingItem) {
                // หากมีรายการอยู่ในตะกร้าแล้ว จะอัปเดตจำนวนและยังคงรายการไว้ที่ตำแหน่งเดิม
                return prevCart.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            } else {
                // เพิ่มรายการใหม่ที่ด้านบนของอาเรย์
                return [item, ...prevCart];
            }
        });
    };


    const minusFromCart = (item) => {
        setCart((prevCart) => {
            const newCart = [...prevCart];
            const index = newCart.findIndex((i) => i.id === item.id);
            if (index !== -1 && newCart[index].quantity > 1) {
                newCart[index].quantity--;
            } else {
                newCart.splice(index, 1);
            }
            return newCart;
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    };

    // ฟังก์ชันสำหรับจัดการ MenuSet
    const addToCartSet = (item) => {
        setCartSet((prevCartSet) => {
            const newCartSet = [...prevCartSet];
            const existingItem = newCartSet.find((i) => i.id === item.id);

            if (existingItem) {

                newCartSet.forEach((i) => {
                    if (i.id === item.id) {
                        i.quantity += item.quantity
                        i.details = i.details.map((detail) => {
                            const existingDetail = item.details.find(
                                (newDetail) => newDetail.menuId === detail.menuId
                            );
                            if (existingDetail) {
                                return {
                                    ...detail,
                                    quantity: detail.quantity + existingDetail.quantity,
                                };
                            }
                            return detail;
                        });

                        i.totalMenu = i.details.reduce(
                            (total, detail) => total + detail.quantity,
                            0
                        );

                        i.price += item.price;
                    }
                });
            } else {
                newCartSet.push({
                    ...item,
                    totalMenu: item.details.reduce(
                        (total, detail) => total + detail.quantity,
                        0
                    ),
                });
            }

            return newCartSet;
        });
    };

    const minusFromCartSet = (item) => {
        setCartSet((prevCartSet) => {
            const newCartSet = [...prevCartSet];
            const index = newCartSet.findIndex((i) => i.id === item.id);
            if (index !== -1) {

                const detailIndex = newCartSet[index].details.findIndex((detail) => detail.id === item.details[0].id);
                if (detailIndex !== -1 && newCartSet[index].details[detailIndex].quantity > 1) {
                    newCartSet[index].quantity--
                    newCartSet[index].details[detailIndex].quantity--;
                } else {
                    newCartSet.splice(index, 1);
                }
            }
            return newCartSet;
        });
    };

    const removeFromCartSet = (itemId) => {
        setCartSet((prevCartSet) => prevCartSet.filter((item) => item.id !== itemId));
    };

    const cartCount = () => {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        const cartSetCount = cartSet.reduce((total, item) => total + item.details.reduce((total, detail) => total + detail.quantity, 0), 0);
        return cartCount + cartSetCount;
    };

    const clearCart = () => {
        setCart([]);
        setCartSet([]);
    };

    const calculateTotalPrice = () => {
        const cartTotal = cart.reduce((total, item) => total + (item.discountId ? (item.price - item.discount.discount) * item.quantity : item.price * item.quantity), 0);
        const cartSetTotal = cartSet.reduce((total, item) => total + item.price, 0);
        return cartTotal + cartSetTotal;
    };


    return (
        <PosContext.Provider value={{
            cart,
            cartSet,
            addToCart,
            minusFromCart,
            removeFromCart,
            addToCartSet,
            minusFromCartSet,
            removeFromCartSet,
            cartCount,
            clearCart,
            calculateTotalPrice
        }}>
            {children}
        </PosContext.Provider>
    );
}

export function usePos() {
    const context = useContext(PosContext);
    if (context === undefined) {
        throw new Error('usePos must be used within a PosProvider');
    }
    return context;
}
