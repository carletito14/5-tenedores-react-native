import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Restaurants from '../screens/Restaurants/Restaurants'
import { AddRestaurants } from '../screens/Restaurants/AddRestaurants';
import Restaurant from '../screens/Restaurants/Restaurant';
import AddReviewRestaurant from '../screens/Restaurants/AddReviewRestaurant';

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

            <Stack.Screen
                name="add-restaurant"
                component={AddRestaurants}
                options={{ title: "Añadir nuevo restaurante" }}
            />

            <Stack.Screen
                name="restaurant"
                component={Restaurant}
            //aquí no hay option porqu el nombre es dinámico 
            />
            <Stack.Screen
                name="add-review-restaurant"
                component={AddReviewRestaurant}
                options={{ title: "Nuevo comentario" }}
            />
        </Stack.Navigator>
    )
}