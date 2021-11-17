import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Restaurants from '../screens/Restaurants'

const Stack = createStackNavigator();

export default function RestaurantsStack() {
    return (
        // por defecto aparece el primero
        <Stack.Navigator>
            <Stack.Screen
                name="restaurants"
                component={Restaurants}
                options={{ title: "Restaurantes" }}
            />

            {/* <Stack.Screen
                name="add-restaurants"
                component={Restaurants}
                options={{ title: "Añadir Restaurante" }}
            /> */}
        </Stack.Navigator>
    )
}