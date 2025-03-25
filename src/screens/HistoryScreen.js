import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    StatusBar,
    Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderComponent from "../components/HeaderComponent";
import { folder } from "../assets/images";
import RNPickerSelect from "react-native-picker-select";

const HistoryScreen = ({ navigation }) => {
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const storedHistory = await AsyncStorage.getItem('timerHistory');
                const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];
                setHistory(parsedHistory.reverse()); // Show latest first
                setFilteredHistory(parsedHistory.reverse());
            } catch (error) {
                console.error('Error fetching timer history:', error);
            }
        };

        fetchHistory();
    }, []);

    useEffect(() => {
        if (selectedCategory === "all") {
            setFilteredHistory(history);
        } else {
            setFilteredHistory(history.filter(item => item.category === selectedCategory));
        }
    }, [selectedCategory, history]);

    const renderItem = ({ item }) => (
        <View style={styles.historyItem}>
            <Text style={styles.timerName}>{item.name}</Text>
            <Text style={styles.timestamp}>{item.completedAt}</Text>
            <Text style={styles.categoryText}>Category: {item.category}</Text>
        </View>
    );

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Image
                source={folder}
                style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>No timers completed yet.</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#28a745" barStyle="light-content" />
            <HeaderComponent title="Timer History" showBackButton={true} onBackPress={() => navigation.goBack()} />
            <View style={styles.content}>
                {/* Filter Dropdown */}
                <RNPickerSelect
                    onValueChange={(value) => setSelectedCategory(value)}
                    items={[
                        { label: "All Categories", value: "all" },
                        { label: "Work", value: "work" },
                        { label: "Exercise", value: "exercise" },
                        { label: "Study", value: "study" },
                        { label: "Personal", value: "personal" },
                    ]}
                    style={pickerSelectStyles}
                    value={selectedCategory}
                    placeholder={{ label: "Select Category", value: null }}
                />
                <FlatList
                    data={filteredHistory}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmptyComponent}
                    contentContainerStyle={filteredHistory.length === 0 ? styles.emptyContent : null}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f4f4f4" },
    content: { flex: 1, marginHorizontal: 15, marginTop: 10 },
    historyItem: {
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    timerName: { fontSize: 18, fontWeight: "600", color: "#333" },
    timestamp: { fontSize: 14, color: "#666", marginTop: 5 },
    categoryText: { fontSize: 14, color: "#888", marginTop: 5 },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    emptyImage: { width: 120, height: 120, marginBottom: 20 },
    emptyText: { fontSize: 16, color: "#888" },
    emptyContent: { flexGrow: 1, justifyContent: 'center' },
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        color: "#333",
        backgroundColor: "#fff",
        marginBottom: 10,
    },
    inputAndroid: {
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        color: "#333",
        backgroundColor: "#fff",
        marginBottom: 10,
    },
};

export default HistoryScreen;
