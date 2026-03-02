import {View, Text, TouchableOpacity, ScrollView} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {useCart} from "@/context/CartContext";
import {useRouter} from "expo-router";
import Header from "@/components/Header";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants";
import CartItem from "@/components/CartItem";

const Cart = () => {
    const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
    const router = useRouter();

    const shipping=2.00;
    const total =cartTotal + shipping;
    return (
        <SafeAreaView className="flex-1 bg-surface">
            <Header title="My Cart" showBack />

            {cartItems.length === 0 ? (

                <View className="flex-1 items-center justify-center">
            {/* Empty Cart Icon */}
            <Ionicons
                name="cart-outline"
                size={80}
                color={COLORS.secondary}
            />

            {/* Message */}
            <Text className="text-secondary text-lg mt-4">
                Your cart is empty
            </Text>

            {/* Start Shopping Button */}
            <TouchableOpacity
                className="mt-4 flex-row items-center bg-primary px-6 py-3 rounded-full"
                onPress={() => router.push("/shop")}
            >
                <Ionicons
                    name="pricetags-outline"
                    size={18}
                    color="white"
                    className="mr-2"
                />
                <Text className="text-white font-bold text-base">
                    Start Shopping
                </Text>
            </TouchableOpacity>
        </View>
            ) : (
              <>
                  <ScrollView
                  className="flex-1 px-4 mt-4"
                  showsVerticalScrollIndicator={false}>
                  {cartItems.map((item, index) => (
                      <View key={item.id} className="mb-4">
                          <CartItem item={item}  onRemove={()=>removeFromCart(item.id,item.size)} onUpdateQuantity={(q)=>updateQuantity(item.id,q,item.size)}/>
                      </View>
                  ))}
              </ScrollView>
                  <View className="p-4 bg-white rounded-t-3xl shadow-sm">
                      {/* Subtotal */}
                      <View className="flex-row justify-between mb-2">
                          <Text className="text-base text-secondary">Subtotal</Text>
                          <Text className="text-primary font-bold">
                              ${cartTotal.toFixed(2)}
                          </Text>
                      </View>

                      {/* Shipping */}
                      <View className="flex-row justify-between mb-2">
                          <Text className="text-base text-secondary">Shipping</Text>
                          <Text className="text-primary font-bold">
                              ${shipping.toFixed(2)}
                          </Text>
                      </View>
                      {/* Total & Checkout */}
                      <View className="p-4 bg-white rounded-t-3xl shadow-sm">
                          {/* Total */}
                          <View className="flex-row justify-between mb-6">
                              <Text className="text-primary font-bold text-lg">
                                  Total
                              </Text>
                              <Text className="text-primary font-bold text-lg">
                                  ${total.toFixed(2)}
                              </Text>
                          </View>

                          {/* Checkout Button */}
                          <TouchableOpacity
                              className="bg-primary py-4 rounded-full items-center"
                              onPress={() => router.push("/checkout")}
                          >
                              <Text className="text-white font-bold text-lg">
                                  Checkout
                              </Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </>
            )}
        </SafeAreaView>
    )
}
export default Cart
