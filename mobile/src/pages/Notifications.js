import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity
} from "react-native";

import api from "../services/api";

export default function Notifications({ route, navigation }) {
    const {
        userName,
        notifications,
        userLatitude,
        userLongitude
    } = route.params;
    // const notifications = [];
    // const userName = "";

    function tratarDuasCasas(value) {
        if (value.length < 2) {
            return `0${value}`;
        }
        return value;
    }

    function returnTreatedDate(stringDate) {
        const dateObject = new Date(stringDate);

        const dia = tratarDuasCasas(String(dateObject.getDate()));
        const mes = tratarDuasCasas(String(dateObject.getMonth() + 1));
        const hora = tratarDuasCasas(String(dateObject.getHours()));
        const minuto = tratarDuasCasas(String(dateObject.getMinutes()));

        const returnString = `${dia}/${mes}/${dateObject.getFullYear()} as ${hora}:${minuto}h`;
        // console.log(returnString);

        return returnString;
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <Text style={styles.titulo}>
                    Bem vindo, {userName?.split(" ")[0]}!
                </Text>
                {notifications && notifications.length > 0 ? (
                    <FlatList
                        data={notifications}
                        keyExtractor={notification => notification._id}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={
                                    index === 0 ? styles.firstItem : styles.item
                                }
                                onPress={() =>
                                    navigation.navigate("Map", {
                                        latitude: item.location.coordinates[1],
                                        longitude: item.location.coordinates[0],
                                        userLatitude,
                                        userLongitude
                                    })
                                }
                            >
                                <Text style={styles.texto}>{item.text}</Text>
                                <Text>
                                    Início: {returnTreatedDate(item.dataInicio)}
                                </Text>
                                <Text>
                                    Fim: {returnTreatedDate(item.dataFim)}
                                </Text>
                                <Text>{item.endereco}</Text>
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <Text style={styles.notFound}>
                        Você não possui notificações.
                    </Text>
                )}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },

    item: {
        // flexWrap: "wrap",
        padding: 10,
        minHeight: 90,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1
    },

    texto: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#ed7476"
    },

    firstItem: {
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        padding: 10,
        minHeight: 90
    },

    titulo: {
        alignSelf: "center",
        marginTop: 25,
        marginBottom: 25,
        fontSize: 22,
        fontWeight: "bold",
        color: "#f05a5b"
    },

    notFound: {
        alignSelf: "center"
    }
});
