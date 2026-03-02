import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {useCart} from "@/context/CartContext";

export const CartTabIcon = ({ color, focused, size }) => {
    const { cartItems } = useCart();

    return (
        <View className="relative">
            <Ionicons
                name={focused ? "cart" : "cart-outline"}
                size={size}
                color={color}
            />
            {cartItems.length > 0 && (
                <View className="absolute -top-2 -right-2 bg-accent size-3 rounded-full " />
            )}
        </View>
    );
};