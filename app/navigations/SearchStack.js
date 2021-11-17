import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Search from '../screens/Search'

const Stack = createStackNavigator();

export default function SearchStack() {
    return (
        // por defecto aparece el primero
        <Stack.Navigator>
            <Stack.Screen
                name="search"
                component={Search}
                options={{ title: "Buscador" }}
            />
        </Stack.Navigator>
    )
}