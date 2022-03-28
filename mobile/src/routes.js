import * as React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import Map from "./pages/Map";

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    options={{
                        title: "Login",
                        headerTitleStyle: { color: "#f05a5b" }
                    }}
                    name="Login"
                    component={Login}
                />
                <Stack.Screen
                    options={{
                        title: "Registrar",
                        headerTitleStyle: { color: "#f05a5b" }
                    }}
                    name="Register"
                    component={Register}
                />
                <Stack.Screen
                    options={{
                        title: "Notificações",
                        headerTitleStyle: { color: "#f05a5b" }
                    }}
                    name="Notifications"
                    component={Notifications}
                />
                <Stack.Screen
                    options={{
                        title: "Mapa",
                        headerTitleStyle: { color: "#f05a5b" }
                    }}
                    name="Map"
                    component={Map}
                />
            </Stack.Navigator>
        </NavigationContainer>
        // <Text>Oi</Text>
    );
}
