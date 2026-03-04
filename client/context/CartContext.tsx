import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Product } from "@/constants/types";
import { dummyCart } from "@/assets/assets";
import {useAuth} from "@clerk/clerk-expo";
import api from "@/constants/api";
import Toast from "react-native-toast-message";

export type CartItem = {
    id: string;
    productId: string;
    product: Product;
    quantity: number;
    size:string;
    price:number;
}

export type CartContextType = {
    cartItems: CartItem[];
    addToCart: (product: Product, size: string) => Promise<void>;
    removeFromCart: (itemId: string, size: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number,size: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartTotal: number;
    itemCount: number;
    isLoading: boolean;
};
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const {getToken,isSignedIn} = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cartTotal, setCartTotal] = useState<number>(0);

    const fetchCart = async () => {
        try {
            setIsLoading(true);

            const token = await getToken();
            const { data } = await api.get("/cart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!data?.success || !data?.data) {
                throw new Error(data?.message || "Failed to fetch cart");
            }

            const serverCart = data.data;

            const mappedItems: CartItem[] = serverCart.items.map(
                (item: any) => ({
                    id: item.product?._id,
                    productId: item.product?._id,
                    product: item.product,
                    quantity: item.quantity,
                    size: item?.size || "M",
                    price: item.price,
                })
            );

            setCartItems(mappedItems);
            setCartTotal(serverCart.totalAmount);
        } catch (error: any) {
            console.error("Failed to fetch cart:", error);

            Toast.show({
                type: "error",
                text1: "Cart Error",
                text2:
                    error?.response?.data?.message || "Something went wrong",
            });
        } finally {
            setIsLoading(false);
        }
    };
    const addToCart = async (product: Product, size: string) => {
        if (!isSignedIn) {
            Toast.show({
                text1: "Please login to add to cart",
                type: "error",
            });
            return;
        }

        try {
            setIsLoading(true);

            const token = await getToken();
            const { data } = await api.post(
                "/cart/add",
                {
                    productId: product._id,
                    quantity: 1,
                    size,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!data?.success) {
                throw new Error(data?.message || "Failed to add to cart");
            }

            await fetchCart();

            Toast.show({
                text1: "Added to cart",
                type: "success",
            });
        } catch (error: any) {
            console.error("Failed to add to cart:", error);

            Toast.show({
                text1: error?.response?.data?.message || "Failed to add to cart",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (productId: string, size: string) => {
        if (!isSignedIn) return;

        try {
            setIsLoading(true);

            const token = await getToken();
            if (!token) throw new Error("Authentication failed");

            const { data } = await api.delete(
                `/cart/item/${productId}`,
                { params: { size }, headers: { Authorization: `Bearer ${token}` } }
            );

            if (!data?.success) throw new Error(data?.message || "Failed to remove item");

            await fetchCart();
        } catch (error: any) {
            console.error("Failed to remove from cart:", error);

            Toast.show({
                type: "error",
                text1: "Remove Failed",
                text2: error?.response?.data?.message || error.message || "Failed to remove from cart",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (productId: string,quantity: number, size: string) => {
        if (!isSignedIn) return;
        if (quantity < 1) return;

        try {
            setIsLoading(true);

            const token = await getToken();
            if (!token) throw new Error("Authentication failed");

            const { data } = await api.put(
                `/cart/item/${productId}`,
                { quantity, size },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!data?.success) {
                throw new Error(data?.message || "Failed to update quantity");
            }

            await fetchCart();
        } catch (error: any) {
            console.error("Failed to update cart quantity:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearCart = async () => {
        if (!isSignedIn) return;

        try {
            setIsLoading(true);

            const token = await getToken();
            const { data } = await api.delete(
                "/cart",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!data?.success) {
                throw new Error(data?.message || "Failed to clear cart");
            }

            setCartItems([]);
            setCartTotal(0);
        } catch (error: any) {
            console.error("Failed to clear cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const itemCount =cartItems.reduce((sum,item)=>sum + item.quantity,0);


    useEffect(()=>{
       if(isSignedIn){fetchCart()
       }else {
           setCartItems([])
           setCartTotal(0)
       }
    },[isSignedIn]);
    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount, isLoading }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};