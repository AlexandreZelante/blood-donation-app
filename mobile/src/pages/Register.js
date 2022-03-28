import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Switch,
    Picker
} from "react-native";
import {
    requestPermissionsAsync,
    getCurrentPositionAsync
} from "expo-location";
import { TextInputMask } from "react-native-masked-text";
import { Header } from "@react-navigation/stack";

// import { MaterialIcons } from "@expo/vector-icons";

import api from "../services/api";

export default function Register({ route, navigation }) {
    const [name, setName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [tipoSanguineo, setTipoSanguineo] = useState("");
    const [currentRegion, setCurrentRegion] = useState(null);
    const [donate, setDonate] = useState(false);
    const [lastDonateDate, setLastDonateDate] = useState("");
    const [address, setAddress] = useState("");
    const [useCurrentAddress, setUseCurrentAddress] = useState(true);

    useEffect(() => {
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync();

            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true
                });

                const { latitude, longitude } = coords;

                console.log(latitude, longitude);

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04
                });
            }
        }

        if (route.params?.hasOwnProperty("email")) {
            setEmail(route.params.email);
        }

        if (route.params?.hasOwnProperty("name")) {
            setName(route.params.name);
        }

        loadInitialPosition();
    }, []);

    function convertDate(dateString) {
        let dateParts = dateString.split("/");
        // month is 0-based, that's why we need dataParts[1] - 1
        let dateObject = new Date(
            +dateParts[2],
            dateParts[1] - 1,
            +dateParts[0]
        );

        console.log(dateString, dateObject);
        return dateObject;
    }

    async function handleRegister() {
        console.log("Chegou aqui antes", {
            name,
            telephone,
            email,
            tipoSanguineo,
            currentRegion,
            doacao: donate,
            ultimaDoacao: convertDate(lastDonateDate)
        });
        const request = await api.post("/addDonor", {
            name,
            telephone,
            email,
            tipoSanguineo,
            currentRegion,
            doacao: donate,
            ultimaDoacao: convertDate(lastDonateDate)
        });

        console.log("Handle Register, add donor: ", request.data);
        if (request.data) {
            navigation.navigate("Notifications", {
                userName: name,
                userLatitude: currentRegion.latitude,
                userLongitude: currentRegion.longitude
            });
        }

        console.log(request.data);
    }

    return (
        <KeyboardAvoidingView
            behavior="padding"
            style={styles.container}
            keyboardVerticalOffset={120}
        >
            {/* <Image source={logo} /> */}
            {/* <Text style={styles.logo}>LOGO</Text> */}

            <View style={styles.form}>
                <Text style={styles.label}>NOME</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Seu nome"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={name}
                    onChangeText={setName}
                ></TextInput>

                <Text style={styles.label}>TELEFONE</Text>
                <TextInputMask
                    style={styles.input}
                    placeholder="Número de celular ou residencial"
                    type={"cel-phone"}
                    options={{
                        maskType: "BRL",
                        withDDD: true,
                        dddMask: "(99) "
                    }}
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={telephone}
                    onChangeText={text => setTelephone(text)}
                ></TextInputMask>

                <Text style={styles.label}>EMAIL</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Seu email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                ></TextInput>

                <Text style={styles.label}>TIPO SANGUÍNEO</Text>
                {/* <TextInput
                    style={styles.input}
                    placeholder="Seu tipo sanguíneo"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    value={tipoSanguineo}
                    onChangeText={setTipoSanguineo}
                ></TextInput> */}
                <View style={styles.input}>
                    <Picker
                        selectedValue={tipoSanguineo}
                        // style={{ height: 50, width: 150 }}
                        onValueChange={(itemValue, itemIndex) =>
                            setTipoSanguineo(itemValue)
                        }
                        style={styles.input}
                    >
                        <Picker.Item label="A+" value="A+" />
                        <Picker.Item label="A-" value="A-" />
                        <Picker.Item label="B+" value="B+" />
                        <Picker.Item label="B-" value="B-" />
                        <Picker.Item label="AB+" value="AB+" />
                        <Picker.Item label="AB-" value="AB-" />
                        <Picker.Item label="O+" value="O+" />
                        <Picker.Item label="O-" value="O-" />
                    </Picker>
                </View>

                <View style={styles.containerSwitch}>
                    <Text style={styles.donateText}>
                        DESEJA USAR O ATUAL ENDEREÇO?
                    </Text>
                    <Switch
                        value={useCurrentAddress}
                        onValueChange={value => setUseCurrentAddress(value)}
                    />
                </View>

                {!useCurrentAddress && (
                    <>
                        <Text style={styles.label}>ENDEREÇO</Text>

                        <TextInputMask
                            type={"datetime"}
                            style={styles.input}
                            placeholder="Seu endereço"
                            placeholderTextColor="#999"
                            options={{
                                format: "DD/MM/YYYY"
                            }}
                            value={address}
                            onChangeText={text => setAddress(text)}
                        />
                    </>
                )}

                <View style={styles.containerSwitch}>
                    <Text style={styles.donateText}>DESEJA DOAR SANGUE?</Text>
                    <Switch
                        value={donate}
                        onValueChange={value => setDonate(value)}
                    />
                </View>

                {donate && (
                    <>
                        <Text style={styles.label}>DATA DA ÚLTIMA DOAÇÃO</Text>
                        {/* <TextInput
                            style={styles.input}
                            placeholder="Data de sua última doação"
                            placeholderTextColor="#999"
                            autoCapitalize="words"
                            value={tipoSanguineo}
                            onChangeText={setTipoSanguineo}
                        ></TextInput> */}

                        <TextInputMask
                            type={"datetime"}
                            style={styles.input}
                            placeholder="Data de sua última doação"
                            placeholderTextColor="#999"
                            options={{
                                format: "DD/MM/YYYY"
                            }}
                            value={lastDonateDate}
                            onChangeText={text => setLastDonateDate(text)}
                        />
                    </>
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleRegister()}
                >
                    <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>
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

    inputPicker: {
        borderWidth: 2,
        borderColor: "#ddd"
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

    containerSwitch: {
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        marginTop: 5,
        marginBottom: 20
    },

    donateText: {
        fontWeight: "bold",
        color: "#444",
        marginBottom: 8,
        paddingTop: 5
    }
});
