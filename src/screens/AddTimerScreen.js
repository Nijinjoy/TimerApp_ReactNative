import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
    StatusBar
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderComponent from "../components/HeaderComponent";

const AddTimerScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [category, setCategory] = useState("Workout");

    // Function to save the new timer
    const saveTimer = async () => {
        if (!name.trim()) {
            Alert.alert("Error", "Please enter a timer name.");
            return;
        }
        if (!duration.trim() || isNaN(duration) || parseInt(duration) <= 0) {
            Alert.alert("Error", "Please enter a valid duration in seconds.");
            return;
        }

        const newTimer = {
            id: Date.now().toString(), // Unique ID
            name: name.trim(),
            duration: parseInt(duration),
            remaining: parseInt(duration), // Initially, remaining time = duration
            category,
            status: "Idle",
        };

        try {
            const storedTimers = JSON.parse(await AsyncStorage.getItem("timers")) || [];
            const updatedTimers = [...storedTimers, newTimer];

            await AsyncStorage.setItem("timers", JSON.stringify(updatedTimers));
            navigation.goBack(); // Navigate back to TimerListScreen
        } catch (error) {
            Alert.alert("Error", "Failed to save the timer.");
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar backgroundColor="#28a745" barStyle="light-content" />
            <HeaderComponent title="Add Timer" showBackButton={true} onBackPress={() => navigation.goBack()} />
            <View style={styles.container}>
                <Text style={styles.heading}>Add New Timer</Text>

                {/* Timer Name Input */}
                <Text style={styles.label}>Timer Name</Text>
                <TextInput
                    placeholder="Enter timer name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />

                {/* Duration Input */}
                <Text style={styles.label}>Duration (seconds)</Text>
                <TextInput
                    placeholder="Enter duration"
                    keyboardType="numeric"
                    value={duration}
                    onChangeText={setDuration}
                    style={styles.input}
                />

                {/* Category Picker */}
                <Text style={styles.label}>Category</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={category}
                        onValueChange={setCategory}
                        style={styles.picker}
                    >
                        <Picker.Item label="Workout" value="Workout" />
                        <Picker.Item label="Study" value="Study" />
                        <Picker.Item label="Break" value="Break" />
                    </Picker>
                </View>

                {/* Save Timer Button */}
                <TouchableOpacity style={styles.saveButton} onPress={saveTimer}>
                    <Text style={styles.buttonText}>Save Timer</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    container: {
        margin: 20,
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 15,
        overflow: "hidden",
    },
    picker: {
        height: 50,
    },
    saveButton: {
        backgroundColor: "#28a745",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AddTimerScreen;
