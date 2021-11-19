import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import {map} from "lodash"
import { Rating, ListItem, Icon } from "react-native-elements"
import Loading from '../../components/Loading';
import Carousel from '../../components/Carousel';
import Map from '../../components/Map';
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
                setRating(data.rating)
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
            <TitleRestaurants
                name={restaurant.name}
                description={restaurant.description}
                rating={rating}
            />
            <RestaurantInfo
                location={restaurant.location}
                name={restaurant.name}
                address={restaurant.address}
            />
        </ScrollView>
    )
}

function TitleRestaurants({ name, description, rating }) {
    return (
        <View style={styles.restaurantTitle}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.nameRestaurant}>{name}</Text>
            </View>
            <Rating
                style={styles.rating}
                imageSize={20}
                readonly
                startingValue={parseFloat(rating)}
            />
            <Text style={styles.descriptionRestaurant}>{description}</Text>
        </View>
    )
}

function RestaurantInfo(props) {
    const { location, name, address } = props;

    const listInfo = [
        {
            text: address,
            iconName: "map-marker",
            iconType: "material-community",
            action: null,
        },
        {
            text: "675 843 274",
            iconName: "phone",
            iconType: "material-community",
            action: null,
        },
        {
            text: "test@gmail.com",
            iconName: "at",
            iconType: "material-community",
            action: null,
        },
    ];

    return (
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}>
                Información sobre el restaurante
            </Text>
            <Map location={location} name={name} height={100} />
            {map(listInfo, (item, index) => (
                <ListItem
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name: item.iconName,
                        type: item.iconType,
                        color: "#00a680",
                    }}
                    containerStyle={styles.containerListItem}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    restaurantTitle: {
        padding: 15
    },
    nameRestaurant: {
        fontSize: 20,
        fontWeight: "bold"
    },
    descriptionRestaurant: {
        marginTop: 6,
        color: "grey"
    },
    rating: {
        position: "absolute",
        right: 30,
        marginTop: 18
    },
    viewRestaurantInfo: {
        margin: 15,
        marginTop: 15
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },
    containerListItem: {
        borderBottomColor: "#d8d8d8",
        borderBottomWidth: 1
    }
})
