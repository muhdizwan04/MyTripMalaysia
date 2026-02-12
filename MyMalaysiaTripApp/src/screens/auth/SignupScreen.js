import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../config/colors';

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleSubmit = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigation.replace('Main'); // Redirect to home/dashboard
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <View style={styles.contentContainer}>
                    <Card style={styles.card}>
                        <CardHeader>
                            <CardTitle style={styles.title}>Create an account</CardTitle>
                            <CardDescription style={styles.description}>
                                Enter your details below to create your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent style={styles.formContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Full Name</Text>
                                <Input
                                    placeholder="John Doe"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <Input
                                    placeholder="m@example.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <Input
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>
                            <Button
                                onPress={handleSubmit}
                                isLoading={isLoading}
                                style={styles.button}
                            >
                                Sign Up
                            </Button>
                        </CardContent>
                        <CardFooter>
                            <View style={styles.footerLink}>
                                <Text style={styles.footerText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.linkText}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </CardFooter>
                    </Card>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
    },
    contentContainer: {
        padding: 24,
        alignItems: 'center',
    },
    card: {
        width: '100%',
        maxWidth: 400,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
    },
    description: {
        textAlign: 'center',
    },
    formContainer: {
        gap: 16,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.foreground,
    },
    button: {
        marginTop: 8,
    },
    footerLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    footerText: {
        color: colors.mutedForeground,
        fontSize: 14,
    },
    linkText: {
        color: colors.primary,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
