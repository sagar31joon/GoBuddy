import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
    StyleSheet,
    Switch,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CreatePostPayload } from '../types';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (post: CreatePostPayload) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [content, setContent] = useState('');
    const [isLiveLocation, setIsLiveLocation] = useState(true);
    const [manualLocation, setManualLocation] = useState('');
    const [splitBill, setSplitBill] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = () => {
        if (!content.trim()) return;
        onSubmit({
            content,
            isLiveLocation,
            manualLocation,
            splitBill,
            isPaid,
            price: isPaid ? parseInt(price) || 0 : undefined,
            date: date || new Date().toISOString(),
        });
        // Reset form
        setContent('');
        setIsLiveLocation(true);
        setManualLocation('');
        setIsPaid(false);
        setPrice('');
        setDate('');
        onClose();
    };

    return (
        <Modal visible={isOpen} animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>New Activity</Text>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={!content.trim()}
                        style={[styles.postButton, !content.trim() && styles.postButtonDisabled]}
                    >
                        <Text style={styles.postButtonText}>Post</Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                    {/* Content Input */}
                    <TextInput
                        style={styles.contentInput}
                        placeholder="What's the plan? e.g., Tennis match at Central Park, need a partner..."
                        placeholderTextColor="#9CA3AF"
                        value={content}
                        onChangeText={setContent}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    {/* Location Toggle */}
                    <View style={styles.option}>
                        <View style={styles.optionLeft}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="location" size={20} color="#2563EB" />
                            </View>
                            <View>
                                <Text style={styles.optionTitle}>Location</Text>
                                <Text style={styles.optionSubtitle}>
                                    {isLiveLocation ? 'Sharing precise location' : 'Not sharing precise location'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={isLiveLocation}
                            onValueChange={setIsLiveLocation}
                            trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
                            thumbColor="#fff"
                        />
                    </View>

                    {!isLiveLocation && (
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter location manually..."
                            placeholderTextColor="#9CA3AF"
                            value={manualLocation}
                            onChangeText={setManualLocation}
                        />
                    )}

                    {/* Date Input */}
                    <View style={styles.dateContainer}>
                        <Ionicons name="calendar" size={20} color="#6B7280" />
                        <TextInput
                            style={styles.dateInput}
                            placeholder="Select date (YYYY-MM-DD)"
                            placeholderTextColor="#9CA3AF"
                            value={date}
                            onChangeText={setDate}
                        />
                    </View>

                    {/* Money Options */}
                    <View style={styles.moneyOptions}>
                        <TouchableOpacity
                            onPress={() => {
                                setSplitBill(!splitBill);
                                if (!splitBill) setIsPaid(false);
                            }}
                            style={[styles.moneyButton, splitBill && styles.moneyButtonActive]}
                        >
                            <Text style={styles.halfSymbol}>½</Text>
                            <Text style={[styles.moneyButtonText, splitBill && styles.moneyButtonTextActive]}>
                                Split Bill
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setIsPaid(!isPaid);
                                if (!isPaid) setSplitBill(false);
                            }}
                            style={[styles.moneyButton, styles.paidButton, isPaid && styles.paidButtonActive]}
                        >
                            <Ionicons
                                name="cash"
                                size={16}
                                color={isPaid ? '#92400E' : '#6B7280'}
                            />
                            <Text style={[styles.moneyButtonText, isPaid && styles.paidButtonTextActive]}>
                                Paid Entry
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Price Input */}
                    {isPaid && (
                        <View style={styles.priceContainer}>
                            <Text style={styles.rupeeSymbol}>₹</Text>
                            <TextInput
                                style={styles.priceInput}
                                placeholder="Enter amount (e.g. 500)"
                                placeholderTextColor="#FDE68A"
                                value={price}
                                onChangeText={(text) => {
                                    if (text === '' || /^\d+$/.test(text)) {
                                        setPrice(text);
                                    }
                                }}
                                keyboardType="numeric"
                            />
                        </View>
                    )}
                </ScrollView>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
    },
    closeButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    postButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    postButtonDisabled: {
        opacity: 0.5,
    },
    postButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 24,
        gap: 16,
        paddingBottom: 100,
    },
    contentInput: {
        fontSize: 18,
        color: '#111827',
        minHeight: 120,
        textAlignVertical: 'top',
        marginBottom: 8,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    iconContainer: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    optionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    optionSubtitle: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
    },
    textInput: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        fontSize: 14,
        backgroundColor: '#F9FAFB',
        fontWeight: '500',
        color: '#111827',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
    },
    dateInput: {
        flex: 1,
        fontSize: 14,
        fontWeight: '700',
        color: '#374151',
    },
    moneyOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    moneyButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    moneyButtonActive: {
        backgroundColor: '#F3E8FF',
        borderColor: '#E9D5FF',
    },
    paidButton: {},
    paidButtonActive: {
        backgroundColor: '#FEF3C7',
        borderColor: '#FDE68A',
    },
    moneyButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
    },
    moneyButtonTextActive: {
        color: '#7C3AED',
    },
    paidButtonTextActive: {
        color: '#92400E',
    },
    halfSymbol: {
        fontSize: 18,
        fontWeight: '700',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        borderWidth: 1,
        borderColor: '#FDE68A',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    rupeeSymbol: {
        fontSize: 18,
        fontWeight: '700',
        color: '#92400E',
    },
    priceInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#78350F',
    },
});

export default CreatePostModal;
