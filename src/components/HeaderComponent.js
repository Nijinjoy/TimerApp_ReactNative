import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

const HeaderComponent = ({ title, showBackButton, onBackPress, showHistoryIcon, onHistoryPress }) => {
    return (
        <View style={styles.headerContainer}>
            {showBackButton && (
                <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
            )}

            <Text style={styles.headerText}>{title}</Text>

            {showHistoryIcon && (
                <TouchableOpacity onPress={onHistoryPress} style={styles.historyButton}>
                    <MaterialIcons name="history" size={24} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#28a745",
        padding: 15,
        justifyContent: "center",
        position: "relative",
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    backButton: {
        position: "absolute",
        left: 15,
    },
    historyButton: {
        position: "absolute",
        right: 15,
    },
});

export default HeaderComponent;

