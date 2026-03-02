import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Product, WishlistContextType} from "@/constants/types";
import {dummyWishlist} from "@/assets/assets";

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({children}:{children:ReactNode}) {
    const [wishlist,setWishlist]=useState<Product[]>([])
    const [loading,setLoading]=useState<boolean>(false)
    const fetchWishlist = async () => {
        setLoading(true);
        setWishlist(dummyWishlist)
        setLoading(false);
    }

    const toggleWishlist = async (product: Product) => {
        setWishlist((prev) => {
            const isAlreadyInWishlist = prev.some((item) => item._id === product._id);
            return isAlreadyInWishlist ? prev.filter((item) => item._id !== product._id) : [...prev, product];
        });
    };

    const isInWishlist = (productId:string) => {
        return wishlist.some((p)=>p._id===productId);
    }
    useEffect(() => {
        fetchWishlist()
    },[])
    return (
        <WishlistContext.Provider value={{wishlist,loading,isInWishlist,toggleWishlist}}>
            {children}
        </WishlistContext.Provider>
    )
}

export const useWishlist = () => {
   const context= useContext(WishlistContext)
    if(context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}