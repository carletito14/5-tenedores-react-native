import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import Loading from '../../components/Loading';
import Carousel from '../../components/Carousel';
import { firebaseApp } from '../../utils/firebase';
import firebase from "firebase/app"
import "firebase/firestore"

const db = firebase.firestore(firebaseApp)
const screenWidth = Dimensions.get("window").width


export default function Restaurant(props) {
    const { navigation, route } = props
    const { id, name } = route.params
    const [restaurant, setRestaurant] = useState(null)
    const [rating, setRating] = useState(0)

    navigation.setOptions({ title: name })

    useEffect(() => {
        db.collection("restaurants")
            .doc(id)// aquí filtramos por el id que nos llega por las props
            .get()
            .then((response) => {
                const data = response.data()
                data.id = response.id
                setRestaurant(data)
            })

    }, [])
    if (!restaurant) return <Loading isVisible={true} text="Cargando..." />

    return (
        <ScrollView vertical style={styles.viewBody}>
            <Carousel
                arrayImages={restaurant.images}
                height={250}
                width={screenWidth}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    }
})
