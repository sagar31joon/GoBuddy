import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ImageBackground,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthScreenProps {
    onLogin: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const [showOtpToast, setShowOtpToast] = useState(false);

    const otpInputRefs = useRef<Array<TextInput | null>>([]);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const toastAnim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
        }).start();
    }, []);

    useEffect(() => {
        if (showOtpToast) {
            Animated.spring(toastAnim, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }
    }, [showOtpToast]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleSendOtp = () => {
        if (phone.length < 10) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('otp');
            setTimer(30);
            setShowOtpToast(true);
        }, 1500);
    };

    const handleVerifyOtp = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onLogin();
        }, 1000);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 3) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (index: number, key: string) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleAutoFill = () => {
        setOtp(['1', '2', '3', '4']);
        setShowOtpToast(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* OTP Toast */}
            {showOtpToast && (
                <Animated.View
                    style={[
                        styles.toast,
                        { transform: [{ translateY: toastAnim }] }
                    ]}
                >
                    <View>
                        <Text style={styles.toastLabel}>Messages • now</Text>
                        <Text style={styles.toastText}>Your GoBuddy OTP is 1234</Text>
                    </View>
                    <TouchableOpacity onPress={handleAutoFill} style={styles.autoFillButton}>
                        <Text style={styles.autoFillText}>Auto-fill</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Background */}
            <View style={styles.background}>
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80' }}
                    style={styles.backgroundImage}
                    imageStyle={{ opacity: 0.3 }}
                >
                    <View style={styles.gradient} />
                </ImageBackground>
            </View>

            {/* Content */}
            <Animated.View
                style={[
                    styles.content,
                    {
                        transform: [{
                            translateY: slideAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [300, 0]
                            })
                        }]
                    }
                ]}
            >
                <View style={styles.handle} />

                <View style={styles.header}>
                    <Text style={styles.title}>GoBuddy</Text>
                    <Text style={styles.subtitle}>Find your perfect sports partner in minutes.</Text>
                </View>

                {step === 'phone' ? (
                    <View style={styles.form}>
                        <Text style={styles.label}>MOBILE NUMBER</Text>
                        <View style={[styles.phoneInput, phone.length === 10 && styles.phoneInputActive]}>
                            <Text style={styles.countryCode}>🇮🇳 +91</Text>
                            <TextInput
                                style={styles.phoneTextInput}
                                value={phone}
                                onChangeText={(text) => setPhone(text.replace(/\D/g, '').slice(0, 10))}
                                placeholder="999 999 9999"
                                placeholderTextColor="#D1D5DB"
                                keyboardType="phone-pad"
                                maxLength={10}
                                autoFocus
                            />
                            <Ionicons
                                name="phone-portrait"
                                size={24}
                                color={phone.length === 10 ? '#10B981' : '#D1D5DB'}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleSendOtp}
                            disabled={phone.length < 10 || isLoading}
                            style={[styles.button, styles.primaryButton, (phone.length < 10 || isLoading) && styles.buttonDisabled]}
                            activeOpacity={0.8}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.buttonText}>Get OTP</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                                </>
                            )}
                        </TouchableOpacity>

                        <Text style={styles.demoText}>
                            For demo access, enter any 10-digit number.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.form}>
                        <View style={styles.otpHeader}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="shield-checkmark" size={24} color="#10B981" />
                            </View>
                            <Text style={styles.otpTitle}>Verify OTP</Text>
                            <Text style={styles.otpSubtitle}>
                                Sent to +91 {phone}{' '}
                                <Text onPress={() => setStep('phone')} style={styles.editButton}>
                                    Edit
                                </Text>
                            </Text>
                        </View>

                        <View style={styles.otpContainer}>
                            {otp.map((digit, idx) => (
                                <TextInput
                                    key={idx}
                                    ref={(ref) => { if (ref) otpInputRefs.current[idx] = ref; }}
                                    style={[styles.otpInput, digit && styles.otpInputFilled]}
                                    value={digit}
                                    onChangeText={(text) => handleOtpChange(idx, text)}
                                    onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(idx, key)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    textAlign="center"
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={handleVerifyOtp}
                            disabled={otp.some(d => !d) || isLoading}
                            style={[styles.button, styles.verifyButton, (otp.some(d => !d) || isLoading) && styles.buttonDisabled]}
                            activeOpacity={0.8}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Verify & Login</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.resendContainer}>
                            {timer > 0 ? (
                                <Text style={styles.timerText}>
                                    Resend OTP in <Text style={styles.timerBold}>00:{timer.toString().padStart(2, '0')}</Text>
                                </Text>
                            ) : (
                                <TouchableOpacity onPress={handleSendOtp}>
                                    <Text style={styles.resendButton}>Resend OTP</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            </Animated.View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    toast: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    toastLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    toastText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '700',
        marginTop: 2,
    },
    autoFillButton: {
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    autoFillText: {
        color: '#60A5FA',
        fontWeight: '700',
        fontSize: 12,
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '55%',
        backgroundColor: '#2563EB',
        borderBottomLeftRadius: 48,
        borderBottomRightRadius: 48,
        overflow: 'hidden',
    },
    backgroundImage: {
        flex: 1,
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: 'rgba(30, 58, 138, 0.8)',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 40,
    },
    handle: {
        width: 48,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        backgroundColor: '#fff',
        paddingTop: 32,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    form: {
        backgroundColor: '#fff',
        paddingHorizontal: 32,
        paddingBottom: 20,
    },
    label: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    phoneInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#F3F4F6',
        paddingVertical: 12,
        marginBottom: 24,
    },
    phoneInputActive: {
        borderBottomColor: '#2563EB',
    },
    countryCode: {
        fontSize: 18,
        fontWeight: '700',
        color: '#9CA3AF',
        marginRight: 12,
    },
    phoneTextInput: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },
    primaryButton: {
        backgroundColor: '#111827',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    verifyButton: {
        backgroundColor: '#2563EB',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    demoText: {
        textAlign: 'center',
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 16,
        paddingHorizontal: 32,
    },
    otpHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconContainer: {
        width: 48,
        height: 48,
        backgroundColor: '#D1FAE5',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    otpTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    otpSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    editButton: {
        color: '#2563EB',
        fontWeight: '700',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        paddingHorizontal: 8,
    },
    otpInput: {
        width: 56,
        height: 64,
        borderWidth: 2,
        borderColor: '#F3F4F6',
        borderRadius: 16,
        fontSize: 24,
        fontWeight: '700',
        backgroundColor: '#F9FAFB',
        color: '#111827',
    },
    otpInputFilled: {
        borderColor: '#2563EB',
        backgroundColor: '#fff',
    },
    resendContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    timerText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    timerBold: {
        color: '#111827',
    },
    resendButton: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2563EB',
    },
});

export default AuthScreen;
