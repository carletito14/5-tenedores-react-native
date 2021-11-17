import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Avatar } from 'react-native-elements';
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

const InfoUser = (props) => {
    const {
        userInfo: { uid, photoURL, displayName, email },
        toastRef,
        setLoading,
        setLoadingText
    } = props

    const changeAvatar = async () => {
        const resultPermissions = await Permissions.askAsync(Permissions.CAMERA);
        const resultPermissionsCamera = resultPermissions.permissions.camera.status;

        if (resultPermissionsCamera === "denied") {
            toastRef.current.show("Es necesario aceptar los permisos de la galería")
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })
            if (result.cancelled) {
                toastRef.current.show("Has cerrado la selección de imágenes")
            } else {
                uploadImage(result.uri).then(() => {
                    updatePhotoUrl()
                }).catch(() => {
                    toastRef.current.show("Error al actualizar avatar")
                })
            }
        }
    }

    // función de subir imagen a firebase
    const uploadImage = async (uri) => {
        setLoadingText('Actualizando Avatar')
        setLoading(true)

        const response = await fetch(uri)
        // console.log(uri); // Esto da error porque es una llamada asíncrona y hay que devolver un Json
        // console.log(JSON.stringify(response));
        const blob = await response.blob()
        // console.log(JSON.stringify(blob)); // Muestra el peso, id, tamaño imagen... etc y así hay que subirlo a firebase
        const ref = firebase.storage().ref().child(`avatar/${uid}`);
        return ref.put(blob)
    }
    const updatePhotoUrl = () => {

        firebase
            .storage()
            .ref(`avatar/${uid}`)
            .getDownloadURL()
            .then(async (response) => {
                console.log(response);
                const update = { photoURL: response };
                await firebase.auth().currentUser.updateProfile(update);
                setLoading(false)
            })
            .catch(() => {
                toastRef.current.show('Error al actualizar avatar')
            })
    }
    return (
        <View style={styles.viewUserInfo}>
            <Avatar
                rounded
                size="large"
                showEditButton
                containerStyle={styles.userInfoAvatar}
                source={
                    photoURL ? { uri: photoURL } : require("../../../assets/img/avatar-default.jpg")
                }
                onEditPress={changeAvatar}
            />
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anónimo"}
                </Text>
                <Text>
                    {email ? email : "Social Login"}
                </Text>
            </View>
        </View>
    )
}

export default InfoUser


const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar: {
        marginRight: 20
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5
    }
})