import React, { useEffect, useState } from "react";
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet,
    StatusBar,
    ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import HeaderComponent from "../components/HeaderComponent";
import CompletionModal from "../components/CompletionModal";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const TimerListScreen = ({ navigation }) => {
    const [timers, setTimers] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [completedTimer, setCompletedTimer] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);


    useEffect(() => {
        const loadTimers = async () => {
            const storedTimers = JSON.parse(await AsyncStorage.getItem("timers")) || [];
            setTimers(storedTimers);
        };
        loadTimers();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimers((prevTimers) => {
                return prevTimers.map((timer) => {
                    if (timer.status === "Running" && timer.remaining > 0) {
                        return { ...timer, remaining: timer.remaining - 1 };
                    } else if (timer.status === "Running" && timer.remaining === 0) {
                        const completedTimer = { ...timer, status: "Completed" };
                        handleTimerCompletion(completedTimer);
                        return completedTimer;
                    }
                    return timer;
                });
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleTimerCompletion = async (completedTimer) => {
        try {
            const existingHistory = await AsyncStorage.getItem("timerHistory");
            const history = existingHistory ? JSON.parse(existingHistory) : [];
            const newEntry = {
                name: completedTimer.name,
                completedAt: new Date().toLocaleString(),
            };
            history.push(newEntry);
            await AsyncStorage.setItem("timerHistory", JSON.stringify(history));
            setCompletedTimer(completedTimer);
            setIsModalVisible(true);
        } catch (error) {
            console.error("Error saving completed timer:", error);
        }
    };



    const toggleCategory = (category) => {
        setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
    };

    const startTimer = (id) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) =>
                timer.id === id ? { ...timer, status: "Running" } : timer
            )
        );
    };

    const pauseTimer = (id) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) =>
                timer.id === id ? { ...timer, status: "Paused" } : timer
            )
        );
    };

    const resetTimer = (id) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) =>
                timer.id === id ? { ...timer, status: "Idle", remaining: timer.duration } : timer
            )
        );
    };

    const startAllTimers = (category) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) =>
                timer.category === category ? { ...timer, status: "Running" } : timer
            )
        );
    };

    const pauseAllTimers = (category) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) =>
                timer.category === category ? { ...timer, status: "Paused" } : timer
            )
        );
    };

    const resetAllTimers = (category) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) =>
                timer.category === category ? { ...timer, status: "Idle", remaining: timer.duration } : timer
            )
        );
    };


    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar backgroundColor="#28a745" barStyle="light-content" />
            <HeaderComponent
                title="Timer Screen"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
                showHistoryIcon={true}
                onHistoryPress={() => navigation.navigate("HistoryScreen")}
            />

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{ marginHorizontal: 15, marginTop: 20 }}>
                    {["Workout", "Study", "Break"].map((category) => {
                        const isExpanded = expandedCategories[category];
                        const categoryTimers = timers.filter((t) => t.category === category);

                        return (
                            <View key={category} style={styles.categoryContainer}>
                                <TouchableOpacity onPress={() => toggleCategory(category)} style={styles.categoryHeader}>
                                    <Text style={styles.categoryText}>{category}</Text>
                                    <AntDesign name={isExpanded ? "up" : "down"} size={18} color="black" />
                                </TouchableOpacity>

                                {isExpanded && (
                                    <View style={{ maxHeight: 800 }}>
                                        <View style={styles.categoryButtons}>
                                            <TouchableOpacity onPress={() => startAllTimers(category)} style={[styles.actionButton, { backgroundColor: "#4caf50" }]}>
                                                <Text style={styles.buttonText}>Start All</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => pauseAllTimers(category)} style={[styles.actionButton, { backgroundColor: "#f4a261" }]}>
                                                <Text style={styles.buttonText}>Pause All</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => resetAllTimers(category)} style={[styles.actionButton, { backgroundColor: "#e63946" }]}>
                                                <Text style={styles.buttonText}>Reset All</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <FlatList
                                            data={categoryTimers}
                                            renderItem={({ item }) => {
                                                const progress = Math.max(0, Math.min((item.remaining / item.duration) * 100, 100));
                                                return (
                                                    <View style={styles.timerItem}>
                                                        <Text style={styles.timerText}>{item.name}</Text>
                                                        <Text style={styles.remainingText}>{item.remaining}s left</Text>
                                                        <Text style={styles.statusText}>{item.status}</Text>

                                                        <View style={styles.progressContainer}>
                                                            <View style={[
                                                                styles.progressBar,
                                                                { width: `${progress}%`, backgroundColor: item.status === "Running" ? "#4caf50" : "#ddd" }
                                                            ]} />
                                                        </View>
                                                        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                                                        <View style={styles.buttonRow}>
                                                            <TouchableOpacity onPress={() => startTimer(item.id)} style={styles.actionButton}>
                                                                <Text style={styles.buttonText}>Start</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => pauseTimer(item.id)} style={[styles.actionButton, { backgroundColor: "#f4a261" }]}>
                                                                <Text style={styles.buttonText}>Pause</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => resetTimer(item.id)} style={[styles.actionButton, { backgroundColor: "#e63946" }]}>
                                                                <Text style={styles.buttonText}>Reset</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                );
                                            }}
                                            keyExtractor={(item) => item.id}
                                            contentContainerStyle={styles.timerList}
                                            showsVerticalScrollIndicator={false}
                                        />
                                    </View>
                                )}

                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <CompletionModal
                visible={isModalVisible}
                timerName={completedTimer?.name || "Timer"}
                onClose={() => setIsModalVisible(false)}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("AddTimer")}
            >
                <AntDesign name="plus" size={24} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#f7f7f7",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    categoryContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: "hidden",
    },
    categoryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#ddd",
    },
    categoryText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    timerList: {
        padding: 10,
    },
    timerItem: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 10,
    },
    timerText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    remainingText: {
        fontSize: 14,
        color: "#555",
    },
    statusText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#007bff",
        marginBottom: 8,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    actionButton: {
        backgroundColor: "#28a745",
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    addButton: {
        position: "absolute",
        right: 20,
        bottom: 30,
        backgroundColor: "#28a745",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    progressContainer: {
        height: 8,
        width: "100%",
        backgroundColor: "#ddd",
        borderRadius: 5,
        overflow: "hidden",
        marginTop: 5,
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#ddd",
        borderRadius: 5,
    },
    progressText: {
        textAlign: "right",
        fontSize: 12,
        color: "#333",
        marginTop: 3,
    },
    categoryButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        paddingHorizontal: 10,
    },
    actionButton: {
        flex: 1,
        padding: 8,
        marginHorizontal: 5,
        backgroundColor: "#4caf50",
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default TimerListScreen;

