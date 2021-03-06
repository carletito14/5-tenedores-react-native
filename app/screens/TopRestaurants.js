import React, { useState, useEffect, useRef } from 'react'
import { View, Text } from 'react-native'
import Toast from 'react-native-easy-toast';
import ListTopRestaurants from '../components/Ranking/ListTopRestaurants';

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

const TopRestaurants = ({ navigation }) => {

    const [restaurants, setRestaurants] = useState([])
    const toastRef = useRef()

    useEffect(() => {
        db.collection('restaurants')
            .orderBy("rating", "desc")
            .limit(5)
            .get()
            .then((res) => {
                const restaurantArray = []
                res.forEach((doc) => {
                    const data = doc.data()
                    data.id = doc.id
                    restaurantArray.push(data)
                });
                setRestaurants(restaurantArray)
            })
    }, [])
    return (
        <View>
            <ListTopRestaurants restaurants={restaurants} navigation={navigation} />
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </View>
    )
}

export default TopRestaurants
