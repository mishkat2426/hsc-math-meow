// Procedural Question Generator for HSC 2026 Higher Math 1st Paper
// Generates exactly 500 extreme hard & trap questions in Bengali

const CHAPTERS = [
  "ম্যাট্রিক্স ও নির্ণায়ক",
  "ভেক্টর",
  "সরলরেখা",
  "বৃত্ত",
  "ত্রিকোণমিতি",
  "অান্তরীকরণ",
  "যোগজীকরণ"
];

const GEN_CHAPTERS = [
  "ম্যাট্রিক্স ও নির্ণায়ক",
  "ভেক্টর",
  "সরলরেখা",
  "বৃত্ত",
  "ত্রিকোণমিতি",
  "অান্তরীকরণ",
  "যোগজীকরণ"
];

// Helper to shuffle array deterministically based on seed
function seededShuffle(array, seed) {
  let m = array.length, t, i;
  while (m) {
    i = Math.floor(random(seed++) * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

// Simple deterministic random generator
function random(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate the 500 questions
export function generateQuestions() {
  const list = [];
  let id = 1;

  // CHAPTER 1: ম্যাট্রিক্স ও নির্ণায়ক (7 templates * 10 variants = 70)
  for (let v = 0; v < 10; v++) {
    // Template 1.1: Singular matrix trap
    const a = v + 2;
    const b = v + 3;
    const c = v + 4;
    const detVal = a * b;
    const correctVal = detVal / c;
    const isInteger = (detVal % c === 0);
    const correctStr = isInteger ? `${correctVal}` : `\\frac{${detVal}}{${c}}`;
    const trap1 = isInteger ? `${correctVal + 1}` : `\\frac{${detVal + 2}}{${c}}`;
    const trap2 = `0`;
    const trap3 = isInteger ? `${-correctVal}` : `-\\frac{${detVal}}{${c}}`;

    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[0],
      difficulty: "চরম কঠিন",
      text: `যদি $A = \\begin{bmatrix} x & ${a} \\\\ ${b} & ${c} \\end{bmatrix}$ একটি ব্যতিক্রমী (Singular) ম্যাট্রিক্স হয়, তবে x এর মান কত? 🐾`,
      options: [
        `x = ${correctStr}`,
        `x = ${trap1}`,
        `x = ${trap2}`,
        `x = ${trap3}`
      ],
      correctIndex: 0,
      trapExplanation: `ব্যতিক্রমী ম্যাট্রিক্সের ক্ষেত্রে নির্ণায়ক $|A| = $0 হতে হবে। অর্থাৎ, c * x - a * b = 0 => x = (a*b)/c। অনেকেই তাড়াহুড়ো করে আরগুণন ভুল করে বা চিহ্নের গোলমাল করে x = 0 বা ঋণাত্মক মান ধরে নেয়, যা একটি ফাঁদ! 😹`
    });

    // Template 1.2: Determinant properties $|kA| = $k^n |A|
    const k = v + 2;
    const detA = v + 5;
    const n = 3; 
    const ans = Math.pow(k, n) * detA;
    const wrongAns1 = k * detA; 
    const wrongAns2 = Math.pow(k, 2) * detA; 
    const wrongAns3 = ans + 10;

    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[0],
      difficulty: "চরম ফাঁদ",
      text: `যদি A একটি ${n} \\times ${n} আকারের ম্যাট্রিক্স হয় এবং $|A| = $${detA} হয়, তবে |${k}A| এর মান কত হবে? 🙀`,
      options: [
        `$|${k}A| = $${ans}`,
        `$|${k}A| = $${wrongAns1}`,
        `$|${k}A| = $${wrongAns2}`,
        `$|${k}A| = $${wrongAns3}`
      ],
      correctIndex: 0,
      trapExplanation: `সূত্র হচ্ছে $|kA| = $k^n |A|, যেখানে n হলো ম্যাট্রিক্সের মাত্রা (dimension)। এখানে ম্যাট্রিক্সের মাত্রা ৩, তাই $|${k}A| = $${k}^3 \\times $|A| = $${Math.pow(k, 3)} \\times ${detA} = ${ans}। সবচেয়ে সাধারণ ফাঁদ হলো সরাসরি k দিয়ে গুণ করা (${wrongAns1})। সাবধান, মেও! 🐱`
    });

    // Template 1.3: Matrix multiplication dimension trap
    const p = v + 2;
    const q = v + 3;
    const r = v + 4;
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[0],
      difficulty: "চরম কঠিন",
      text: `যদি A ম্যাট্রিক্সের মাত্রা ${p} \\times ${q} এবং B ম্যাট্রিক্সের মাত্রা ${q} \\times ${r} হয়, তবে (AB)^T ম্যাট্রিক্সের মাত্রা কত হবে? 🐈`,
      options: [
        `${r} \\times ${p}`,
        `${p} \\times ${r}`,
        `${q} \\times ${q}`,
        `গুণফল করা সম্ভব নয়`
      ],
      correctIndex: 0,
      trapExplanation: `ম্যাট্রিক্স AB এর মাত্রা হবে ${p} \\times ${r}। কিন্তু প্রশ্নটিতে (AB)^T অর্থাৎ ট্রান্সপোজ ম্যাট্রিক্সের মাত্রা জানতে চাওয়া হয়েছে। ট্রান্সপোজ করলে সারি ও কলাম অদলবদল হয়, তাই মাত্রা হবে ${r} \\times ${p}। অনেকেই সরাসরি ${p} \\times ${r} দাগিয়ে এই ফাঁদে পা দেয়! 😹`
    });

    // Template 1.4: Column Vector & Row Vector Product Dimension Trap
    // A = column vector of size (v+3)x1, B = row vector of size 1x(v+3)
    // AB dimension is (v+3)x(v+3), BA dimension is 1x1.
    const size = v + 3;
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[0],
      difficulty: "চরম ফাঁদ",
      text: `A একটি ${size} \\times 1 আকারের কলাম ম্যাট্রিক্স এবং B একটি 1 \\times ${size} আকারের সারি ম্যাট্রিক্স। AB এবং BA ম্যাট্রিক্সদ্বয়ের মাত্রার যোগফল কত? 🐾`,
      options: [
        `${size*size + 1}`,
        `${size + size}`,
        `২ (যেহেতু উভয়ই ১টি একক মান)`,
        `গুণফল নির্ণয় করা অসম্ভব`
      ],
      correctIndex: 0,
      trapExplanation: `AB এর মাত্রা হবে (${size} ✕ 1) ✕ (1 ✕ ${size}) = ${size} ✕ ${size}। আর BA এর মাত্রা হবে (1 ✕ ${size}) ✕ (${size} ✕ 1) = 1 ✕ 1। অতএব মাত্রার উপাদান সংখ্যা বা মাত্রার ডাইমেনশনগুলোর সমষ্টি হবে (${size} ✕ ${size}) এবং (1 ✕ 1) এর মাত্রা যোগফল = ${size*size + 1}। অনেকেই মনে করে উভয় গুণের মাত্রাই সমান হবে, যা বড় ফাঁদ! 😻`
    });

    // Template 1.5: Skew symmetric diagonal element trap
    const dVal = v + 1;
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[0],
      difficulty: "চরম ফাঁদ",
      text: `একটি বিপরীত সমসমঞ্জস (Skew-symmetric) ম্যাট্রিক্স A এর কর্ণের উপাদানগুলোর সমষ্টি কত হবে, যদি এর মাত্রা ${dVal+2} \\times ${dVal+2} হয়? 😸`,
      options: [
        `0`,
        `${dVal+2}`,
        `-${dVal+2}`,
        `যেকোনো বাস্তব সংখ্যা হতে পারে`
      ],
      correctIndex: 0,
      trapExplanation: `বিপরীত সমসমঞ্জস বা Skew-symmetric ম্যাট্রিক্সের সংজ্ঞানুযায়ী, এর প্রধান কর্ণের প্রতিটি উপাদান অবশ্যই শূন্য (0) হতে হবে (যেহেতু a_ij = -a_ji, যার ফলে i=j হলে a_ii = -a_ii => a_ii = 0)। সুতরাং কর্ণের উপাদানগুলোর সমষ্টি সর্বদা 0 হবে। মাত্রা যাই হোক না কেন, উত্তর সবসময় 0! 🐱`
    });

    // Template 1.6: Trace of Inverse Matrix of Diagonal Matrix
    const d1 = v + 2;
    const d2 = v + 3;
    const d3 = v + 4;
    const correctTrace = (1/d1 + 1/d2 + 1/d3).toFixed(3);
    const wrongTrace1 = (d1 + d2 + d3).toFixed(3);
    const wrongTrace2 = (1 / (d1 + d2 + d3)).toFixed(3);
    const wrongTrace3 = (d1 * d2 * d3).toFixed(3);

    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[0],
      difficulty: "চরম কঠিন",
      text: `যদি A = diag(${d1}, ${d2}, ${d3}) একটি কর্ন ম্যাট্রিক্স হয়, তবে A^(-1) এর ট্রেস (Trace) কত? 🐾`,
      options: [
        `${correctTrace}`,
        `${wrongTrace1}`,
        `${wrongTrace2}`,
        `${wrongTrace3}`
      ],
      correctIndex: 0,
      trapExplanation: `কর্ন ম্যাট্রিক্সের বিপরীত ম্যাট্রিক্সের কর্ণের উপাদানগুলো হলো মূল উপাদানের বিপরীত ভগ্নাংশ। অর্থাৎ A^(-1) এর প্রধান কর্ণের উপাদানগুলো হবে 1/${d1}, 1/${d2}, 1/${d3}। এদের সমষ্টিই হলো ট্রেস = ${(1/d1).toFixed(3)} + ${(1/d2).toFixed(3)} + ${(1/d3).toFixed(3)} = ${correctTrace}। অনেকেই সরাসরি A এর ট্রেসের উল্টোমান (1/Trace(A)) নির্ণয় করে ভুল করে (${wrongTrace2})! 😿`
    });

    // Template 1.7: Inverse Matrix of Singular Matrix / Determinant value
    const detZeroVal = v;
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[0],
      difficulty: "চরম কঠিন",
      text: `যদি একটি ম্যাট্রিক্স B এর মাত্রা ${v+2} \\times ${v+2} হয় এবং এর নির্ণায়কের মান $|B| = $${detZeroVal} হয়, তবে B^(-1) এর নির্ণায়কের মান |B^(-1)| কত? 🙀`,
      options: [
        `${detZeroVal === 0 ? "অসংজ্ঞায়িত (বিপরীত অসম্ভব)" : (1/detZeroVal).toFixed(3)}`,
        `${detZeroVal}`,
        `${detZeroVal === 0 ? "0" : (-detZeroVal).toFixed(3)}`,
        `1`
      ],
      correctIndex: 0,
      trapExplanation: `আমরা জানি $|B^(-1)| = $1 / |B|। কিন্তু যদি $|B| = $0 হয় (অর্থাৎ ম্যাট্রিক্সটি ব্যতিক্রমী বা singular), তবে তার কোনো বিপরীত ম্যাট্রিক্সই থাকবে না, অর্থাৎ মান অসংজ্ঞায়িত! v = 0 হলে $|B| = $0, ফলে বিপরীতকরণ অসম্ভব। অনেকেই অন্ধের মতো 1/0 = 0 বা অসীম দাগিয়ে ফেলে! 🐈`
    });
  }

  // CHAPTER 2: ভেক্টর (7 templates * 10 variants = 70)
  for (let v = 0; v < 10; v++) {
    // Template 2.1: Unit Vector perpendicular to both A and B
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[1],
      difficulty: "চরম ফাঁদ",
      text: `A এবং B দুটি ভেক্টরের উভয়ের উপর লম্ব একটি একক ভেক্টর নির্ণয়ের সঠিক গাণিতিক রূপ কোনটি? 😽`,
      options: [
        `± $A \\times B \\over |A \\times B|$`,
        `$A \\times B \\over |A \\times B|$`,
        `$A \\cdot B \\over |A \\times B|$`,
        `± (A × B) / (A . B)`
      ],
      correctIndex: 0,
      trapExplanation: `দুটি ভেক্টরের উপর লম্ব একক ভেক্টরের দিক স্ক্রু নিয়মে ধনাত্মক ও ঋণাত্মক উভয় দিকেই হতে পারে। তাই সুত্রটিতে অবশ্যই '±' চিহ্ন ব্যবহার করতে হবে। অনেকেই শুধু ধনাত্মক দিক ভেবে অপশন B দাগায় যা অত্যন্ত বড় ফাঁদ! 🐾`
    });

    // Template 2.2: Vector projection vs component trap
    const ax = v + 1;
    const ay = 2;
    const az = v + 3;
    const abDot = 2 * ax + 2 - 2 * az;
    const projection = (abDot / 3).toFixed(2);

    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[1],
      difficulty: "চরম কঠিন",
      text: `ভেক্টর A = ${ax}i + 2j + ${az}k এর দিক বরাবর B = 2i + j - 2k ভেক্টরের ভেক্টর অংশক (Vector Component) কত? 😹`,
      options: [
        `অংশক = ((${abDot}/9) ✕ B)`,
        `অংশক = ${projection}`,
        `অংশক = ((${abDot}/3) ✕ A)`,
        `অংশক = 0`
      ],
      correctIndex: 0,
      trapExplanation: `প্রশ্নটি ভালো করে পড়ুন! 'স্কেলার অভিক্ষেপ' (Scalar Projection) নয়, 'ভেক্টর অংশক' (Vector Component) চাওয়া হয়েছে। অংশক হলো একটি ভেক্টর রাশি, যার মান = (A.B / |B|) এবং দিক হলো B এর একক ভেক্টরের দিকে। তাই অংশক = (A.B / |B|^2) * B। অপশন B তে থাকা অভিক্ষেপ দাগালে চলবে না, মেও! 🐱`
    });

    // Template 2.3: Area of Triangle with Collinear Points Trap
    // A(1,1,1), B(2,2,2), C(3,3,3) are collinear. Area is 0.
    const seed = v + 1;
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[1],
      difficulty: "চরম ফাঁদ",
      text: `ত্রিমাত্রিক স্থানে A(${seed}, ${seed}, ${seed}), B(${2*seed}, ${2*seed}, ${2*seed}) এবং C(${3*seed}, ${3*seed}, ${3*seed}) বিন্দুত্রয় দ্বারা গঠিত ত্রিভুজের ক্ষেত্রফল কত? 😿`,
      options: [
        `0 বর্গ একক`,
        `${seed} বর্গ একক`,
        `${0.5 * seed} বর্গ একক`,
        `ক্ষেত্রফল নির্ণয় অসম্ভব`
      ],
      correctIndex: 0,
      trapExplanation: `বিন্দুত্রয়ের স্থানাঙ্ক ভালো করে দেখুন। B = 2A এবং C = 3A। এরা মূলবিন্দুগামী একই সরলরেখার উপর অবস্থিত (সমরেখ ভেক্টর)। যেহেতু বিন্দু তিনটি সমরেখ (collinear), তারা কোনো ত্রিভুজ গঠন করে না, তাই ত্রিভুজের ক্ষেত্রফল হবে ঠিক 0! অনেকেই ত্রিভুজের হাফ সূত্র দিয়ে জটিল হিসাব করতে গিয়ে সময় নষ্ট ও ভুল করে! 😹`
    });

    // Template 2.4: Area of triangle/parallelogram diagonal trap
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[1],
      difficulty: "চরম কঠিন",
      text: `একটি সামান্তরিকের কর্ণদ্বয় যথাক্রমে d1 এবং d2 হলে, এর ক্ষেত্রফল নিচের কোনটি? 🙀`,
      options: [
        `1/2 |d1 × d2|`,
        `|d1 × d2|`,
        `d1 . d2`,
        `1/2 |d1 . d2|`
      ],
      correctIndex: 0,
      trapExplanation: `যদি সন্নিহিত বাহু দেওয়া থাকে, তবে ক্ষেত্রফল হয় |A × B|। কিন্তু যদি কর্ণদ্বয় d1 ও d2 দেওয়া থাকে, তবে ক্ষেত্রফল হয় 1/2 |d1 × d2|। অনেকেই সরাসরি মডুলাস ক্রস প্রোডাক্ট দাগিয়ে দেয়, যা ভুল! 🐾`
    });

    // Template 2.5: Angle between A and B when $|A+B| = $|A-B|
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[1],
      difficulty: "চরম ফাঁদ",
      text: `দুটি অশূন্য ভেক্টর A এবং B এর ক্ষেত্রে $|A + B| = $|A - B| হলে, ভেক্টরদ্বয়ের মধ্যবর্তী কোণ কত? 😸`,
      options: [
        `90° (π/2)`,
        `0°`,
        `180° (π)`,
        `45° (π/4)`
      ],
      correctIndex: 0,
      trapExplanation: `|A + B|^2 = |A - B|^2 => A^2 + B^2 + 2A.B = A^2 + B^2 - 2A.B => 4 A.B = 0 => A.B = 0। যেহেতু ভেক্টরদ্বয় অশূন্য, তাই তাদের ডট গুণফল 0 হওয়ার মানে হলো তারা পরস্পর লম্ব, অর্থাৎ মধ্যবর্তী কোণ 90°। 🐱`
    });

    // Template 2.6: Direction cosines identity
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[1],
      difficulty: "চরম কঠিন",
      text: `একটি ভেক্টর ত্রিমাত্রিক স্থানাঙ্ক ব্যবস্থায় অক্ষত্রয়ের সাথে যথাক্রমে α, β, γ কোণ উৎপন্ন করলে, sin²α + sin²β + sin²γ এর মান কত? 🙀`,
      options: [
        `2`,
        `1`,
        `3`,
        `0`
      ],
      correctIndex: 0,
      trapExplanation: `দিক কোসাইনসমূহের বর্গের সমষ্টি cos²α + cos²β + cos²γ = 1। আমাদের কাছে জানতে চাওয়া হয়েছে sin²α + sin²β + sin²γ এর মান। আমরা জানি, sin²θ = 1 - cos²θ। অতএব, (1 - cos²α) + (1 - cos²β) + (1 - cos²γ) = 3 - (cos²α + cos²β + cos²γ) = 3 - 1 = 2। অপশন ১ দাগাতে গিয়ে সবাই ১ দাগিয়ে এই ফাঁদে পড়ে! 😹`
    });

    // Template 2.7: Null vector magnitude trap
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[1],
      difficulty: "চরম ফাঁদ",
      text: `একটি শূন্য ভেক্টর (Null Vector) এর দিক কোন দিকে হবে? 😿`,
      options: [
        `দিক অনির্ধারিত (Undetermined)`,
        `ধনাত্মক x-অক্ষের দিকে`,
        `দিক নেই`,
        `সব দিকে`
      ],
      correctIndex: 0,
      trapExplanation: `শূন্য ভেক্টরের মান শূন্য। এর কোনো নির্দিষ্ট দিক নেই বা এর দিক অনির্ধারিত। অপশনে 'দিক নেই' দেখে গুলিয়ে ফেলবেন না, কারণ গাণিতিকভাবে এর দিক 'অনির্ধারিত' বা 'যেকোনো দিক' বিবেচনা করা হয় কিন্তু নির্দিষ্ট কোনো দিক থাকে না। সঠিক পরিভাষা হলো 'অনির্ধারিত' বা 'Undetermined'। 🐈`
    });
  }

  // CHAPTER 3: সরলরেখা (8 templates * 10 variants = 80)
  for (let v = 0; v < 10; v++) {
    // Template 3.1: Distance between parallel lines
    const c1 = v + 1;
    const c2 = v + 7;
    const d = Math.abs(2 * c1 - c2) / 10; 
    const wrongD = Math.abs(c1 - c2) / 5; 

    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[2],
      difficulty: "চরম ফাঁদ",
      text: `3x - 4y + ${c1} = 0 এবং 6x - 8y + ${c2} = 0 সমান্তরাল রেখাদ্বয়ের মধ্যবর্তী দূরত্ব কত? 🙀`,
      options: [
        `${d.toFixed(2)} একক`,
        `${wrongD.toFixed(2)} একক`,
        `${Math.abs(c1 - c2)} একক`,
        `0 একক`
      ],
      correctIndex: 0,
      trapExplanation: `সমান্তরাল রেখাদ্বয়ের দূরত্বের সূত্র প্রয়োগের পূর্বে সহগগুলো সমান করে নিতে হবে। প্রথম সমীকরণকে ২ দিয়ে গুণ করলে পাই: 6x - 8y + ${2*c1} = 0। এবার সূত্রানুযায়ী দূরত্ব = |${2*c1} - ${c2}| / √(6² + 8²) = |${2*c1 - c2}| / 10 = ${d.toFixed(2)}। অনেকেই সরাসরি সহগ না মিলিয়ে দূরত্ব বের করে ভুল করে! 🐾`
    });

    // Template 3.2: Internal vs External division point
    const y1 = v + 2;
    const y2 = v + 5;
    const extRatioStr = `বহিঃস্থভাবে ${y1}:${y2}`;
    const intRatioStr = `অন্তঃস্থভাবে ${y1}:${y2}`;
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[2],
      difficulty: "চরম কঠিন",
      text: `A(2, ${y1}) and B(5, -${y2}) বিন্দুদ্বয়ের সংযোগকারী রেখাকে x-অক্ষ কী অনুপাতে বিভক্ত করে? 😻`,
      options: [
        `${intRatioStr}`,
        `${extRatioStr}`,
        `অন্তঃস্থভাবে ${y2}:${y1}`,
        `বহিঃস্থভাবে ${y2}:${y1}`
      ],
      correctIndex: 0,
      trapExplanation: `x-অক্ষ সংযোগকারী রেখাকে -y1/y2 অনুপাতে বিভক্ত করে। এখানে অনুপাতটি হলো: -(${y1}) / (-${y2}) = ${y1}/${y2}। যেহেতু অনুপাতটির মান ধনাত্মক এসেছে, তাই বিভক্তিটি হবে 'অন্তঃস্থভাবে' (internally)। ঋণাত্মক আসলে বহিঃস্থ হতো। 🐱`
    });

    // Template 3.3: Right Triangle Orthocenter Trap
    // Right triangle with vertices (0,0), (v+2, 0), (0, v+5).
    // Orthocenter is at the vertex containing the right angle: (0,0).
    const sideA = v + 2;
    const sideB = v + 5;
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[2],
      difficulty: "চরম ফাঁদ",
      text: `একটি ত্রিভুজের শীর্ষবিন্দু তিনটি যথাক্রমে O(0, 0), P(${sideA}, 0) এবং Q(0, ${sideB})। এই ত্রিভুজটির লম্ববিন্দু (Orthocenter) এর স্থানাঙ্ক কত? 😸`,
      options: [
        `(0, 0)`,
        `(${sideA/2}, ${sideB/2})`,
        `(${(sideA/3).toFixed(2)}, ${(sideB/3).toFixed(2)})`,
        `(${sideA}, ${sideB})`
      ],
      correctIndex: 0,
      trapExplanation: `শীর্ষবিন্দুগুলো ও অক্ষদ্বয় ভালো করে খেয়াল করুন! O(0,0) বিন্দুতে সমকোণ অবস্থিত কারণ OP রেখা x-অক্ষে এবং OQ রেখা y-অক্ষে অবস্থিত। আমরা জানি, সমকোণী ত্রিভুজের লম্ববিন্দু (Orthocenter) সমকোণ ধারণকারী শীর্ষবিন্দুতেই অবস্থিত হয়। অতএব লম্ববিন্দু হলো O(0,0)। কোনো সমীকরণ সমাধান না করেই এটা সেকেন্ডে বলা যায়! 🐾`
    });

    // Template 3.4: Area of triangle with collinear points
    const mult3 = v + 1;
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[2],
      difficulty: "চরম কঠিন",
      text: `A(${mult3}, ${2*mult3}), B(${3*mult3}, ${4*mult3}) এবং C(${5*mult3}, ${6*mult3}) শীর্ষবিশিষ্ট ত্রিভুজ ABC এর ক্ষেত্রফল কত বর্গ একক? 🐈`,
      options: [
        `0`,
        `${2*mult3}`,
        `${mult3}`,
        `ক্ষেত্রফল নির্ণয় সম্ভব নয়`
      ],
      correctIndex: 0,
      trapExplanation: `বিন্দুত্রয় লক্ষ করুন: A, B, C বিন্দুগুলো একই সরলরেখার উপর অবস্থিত (সমরেখ), কারণ AB এর ঢাল = BC এর ঢাল = 1। সমরেখ বিন্দুর দ্বারা গঠিত ত্রিভুজের ক্ষেত্রফল semesters ০ (শূন্য) হয়। বড় হিসাব না করেই এটা ঢাল দেখে বুঝা যায়! 😹`
    });

    // Template 3.5: Perpendicular line passing through point
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[2],
      difficulty: "চরম কঠিন",
      text: `3x + 4y - ${v+5} = 0 রেখার উপর লম্ব এবং (${v+3}, ${(4/3)*(v+3)}) বিন্দুগামী সরলরেখার সমীকরণ কোনটি? 🐾`,
      options: [
        `4x - 3y = 0`,
        `3x - 4y = 0`,
        `4x + 3y = 0`,
        `3x + 4y = 0`
      ],
      correctIndex: 0,
      trapExplanation: `3x + 4y - c = 0 এর লম্ব রেখার সমীকরণ হবে 4x - 3y + k = 0। প্রদত্ত বিন্দুটি বসিয়ে পাই k = 0, তাই সমীকরণ 4x - 3y = 0। চিহ্নের পরিবর্তনে লক্ষ্য রাখুন, লম্ব রেখায় x ও y এর সহগ ইন্টারচেঞ্জ হয় এবং মাঝের চিহ্ন পরিবর্তিত হয়। 🐱`
    });

    // Template 3.6: Polar to Cartesian coordinate coordinates
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[2],
      difficulty: "চরম ফাঁদ",
      text: `পোলার স্থানাঙ্ক (2, 150°) বিশিষ্ট বিন্দুর কার্তেসীয় স্থানাঙ্ক কত? 😸`,
      options: [
        `(-√3, 1)`,
        `(√3, 1)`,
        `(-1, √3)`,
        `(1, -√3)`
      ],
      correctIndex: 0,
      trapExplanation: `x = r cos θ = 2 cos(150°) = 2 ✕ (-√3/2) = -√3 এবং y = r sin θ = 2 sin(150°) = 2 ✕ (1/2) = 1। সুতরাং কার্তেসীয় স্থানাঙ্ক (-√3, 1)। কোণটি দ্বিতীয় চতুর্ভাগে হওয়ায় x এর মান ঋণাত্মক ও y এর মান ধনাত্মক হবে। 🐈`
    });

    // Template 3.7: Intersection of lines y=mx and y=nx
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[2],
      difficulty: "চরম ফাঁদ",
      text: `y = ${v+2}x এবং y = ${v+5}x রেখাদ্বয়ের ছেদবিন্দু কোন চতুর্ভাগে অবস্থিত? 😻`,
      options: [
        `কোনো চতুর্ভাগে নয়, মূলবিন্দুতে`,
        `প্রথম চতুর্ভাগে`,
        `তৃতীয় চতুর্ভাগে`,
        `দ্বিতীয় চতুর্ভাগে`
      ],
      correctIndex: 0,
      trapExplanation: `উভয় সরলরেখাই মূলবিন্দুগামী (যেহেতু c = 0)। যেকোনো দুটি ভিন্ন ঢালের মূলবিন্দুগামী রেখার একমাত্র ছেদবিন্দু হলো মূলবিন্দু (0,0)। মূলবিন্দু কোনো চতুর্ভাগের অংশ নয়, এটি অক্ষদ্বয়ের মিলনস্থল। এটি একটি দারুণ ফাঁদ! 🐾`
    });

    // Template 3.8: Angle of intercept line x/a + y/b = 1
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[2],
      difficulty: "চরম কঠিন",
      text: `x/a + y/a = 1 সরলরেখাটি x-অক্ষের ধনাত্মক দিকের সাথে কত কোণ উৎপন্ন করে? 😿`,
      options: [
        `135°`,
        `45°`,
        `90°`,
        `60°`
      ],
      correctIndex: 0,
      trapExplanation: `সমীকরণটি সরল করলে পাই y = -x + a। এখানে ঢাল m = -1। আমরা জানি, m = tan θ => tan θ = -1 => θ = 135°। অনেকেই ঢাল ধনাত্মক ১ ভেবে 45° দাগিয়ে ফেলে। চরম ফাঁদ, মেও! 😹`
    });
  }

  // CHAPTER 4: বৃত্ত (7 templates * 10 variants = 70)
  for (let v = 0; v < 10; v++) {
    // Template 4.1: Circle equation with coefficient scaling
    const gVal = 2 * (v + 1);
    const fVal = 4 * (v + 1);
    const correctCenterX = gVal / 2;
    const correctCenterY = fVal / 2;
    const wrongCenterX = gVal;
    const wrongCenterY = fVal;

    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[3],
      difficulty: "চরম ফাঁদ",
      text: `2x² + 2y² - ${2*gVal}x - ${2*fVal}y - 7 = 0 বৃত্তের কেন্দ্র কত? 🙀`,
      options: [
        `(${correctCenterX}, ${correctCenterY})`,
        `(${wrongCenterX}, ${wrongCenterY})`,
        `(${-correctCenterX}, ${-correctCenterY})`,
        `(${-wrongCenterX}, ${-wrongCenterY})`
      ],
      correctIndex: 0,
      trapExplanation: `বৃত্তের সাধারণ সমীকরণে x² এবং y² এর সহগ সর্বদা ১ হতে হবে। কেন্দ্র বের করার আগে পুরো সমীকরণকে ২ দ্বারা ভাগ করতে হবে: x² + y² - ${gVal}x - ${fVal}y - 3.5 = 0। এবার কেন্দ্র হবে (-g, -f) = (${correctCenterX}, ${correctCenterY})। অনেকে ভাগ না করেই কেন্দ্র (${wrongCenterX}, ${wrongCenterY}) বের করে ফাঁদে পড়ে! 😹`
    });

    // Template 4.2: Length of Tangent from Internal Point (Imaginary!)
    // Circle: x^2 + y^2 = 9. Point inside: (1, 1). Power = 1+1-9 = -7. Tangent length = sqrt(-7) = imaginary.
    const radiusSq = v + 10; // 10 to 19
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[3],
      difficulty: "চরম ফাঁদ",
      text: `x² + y² = ${radiusSq} বৃত্তের উপর (1, 1) বিন্দু হতে অঙ্কিত স্পর্শকের দৈর্ঘ্য কত একক? 😿`,
      options: [
        `বাস্তব স্পর্শক সম্ভব নয় (কাল্পনিক)`,
        `√${radiusSq - 2} একক`,
        `√${radiusSq} একক`,
        `√${radiusSq + 2} একক`
      ],
      correctIndex: 0,
      trapExplanation: `বিন্দুটি (1,1) বৃত্তের ভিতরে অবস্থিত! কারণ 1² + 1² = 2 < ${radiusSq}। কোনো বিন্দুর অবস্থান বৃত্তের অভ্যন্তরে হলে সেখান থেকে বৃত্তে কোনো বাস্তব স্পর্শক টানা যায় না (স্পর্শকের দৈর্ঘ্য সূত্র √S₁ এর মান ঋণাত্মক বর্গমূল, অর্থাৎ কাল্পনিক হয়)। অনেকেই অন্ধের মতো দৈর্ঘ্য = √$|1+1-${radiusSq}| = $√${radiusSq - 2} দাগায়, যা একটি বিরাট ফাঁদ! 🐾`
    });

    // Template 4.3: Circle touching X-axis radius trap
    const h = v + 2;
    const k = v + 5;
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[3],
      difficulty: "চরম ফাঁদ",
      text: `একটি বৃত্তের কেন্দ্র (${h}, -${k}) এবং তা x-অক্ষকে স্পর্শ করে। বৃত্তটির ব্যাসার্ধ কত? 😻`,
      options: [
        `${k}`,
        `${h}`,
        `-${k}`,
        `√(${h}² + ${k}²)`
      ],
      correctIndex: 0,
      trapExplanation: `বৃত্ত x-অক্ষকে স্পর্শ করলে তার ব্যাসার্ধ হবে কেন্দ্রের কোটি (y-স্থানাঙ্ক) এর পরমমান, অর্থাৎ |k। এখানে কোটি -${k}, তাই ব্যাসার্ধ হবে $|-${k}| = $${k}। ব্যাসার্ধ কখনো ঋণাত্মক হতে পারে না, তাই অপশন C একটি বড় ফাঁদ! 🐾`
    });

    // Template 4.4: Condition for tangent
    const rVal = v + 2;
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[3],
      difficulty: "চরম কঠিন",
      text: `y = mx + c রেখাটি x² + y² = ${rVal*rVal} বৃত্তের স্পর্শক হওয়ার শর্ত কোনটি? 🙀`,
      options: [
        `c = ± ${rVal}√(1 + m²)`,
        `c = ${rVal}√(1 + m²)`,
        `c = ± ${rVal}(1 + m²)`,
        `c² = ${rVal*rVal}(1 - m²)`
      ],
      correctIndex: 0,
      trapExplanation: `বৃত্তের কেন্দ্র (0,0) থেকে স্পর্শকের লম্ব দূরত্ব ব্যাসার্ধের সমান হবে। এতে সমাধান করলে দাঁড়ায় c = ± a√(1+m²)। ব্যাসার্ধ a = ${rVal}। অবশ্যই '±' থাকতে হবে, কারণ বৃত্তের দুই পাশে দুটি সমান্তরাল স্পর্শক সম্ভব। 🐱`
    });

    // Template 4.5: Diameter end points circle
    const xEnd = v + 2;
    const yEnd = v + 4;
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[3],
      difficulty: "চরম কঠিন",
      text: `মূলবিন্দু (0,0) এবং (${xEnd}, ${yEnd}) বিন্দুদ্বয়ের সংযোগকারী সরলরেখাকে ব্যাস ধরে অঙ্কিত বৃত্তের সমীকরণ কোনটি? 😸`,
      options: [
        `x² + y² - ${xEnd}x - ${yEnd}y = 0`,
        `x² + y² + ${xEnd}x + ${yEnd}y = 0`,
        `x² + y² - ${xEnd}x + ${yEnd}y = 0`,
        `x² + y² = ${xEnd*xEnd + yEnd*yEnd}`
      ],
      correctIndex: 0,
      trapExplanation: `ব্যাসের প্রান্তবিন্দু দেওয়া থাকলে বৃত্তের সমীকরণ: (x - x1)(x - x2) + (y - y1)(y - y2) = 0। এখানে (x1,y1) = (0,0) এবং (x2,y2) = (${xEnd}, ${yEnd})। বসালে পাই: x(x - ${xEnd}) + y(y - ${yEnd}) = 0 => x² + y² - ${xEnd}x - ${yEnd}y = 0। চিহ্নের ভুল করলে চলবে না! 🐈`
    });

    // Template 4.6: Radical axis of two circles
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[3],
      difficulty: "চরম ফাঁদ",
      text: `S₁ ≡ x² + y² - 4x - 6y = 0 এবং S₂ ≡ x² + y² - 8x - 10y = 0 বৃত্তদ্বয়ের সাধারণ জ্যা (Common Chord) এর সমীকরণ কোনটি? 😿`,
      options: [
        `4x + 4y = 0`,
        `12x + 16y = 0`,
        `x + y = 2`,
        `4x - 4y = 0`
      ],
      correctIndex: 0,
      trapExplanation: `দুটি বৃত্তের সাধারণ জ্যা এর সমীকরণ হলো S₁ - S₂ = 0। বিয়োগ করলে আমরা পাই: (-4x - (-8x)) + (-6y - (-10y)) = 0 => 4x + 4y = 0। অনেকেই যোগ করে ফেলে অথবা বিয়োগে চিহ্নের ভুল করে ভুল সমীকরণ বের করে ফেলে! 🐾`
    });

    // Template 4.7: Intersection of circle and line (number of points)
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[3],
      difficulty: "চরম কঠিন",
      text: `x² + y² = 9 বৃত্ত এবং x + y = 5 সরলরেখাটি পরস্পরকে কয়টি বিন্দুতে ছেদ করে? 😻`,
      options: [
        `0টি (ছেদ করে না)`,
        `2টি`,
        `1টি (স্পর্শ করে)`,
        `অসংখ্য`
      ],
      correctIndex: 0,
      trapExplanation: `বৃত্তের কেন্দ্র (0,0) থেকে সরলরেখাটির লম্ব দূরত্ব d = |0+0-5| / √(1²+1²) = 5/√2 ≈ 3.53। বৃত্তের ব্যাসার্ধ r = 3। যেহেতু লম্ব দূরত্ব d > r, সরলরেখাটি বৃত্তের সম্পূর্ণ বাইরে অবস্থিত, অর্থাৎ কোনো ছেদবিন্দু নেই (0টি)। 🐱`
    });
  }

  // CHAPTER 5: ত্রিকোণমিতি (7 templates * 10 variants = 70)
  for (let v = 0; v < 10; v++) {
    // Template 5.1: Boundary quadrant values
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[4],
      difficulty: "চরম কঠিন",
      text: `যদি sin θ = -1/2 হয় এবং π ≤ θ ≤ 3π/2 হয়, তবে θ এর মান কত? 🙀`,
      options: [
        `7π/6`,
        `11π/6`,
        `-π/6`,
        `5π/6`
      ],
      correctIndex: 0,
      trapExplanation: `sin θ ঋণাত্মক এবং ব্যবধিটি ৩য় চতুর্ভাগ [π, 3π/2] নির্দেশ করে। ৩য় চতুর্ভাগে কোণটি হবে π + π/6 = 7π/6। অপশন B-তে থাকা 11π/6 ৪র্থ চতুর্ভাগের মান, যা প্রদত্ত ব্যবধিতে পড়ে না। এটি একটি চমৎকার কোয়াড্রেন্ট ফাঁদ! 🐾`
    });

    // Template 5.2: Min value of a sin x + b cos x
    const aCoeff = v + 3;
    const bCoeff = v + 4;
    const root = Math.sqrt(aCoeff*aCoeff + bCoeff*bCoeff);
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[4],
      difficulty: "চরম কঠিন",
      text: `${aCoeff}sin θ - ${bCoeff}cos θ এর সর্বনিম্ন (minimum) মান কত? 😹`,
      options: [
        `-${root}`,
        `-${aCoeff+bCoeff}`,
        `${root}`,
        `0`
      ],
      correctIndex: 0,
      trapExplanation: `f(θ) = a sin θ + b cos θ এর সর্বোচ্চ মান √(a²+b²) und সর্বনিম্ন মান -√(a²+b²)। এখানে a = ${aCoeff}, b = -${bCoeff}। অতএব সর্বনিম্ন মান হবে -√(${aCoeff}² + (${-bCoeff})²) = -${root}। অনেকেই মাইনাস চিহ্ন দেখে গুলিয়ে ফেলে! 🐱`
    });

    // Template 5.3: tan(A+B+C) or direct values
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[4],
      difficulty: "চরম ফাঁদ",
      text: `একটি ত্রিভুজ ABC-তে tan A + tan B + tan C এর মান সর্বদা নিচের কোনটির সমান? 😿`,
      options: [
        `tan A ✕ tan B ✕ tan C`,
        `1`,
        `0`,
        `tan A + tan B - tan C`
      ],
      correctIndex: 0,
      trapExplanation: `যেহেতু A+B+C = π, সেহেতু tan(A+B+C) = tan(π) = 0। সূত্রানুযায়ী লব tan A + tan B + tan C - tan A tan B tan C = 0 হতে হবে। অর্থাৎ tan A + tan B + tan C = tan A ✕ tan B ✕ tan C। এটা ত্রিভুজের একটি অন্যতম সুন্দর বৈশিষ্ট্য যা শিক্ষার্থীরা ভুলে যায়! 🐈`
    });

    // Template 5.4: Value of cos 20 + cos 100 + cos 140
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[4],
      difficulty: "চরম কঠিন",
      text: `cos 20° + cos 100° + cos 140° এর সরলীকৃত মান কত? 😸`,
      options: [
        `0`,
        `1`,
        `1/2`,
        `-1`
      ],
      correctIndex: 0,
      trapExplanation: `cos 100° + cos 20° = 2 cos(60°) cos(40°) = 2 ✕ (1/2) ✕ cos 40° = cos 40°। আবার cos 140° = cos(180° - 40°) = -cos 40°। তাহলে রাশিটি দাঁড়ায়: cos 40° - cos 40° = 0। অনেক বড় হিসাব ভেবে অনেকেই এটি ছেড়ে দেয়, আসলে উত্তর অতি সহজ 0! 🐱`
    });

    // Template 5.5: Minimum value of sin^6 x + cos^6 x
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[4],
      difficulty: "চরম কঠিন",
      text: `sin⁶ θ + cos⁶ θ এর সর্বনিম্ন (minimum) মান কত? 🙀`,
      options: [
        `1/4`,
        `1`,
        `1/2`,
        `0`
      ],
      correctIndex: 0,
      trapExplanation: `sin⁶ θ + cos⁶ θ = (sin² θ + cos² θ)³ - 3 sin² θ cos² θ (sin² θ + cos² θ) = 1 - (3/4) sin² 2θ। যেহেতু sin² 2θ এর সর্বোচ্চ মান ১, তাই রাশিটির সর্বনিম্ন মান হবে 1 - 3/4 = 1/4। অনেকে সর্বনিম্ন মান 0 বা 1/2 দাগিয়ে ফেলে যা চরম ট্র্যাপ! 🐾`
    });

    // Template 5.6: Period of trigonometric function
    const freq = v + 2;
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[4],
      difficulty: "চরম ফাঁদ",
      text: `f(x) = sin(${freq}x) ফাংশনের পর্যায়কাল (Period) কত? 😿`,
      options: [
        `2π/${freq}`,
        `2π`,
        `π/${freq}`,
        `${freq}π`
      ],
      correctIndex: 0,
      trapExplanation: `sin(x) এর পর্যায়কাল হলো 2π। যখন x কে কোনো ধ্রুবক k দ্বারা গুণ করা হয়, তখন পর্যায়কাল k ভাগ হয়ে যায়। অতএব sin(${freq}x) এর পর্যায়কাল হবে 2π/${freq}। অনেকে ভুল করে গুণ করে ফেলে (${freq}π)। সাবধান, মেও! 🐱`
    });

    // Template 5.7: tan theta value from sec theta + tan theta = p
    const pVal = v + 2;
    const correctTan = (pVal*pVal - 1) / (2*pVal);
    const wrongTan = (pVal*pVal + 1) / (2*pVal); 

    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[4],
      difficulty: "চরম কঠিন",
      text: `যদি sec θ + tan θ = ${pVal} হয়, তবে tan θ এর মান কত? 😻`,
      options: [
        `${correctTan.toFixed(3)}`,
        `${wrongTan.toFixed(3)}`,
        `${(1/pVal).toFixed(3)}`,
        `${(pVal - 1).toFixed(3)}`
      ],
      correctIndex: 0,
      trapExplanation: `আমরা জানি sec²θ - tan²θ = 1 => (sec θ - tan θ) = 1/p। সমীকরণ দুটি বিয়োগ করলে পাই 2 tan θ = p - 1/p => tan θ = (p² - 1)/(2p)। অপশন B তে থাকা সমাধানটি আসলে sec θ এর মান, যা শিক্ষার্থীরা প্রায়ই গুলিয়ে ফেলে! 🐈`
    });
  }

  // CHAPTER 6: অন্তরীকরণ (7 templates * 10 variants = 70)
  for (let v = 0; v < 10; v++) {
    // Template 6.1: Limit with absolute values |x| / x as x->0
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[5],
      difficulty: "চরম ফাঁদ",
      text: `$\\lim_{x \\to 0} \\frac{|x| / x}$ এর সঠিক গাণিতিক মান কত? 🙀`,
      options: [
        `বিদ্যমান নেই (Does not exist)`,
        `1`,
        `-1`,
        `0`
      ],
      correctIndex: 0,
      trapExplanation: `ডান হস্ত সীমা (RHL) = lim(x→0+) x/x = 1। আর বাম হস্ত সীমা (LHL) = lim(x→0-) -x/x = -1। যেহেতু RHL ≠ LHL, সেহেতু x=0 বিন্দুতে এই সীমার কোনো মান বিদ্যমান নেই! অনেকেই সরাসরি ১ বা -১ দাগিয়ে দিয়ে ফাঁদে পা দেয়! 😿`
    });

    // Template 6.2: Limit with squeeze theorem x*sin(1/x)
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[5],
      difficulty: "চরম ফাঁদ",
      text: `$\\lim_{x \\to 0} \\frac{x ✕ sin(1/x)}$ এর মান কত হবে? 😿`,
      options: [
        `0`,
        `1`,
        `অসংজ্ঞায়িত / বিদ্যমান নেই`,
        `অসীম (∞)`
      ],
      correctIndex: 0,
      trapExplanation: `এখানে Squeeze Theorem কাজ করে। আমরা জানি, sin(1/x) এর মান সবসময় -১ থেকে ১ এর মধ্যে থাকে। একে x দ্বারা গুণ করলে সীমা হবে: 0 ✕ (যেকোনো সসীম সংখ্যা) = 0। অনেকেই ভুল করে sin(1/x)/ (1/x) আকার বানানোর চেষ্টা করে ১ দাগিয়ে ফেলে, যা বড় ট্র্যাপ! 🐾`
    });

    // Template 6.3: Derivative of a^x vs x^a
    const base = v + 2;
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[5],
      difficulty: "চরম কঠিন",
      text: `d/dx (${base}^x) এর মান কত? 😸`,
      options: [
        `${base}^x ln(${base})`,
        `x ✕ ${base}^(x-1)`,
        `${base}^x`,
        `${base}^x / ln(${base})`
      ],
      correctIndex: 0,
      trapExplanation: `সূচকীয় ফাংশনের ডেরিভেটিভ সূত্র: d/dx (a^x) = a^x ln(a)। এখানে a = ${base}। অনেকেই ভুলে বীজগণিতীয় পাওয়ার রুল প্রয়োগ করে অপশন B দাগিয়ে ফেলে, যা মারাত্মক ফাঁদ! 🐱`
    });

    // Template 6.4: L'Hopital rule failure trap
    const xVal = v + 1;
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[5],
      difficulty: "চরম ফাঁদ",
      text: `$\\lim_{x \\to ${xVal}} \\frac{(x² + ${xVal*xVal}) / (x - ${xVal})}$ এর মান কত? 🙀`,
      options: [
        `বিদ্যমান নেই / অসংজ্ঞায়িত`,
        `${2*xVal}`,
        `${xVal}`,
        `0`
      ],
      correctIndex: 0,
      trapExplanation: `সীমাটি লক্ষ্য করুন: x → ${xVal} বসালে লব হয় ${2*xVal*xVal} এবং হর হয় 0। এটি কিন্তু 0/0 আকার নয়, তাই এল-হসপিটাল নিয়ম খাটবে না! সীমাটির কোনো বাস্তব মান নেই (অসংজ্ঞায়িত)। অনেকেই অন্ধের মতো ল্যাপ্লাস/হসপিটাল নিয়ম চালিয়ে ${2*xVal} দাগিয়ে ফেলে যা চরম ট্র্যাপ! 🐈`
    });

    // Template 6.5: Point of inflection y = x^3
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[5],
      difficulty: "চরম কঠিন",
      text: `y = x³ বক্ররেখার x = 0 বিন্দুটি একটি কী নির্দেশ করে? 🐾`,
      options: [
        `নতি পরিবর্তন বিন্দু (Point of Inflection)`,
        `গুরুমান বিন্দু`,
        `লঘুমান বিন্দু`,
        `স্থির বিন্দু কিন্তু কোনো বিশেষত্ব নেই`
      ],
      correctIndex: 0,
      trapExplanation: `x = 0 বিন্দুতে dy/dx = 0 এবং d²y/dx² = 0। কিন্তু ৩য় ডেরিভেটিভ d³y/dx³ = 6 ≠ 0। এর মানে হলো বিন্দুটিতে লঘু বা গুরুমান নেই, বরং বক্ররেখার দিক পরিবর্তন হয়। একে নতি পরিবর্তন বিন্দু বা Point of Inflection বলে। 🐱`
    });

    // Template 6.6: Parametric differentiation dy/dx
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[5],
      difficulty: "চরম কঠিন",
      text: `যদি x = a cos t এবং y = a sin t হয়, তবে dy/dx এর মান কত? 😽`,
      options: [
        `-cot t`,
        `-tan t`,
        `cot t`,
        `tan t`
      ],
      correctIndex: 0,
      trapExplanation: `dy/dx = (dy/dt) / (dx/dt) = (a cos t) / (-a sin t) = -cot t। সহগ ও চিহ্নে সতর্ক থাকুন! তাড়াহুড়োয় মাইনাস চিহ্ন বাদ দিয়ে অনেকে cot t দাগায়। 🐾`
    });

    // Template 6.7: Successive differentiation d^n/dx^n (sin x)
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[5],
      difficulty: "চরম কঠিন",
      text: `dⁿ/dxⁿ (sin x) এর মান কত? 😿`,
      options: [
        `sin(x + nπ/2)`,
        `cos(x + nπ/2)`,
        `(-1)ⁿ sin x`,
        `sin(x + nπ)`
      ],
      correctIndex: 0,
      trapExplanation: `sin x কে প্রতিবার অন্তরীকরণ করলে তা ৯০° কোণ এগিয়ে যায়। n-তম অন্তরীকরণের সূত্রটি হলো sin(x + nπ/2)। এটি মনে রাখা জরুরি, নতুবা n=1, 2 বসিয়ে অপশন চেক করে মেলাতে হবে। 🐈`
    });
  }

  // CHAPTER 7: যোগজীকরণ (7 templates * 10 variants = 70)
  for (let v = 0; v < 10; v++) {
    // Template 7.1: Discontinuous definite integral (Classic trap!)
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[6],
      difficulty: "চরম ফাঁদ",
      text: `$\\int_{-1 থেকে 1} 1/x² dx$ এর মান কত? 🙀`,
      options: [
        `অসংজ্ঞায়িত / অপসারী (Divergent)`,
        `-2`,
        `2`,
        `0`
      ],
      correctIndex: 0,
      trapExplanation: `ফাংশনটি f(x) = 1/x² সীমার অন্তর্গত x = 0 বিন্দুতে অসংজ্ঞায়িত (vertical asymptote)। এটি একটি অপ্রকৃত যোগজ (improper integral)। এর ইন্টিগ্রেশন করলে মান অসীমের দিকে যায় (অপসারী)। সাধারণ ইন্টিগ্রেশন করে -2 দাগানো একটি চরম ঐতিহাসিক ফাঁদ! 😹`
    });

    // Template 7.2: Absolute Trigonometric Integral Trap (0 to 2pi of sqrt(1 - cos 2x))
    // Integral from 0 to 2pi of sqrt(2) * |sin x| dx.
    // Over [0, pi] sin x >= 0, integral is 2*sqrt(2). Over [pi, 2pi] sin x < 0, $|sin x| = $-sin x, integral is 2*sqrt(2). Total = 4*sqrt(2).
    // Naive integration without absolute sign: integral of sin x from 0 to 2pi is [-cos x] = -1 - (-1) = 0.
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[6],
      difficulty: "চরম ফাঁদ",
      text: `∫[0 থেকে 2π] √(1 - cos 2x) dx এর সঠিক মান কোনটি? 🙀`,
      options: [
        `4√2`,
        `0`,
        `2√2`,
        `-4√2`
      ],
      correctIndex: 0,
      trapExplanation: `√(1 - cos 2x) = √(2 sin² x) = √2 |sin x|। যেহেতু [0, 2π] ব্যবধিতে sin x এর মান ২য় অর্ধে ঋণাত্মক হয়, তাই মডুলাস ভাঙলে ইন্টিগ্রেশনকে দুই ভাগে ভাগ করতে হবে: [0, π] এ √2 sin x এবং [π, 2π] এ -√2 sin x। হিসাব করলে দাঁড়াবে 2√2 + 2√2 = 4√2। সরল ইন্টিগ্রেশন করে ০ (অপশন B) দাগানো একটি বড় ফাঁদ! 😹`
    });

    // Template 7.3: Constant of integration trap
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[6],
      difficulty: "চরম কঠিন",
      text: `∫ (1/x) dx এর সঠিক অনির্দিষ্ট মান কোনটি? 😿`,
      options: [
        `ln|x| + C`,
        `ln(x) + C`,
        `-1/x² + C`,
        `1/x + C`
      ],
      correctIndex: 0,
      trapExplanation: `1/x এর যোগজ হলো ln|x| + C, যেখানে মডুলাস চিহ্ন অত্যন্ত গুরুত্বপূর্ণ, কারণ ঋণাত্মক সংখ্যার লগারিদম সংজ্ঞায়িত নয়। মডুলাস ছাড়া ln(x) + C দাগানো একটি সূক্ষ্ম ফাঁদ! 🐾`
    });

    // Template 7.4: e^x (f + f') form
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[6],
      difficulty: "চরম কঠিন",
      text: `∫ e^x ( sec x + sec x tan x ) dx এর মান কত? 😻`,
      options: [
        `e^x sec x + C`,
        `e^x tan x + C`,
        `e^x sec x tan x + C`,
        `-e^x sec x + C`
      ],
      correctIndex: 0,
      trapExplanation: `আমরা জানি ∫ e^x ( f(x) + f'(x) ) dx = e^x f(x) + C। এখানে f(x) = sec x এবং তার অন্তরক f'(x) = sec x tan x। সুতরাং উত্তর হবে e^x sec x + C। 🐱`
    });

    // Template 7.5: Integral of ln x
    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[6],
      difficulty: "চরম কঠিন",
      text: `∫ ln(x) dx এর মান কত? 🙀`,
      options: [
        `x ln(x) - x + C`,
        `1/x + C`,
        `x ln(x) + x + C`,
        `ln(x) - x + C`
      ],
      correctIndex: 0,
      trapExplanation: `লিয়াট (LIATE) নিয়ম ব্যবহার করে আংশিক যোগজীকরণ (integration by parts) করতে হবে: ∫ 1 ✕ ln(x) dx। সমাধান করলে দাঁড়ায় x ln(x) - x + C। অনেকেই 1/x + C দাগিয়ে ডেরিভেটিভের সাথে গুলিয়ে ফেলে! 🐈`
    });

    // Template 7.6: Area under curve y^2 = 4ax
    const a = v + 1;
    const correctArea = (16 * a * a / 3).toFixed(2);
    const wrongArea = (8 * a * a / 3).toFixed(2);

    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[6],
      difficulty: "চরম কঠিন",
      text: `y² = ${4*a}x এবং x² = ${4*a}y পরাবৃত্তদ্বয় দ্বারা সীমাবদ্ধ অঞ্চলের ক্ষেত্রফল কত? 🐾`,
      options: [
        `${correctArea} বর্গ একক`,
        `${wrongArea} বর্গ একক`,
        `${(16*a/3).toFixed(2)} বর্গ একক`,
        `0 বর্গ একক`
      ],
      correctIndex: 0,
      trapExplanation: `দুটি পরাবৃত্ত y² = 4ax এবং x² = 4by দ্বারা সীমাবদ্ধ অঞ্চলের ক্ষেত্রফলের সূত্র হলো 16ab/3। এখানে a = ${a} এবং b = ${a}। অতএব ক্ষেত্রফল = 16 ✕ ${a} ✕ ${a} / 3 = ${correctArea}। হাফ গুণ করতে ভুলে গেলে বা ভুল সূত্র ব্যবহার করলে ফাঁদে পড়তে হবে! 😹`
    });

    // Template 7.7: Integral of absolute function
    const limit = v + 2;
    const ans7 = limit * limit;
    const wrongAns7 = 0; 
    const wrongAns7_2 = limit;

    list.push({
      id: id++,
      chapter: GEN_CHAPTERS[6],
      difficulty: "চরম ফাঁদ",
      text: `∫[-${limit} থেকে ${limit}] |x| dx এর মান কত? 🙀`,
      options: [
        `${ans7}`,
        `${wrongAns7}`,
        `${wrongAns7_2}`,
        `${2*ans7}`
      ],
      correctIndex: 0,
      trapExplanation: `যেহেতু |x| একটি যুগ্ম ফাংশน, তাই ∫[-a to a] |x| dx = 2 ∫[0 to a] x dx = 2 [x²/2]₀^a = a² = ${limit}² = ${ans7}। অনেকেই অযুগ্ম ভেবে সরাসরি ০ দাগিয়ে ট্র্যাপে পড়ে, কারণ মডুলাস ফাংশন সবসময় ধনাত্মক মান দেয়! 🐾`
    });
  }

  // Shuffle options deterministically
  for (let i = 0; i < list.length; i++) {
    const q = list[i];
    const originalCorrectOption = q.options[q.correctIndex];
    const shuffledOptions = seededShuffle([...q.options], i + 100);
    q.options = shuffledOptions;
    q.correctIndex = shuffledOptions.indexOf(originalCorrectOption);
  }

  return list;
}
