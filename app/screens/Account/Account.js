import React, { useEffect, useState } from 'react'
import * as firebase from "firebase";
import UserGuest from './UserGuest'
import UserLogged from './UserLogged'
import Loading from '../../components/Loading';

require('firebase/auth')

const Account = () => {
    const [login, setLogin] = useState(null)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            !user ? setLogin(false) : setLogin(true)
        })
    }, [])
    if (login === null) return <Loading isVisible={true} text="cargando..."/>

    return login ? <UserLogged /> : <UserGuest />
}

export default Account
