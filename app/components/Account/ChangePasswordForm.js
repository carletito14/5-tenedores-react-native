import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Button, Input, Icon } from 'react-native-elements'
import * as firebase from "firebase"
import { onChange } from 'react-native-reanimated'
import { size } from "lodash"
import { reauthenticate } from '../../utils/api'

export const ChangePasswordForm = ({ setShowModal, toastRed }) => {

    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const [formData, setFormData] = useState(defaultValue())
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }
    const onSubmit = async () => {
        let isSetError = true
        let errorsTemp = {};
        setErrors({})

        if (!formData.password || !formData.newPassword || !formData.repeatNewPassword) {
            errorsTemp = {
                password: !formData.password ? "La contraseña no puede estar vacía." : "",
                newPassword: !formData.newPassword ? "La contraseña no puede estar vacía." : "",
                repeatNewPassword: !formData.repeatNewPassword ? "La contraseña no puede estar vacía." : ""
            }
        } else if (formData.newPassword !== formData.repeatNewPassword) {
            errorsTemp = {
                newPassword: "Las contraseñas no son iguales.",
                repeatNewPassword: "Las contraseñas no son iguales."
            }
        } else if (size(formData.newPassword) < 6) {
            errorsTemp = {
                newPassword: "La contraseña tiene que tener mínimo 6 carácteres.",
                repeatNewPassword: "La contraseña tiene que tener mínimo 6 carácteres."
            }
        } else {
            setIsLoading(true)
            // siempre que esperemos respuesta del servidor 
            // hacemos la función asíncrona para que se quede aquí parado hasta obtener una respuesta

            await reauthenticate(formData.password).then(async () => {
                await firebase
                    .auth()
                    .currentUser.updatePassword(formData.newPassword)
                    .then(() => {
                        isSetError = false
                        setIsLoading(false)
                        setShowModal(false)
                        
                        firebase.auth().signOut()
                    })
                    .catch(() => {
                        errorsTemp = {
                            other: "Error al actualizar la contraseña"
                        }
                        setIsLoading(false)
                    })

            }).catch(() => {
                errorsTemp = {
                    password: "La contraseña no es correcta."
                }
                setIsLoading(false)
            })
        }


        isSetError && setErrors(errorsTemp)
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={
                    <Icon
                        type="material-community" //iconos de reactnativeelements materialcommunity
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                onChange={e => onChange(e, "password")}
                errorMessage={errors.password}
            />

            <Input
                placeholder="Nueva contaseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showNewPassword ? false : true}
                rightIcon={
                    <Icon
                        type="material-community" //iconos de reactnativeelements materialcommunity
                        name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                    />
                }
                onChange={e => onChange(e, "newPassword")}
                errorMessage={errors.newPassword}
            />

            <Input
                placeholder="Repetir nueva contaseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showRepeatPassword ? false : true}
                rightIcon={
                    <Icon
                        type="material-community" //iconos de reactnativeelements materialcommunity
                        name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                    />
                }
                onChange={e => onChange(e, "repeatNewPassword")}
                errorMessage={errors.repeatNewPassword}
            />
            <Button
                title="Cambiar contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
            <Text>{errors.other}</Text>
        </View>
    )
}
function defaultValue() {
    return {
        password: "",
        newPassword: "",
        repeatNewPassword: ""
    }
}
const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10,
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
