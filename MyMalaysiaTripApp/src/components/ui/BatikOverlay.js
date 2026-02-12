
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * BatikOverlay Component
 * Renders a subtle Malaysian Batik pattern as a background element.
 * 
 * @param {string} type - 'full' (background), 'header' (top only), 'corner' (accent)
 * @param {number} opacity - Default 0.05 for subtle watermark effect
 * @param {boolean} inverted - Use white pattern for dark backgrounds
 */
const BatikOverlay = ({ type = 'full', opacity = 0.05, inverted = false }) => {
    const pattern = inverted
        ? require('../../../assets/batik_pattern_white.png')
        : require('../../../assets/batik_pattern_subtle.png');

    if (type === 'header') {
        return (
            <View style={[styles.headerContainer, { opacity }]} pointerEvents="none">
                <Image
                    source={pattern}
                    style={styles.headerImage}
                    resizeMode="cover"
                />
            </View>
        );
    }

    if (type === 'corner') {
        return (
            <View style={[styles.cornerContainer, { opacity }]} pointerEvents="none">
                <Image
                    source={pattern}
                    style={styles.cornerImage}
                    resizeMode="contain"
                />
            </View>
        );
    }

    return (
        <View style={[styles.fullContainer, { opacity }]} pointerEvents="none">
            <Image
                source={pattern}
                style={styles.fullImage}
                resizeMode="repeat"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    fullContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
    fullImage: {
        width: width * 2,
        height: height * 2,
        transform: [{ rotate: '15deg' }],
        marginLeft: -width * 0.5,
        marginTop: -height * 0.5,
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 180,
        zIndex: -1,
        overflow: 'hidden',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    cornerContainer: {
        position: 'absolute',
        bottom: -50,
        right: -50,
        width: 250,
        height: 250,
        zIndex: -1,
    },
    cornerImage: {
        width: '100%',
        height: '100%',
    }
});

export default BatikOverlay;
