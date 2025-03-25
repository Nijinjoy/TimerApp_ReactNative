import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';


const CompletionModal = ({ visible, timerName, onClose }) => {
    const navigation = useNavigation();
    const handleOkPress = () => {
        onClose(); // Close the modal
        navigation.navigate('HistoryScreen');
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>🎉 Congratulations! 🎉</Text>
                    <Text style={styles.modalMessage}>
                        The timer <Text style={styles.modalTimerName}>{timerName}</Text> has completed.
                    </Text>
                    <TouchableOpacity onPress={handleOkPress} style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: "center",
        width: "100%",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 15,
    },
    modalTimerName: {
        fontWeight: "bold",
        color: "#28a745",
    },
    modalButton: {
        backgroundColor: "#28a745",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    modalButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CompletionModal;
