import React, { useState } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AdInterstitial, useAdGate } from '../../../src/components/ui/AdInterstitial';
import {
  AccessoryProduct,
  ACCESSORY_PRODUCTS,
  BookProduct,
  BOOK_PRODUCTS,
  ChipProduct,
  CHIP_PRODUCTS,
  TIER_LABEL,
} from '../../../src/lib/gearData';

// ─── Open affiliate link safely ───────────────────────────────────────────────

function openLink(url: string) {
  Linking.openURL(url).catch(() => {});
}

// ─── Product cards ─────────────────────────────────────────────────────────────

function ChipCard({ product }: { product: ChipProduct }) {
  return (
    <View style={s.productCard}>
      {product.ourPick && (
        <View style={s.badge}>
          <Text style={s.badgeText}>{product.ourPick}</Text>
        </View>
      )}
      <View style={s.productHeader}>
        <Text style={s.productName}>{product.name}</Text>
        <View style={s.tierTag}>
          <Text style={s.tierTagText}>{TIER_LABEL[product.tier]}</Text>
        </View>
      </View>
      <Text style={s.bestFor}>Best for: {product.bestFor}</Text>
      <Text style={s.productDesc}>{product.description}</Text>
      <TouchableOpacity style={s.linkBtn} onPress={() => openLink(product.link)} activeOpacity={0.8}>
        <Text style={s.linkBtnText}>View on Amazon  →</Text>
      </TouchableOpacity>
    </View>
  );
}

function BookCard({ book }: { book: BookProduct }) {
  return (
    <View style={s.productCard}>
      {book.ourPick && (
        <View style={s.badge}>
          <Text style={s.badgeText}>{book.ourPick}</Text>
        </View>
      )}
      <Text style={s.productName}>{book.name}</Text>
      <Text style={s.bookAuthor}>by {book.author}</Text>
      <Text style={s.productDesc}>{book.description}</Text>
      <TouchableOpacity style={s.linkBtn} onPress={() => openLink(book.link)} activeOpacity={0.8}>
        <Text style={s.linkBtnText}>View on Amazon  →</Text>
      </TouchableOpacity>
    </View>
  );
}

function AccessoryCard({ item }: { item: AccessoryProduct }) {
  return (
    <View style={s.productCard}>
      <Text style={s.productName}>{item.name}</Text>
      <Text style={s.bestFor}>Best for: {item.bestFor}</Text>
      <Text style={s.productDesc}>{item.description}</Text>
      <TouchableOpacity style={s.linkBtn} onPress={() => openLink(item.link)} activeOpacity={0.8}>
        <Text style={s.linkBtnText}>View on Amazon  →</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Section header ────────────────────────────────────────────────────────────

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={s.sectionTitleWrap}>
      <Text style={s.sectionTitle}>{title}</Text>
      {sub ? <Text style={s.sectionSub}>{sub}</Text> : null}
    </View>
  );
}

// ─── Tier filter tabs ──────────────────────────────────────────────────────────

type TierFilter = 'all' | 'budget' | 'mid' | 'premium';

const TIER_FILTERS: { label: string; value: TierFilter }[] = [
  { label: 'All',     value: 'all'     },
  { label: 'Budget',  value: 'budget'  },
  { label: 'Mid',     value: 'mid'     },
  { label: 'Premium', value: 'premium' },
];

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function GearPage() {
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const { showAd, markAdShown } = useAdGate('gear');

  const filteredChips =
    tierFilter === 'all'
      ? CHIP_PRODUCTS
      : CHIP_PRODUCTS.filter(p => p.tier === tierFilter);

  return (
    <>
      <AdInterstitial visible={showAd} onDismiss={markAdShown} storageKey="gear" />
      <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.heading}>Gear</Text>
      <Text style={s.sub}>
        Curated recommendations for every type of home game. Every link supports DCR Poker.
      </Text>

      {/* ── Poker Chips ── */}
      <SectionTitle
        title="🎰 Poker Chip Sets"
        sub="The right set makes your game feel like a real card room."
      />

      {/* Tier filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
        {TIER_FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            style={[s.filterBtn, tierFilter === f.value && s.filterBtnActive]}
            onPress={() => setTierFilter(f.value)}
            activeOpacity={0.75}
          >
            <Text style={[s.filterBtnText, tierFilter === f.value && s.filterBtnTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredChips.map(p => <ChipCard key={p.id} product={p} />)}

      {/* ── Books ── */}
      <SectionTitle
        title="📚 Poker Books"
        sub="Read what the pros read. These are the books that actually move the needle."
      />
      {BOOK_PRODUCTS.map(b => <BookCard key={b.id} book={b} />)}

      {/* ── Accessories ── */}
      <SectionTitle
        title="🃏 Accessories"
        sub="The small details that separate a kitchen table from a real game."
      />
      {ACCESSORY_PRODUCTS.map(a => <AccessoryCard key={a.id} item={a} />)}

      <Text style={s.disclaimer}>
        Links above are Amazon affiliate links. DCR Poker may earn a small commission at no extra cost to you. We only recommend products we'd use ourselves.
      </Text>
    </ScrollView>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content:   { padding: 20, paddingBottom: 48 },

  heading: {
    color: '#e94560',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 8,
  },
  sub: { color: '#aaa', fontSize: 14, marginBottom: 28, lineHeight: 20 },

  sectionTitleWrap: { marginTop: 8, marginBottom: 14 },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSub: { color: '#888', fontSize: 13 },

  filterRow: { gap: 8, paddingBottom: 16, paddingRight: 8 },
  filterBtn: {
    backgroundColor: '#0f3460',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  filterBtnActive: { backgroundColor: '#e94560' },
  filterBtnText: { color: '#aaa', fontSize: 13, fontWeight: '600' },
  filterBtnTextActive: { color: '#fff' },

  productCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e94560',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  badgeText:   { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  productName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    lineHeight: 20,
    marginBottom: 2,
  },
  tierTag: {
    backgroundColor: '#0f1b35',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  tierTagText: { color: '#aaa', fontSize: 11 },
  bookAuthor:  { color: '#888', fontSize: 12, marginBottom: 6 },
  bestFor:     { color: '#aaa', fontSize: 12, marginBottom: 6, fontStyle: 'italic' },
  productDesc: { color: '#ccc', fontSize: 13, lineHeight: 19, marginBottom: 12 },
  linkBtn: {
    backgroundColor: '#0f3460',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a4a7a',
  },
  linkBtnText: { color: '#e94560', fontSize: 14, fontWeight: 'bold' },

  disclaimer: {
    color: '#555',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});
