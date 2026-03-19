import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { audiobookData } from '../lib/audiobooks';

export default function AudiobookGrid() {
  const { width } = useWindowDimensions();
  const numCols = width >= 1100 ? 3 : width >= 768 ? 2 : 1;
  const gap = 14;
  const cardWidth =
    numCols === 1
      ? '100%'
      : undefined;

  const handlePress = (link: string) => {
    Linking.openURL(link);
  };

  if (numCols === 1) {
    return (
      <View>
        {audiobookData.map((book, i) => (
          <View key={i} style={[s.card, { marginBottom: gap }]}>
            <Image source={book.image} style={s.cover} resizeMode="cover" />
            <View style={s.body}>
              <Text style={s.title}>{book.title}</Text>
              <Text style={s.author}>{book.author}</Text>
              <Text style={s.desc}>{book.description}</Text>
              <TouchableOpacity
                style={s.cta}
                onPress={() => handlePress(book.link)}
                activeOpacity={0.8}
              >
                <Text style={s.ctaText}>View on Amazon</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  }

  // Multi-column: split into rows manually
  const rows: typeof audiobookData[] = [];
  for (let i = 0; i < audiobookData.length; i += numCols) {
    rows.push(audiobookData.slice(i, i + numCols));
  }

  return (
    <View>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={[s.row, { gap, marginBottom: gap }]}>
          {row.map((book, colIdx) => (
            <View key={colIdx} style={[s.card, { flex: 1 }]}>
              <Image source={book.image} style={s.cover} resizeMode="cover" />
              <View style={s.body}>
                <Text style={s.title}>{book.title}</Text>
                <Text style={s.author}>{book.author}</Text>
                <Text style={s.desc}>{book.description}</Text>
                <TouchableOpacity
                  style={s.cta}
                  onPress={() => handlePress(book.link)}
                  activeOpacity={0.8}
                >
                  <Text style={s.ctaText}>View on Amazon</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {/* Fill empty slots in last row so columns align */}
          {row.length < numCols &&
            Array.from({ length: numCols - row.length }).map((_, k) => (
              <View key={`empty-${k}`} style={{ flex: 1 }} />
            ))}
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: 180,
  },
  body: {
    padding: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  author: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
  },
  desc: {
    fontSize: 13,
    color: '#aaaaaa',
    lineHeight: 19,
    marginBottom: 14,
  },
  cta: {
    backgroundColor: '#2ecc71',
    borderRadius: 6,
    paddingVertical: 9,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
});
