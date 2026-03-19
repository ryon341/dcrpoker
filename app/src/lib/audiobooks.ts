// DCR Poker — Recommended Audiobooks / Poker Books

export interface AudiobookEntry {
  title: string;
  author: string;
  description: string;
  image: ReturnType<typeof require>;
  link: string;
}

export const audiobookData: AudiobookEntry[] = [
  {
    title: 'The Mental Game of Poker',
    author: 'Jared Tendler',
    description: 'Stop tilting. Fix your leaks. Build a mental routine that holds under pressure at the table.',
    image: require('../../assets/audio-books/mentalgameofpoker.jpg'),
    link: 'https://www.amazon.com/dp/B00DQFMXG4?tag=deercreek097-20',
  },
  {
    title: 'The Theory of Poker',
    author: 'David Sklansky',
    description: 'The foundational principles every serious poker player must understand — from fundamental theorem to advanced concepts.',
    image: require('../../assets/audio-books/thetheoryofpoker.jpg'),
    link: 'https://www.amazon.com/dp/1880685000?tag=deercreek097-20',
  },
  {
    title: 'How to Study Poker',
    author: 'Ed Miller & Matthew Janda',
    description: 'A systematic framework for studying the game away from the table and turning study into real improvement.',
    image: require('../../assets/audio-books/howtostudypoker.jpg'),
    link: 'https://www.amazon.com/dp/B071Y3CLQS?tag=deercreek097-20',
  },
  {
    title: 'Exploitive Play in Live Poker',
    author: 'Alexander Fitzgerald',
    description: 'Learn to exploit live player tendencies and crush the types of opponents you actually face at the table.',
    image: require('../../assets/audio-books/exploitiveplayinlivepoker.jpg'),
    link: 'https://www.amazon.com/dp/B01N9WHHVT?tag=deercreek097-20',
  },
  {
    title: 'Mastering Small Stakes No-Limit Hold\'em',
    author: 'Jonathan Little',
    description: 'Practical strategies for beating low-stakes cash games and building your bankroll from the ground up.',
    image: require('../../assets/audio-books/masteringsmallstakes.jpg'),
    link: 'https://www.amazon.com/dp/B09XYZMSSS?tag=deercreek097-20',
  },
  {
    title: 'GTO Poker Gems',
    author: 'Tombos21',
    description: 'Distills complex game-theory-optimal concepts into actionable insights you can apply at the tables immediately.',
    image: require('../../assets/audio-books/gtopokergems.jpg'),
    link: 'https://www.amazon.com/dp/B08SBPLGM6?tag=deercreek097-20',
  },
  {
    title: 'Reading Poker Tells',
    author: 'Zachary Elwood',
    description: 'The definitive guide to reading physical and verbal tells — from micro-expressions to bet-timing patterns.',
    image: require('../../assets/audio-books/readingpokertells.jpg'),
    link: 'https://www.amazon.com/dp/0985979909?tag=deercreek097-20',
  },
  {
    title: 'Play Poker Like the Pros',
    author: 'Phil Hellmuth',
    description: 'Phil Hellmuth\'s proven system for winning at limit hold\'em, no-limit hold\'em, Omaha, and tournament poker.',
    image: require('../../assets/audio-books/playpokerlikethepros.jpg'),
    link: 'https://www.amazon.com/dp/0060005998?tag=deercreek097-20',
  },
  {
    title: 'Secrets of Professional Tournament Poker',
    author: 'Jonathan Little',
    description: 'A volume-by-volume breakdown of tournament strategy — stack-depth decisions, ICM, and final table play.',
    image: require('../../assets/audio-books/secretsofprofessionaltournamentpoker.jpg'),
    link: 'https://www.amazon.com/dp/B00EED2NNO?tag=deercreek097-20',
  },
  {
    title: 'Poker Satellite Strategy',
    author: 'Dara O\'Kearney & Barry Carter',
    description: 'Master the unique strategy of satellite tournaments — when to accumulate chips and when to lock up your seat.',
    image: require('../../assets/audio-books/pokersatellitestrategy.jpg'),
    link: 'https://www.amazon.com/dp/B0849YJ3K6?tag=deercreek097-20',
  },
];
