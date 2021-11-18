import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements'
import * as firebase from "firebase"
import { validateEmail } from '../../utils/validations'
import { reauthenticate } from '../../utils/api'

const ChangeEmailForm = ({ email, setShowModal, toastRef, setReloadUserInfo }) => {

    const [formData, setFormData] = useState(defaultValue())
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }
    const onSubmit = () => {
        setErrors({})
        if (!formData.email || email === formData.email) {
            setErrors({ email: "El email no ha cambiado" })
        } else if (!validateEmail(formData.email)) {
            setErrors({
                email: "Email incorrecto"
            })
        } else if (!formData.password) {
            setErrors({ password: "La contraseña no puede estar vacía" })
        } else {
            setIsLoading(true)
            reauthenticate(formData.password)
                .then((response) => {
                    firebase.auth().currentUser.updateEmail(formData.email)
                        .then(() => {
                            setIsLoading(false)
                            setReloadUserInfo(true)
                            toastRef.current.show("Email actualizado correctamente")
                            setShowModal(false)
                        })
                        .catch(() => {
                            setErrors("Error al actualizar el email.")
                            setIsLoading(false)
                        })
                }).catch(() => {
                    setIsLoading(false)
                    setErrors({ password: "La contraseña no es correcta." })
                })
        }
    }
    return (
        <View style={styles.view}>
            <Input
                placeholder="Correo Electrónico"
                containerStyle={styles.input}
                defaultValue={email || ""}
                rightIcon={{
                    type: "material-community",
                    name: "at",
                    color: "#c2c2c2"
                }}
                onChange={(e) => onChange(e, "email")}
                errorMessage={errors.email}
            />


            <Input
                // En firebase cuando se cambia un dato sensible te pide la contraseña
                // por eso hay que introducirla para verificar que es el usuario real el que,
                // en este caso está cambiando el email

                placeholder="Contraseña"
                containerStyle={styles.input}
                passwordR={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={
                    <Icon
                        type="material-community" //iconos de reactnativeelements materialcommunity
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                onChange={(e) => onChange(e, "password")}
                errorMessage={errors.password}
            />
            <Button
                title="Cambiar email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    )
}

export default ChangeEmailForm

function defaultValue() {
    return {
        email: "",
        password: ""
    }
}
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
    },
    iconRight: {
        color: "#c2c2c2"
    }
})