import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import {COLORS} from "@/constants";
import {View} from "react-native";
import {CartTabIcon} from "@/components/CartTabIcon";

const TabLayout = () => {

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: '#CDCDE0',
                tabBarShowLabel: false,
                tabBarStyle:{
                    backgroundColor:'#fff',
                    borderTopWidth:1,
                    borderTopColor:'#F0F0F0',
                    height:56,
                    paddingTop:8,
                }
            }}
        >
            {/* Home */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused, size }) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Cart */}
            <Tabs.Screen
                name="cart"
                options={{
                    tabBarIcon: ({ color, focused, size }) => (
                        <CartTabIcon color={color} focused={focused} size={size} />
                    ),
                }}
            />

            {/* Favourites */}
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'favorites',
                    tabBarIcon: ({ color, focused, size }) => (
                        <Ionicons
                            name={focused ? 'heart' : 'heart-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Profile */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused, size }) => (
                        <Ionicons
                            name={focused ? 'person' : 'person-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    )
}

export default TabLayout