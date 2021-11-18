import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Alert, Dimensions, Text } from 'react-native'
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements'
import * as Location from "expo-location"
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"
import { map, size, filter } from "lodash"
import { Modal } from '../Modal';

const widthScreen = Dimensions.get("window").width; // nos pone un 100% de lo que queramos (para imagenes es util)


export const AddRestaurantForm = ({ toastRef, setIsLoading, navigation }) => {

    const [restaurantName, setRestaurantName] = useState("")
    const [restaurantAdress, setRestaurantAdress] = useState("")
    const [restaurantDescription, setRestaurantDescription] = useState("")
    const [imagesSelected, setImagesSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)


    const addRestaurant = () => {
        console.log('Nombre: ' + restaurantName);
        console.log('Dirección: ' + restaurantAdress);
        console.log('Descripción: ' + restaurantDescription);
    }

    return (
        <ScrollView style={styles.scrollView}>

            <ImageRestaurant imageRestaurant={imagesSelected[0]} />
            <FormAdd
                setRestaurantName={setRestaurantName}
                setRestaurantAdress={setRestaurantAdress}
                setRestaurantDescription={setRestaurantDescription}
                setIsVisibleMap={setIsVisibleMap}
            />
            <UploadImage
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <Button
                title="Crear restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <Map
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
            />
        </ScrollView>
    )
}


function Map({ isVisibleMap, setIsVisibleMap }) {

    // useEffect(() => {
    //     (async() =>{
    //         const resultPermissions = Permissions.askAsync(
    //             Permissions.LOCATION
    //         )
    //     })()

    // }, [])

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <Text>Mapa</Text>
        </Modal>
    )
}
function ImageRestaurant({ imageRestaurant }) {

    return (
        <View style={styles.viewPhoto}>
            <Image
                source={
                    imageRestaurant
                        ? { uri: imageRestaurant }
                        : require("../../../assets/img/no-image.png")
                }
                style={{ width: widthScreen, height: 200 }}
            />
        </View>
    )
}
function FormAdd({ setRestaurantName, setRestaurantAdress, setRestaurantDescription, setIsVisibleMap }) {
    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantName(e.nativeEvent.text)}
            />
            <Input
                placeholder="Dirección"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantAdress(e.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input
                placeholder="Descripción del restaurante"
                multiline={true}
                inputContainerStyle={styles.textArea}
                containerStyle={styles.input}
                onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
            />


        </View>
    )
}
function UploadImage({ toastRef, setImagesSelected, imagesSelected }) {

    const imageSelect = async () => {
        // hay que pedir permisos primero para seleccionar imágenes
        const resultPermissions = await Permissions.askAsync(Permissions.CAMERA)
        if (resultPermissions === "denied") {
            toastRef.current.show("Es necesario aceptar los permisos de galería. Si los has rechazado, ve a ajustes y actívalos manualmente.", 300)
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })

            //si el usuario cierra sin seleccionar ninguna imagen
            if (result.cancelled) {
                toastRef.current.show("Has cerrado la galería sin seleccionar ninguna imagen", 700)
            } else {
                // tenemos que pasarle a firebase la uri de la imagen
                setImagesSelected([...imagesSelected, result.uri]) // hacemos esto para añadir y no perder las anteriores
            }
        }
    }

    const removeImage = (image) => {
        // console.log(image);

        Alert.alert(
            "Eliminar Imagen",
            "¿Estás seguro de que quieres eliminar la imagen?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setImagesSelected(filter(imagesSelected, (imageUrl) => imageUrl !== image))
                    }
                }
            ],
            { cancelable: false }
        )
    }
    return (
        <View style={styles.viewImage}>

            {size(imagesSelected) < 4 && (
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}

            {map(imagesSelected, (imageRestaurant, index) => (
                <Avatar
                    key={index}
                    style={styles.miniaturesStyle}
                    source={{ uri: imageRestaurant }}
                    onPress={() => removeImage(imageRestaurant)}
                />
            ))}
        </View>

    )
}



const styles = StyleSheet.create({
    scrollView: {
        height: "100%"
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        marginBottom: 0
    },
    btnAddRestaurant: {
        backgroundColor: "#00a680",
        margin: 20
    },
    viewImage: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    miniaturesStyle: {
        width: "23%",
        height: 85,
        marginRight: 10,
        borderStyle: 'dotted'
    },
    viewPhoto: {
        alignItems: 'center',
        height: 200,
        marginBottom: 20
    }

})