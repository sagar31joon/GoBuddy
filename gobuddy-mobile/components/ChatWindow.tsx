import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChatWindowProps {
    user: {
        name: string;
        avatar: string;
        sport: string;
    };
    onClose: () => void;
}

export default function ChatWindow({ user, onClose }: ChatWindowProps) {
    const insets = useSafeAreaInsets();
    const [message, setMessage] = useState('');

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    <View>
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.sport}>{user.sport}</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={24} color="#111827" />
                </TouchableOpacity>
            </View>

            {/* Chat Area */}
            <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
                <View style={[styles.bubble, styles.bubbleLeft]}>
                    <Text style={styles.textLeft}>Hey! I saw you're interested in {user.sport}. Want to join up?</Text>
                </View>
                <View style={[styles.bubble, styles.bubbleRight]}>
                    <Text style={styles.textRight}>Hi! Yes, I'd love to. Where are you planning to play?</Text>
                </View>
                <View style={[styles.bubble, styles.bubbleLeft]}>
                    <Text style={styles.textLeft}>I was thinking about the city complex. It's half way for both of us I think.</Text>
                </View>
            </ScrollView>

            {/* Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                    <TouchableOpacity style={styles.attachBtn}>
                        <Ionicons name="add" size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity style={styles.sendBtn}>
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backBtn: { padding: 8, marginRight: 8 },
    headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 40, height: 40, borderRadius: 20 },
    name: { fontSize: 16, fontWeight: '700', color: '#111827' },
    sport: { fontSize: 12, color: '#6B7280' },
    chatArea: { flex: 1, backgroundColor: '#F9FAFB' },
    chatContent: { padding: 20, gap: 16 },
    bubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 4 },
    bubbleLeft: { alignSelf: 'flex-start', backgroundColor: '#fff', borderBottomLeftRadius: 4 },
    bubbleRight: { alignSelf: 'flex-end', backgroundColor: '#2563EB', borderBottomRightRadius: 4 },
    textLeft: { color: '#374151', fontSize: 14 },
    textRight: { color: '#fff', fontSize: 14 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#fff',
        gap: 12,
    },
    attachBtn: { padding: 8 },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        maxHeight: 100,
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
