import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface ChannelBadgeProps {
  channel: 'whatsapp' | 'email' | 'call';
}

export const ChannelBadge: React.FC<ChannelBadgeProps> = ({ channel }) => {
  const getBadgeStyle = () => {
    switch (channel) {
      case 'whatsapp':
        return {
          bg: theme.colors.whatsapp + '20',
          text: theme.colors.whatsapp,
          label: 'WhatsApp'
        };
      case 'email':
        return {
          bg: theme.colors.email + '20',
          text: theme.colors.email,
          label: 'Email'
        };
      case 'call':
        return {
          bg: theme.colors.call + '20',
          text: theme.colors.call,
          label: 'Call Log'
        };
    }
  };

  const config = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.roundness.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
