import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, Icon, Button } from "react-native-elements"
import { size, isEmpty } from 'lodash'
import Loading from '../Loading';
import { validateEmail } from '../../utils/validations'
import * as firebase from "firebase"
import { useNavigation } from '@react-navigation/core'

const RegisterForm = ({ toastRef }) => {

    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValue())
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false)

    const onSubmit = () => {
        if (isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword)) {
            toastRef.current.show('Todos los campos son obligatorios')
        } else if (!validateEmail(formData.email)) {
            toastRef.current.show('El email no es correcto');
        } else if (formData.password !== formData.repeatPassword) {
            toastRef.current.show('las contraseñas deben de ser iguales');
        } else if (size(formData.password) < 6) {
            toastRef.current.show('la contraseña debe tener al menos 6 carácteres');
        } else {
            setLoading(true)
            firebase
                .auth()
                .createUserWithEmailAndPassword(formData.email, formData.password)
                .then(response => {
                    setLoading(false)
                    navigation.navigate("account")
                })
                .catch((err) => {
                    setLoading(false)
                    toastRef.current.show('Este usuario ya está en uso, pruebe con otro.')
                })
        }
    }

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo Electrónico"
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, "email")}
                rightIcon={
                    <Icon
                        type="material-community" //iconos de reactnativeelements materialcommunity
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, "password")}
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
            />
            <Input
                placeholder="Repetir Contraseña"
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, "repeatPassword")}
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
            />
            <Button
                title="Unirse"
                containerStyle={styles.btnContainerStyle}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
            />
            <Loading isVisible={loading} text="Creando cuenta" />
        </View>
    )
}

export default RegisterForm
function defaultFormValue() {

    return {
        email: "",
        password: "",
        repeatPassword: ""
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width: "100%",
        marginTop: 20
    },
    btnContainerStyle: {
        marginTop: 20,
        width: "95%",
    },
    btnRegister: {
        backgroundColor: "#00a680"
    },
    iconRight: {
        color: "#c1c1c1"
    }
})
