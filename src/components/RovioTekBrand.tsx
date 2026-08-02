import { View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';

const LOGO_DARK = require('../../assets/images/roviotek-logo-dark.png');
const LOGO_WHITE = require('../../assets/images/roviotek-logo-white.png');

// Source images are 1367x427
const ASPECT = 1367 / 427;

type Props = {
  variant?: 'dark' | 'light';
  width?: number;
  style?: ViewStyle;
};

export default function RovioTekBrand({ variant = 'dark', width = 150, style }: Props) {
  return (
    <View style={[{ alignItems: 'center' }, style]}>
      <Image
        source={variant === 'light' ? LOGO_WHITE : LOGO_DARK}
        contentFit="contain"
        style={{ width, height: width / ASPECT }}
      />
    </View>
  );
}
