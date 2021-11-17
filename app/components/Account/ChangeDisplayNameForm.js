import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button } from 'react-native-elements'

const ChangeDisplayNameForm = ({ displayName, setShowModal, toastRef }) => {
    return (
        <View style={styles.view}>
            <Input
                placeholder="Nombre y Apellidos"
                containerStyle={styles.input}
                rightIcon={{
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#c2c2c2"
                }}
                defaultValue={displayName || ""}
            />
            <Button title="Cambiar Nombre" containerStyle={styles.btnContainer} buttonStyle={styles.btn} />
        </View>
    )
}

export default ChangeDisplayNameForm


const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        marginTop: 20,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
})