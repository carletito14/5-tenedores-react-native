import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Favorites from '../screens/Favorites'

const Stack = createStackNavigator();

export default function FavoritesStack() {
    return (
        // por defecto aparece el primero
        <Stack.Navigator>
            <Stack.Screen
                name="favorites"
                component={Favorites}
                options={{ title: "Restaurantes Favoritos" }}
            />
        </Stack.Navigator>
    )
}