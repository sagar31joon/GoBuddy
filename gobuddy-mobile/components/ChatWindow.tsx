import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    PanResponder,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const COLLAPSED_HEIGHT = 110;

interface ChatWindowProps {
    user: {
        name: string;
        avatar: string;
        sport: string;
    };
    onClose: () => void;
    initialMode?: 'collapsed' | 'expanded';
}

interface Message {
    id: string;
    text: string;
    sender: 'me' | 'them';
    timestamp: Date;
}

const DEMO_RESPONSES = [
    "Sounds good! See you there.",
    "I'll be there in about 10 minutes.",
    "Perfect, looking forward to it!",
    "Do you have an extra racket?",
    "Great! Let's play.",
    "On my way!",
    "Thanks for organizing this.",
    "Is there parking nearby?"
];

export default function ChatWindow({ user, onClose, initialMode = 'collapsed' }: ChatWindowProps) {
    const insets = useSafeAreaInsets();
    const [currentMode, setCurrentMode] = useState<'collapsed' | 'expanded'>(initialMode);
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    // Initial Mock Messages
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: `Hey! I saw you're interested in ${user.sport}. Want to join up?`, sender: 'them', timestamp: new Date(Date.now() - 3600000) },
        { id: '2', text: "Hi! Yes, I'd love to. Where are you planning to play?", sender: 'me', timestamp: new Date(Date.now() - 3500000) },
        { id: '3', text: "I was thinking about the city complex. It's half way for both of us I think.", sender: 'them', timestamp: new Date(Date.now() - 3400000) },
    ]);

    // Expanded: Stop below the status bar (top inset)
    const expandedPos = insets.top + 10;
    // Collapsed: Show only the preview card at the bottom
    const collapsedPos = SCREEN_HEIGHT - COLLAPSED_HEIGHT - insets.bottom - 20;

    // Animated Value for Y translation
    const panY = useRef(new Animated.Value(initialMode === 'expanded' ? expandedPos : SCREEN_HEIGHT)).current;

    useEffect(() => {
        // Initial slide animation
        Animated.spring(panY, {
            toValue: initialMode === 'expanded' ? expandedPos : collapsedPos,
            useNativeDriver: true,
            damping: 20,
            stiffness: 100
        }).start();
    }, []);

    const animateTo = (toValue: number, mode: 'collapsed' | 'expanded') => {
        setCurrentMode(mode);
        Animated.spring(panY, {
            toValue,
            useNativeDriver: true,
            damping: 20,
            stiffness: 100
        }).start();
    };

    const expand = () => animateTo(expandedPos, 'expanded');
    const collapse = () => animateTo(collapsedPos, 'collapsed');

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, { dx, dy }) => Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10,
            onPanResponderGrant: () => {
                panY.setOffset((panY as any)._value);
                panY.setValue(0);
            },
            onPanResponderMove: Animated.event(
                [null, { dy: panY }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (_, { dy, vy }) => {
                panY.flattenOffset();

                // Logic based on drag direction
                if (dy < -50 || vy < -0.5) {
                    expand();
                } else if (dy > 50 || vy > 0.5) {
                    if (currentMode === 'expanded') collapse();
                } else {
                    if (currentMode === 'expanded') expand();
                    else collapse();
                }
            }
        })
    ).current;

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'me',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        scrollToBottom();

        // Simulate Auto Response
        simulateAutoResponse();
    };

    const simulateAutoResponse = () => {
        const delay = Math.random() * 1000 + 500; // 0.5s - 1.5s
        const randomResponse = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];

        setTimeout(() => {
            const responseMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: randomResponse,
                sender: 'them',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, responseMsg]);
            scrollToBottom();
        }, delay);
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const lastMessage = messages[messages.length - 1];

    return (
        <View style={styles.overlayContainer} pointerEvents="box-none">
            <Animated.View
                style={[
                    styles.sheetContainer,
                    {
                        transform: [{ translateY: panY }]
                    }
                ]}
            >
                {/* Visual Handle / Header */}
                <View
                    style={[
                        styles.cardHeader,
                        currentMode === 'collapsed' ? styles.cardCollapsed : styles.cardExpanded,
                    ]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.dragHandle} />

                    <View style={styles.headerContent}>
                        <View style={styles.userInfo}>
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                            <View style={styles.textContainer}>
                                <View style={styles.nameRow}>
                                    <Text style={styles.name}>{user.name}</Text>
                                    <View style={styles.unreadBadge}>
                                        <Text style={styles.unreadText}>1</Text>
                                    </View>
                                </View>
                                <View style={styles.messagePreviewRow}>
                                    <Text style={styles.lastMessage} numberOfLines={1}>
                                        {lastMessage ? lastMessage.text : `Hey! I saw you're interested in ${user.sport}...`}
                                    </Text>
                                    <Text style={styles.timestamp}>
                                        {lastMessage ? lastMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '12:30 PM'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Controls */}
                        {currentMode === 'collapsed' && (
                            <TouchableOpacity onPress={onClose} style={styles.closeBtnSmall}>
                                <Ionicons name="close" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}

                        {currentMode === 'expanded' && (
                            <TouchableOpacity onPress={collapse} style={styles.minimizeBtn}>
                                <Ionicons name="chevron-down" size={24} color="#111827" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Chat Content - Hidden when collapsed to save resources/avoid rendering glitches */}
                <View style={[styles.fullChatArea, { opacity: currentMode === 'expanded' ? 1 : 0, paddingBottom: expandedPos }]}>
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.messagesList}
                        contentContainerStyle={styles.messagesContent}
                        onContentSizeChange={() => scrollToBottom()}
                    >
                        {messages.map((msg) => (
                            <View
                                key={msg.id}
                                style={[
                                    styles.bubble,
                                    msg.sender === 'me' ? styles.bubbleRight : styles.bubbleLeft
                                ]}
                            >
                                <Text style={msg.sender === 'me' ? styles.textRight : styles.textLeft}>
                                    {msg.text}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                    >
                        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                            <TouchableOpacity style={styles.attachBtn}>
                                <Ionicons name="add" size={24} color="#6B7280" />
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
                            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                                <Ionicons name="send" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>

            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
        elevation: 1000,
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        height: SCREEN_HEIGHT,
        width: '100%',
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    cardHeader: {
        // Shared header styles
        paddingHorizontal: 20,
        paddingBottom: 16,
        zIndex: 20,
    },
    cardCollapsed: {
        height: COLLAPSED_HEIGHT,
        marginHorizontal: 16,
        borderRadius: 16,
        paddingTop: 12,
        backgroundColor: '#F5F6FA', // Light tinted background
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardExpanded: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#D1D5DB',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginBottom: 12,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    unreadBadge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 8,
    },
    unreadText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    messagePreviewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    lastMessage: {
        fontSize: 13,
        color: '#6B7280',
        maxWidth: '70%',
    },
    timestamp: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    closeBtnSmall: {
        padding: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 20,
    },
    minimizeBtn: {
        padding: 8,
    },
    fullChatArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messagesList: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    messagesContent: {
        padding: 20,
        gap: 16,
        paddingBottom: 40,
    },
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
        color: '#111827',
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
