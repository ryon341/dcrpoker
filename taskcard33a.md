✅ TASKCARD — Audiobook Section (VS Code Implementation)
Title

TC033-A — Audiobook UI + Training Page Integration

Objective

Build a reusable Audiobook Card Grid component and integrate it into:

Training Page (/tools/training or equivalent)

Future Gear / Monetization surfaces

This component should:

display all 10 books

use local images

open Amazon links

match the UI system created in TC037

Requirements
1) Create Audiobook Component
File:
app/components/AudiobookGrid.jsx
Component behavior

render all books from audiobookData

display as responsive grid

each item is a card:

cover image

title

short description

CTA button

Layout
Grid:

mobile: 1 column

tablet: 2 columns

desktop: 3 columns

Card structure

Each card must include:

Image (top)

full width

maintain aspect ratio

rounded corners

Title

bold

slightly larger font

Description

short (2–3 lines max)

muted color

CTA button

Text:

View on Amazon

Behavior:

opens external link

use Linking.openURL()

2) Import Data

Use:

import { audiobookData } from "../lib/audiobooks";
3) Example Implementation
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { audiobookData } from "../lib/audiobooks";

export default function AudiobookGrid() {
  return (
    <View style={{ gap: 16 }}>
      {audiobookData.map((book, index) => (
        <View key={index} style={styles.card}>
          
          <Image source={book.image} style={styles.image} />

          <Text style={styles.title}>{book.title}</Text>

          <Text style={styles.description}>
            {book.description}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL(book.link)}
          >
            <Text style={styles.buttonText}>View on Amazon</Text>
          </TouchableOpacity>

        </View>
      ))}
    </View>
  );
}
4) Basic Styles (match TC037)
const styles = {
  card: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a"
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 12
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6
  },
  description: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 10
  },
  button: {
    backgroundColor: "#2ecc71",
    padding: 10,
    borderRadius: 8,
    alignItems: "center"
  },
  buttonText: {
    color: "#000",
    fontWeight: "600"
  }
};
5) Integrate Into Training Page
File:
app/app/tools/training.jsx
Add section:
import AudiobookGrid from "../../components/AudiobookGrid";
Insert near bottom:
<View style={{ marginTop: 40 }}>
  <Text style={styles.sectionTitle}>
    Learn from the Best
  </Text>

  <AudiobookGrid />
</View>
6) Add Section Title Style
sectionTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "#fff",
  marginBottom: 16
}
7) Fix Final Book Link

Replace this:

link: "#"

With:

link: "https://www.amazon.com/dp/B071Y3CLQS?tag=deercreek097-20"

📌 That link corresponds to:
“How to Study Poker”

8) Optional (Nice-to-have)

If easy:

add horizontal scroll version for mobile

add category label badge

add “Why we recommend” expandable text

9) Acceptance Criteria

Taskcard is complete when:

Audiobook grid renders all 10 books

Images load correctly from local assets

Clicking button opens Amazon link

Layout looks clean (card-based, not plain text)

Works on mobile (no overflow)

Integrated into Training page

Matches TC037 visual system

10) Out of Scope

Do NOT:

fetch from API

add user accounts

track clicks (later feature)

over-style or animate

🔥 What this unlocks

After this:

TC033 (Training Page) becomes real + valuable

you now have:

content ✅

UI ✅

monetization ✅