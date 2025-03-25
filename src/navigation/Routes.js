import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import TimerListScreen from "../screens/TimerListScreen";
import AddTimerScreen from "../screens/AddTimerScreen";
import HistoryScreen from "../screens/HistoryScreen";

const Stack = createStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="TimerList" component={TimerListScreen} />
                <Stack.Screen name="AddTimer" component={AddTimerScreen} />
                <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Routes;
