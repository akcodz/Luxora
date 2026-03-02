import {View, Text, ScrollView, TouchableOpacity} from 'react-native'
import React from 'react'
import {useWishlist} from "@/context/WishlistContext";
import {useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import Header from "@/components/Header";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants";
import ProductCard from "@/components/ProductCard";

const Favorites = () => {
    const { wishlist } = useWishlist();
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
            <Header title="Wishlist" showMenu showCart />

            {wishlist.length >0 ? (
                <ScrollView
                    className="flex-1 px-4 mt-4"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-row flex-wrap justify-between">
                        {wishlist.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <View className="flex-1 items-center justify-center">
                    {/* Empty Wishlist Icon */}
                    <Ionicons
                        name="heart-outline"
                        size={80}
                        color={COLORS.secondary}
                    />

                    {/* Message */}
                    <Text className="text-secondary text-lg mt-4">
                        Your wishlist is empty
                    </Text>

                    <Text className="text-muted text-sm mt-1 text-center px-6">
                        Save your favorite items here and come back anytime
                    </Text>

                    {/* Start Shopping Button */}
                    <TouchableOpacity
                        className="mt-6 flex-row items-center bg-primary px-6 py-3 rounded-full"
                        onPress={() => router.push("/shop")}
                    >
                        <Ionicons
                            name="pricetags-outline"
                            size={18}
                            color="white"
                            className="mr-2"
                        />
                        <Text className="text-white font-bold text-base">
                            Browse Products
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}
export default Favorites
