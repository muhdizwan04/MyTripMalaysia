import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../config/colors';

export function Button({ children, onPress, variant = 'default', size = 'default', isLoading, style, textStyle, disabled }) {
    const buttonStyles = [
        styles.base,
        styles[`variant_${variant}`],
        styles[`size_${size}`],
        style
    ];
    if (disabled || isLoading) buttonStyles.push(styles.disabled);

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.foreground : colors.primaryForeground} />
            ) : (
                <Text style={[styles.textBase, styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`], textStyle]}>
                    {children}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
    },
    // Variants
    variant_default: {
        backgroundColor: colors.primary,
    },
    variant_destructive: {
        backgroundColor: colors.destructive,
    },
    variant_outline: {
        borderWidth: 1,
        borderColor: colors.input,
        backgroundColor: colors.background,
    },
    variant_secondary: {
        backgroundColor: colors.secondary,
    },
    variant_ghost: {
        backgroundColor: 'transparent',
    },
    variant_link: {
        backgroundColor: 'transparent',
    },
    // Sizes
    size_default: {
        height: 40,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    size_sm: {
        height: 36,
        paddingHorizontal: 12,
    },
    size_lg: {
        height: 44,
        paddingHorizontal: 32,
    },
    size_icon: {
        height: 40,
        width: 40,
    },
    // Text Styles
    textBase: {
        fontSize: 14,
        fontWeight: '500',
    },
    textDefault: {
        color: colors.primaryForeground,
    },
    textDestructive: {
        color: colors.destructiveForeground,
    },
    textOutline: {
        color: colors.foreground,
    },
    textSecondary: {
        color: colors.secondaryForeground,
    },
    textGhost: {
        color: colors.foreground,
    },
    textLink: {
        color: colors.primary,
        textDecorationLine: 'underline',
    },
    disabled: {
        opacity: 0.5,
    }
});
