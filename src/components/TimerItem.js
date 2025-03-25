import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ProgressBarAndroid } from "react-native";

const TimerItem = ({ timer }) => {
    const [remaining, setRemaining] = useState(timer.remaining);
    const [status, setStatus] = useState(timer.status);

    useEffect(() => {
        let interval;
        if (status === "Running") {
            interval = setInterval(() => {
                setRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setStatus("Completed");
                        alert(`${timer.name} has completed!`);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [status]);

    return (
        <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{timer.name} - {status}</Text>
            <ProgressBarAndroid styleAttr="Horizontal" progress={remaining / timer.duration} />

            <View style={styles.buttons}>
                <Button title="Start" onPress={() => setStatus("Running")} />
                <Button title="Pause" onPress={() => setStatus("Paused")} />
                <Button title="Reset" onPress={() => { setStatus("Idle"); setRemaining(timer.duration); }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    timerContainer: { padding: 10, borderWidth: 1, marginTop: 5 },
    timerText: { fontSize: 16 },
    buttons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 }
});

export default TimerItem;
