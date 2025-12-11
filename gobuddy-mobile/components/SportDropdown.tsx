import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPORTS_LIST, SPORT_ICONS } from '../constants';

interface SportDropdownProps {
    selectedSport: string;
    onSelect: (sport: string) => void;
    includeAll?: boolean;
    label?: string;
}

const SportDropdown: React.FC<SportDropdownProps> = ({ selectedSport, onSelect, includeAll = false, label }) => {
    const [isOpen, setIsOpen] = useState(false);

    const data = includeAll ? ['All', ...SPORTS_LIST] : SPORTS_LIST;

    const getIcon = (sport: string) => {
        if (sport === 'All') return '🌍';
        return SPORT_ICONS[sport] || '🏅';
    };

    const handleSelect = (item: string) => {
        onSelect(item);
        setIsOpen(false);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setIsOpen(true)}
            >
                <View style={styles.selectedRow}>
                    <Text style={styles.selectedIcon}>{getIcon(selectedSport)}</Text>
                    <Text style={styles.selectedText}>{selectedSport || 'Select Sport'}</Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.dropdownModal}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Select Sport</Text>
                                    <TouchableOpacity onPress={() => setIsOpen(false)}>
                                        <Ionicons name="close" size={24} color="#111827" />
                                    </TouchableOpacity>
                                </View>
                                <FlatList
                                    data={data}
                                    keyExtractor={(item) => item}
                                    style={styles.list}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={[styles.item, item === selectedSport && styles.itemSelected]}
                                            onPress={() => handleSelect(item)}
                                        >
                                            <View style={styles.itemRow}>
                                                <Text style={styles.itemIcon}>{getIcon(item)}</Text>
                                                <Text style={[styles.itemText, item === selectedSport && styles.itemTextSelected]}>
                                                    {item}
                                                </Text>
                                            </View>
                                            {item === selectedSport && (
                                                <Ionicons name="checkmark" size={20} color="#2563EB" />
                                            )}
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    selectedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    selectedIcon: {
        fontSize: 18,
    },
    selectedText: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    dropdownModal: {
        backgroundColor: '#fff',
        borderRadius: 24,
        maxHeight: '70%',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    list: {
        paddingVertical: 8,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    itemSelected: {
        backgroundColor: '#EFF6FF',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    itemIcon: {
        fontSize: 20,
    },
    itemText: {
        fontSize: 16,
        color: '#374151',
    },
    itemTextSelected: {
        color: '#111827',
        fontWeight: '600',
    },
});

export default SportDropdown;
