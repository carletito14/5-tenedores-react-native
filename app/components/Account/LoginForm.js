import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, Icon, Button } from 'react-native-elements'
import { isEmpty } from 'lodash'
import { useNavigation } from '@react-navigation/core'
import * as firebase from "firebase"
import { validateEmail } from '../../utils/validations';
import Loading from '../Loading';


const LoginForm = ({ toastRef }) => {

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValue())
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false)
    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }
    const onSubmit = () => {
        if (isEmpty(formData.email) || isEmpty(formData.password)) {
            toastRef.current.show("Todos los campos son obligatorios")
        } else if (!validateEmail(formData.email)) {
            toastRef.current.show("El email no es correcto")
        } else {
            setLoading(true)
            firebase
                .auth()
                .signInWithEmailAndPassword(formData.email, formData.password)
                .then(() => {
                    setLoading(false)
                    navigation.navigate("account")
                })
                .catch(() => {
                    setLoading(false)
                    toastRef.current.show('El email o la contraseña son incorrectas')
                })
        }
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo Electrónico"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, "email")}
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
                password={true}
                secureTextEntry={showPassword ? false : true}
                onChange={(e) => onChange(e, "password")}
                rightIcon={
                    <Icon
                        type="material-community" //iconos de reactnativeelements materialcommunity
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Button
                title="Iniciar Sesión"
                containerStyle={styles.btnContainerLogin} //estilos al contenedor del botón
                buttonStyle={styles.btnLogin} // estilos al propio botón
                onPress={onSubmit}
            />
            <Loading isVisible={loading} text="Iniciando sesión" />
        </View>
    )
}

export default LoginForm

function defaultFormValue() {
    return {
        email: "",
        password: ""
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width: "100%",
        marginTop: 20
    },
    btnContainerLogin: {
        marginTop: 20,
        width: "95%"
    },
    btnLogin: {
        backgroundColor: "#00a680"
    },
    iconRight: {
        color: "#c1c1c1"
    }
})