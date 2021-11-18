import React, { useState, useRef } from 'react'
import { View } from 'react-native'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading';
import { AddRestaurantForm } from '../../components/Restaurants/AddRestaurantForm';

export const AddRestaurants = ({ navigation }) => {
    //si la screen proviene directamente del stack vienen parámetros como screen
    const toastRef = useRef();
    const [isLoading, setIsLoading] = useState(false)

    return (
        <View>
            <AddRestaurantForm
                toastRef={toastRef}
                setIsLoading={setIsLoading}
                navigation={navigation}
            />
            <Toast
                ref={toastRef}
                position="center"
                opacity={0.9}
            />
            <Loading
                isVisible={isLoading}
                text="Creando Restaurante"
            />
        </View>
    )
}
