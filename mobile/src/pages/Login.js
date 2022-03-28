import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    AsyncStorage,
    Alert
} from "react-native";

import * as Facebook from "expo-facebook";

import logo from "../assets/bloodIcon.png";

import api from "../services/api";

export default function Login({ navigation }) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [notFound, setNotFound] = useState(false);

    async function logIn() {
        try {
            await Facebook.initializeAsync("2725171404422682");
            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ["public_profile", "email"]
            });
            if (type === "success") {
                // Get the user's name using Facebook's Graph API
                fetch(
                    `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`
                )
                    .then(response => response.json())
                    .then(data => {
                        handleLoginFacebook(data.email, data.name);
                        console.log(data);
                    })
                    .catch(e => console.log(e));
            } else {
                // type === 'cancel'
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
        }
    }

    async function handleLogin() {
        const request = await api.post("/getDonor", { email: login });
        // console.log("Dados", request.data);

        if (request.data) {
            navigation.navigate("Notifications", {
                userName: request.data.doc.name,
                notifications: request.data.notifications,
                userLatitude: request.data.doc.location.coordinates[1],
                userLongitude: request.data.doc.location.coordinates[0]
            });
        } else {
            setLogin("");
            setPassword("");
            setNotFound(true);
        }
    }

    async function handleLoginFacebook(email, name) {
        const request = await api.post("/getDonor", { email });
        // console.log("Dados", request.data);

        if (request.data) {
            navigation.navigate("Notifications", {
                userName: request.data.doc.name,
                notifications: request.data.notifications,
                userLatitude: request.data.doc.location.coordinates[1],
                userLongitude: request.data.doc.location.coordinates[0]
            });
        } else {
            navigation.navigate("Register", {
                email,
                name
            });
        }
    }

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <Image style={styles.thumbnail} source={logo} />
            {/* <Text style={styles.logo}>LOGO</Text> */}

            <View style={styles.form}>
                <Text style={styles.label}>E-MAIL</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Seu e-mail"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={login}
                    onChangeText={setLogin}
                    onFocus={() => setNotFound(false)}
                ></TextInput>

                <Text style={styles.label}>SENHA</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Sua Senha"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                ></TextInput>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleLogin()}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.facebookButton}
                    onPress={() => logIn()}
                >
                    <Text style={styles.buttonText}>Facebook</Text>
                </TouchableOpacity>

                {notFound && (
                    <Text style={styles.notFoundText}>
                        Usuário não encontrado
                    </Text>
                )}

                <TouchableOpacity
                    style={styles.registrar}
                    onPress={() => navigation.navigate("Register")}
                >
                    <Text style={styles.registrarText}>
                        Não possui conta? Registre-se
                    </Text>
                </TouchableOpacity>

                {/* <Text style={styles.textFacebook}>Ou, entre pelo facebook</Text> */}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    },

    logo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#f05a5b"
    },

    thumbnail: {
        width: 120,
        height: 120,
        resizeMode: "cover",
        borderRadius: 2,
        borderColor: "red",
        borderWidth: 2,
        borderRadius: 20
    },

    form: {
        alignSelf: "stretch",
        paddingHorizontal: 30,
        marginTop: 30
    },

    label: {
        fontWeight: "bold",
        color: "#444",
        marginBottom: 8
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        paddingHorizontal: 20,
        fontSize: 16,
        color: "#444",
        height: 44,
        marginBottom: 20,
        borderRadius: 2
    },

    button: {
        height: 42,
        backgroundColor: "#f05a5b",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 2
    },

    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    },

    registrar: {
        alignItems: "center",
        marginTop: 10
    },

    registrarText: {
        textDecorationLine: "underline",
        color: "#f05a5b"
    },

    notFoundText: {
        color: "red",
        alignSelf: "center",
        marginVertical: 10
    },

    facebookButton: {
        height: 42,
        backgroundColor: "#3b5998",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 2,
        marginTop: 10
    },

    textFacebook: {
        alignSelf: "center",
        marginVertical: 10
    }
});
