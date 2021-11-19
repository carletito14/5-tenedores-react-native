import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Alert, Dimensions, Text } from 'react-native'
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements'
import * as Location from "expo-location"
import MapView from 'react-native-maps'
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"
import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app'
import "firebase/storage"
import "firebase/firestore"
import { map, size, filter } from "lodash"
import uuid from "random-uuid-v4"
import { Modal } from '../Modal';

const db = firebase.firestore(firebaseApp)
const widthScreen = Dimensions.get("window").width; // nos pone un 100% de lo que queramos (para imagenes es util)


export const AddRestaurantForm = ({ toastRef, setIsLoading, navigation }) => {

    const [restaurantName, setRestaurantName] = useState("")
    const [restaurantAdress, setRestaurantAdress] = useState("")
    const [restaurantDescription, setRestaurantDescription] = useState("")
    const [imagesSelected, setImagesSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationRestaurant, setLocationRestaurant] = useState(null)

    const addRestaurant = () => {

        if (!restaurantName || !restaurantAdress || !restaurantDescription) {
            toastRef.current.show("Todos los campos del formulario son obligatorios.")
        } else if (size(imagesSelected) === 0) {
            toastRef.current.show("El restaurante tiene que tener al menos una foto.")
        } else if (!locationRestaurant) {
            toastRef.current.show("Tienes que localizar el restaurante en el mapa.")
        } else {
            setIsLoading(true)
            // console.log('okey');
            uploadImageStorage().then(response => {
                // console.log(response);
                // si no hay colección se va a crear con el nombre que le demos automáticamente
                db.collection("restaurants")
                    .add({
                        name: restaurantName,
                        address: restaurantAdress,
                        description: restaurantDescription,
                        location: locationRestaurant,
                        images: response,
                        rating: 0,
                        ratingTotal: 0,
                        quantityVoting: 0,
                        createAt: new Date(),
                        createBy: firebase.auth().currentUser.uid
                    })
                    .then(() => {
                        setIsLoading(false)
                        toastRef.current.show("Restaurante creado correctamente.", 3000)
                        setTimeout(() => {
                            navigation.navigate("restaurants")
                        }, 500);

                    })
                    .catch(() => {
                        setIsLoading(false)
                        toastRef.current.show("Error al subir el restaurante, inténtelo más tarde.")
                    })

                // toastRef.current.show("Restaurante creado correctamente", 6000)
            })
        }
    }

    const uploadImageStorage = async () => { // es async porque trabaja con servidor para subida de imágenes
        const imageBlob = []

        await Promise.all(
            map(imagesSelected, async (image) => {
                const response = await fetch(image)
                const blob = await response.blob()
                const idPhoto = uuid();
                const ref = firebase.storage().ref("restaurants").child(idPhoto) // decimos donde se guarda la imagen y le damos un id único
                await ref.put(blob).then(async (result) => { // la subimos y esperamos response
                    await firebase
                        .storage()
                        .ref(`restaurants/${idPhoto}`)
                        .getDownloadURL()
                        .then(photoUrl => {
                            imageBlob.push(photoUrl)
                        })
                })
            })
        )


        return imageBlob
    }

    return (
        <ScrollView style={styles.scrollView}>

            <ImageRestaurant imageRestaurant={imagesSelected[0]} />
            <FormAdd
                setRestaurantName={setRestaurantName}
                setRestaurantAdress={setRestaurantAdress}
                setRestaurantDescription={setRestaurantDescription}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
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
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}


function Map({ isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef }) {

    const [location, setLocation] = useState(null)

    useEffect(() => {
        (async () => {
            const resultPermissions = Permissions.askAsync(
                Permissions.LOCATION
            );
            const statusPermissions = (await resultPermissions).permissions.location.status;

            if (statusPermissions !== "granted") { // si no acepta permisos
                toastRef.current.show("Tienes que aceptar los permisos de localización para crear un restaurante.", 3000)
            } else {
                const loc = await Location.getCurrentPositionAsync({})
                // console.log(loc); // en loc se guarda la altitud, latitud... etc

                setLocation({ //este objeto tiene que llamarse así obligatorio
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })
            }
        })()

    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(location)
        toastRef.current.show("Localización guardada correctamente")
        setIsVisibleMap(false)
    }

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)} // para que el marker se actualicd
                    >
                        <MapView.Marker
                            // esto es para el marcador de Maps
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                    <Button
                        title="Guardar Ubicación"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />

                    <Button
                        title="Cancelar Ubicación"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
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
function FormAdd({ setRestaurantName, setRestaurantAdress, setRestaurantDescription, setIsVisibleMap, locationRestaurant }) {
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
                    color: locationRestaurant ? "#00a680" : "#c2c2c2",
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
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d"
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680"
    }

})