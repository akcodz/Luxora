import {View, Text, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import {CartItemProps} from "@/constants/types";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants";

const CartItem = ({item,onRemove,onUpdateQuantity}:CartItemProps) => {
    const imageUrl =item.product.images[0]
    return (
        <View className="flex-row mb-4 bg-white p-3 rounded-xl">
            {/* Product Image */}
            <View className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mr-3">
                <Image
                    source={{ uri: imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </View>

            {/* Product Info */}
            <View className="flex-1 justify-between">
                {/* Name and Price Row */}
                <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                        <Text className="text-primary font-medium text-sm mb-1">
                            {item.product.name}
                        </Text>
                        <Text className="text-secondary text-sm">
                            Size: {item.size}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={onRemove}>
                        <Ionicons
                            name="close-circle-outline"
                            size={20}
                            color={COLORS.primary}
                        />
                    </TouchableOpacity>

                </View>
                {/*Price and Quantity*/}
                <View className="flex-row justify-between items-center mt-2">
                    {/* Product Price */}
                    <Text className="text-primary font-bold text-base">
                        ${item.product.price.toFixed(2)}
                    </Text>

                    {/* Quantity Controls */}
                    <View className="flex-row items-center bg-surface rounded-full px-2 py-1">
                        {/* Decrease Button */}
                        <TouchableOpacity
                            onPress={() => onUpdateQuantity && onUpdateQuantity(item.quantity - 1)}
                            className="px-2"
                        >
                            <Ionicons name="remove-outline" size={20} color={COLORS.primary} />
                        </TouchableOpacity>

                        {/* Quantity Display */}
                        <Text className="px-2 text-primary font-semibold">
                            {item.quantity}
                        </Text>

                        {/* Increase Button */}
                        <TouchableOpacity
                            onPress={() =>onUpdateQuantity && onUpdateQuantity( item.quantity + 1)}
                            className="px-2"
                        >
                            <Ionicons name="add-outline" size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}
export default CartItem
