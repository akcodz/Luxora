import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Product, WishlistContextType } from "@/constants/types";
import Toast from "react-native-toast-message";
import api from "@/constants/api";
import {useAuth} from "@clerk/clerk-expo"; 

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const {getToken,isSignedIn} = useAuth();
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch wishlist from backend
    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const token = await getToken();

            const { data } = await api.get("/wishlist", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWishlist(data);
        } catch (error: any) {
            console.error("Failed to fetch wishlist:", error);
            Toast.show({
                type: "error",
                text1: "Failed to load wishlist",
                text2: error?.response?.data?.message || "Something went wrong",
            });
        } finally {
            setLoading(false);
        }
    };

    // Toggle wishlist: add/remove
    const toggleWishlist = async (product: Product) => {
        // Optimistic UI update
        setWishlist((prev) => {
            const isAlready = prev.some((item) => item._id === product._id);
            return isAlready ? prev.filter((item) => item._id !== product._id) : [...prev, product];
        });

        try {
            const token = await getToken();

            await api.patch(`/wishlist/toggle/${product._id}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await fetchWishlist();
        } catch (error: any) {
            // Revert UI if API fails
            setWishlist((prev) => {
                const isAlready = prev.some((item) => item._id === product._id);
                return isAlready ? prev.filter((item) => item._id !== product._id) : [...prev, product];
            });

            Toast.show({
                type: "error",
                text1: "Failed to update wishlist",
                text2: error?.response?.data?.message || "Something went wrong",
            });
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some((p) => p._id === productId);
    };

    // Fetch wishlist on mount
    useEffect(() => {
        if(isSignedIn){
        fetchWishlist();
        }
    }, [isSignedIn]);

    return (
        <WishlistContext.Provider value={{ wishlist, loading, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

// Custom hook for consuming context
export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};