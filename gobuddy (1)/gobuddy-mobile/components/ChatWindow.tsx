import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatWindowProps {
    partnerName: string;
    onClose: () => void;
}

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'them';
    time: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ partnerName, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: `Hey! I saw your post about sports.`, sender: 'me', time: 'Just now' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [
                ...prev,
                { id: 2, text: `Hi! Yes, I'm still looking for a partner. Are you interested?`, sender: 'them', time: 'Just now' }
            ]);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMsg: Message = {
            id: Date.now(),
            text: inputText,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMsg]);
        setInputText('');

        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: "Sounds great! Let's connect at the venue.",
                    sender: 'them',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }, 2500);
    };

    return (
        <Modal visible={true} animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#2563EB" />
                    </TouchableOpacity>
                    <View style={styles.headerInfo}>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarText}>{partnerName.charAt(0)}</Text>
                            <View style={styles.onlineDot} />
                        </View>
                        <View>
                            <Text style={styles.partnerName}>{partnerName}</Text>
                            <Text style={styles.activeStatus}>Active now</Text>
                        </View>
                    </View>
                    <View style={styles.headerActions}>
                        <Ionicons name="call" size={22} color="#2563EB" style={{ marginRight: 16 }} />
                        <Ionicons name="videocam" size={24} color="#2563EB" />
                    </View>
                </View>

                {/* Messages */}
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    <Text style={styles.dateLabel}>Today</Text>

                    {messages.map((msg) => (
                        <View
                            key={msg.id}
                            style={[styles.messageRow, msg.sender === 'me' ? styles.messageRowRight : styles.messageRowLeft]}
                        >
                            {msg.sender === 'them' && (
                                <View style={styles.smallAvatar}>
                                    <Text style={styles.smallAvatarText}>{partnerName.charAt(0)}</Text>
                                </View>
                            )}
                            <View
                                style={[
                                    styles.messageBubble,
                                    msg.sender === 'me' ? styles.myMessage : styles.theirMessage,
                                ]}
                            >
                                <Text style={msg.sender === 'me' ? styles.myMessageText : styles.theirMessageText}>
                                    {msg.text}
                                </Text>
                            </View>
                        </View>
                    ))}

                    {isTyping && (
                        <View style={[styles.messageRow, styles.messageRowLeft]}>
                            <View style={styles.smallAvatar}>
                                <Text style={styles.smallAvatarText}>{partnerName.charAt(0)}</Text>
                            </View>
                            <View style={[styles.messageBubble, styles.theirMessage]}>
                                <View style={styles.typingIndicator}>
                                    <View style={styles.typingDot} />
                                    <View style={styles.typingDot} />
                                    <View style={styles.typingDot} />
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Input */}
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachButton}>
                        <Ionicons name="image" size={20} color="#2563EB" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.attachButton}>
                        <Ionicons name="mic" size={20} color="#2563EB" />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor="#9CA3AF"
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmitEditing={handleSend}
                        returnKeyType="send"
                    />

                    <TouchableOpacity
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                    >
                        <Ionicons name="send" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingTop: 50,
    },
    backButton: {
        padding: 4,
        marginRight: 8,
    },
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#fff',
    },
    partnerName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    activeStatus: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    messagesContent: {
        padding: 16,
        gap: 16,
    },
    dateLabel: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
        marginVertical: 16,
    },
    messageRow: {
        flexDirection: 'row',
        gap: 8,
    },
    messageRowLeft: {
        justifyContent: 'flex-start',
    },
    messageRowRight: {
        justifyContent: 'flex-end',
    },
    smallAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    smallAvatarText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    messageBubble: {
        maxWidth: '75%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
    },
    myMessage: {
        backgroundColor: '#2563EB',
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderBottomLeftRadius: 4,
    },
    myMessageText: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 22,
    },
    theirMessageText: {
        color: '#111827',
        fontSize: 15,
        lineHeight: 22,
    },
    typingIndicator: {
        flexDirection: 'row',
        gap: 4,
    },
    typingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#9CA3AF',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        gap: 12,
        paddingBottom: 24,
    },
    attachButton: {
        backgroundColor: '#EFF6FF',
        padding: 8,
        borderRadius: 20,
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
    },
    sendButton: {
        backgroundColor: '#2563EB',
        padding: 10,
        borderRadius: 20,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});

export default ChatWindow;
