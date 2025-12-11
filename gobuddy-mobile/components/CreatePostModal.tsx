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
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { CreatePostPayload } from '../types';
import { SPORTS_LIST } from '../constants';
import SportDropdown from './SportDropdown';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (post: CreatePostPayload) => void;
}

const SKILLS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [content, setContent] = useState('');
    const [sport, setSport] = useState(SPORTS_LIST[0]);
    const [skillLevel, setSkillLevel] = useState<any>('All Levels');
    const [usePreciseLocation, setUsePreciseLocation] = useState(false);
    const [manualLocation, setManualLocation] = useState('');
    const [splitBill, setSplitBill] = useState(false);
    const [date, setDate] = useState('');
    const [isLoadingLoc, setIsLoadingLoc] = useState(false);

    const handleLocationToggle = async (value: boolean) => {
        setUsePreciseLocation(value);
        if (value) {
            setIsLoadingLoc(true);
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setUsePreciseLocation(false);
                    return;
                }
                setIsLoadingLoc(false);
            } catch (error) {
                setUsePreciseLocation(false);
                setIsLoadingLoc(false);
            }
        }
    };

    const handleSubmit = () => {
        if (!content.trim()) return;
        onSubmit({
            content,
            sport,
            skillLevel,
            isLiveLocation: usePreciseLocation,
            manualLocation: usePreciseLocation ? 'Precise Location' : manualLocation,
            splitBill,
            date: date || new Date().toISOString(),
        });

        setContent('');
        setSport(SPORTS_LIST[0]);
        setSkillLevel('All Levels');
        setUsePreciseLocation(false);
        setManualLocation('');
        setSplitBill(false);
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
                        <Ionicons name="close" size={28} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Schedule Match</Text>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={!content.trim()}
                        style={[styles.postButton, !content.trim() && styles.postButtonDisabled]}
                    >
                        <Text style={styles.postButtonText}>Post</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>



                    {/* Sport Selector */}
                    <Text style={styles.label}>Select Sport</Text>
                    <SportDropdown
                        selectedSport={sport}
                        onSelect={setSport}
                    />

                    {/* Skill Level */}
                    <Text style={styles.label}>Skill Level</Text>
                    <View style={styles.wrapRow}>
                        {SKILLS.map(s => (
                            <TouchableOpacity
                                key={s}
                                style={[styles.chip, skillLevel === s && styles.chipActive]}
                                onPress={() => setSkillLevel(s)}
                            >
                                <Text style={[styles.chipText, skillLevel === s && styles.chipTextActive]}>{s}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Content */}
                    <Text style={styles.label}>Plan Details</Text>
                    <TextInput
                        style={styles.contentInput}
                        placeholder="What's the plan? e.g., Looking for a doubles partner..."
                        placeholderTextColor="#9CA3AF"
                        value={content}
                        onChangeText={setContent}
                        multiline
                        textAlignVertical="top"
                    />

                    {/* Location */}
                    <View style={styles.sectionCard}>
                        <View style={styles.rowBetween}>
                            <View style={styles.row}>
                                <View style={styles.iconBox}>
                                    <Ionicons name="location" size={20} color="#2563EB" />
                                </View>
                                <View>
                                    <Text style={styles.rowTitle}>Precise Location</Text>
                                    <Text style={styles.rowSubtitle}>Use GPS coordinates</Text>
                                </View>
                            </View>
                            {isLoadingLoc ? (
                                <ActivityIndicator size="small" color="#2563EB" />
                            ) : (
                                <Switch
                                    value={usePreciseLocation}
                                    onValueChange={handleLocationToggle}
                                    trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
                                    thumbColor="#fff"
                                />
                            )}
                        </View>

                        {!usePreciseLocation && (
                            <TextInput
                                style={styles.subInput}
                                placeholder="Enter location name manually..."
                                placeholderTextColor="#9CA3AF"
                                value={manualLocation}
                                onChangeText={setManualLocation}
                            />
                        )}
                    </View>

                    {/* Date */}
                    <View style={styles.sectionCard}>
                        <View style={styles.row}>
                            <View style={styles.iconBox}>
                                <Ionicons name="calendar" size={20} color="#7C3AED" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowTitle}>Date & Time</Text>
                                <TextInput
                                    style={styles.dateInput}
                                    placeholder="YYYY-MM-DD HH:MM"
                                    placeholderTextColor="#9CA3AF"
                                    value={date}
                                    onChangeText={setDate}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Bill Split */}
                    <View style={styles.sectionCard}>
                        <View style={styles.rowBetween}>
                            <View style={styles.row}>
                                <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                                    <Ionicons name="wallet" size={20} color="#059669" />
                                </View>
                                <View>
                                    <Text style={styles.rowTitle}>Split Bill</Text>
                                    <Text style={styles.rowSubtitle}>Share costs equally</Text>
                                </View>
                            </View>
                            <Switch
                                value={splitBill}
                                onValueChange={setSplitBill}
                                trackColor={{ false: '#D1D5DB', true: '#059669' }}
                                thumbColor="#fff"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    closeButton: { padding: 4 },
    postButton: { backgroundColor: '#111827', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
    postButtonDisabled: { opacity: 0.5 },
    postButtonText: { color: '#fff', fontWeight: '600' },
    scrollView: { flex: 1 },
    content: { padding: 24, gap: 20, paddingBottom: 100 },
    label: { fontSize: 16, fontWeight: '700', marginBottom: -10, color: '#111827' },
    hScroll: { flexDirection: 'row', gap: 10, paddingBottom: 4 },
    wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#F3F4F6'
    },
    chipActive: {
        backgroundColor: '#111827',
        borderColor: '#111827',
    },
    chipText: { fontSize: 14, color: '#374151', fontWeight: '500' },
    chipTextActive: { color: '#fff' },
    contentInput: {
        fontSize: 16,
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    sectionCard: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 12,
    },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
    rowSubtitle: { fontSize: 12, color: '#6B7280' },
    subInput: {
        fontSize: 14,
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    dateInput: {
        fontSize: 14,
        color: '#111827',
        marginTop: 4,
    },
});

export default CreatePostModal;
