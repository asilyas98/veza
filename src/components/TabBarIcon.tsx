import React from 'react';
import { Text, StyleSheet } from 'react-native';

type TabName = 'Discover' | 'Likes' | 'Stories' | 'Matches' | 'Profile';

interface TabBarIconProps {
  name: TabName;
  focused: boolean;
  color: string;
  size: number;
}

const ICONS: Record<TabName, { active: string; inactive: string }> = {
  Discover:  { active: '◉', inactive: '○'  },
  Likes:     { active: '♥', inactive: '♡'  },
  Stories:   { active: '▣', inactive: '□'  },
  Matches:   { active: '◆', inactive: '◇'  },
  Profile:   { active: '●', inactive: '○'  },
};

export function TabBarIcon({ name, focused, color, size }: TabBarIconProps) {
  const icon = ICONS[name];
  return (
    <Text style={{ color, fontSize: size * 0.9, lineHeight: size }}>
      {focused ? icon.active : icon.inactive}
    </Text>
  );
}
