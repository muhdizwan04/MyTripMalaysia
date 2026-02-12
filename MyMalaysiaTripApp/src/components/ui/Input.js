import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors } from '../../config/colors';

export function Input({ style, ...props }) {
    return (
        <TextInput
            style={[styles.input, style]}
            placeholderTextColor={colors.mutedForeground}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: '100%',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.input,
        backgroundColor: colors.background,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        color: colors.foreground,
    },
});
