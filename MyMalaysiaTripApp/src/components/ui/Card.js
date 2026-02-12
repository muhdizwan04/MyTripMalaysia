import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../config/colors';

export function Card({ children, style }) {
    return <View style={[styles.card, style]}>{children}</View>;
}

export function CardHeader({ children, style }) {
    return <View style={[styles.header, style]}>{children}</View>;
}

export function CardTitle({ children, style }) {
    return <Text style={[styles.title, style]}>{children}</Text>;
}

export function CardDescription({ children, style }) {
    return <Text style={[styles.description, style]}>{children}</Text>;
}

export function CardContent({ children, style }) {
    return <View style={[styles.content, style]}>{children}</View>;
}

export function CardFooter({ children, style }) {
    return <View style={[styles.footer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        overflow: 'hidden',
    },
    header: {
        padding: 24,
        paddingBottom: 0,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.foreground,
        lineHeight: 28, // leading-none equivalent usually tighter but for title good
    },
    description: {
        fontSize: 14,
        color: colors.mutedForeground,
        marginTop: 6,
    },
    content: {
        padding: 24,
    },
    footer: {
        padding: 24,
        paddingTop: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
