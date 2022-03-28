import React from "react";
import { View, StyleSheet, Image } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

import logo from "../assets/bloodIcon.png";

export default function Map({ route }) {
    const { latitude, longitude, userLatitude, userLongitude } = route.params;

    return (
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04
            }}
        >
            <Marker coordinate={{ latitude: latitude, longitude: longitude }}>
                <Image style={styles.avatar} source={logo} />
            </Marker>
            <Marker
                coordinate={{
                    latitude: userLatitude,
                    longitude: userLongitude
                }}
            />
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: "red"
    }
});
