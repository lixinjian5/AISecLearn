import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

function Number({ mv, number, height }) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) memo -= 10 * height;
    return memo;
  });

  return (
    <motion.span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', y }}>
      {number}
    </motion.span>
  );
}

function normalizeNearInteger(num) {
  const nearest = Math.round(num);
  return Math.abs(num - nearest) < 1e-9 * Math.max(1, Math.abs(num)) ? nearest : num;
}

function getValueRoundedToPlace(value, place) {
  return Math.floor(normalizeNearInteger(value / place));
}

function Digit({ place, value, height, digitStyle }) {
  if (place === '.') {
    return <span className="relative inline-flex items-center justify-center" style={{ height, width: 'fit-content', ...digitStyle }}>.</span>;
  }

  const valueRoundedToPlace = getValueRoundedToPlace(value, place);
  const animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => { animatedValue.set(valueRoundedToPlace); }, [animatedValue, valueRoundedToPlace]);

  return (
    <span className="relative inline-flex overflow-hidden" style={{ height, position: 'relative', width: '1ch', fontVariantNumeric: 'tabular-nums', ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </span>
  );
}

export default function Counter({
  value,
  fontSize = 100,
  padding = 0,
  places = [...value.toString()].map((ch, i, a) => {
    if (ch === '.') return '.';
    const dotIndex = a.indexOf('.');
    const isInteger = dotIndex === -1;
    const exponent = isInteger ? a.length - i - 1 : i < dotIndex ? dotIndex - i - 1 : -(i - dotIndex);
    return 10 ** exponent;
  }),
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = 'inherit',
  fontWeight = 'inherit',
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 16,
  gradientFrom = 'black',
  gradientTo = 'transparent',
  topGradientStyle,
  bottomGradientStyle,
}) {
  const height = fontSize + padding;

  return (
    <span style={{ position: 'relative', display: 'inline-block', ...containerStyle }}>
      <span style={{ fontSize, display: 'flex', gap, overflow: 'hidden', borderRadius, paddingLeft: horizontalPadding, paddingRight: horizontalPadding, lineHeight: 1, color: textColor, fontWeight, direction: 'ltr', ...counterStyle }}>
        {places.map((place) => (
          <Digit key={place} place={place} value={value} height={height} digitStyle={digitStyle} />
        ))}
      </span>
      <span style={{ pointerEvents: 'none', position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <span style={topGradientStyle ?? { height: gradientHeight, background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})` }} />
        <span style={bottomGradientStyle ?? { height: gradientHeight, background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})` }} />
      </span>
    </span>
  );
}
