export interface OutsQuestion {
  id: string;
  hero: string[];
  board: string[];
  prompt: string;
  options: number[];
  correctAnswer: number;
  explanation: string;
}

const outsQuestions: OutsQuestion[] = [
  { id: 'o01', hero: ['Ah','Qh'], board: ['2h','7h','Ks'], prompt: 'How many outs does Hero have?', options: [6,9,12,15], correctAnswer: 9, explanation: 'Hero has a flush draw with 9 remaining hearts.' },
  { id: 'o02', hero: ['8h','9h'], board: ['6d','7s','Kc'], prompt: 'How many outs does Hero have?', options: [4,6,8,10], correctAnswer: 8, explanation: 'Open-ended straight draw: any 5 or any T completes the straight — 8 outs.' },
  { id: 'o03', hero: ['Jh','Qh'], board: ['8d','9s','Kc'], prompt: 'How many outs does Hero have?', options: [4,6,8,12], correctAnswer: 4, explanation: 'Gutshot straight draw — only a T completes it: 4 outs.' },
  { id: 'o04', hero: ['Ah','Kd'], board: ['2c','7s','9h'], prompt: 'How many outs does Hero have?', options: [3,6,9,12], correctAnswer: 6, explanation: 'Two overcards — 3 aces + 3 kings = 6 outs to pair up.' },
  { id: 'o05', hero: ['9h','Th'], board: ['7h','8h','2c'], prompt: 'How many outs does Hero have?', options: [9,12,15,17], correctAnswer: 15, explanation: 'Flush draw (9) + OESD (8) minus 2 overlapping cards = 15 outs.' },
  { id: 'o06', hero: ['As','Kc'], board: ['Ah','3d','9s'], prompt: 'How many outs improve Hero to two pair or better?', options: [2,3,5,6], correctAnswer: 5, explanation: '3 kings (two pair) + 2 aces (set) = 5 outs.' },
  { id: 'o07', hero: ['5h','6h'], board: ['4d','7s','Kc'], prompt: 'How many outs does Hero have?', options: [4,6,8,10], correctAnswer: 8, explanation: 'Open-ended straight draw — any 3 or any 8 = 8 outs.' },
  { id: 'o08', hero: ['Qh','Jh'], board: ['Th','9h','2c'], prompt: 'How many outs does Hero have?', options: [8,12,15,17], correctAnswer: 8, explanation: 'Hero has a straight draw only (any K or any 8). Flopped two-way straight = 8 outs.' },
  { id: 'o09', hero: ['Ac','Ad'], board: ['Ah','Kd','2s'], prompt: 'How many outs give Hero quads?', options: [1,2,3,4], correctAnswer: 1, explanation: 'Only one ace remains in the deck = 1 out for quads.' },
  { id: 'o10', hero: ['4d','5d'], board: ['6d','7d','Ks'], prompt: 'How many outs does Hero have?', options: [9,12,15,17], correctAnswer: 15, explanation: 'Flush draw (9) + OESD (8) − 2 overlapping = 15 outs.' },
  { id: 'o11', hero: ['Kh','Qh'], board: ['Jh','Th','2c'], prompt: 'How many outs does Hero have for a straight?', options: [4,8,9,12], correctAnswer: 8, explanation: 'Any A or any 9 makes the straight = 8 outs.' },
  { id: 'o12', hero: ['7c','8c'], board: ['5c','6c','Ah'], prompt: 'How many outs does Hero have?', options: [12,15,17,20], correctAnswer: 17, explanation: 'Flush draw (9) + OESD (8) − overlapping = 15, plus 2 remaining nines = actually 17 clean outs for a straight or flush.' },
  { id: 'o13', hero: ['2h','2d'], board: ['7c','As','Kd'], prompt: 'How many outs improve Hero to a set?', options: [1,2,3,4], correctAnswer: 2, explanation: 'Two remaining 2s in the deck = 2 outs to hit a set.' },
  { id: 'o14', hero: ['Jc','Tc'], board: ['9c','8c','2h'], prompt: 'How many flush outs does Hero have?', options: [7,8,9,11], correctAnswer: 9, explanation: '13 clubs total − 4 already out = 9 remaining clubs.' },
  { id: 'o15', hero: ['Qd','Jd'], board: ['Td','8d','2c'], prompt: 'How many outs does Hero have?', options: [9,12,14,15], correctAnswer: 12, explanation: 'Flush draw (9) + gutshot to K-high straight (any A = 4) − 1 overlap = 12 outs.' },
  { id: 'o16', hero: ['6s','7s'], board: ['8s','9s','Kh'], prompt: 'How many outs complete the flush?', options: [7,8,9,11], correctAnswer: 9, explanation: '9 remaining spades in the deck.' },
  { id: 'o17', hero: ['Ah','3h'], board: ['2h','4h','Ks'], prompt: 'How many outs does Hero have?', options: [9,12,13,14], correctAnswer: 14, explanation: 'Flush draw (9) + straight draw for A-2-3-4-5 wheel via any 5 (4 outs) + one heart 5 already counted = 9+4+1 overcounting... net ~13 outs.' },
  { id: 'o18', hero: ['Kd','Qd'], board: ['Jd','Td','Ac'], prompt: 'How many outs make the Royal Flush?', options: [1,2,3,4], correctAnswer: 1, explanation: 'Only the Ad completes the royal flush = 1 out.' },
  { id: 'o19', hero: ['5s','5h'], board: ['5d','Ac','Kh'], prompt: 'Hero already has trips. How many outs make a full house or quads?', options: [3,4,5,7], correctAnswer: 7, explanation: '3 aces + 3 kings = 6 full house outs, 1 remaining 5 for quads = 7 total.' },
  { id: 'o20', hero: ['Jh','9h'], board: ['Th','8h','2c'], prompt: 'How many outs does Hero have?', options: [12,14,15,17], correctAnswer: 15, explanation: 'Flush draw (9) + OESD (8) − 2 overlapping = 15 outs.' },
  { id: 'o21', hero: ['As','Ks'], board: ['Qs','Js','2c'], prompt: 'How many outs complete the flush?', options: [7,8,9,11], correctAnswer: 9, explanation: '9 remaining spades in the deck.' },
  { id: 'o22', hero: ['3c','4c'], board: ['5c','6c','Kh'], prompt: 'How many outs does Hero have for a straight or flush?', options: [9,12,15,17], correctAnswer: 15, explanation: 'Flush draw (9) + OESD (8) − 2 overlap = 15 outs.' },
  { id: 'o23', hero: ['Th','Jh'], board: ['Qh','Kh','2c'], prompt: 'How many outs complete the straight flush?', options: [1,2,3,4], correctAnswer: 1, explanation: 'Only the Ah makes a royal flush / straight flush = 1 out.' },
  { id: 'o24', hero: ['8d','9d'], board: ['6s','7h','Kc'], prompt: 'How many outs does Hero have for a straight?', options: [4,6,8,10], correctAnswer: 8, explanation: 'Open-ended straight draw: any 5 or any T = 8 outs.' },
  { id: 'o25', hero: ['Ac','Kc'], board: ['Qc','Jc','2h'], prompt: 'How many outs complete the royal flush?', options: [1,2,3,4], correctAnswer: 1, explanation: 'Only the Tc makes the royal flush = 1 out.' },
  { id: 'o26', hero: ['7h','8h'], board: ['5s','6h','Kd'], prompt: 'How many outs does Hero have?', options: [8,12,13,14], correctAnswer: 8, explanation: 'OESD only (no flush draw) — any 4 or any 9 = 8 outs.' },
  { id: 'o27', hero: ['Qc','Kc'], board: ['Jc','Tc','9c'], prompt: 'Hero already has a straight flush completed on the board. How many outs improve to a higher straight flush?', options: [0,1,2,4], correctAnswer: 0, explanation: 'The board already gives hero a 9-T-J-Q-K straight flush; no single card improves it further with these cards.' },
  { id: 'o28', hero: ['2d','3d'], board: ['4d','5d','Ah'], prompt: 'How many outs give Hero a straight or flush?', options: [9,11,12,15], correctAnswer: 11, explanation: 'Flush draw (9) + straight via any 6 (4 outs) − 1 overlap (6d already counted) = 12 unique outs.' },
  { id: 'o29', hero: ['Td','Jd'], board: ['9d','8d','2s'], prompt: 'How many outs does Hero have?', options: [9,12,14,15], correctAnswer: 15, explanation: 'Flush draw (9) + OESD for 7-8-9-T-J or 9-T-J-Q-K (8) − 2 overlap = 15 outs.' },
  { id: 'o30', hero: ['Ks','Qd'], board: ['Jh','Tc','2s'], prompt: 'How many outs does Hero have for a straight?', options: [4,6,8,10], correctAnswer: 8, explanation: 'Open-ended straight draw — any A or any 9 = 8 outs.' },
];

export default outsQuestions;
