import React, { useState, useEffect, useRef } from 'react';

const FORMULA_DATABASE = {
  "Matrices & Determinants": [
    { title: "Singular Matrix Condition", eq: "$$|A| = 0$$", desc: "একটি বর্গ ম্যাট্রিক্স A ব্যতিক্রমী (Singular) হবে যদি এবং কেবল যদি এর নির্ণায়কের মান শূন্য হয়। এর কোনো বিপরীত ম্যাট্রিক্স থাকে না।" },
    { title: "Inverse of 2x2 Matrix", eq: "$$A^{-1} = \\frac{1}{ad - bc} \\begin{bmatrix} d & -b \\ -c & a \\end{bmatrix}$$", desc: "A = [[a, b], [c, d]] ম্যাট্রিক্সের জন্য। বিপরীত ম্যাট্রিক্স তখনই সম্ভব যখন ad - bc ≠ 0 হবে।" },
    { title: "Adjoint Determinant Property", eq: "$$|adj(A)| = |A|^{n-1}$$", desc: "এখানে n হলো বর্গ ম্যাট্রিক্স A এর মাত্রা বা ডাইমেনশন।" },
    { title: "Scaling Determinant Property", eq: "$$|kA| = k^n |A|$$", desc: "একটি n মাত্রার বর্গ ম্যাট্রিক্সকে ধ্রুবক k দ্বারা গুণ করলে তার নির্ণায়কের মান k^n গুণ বৃদ্ধি পায়।" },
    { title: "Trace of a Matrix", eq: "$$Tr(A) = \\sum_{i=1}^n a_{ii}$$", desc: "প্রধান কর্ণের উপাদানগুলোর সমষ্টিকে ম্যাট্রিক্সের ট্রেস বলে।" }
  ],
  "Vectors": [
    { title: "Scalar (Dot) Product", eq: "$$A \\cdot B = |A||B| \\cos \\theta$$", desc: "যদি A এবং B ভেক্টরদ্বয় পরস্পর লম্ব হয়, তবে তাদের ডট গুণফল সর্বদা 0 হবে।" },
    { title: "Vector (Cross) Product", eq: "$$A \\times B = |A||B| \\sin \\theta \\hat{\\eta}$$", desc: "এখানে η হলো A এবং B উভয়ের উপর লম্ব একটি একক ভেক্টর।" },
    { title: "Unit Perpendicular Vector", eq: "$$\\hat{\\eta} = \\pm \\frac{A \\times B}{|A \\times B|}$$", desc: "A এবং B উভয় ভেক্টরের উপর লম্ব একক ভেক্টর। দিক স্ক্রু নিয়ম অনুযায়ী ধনাত্মক বা ঋণাত্মক হতে পারে।" },
    { title: "Area of a Triangle", eq: "$$Area = \\frac{1}{2} |A \\times B|$$", desc: "এখানে A এবং B হলো ত্রিভুজের দুটি সন্নিহিত বাহু নির্দেশকারী ভেক্টর।" },
    { title: "Area of a Parallelogram (diagonals)", eq: "$$Area = \\frac{1}{2} |d_1 \\times d_2|$$", desc: "এখানে d1 and d2 হলো সামান্তরিকের দুটি কর্ণ নির্দেশকারী ভেক্টর।" },
    { title: "Direction Cosines", eq: "$$\\cos^2 \\alpha + \\cos^2 \\beta + \\cos^2 \\gamma = 1$$", desc: "ভেক্টরটি ধনাত্মক x, y এবং z অক্ষের সাথে যথাক্রমে α, β, γ কোণ উৎপন্ন করে।" }
  ],
  "Straight Lines": [
    { title: "Distance between Two Points", eq: "$$d = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$$", desc: "কার্তেসীয় স্থানাঙ্ক ব্যবস্থায় P1 এবং P2 বিন্দুর মধ্যবর্তী সরাসরি দূরত্ব।" },
    { title: "Internal Division Point", eq: "$$P = \\left(\\frac{m_1 x_2 + m_2 x_1}{m_1+m_2}, \\frac{m_1 y_2 + m_2 y_1}{m_1+m_2}\\right)$$", desc: "m1:m2 অনুপাতে সংযোগকারী সরলরেখাকে অন্তঃস্থভাবে বিভক্তকারী বিন্দু P এর স্থানাঙ্ক।" },
    { title: "External Division Point", eq: "$$P = \\left(\\frac{m_1 x_2 - m_2 x_1}{m_1-m_2}, \\frac{m_1 y_2 - m_2 y_1}{m_1-m_2}\\right)$$", desc: "m1:m2 অনুপাতে সংযোগকারী সরলরেখাকে বহিঃস্থভাবে বিভক্তকারী বিন্দু P এর স্থানাঙ্ক।" },
    { title: "Distance from Point to Line", eq: "$$d = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2 + B^2}}$$", desc: "(x0, y0) বিন্দু হতে Ax + By + C = 0 সরলরেখার লম্ব দূরত্ব।" },
    { title: "Distance between Parallel Lines", eq: "$$d = \\frac{|C_1 - C_2|}{\\sqrt{A^2 + B^2}}$$", desc: "Ax+By+C1=0 এবং Ax+By+C2=0 সমান্তরাল রেখাদ্বয়ের মধ্যবর্তী দূরত্ব। দূরত্বের সূত্র বসানোর আগে সহগ সমান করে নিতে হবে।" },
    { title: "Angle between Two Lines", eq: "$$\\tan \\theta = \\pm \\frac{m_1 - m_2}{1 + m_1 m_2}$$", desc: "এখানে m1 এবং m2 হলো সরলরেখাদ্বয়ের ঢাল।" }
  ],
  "Circles": [
    { title: "General Equation of Circle", eq: "$$x^2 + y^2 + 2gx + 2fy + c = 0$$", desc: "বৃত্তের কেন্দ্র (-g, -f) এবং ব্যাসার্ধ √(g² + f² - c)। সমীকরণে x² ও y² এর সহগ সর্বদা ১ হতে হবে।" },
    { title: "Axis Intercepts", eq: "$$X\\text{-intercept} = 2\\sqrt{g^2 - c}, \\quad Y\\text{-intercept} = 2\\sqrt{f^2 - c}$$", desc: "বৃত্ত দ্বারা অক্ষত্রয় থেকে খণ্ডিত বা কর্তিত অংশের দৈর্ঘ্য।" },
    { title: "Circle touching axes", eq: "$$\\text{Touches X-axis: } g^2 = c, \\quad \\text{Touches Y-axis: } f^2 = c$$", desc: "x-অক্ষকে স্পর্শ করলে g² = c এবং y-অক্ষকে স্পর্শ করলে f² = c। উভয় অক্ষকে স্পর্শ করলে g² = f² = c।" },
    { title: "Tangent Condition", eq: "$$c = \\pm a\\sqrt{1 + m^2}$$", desc: "y = mx + c সরলরেখাটি x² + y² = a² বৃত্তের স্পর্শক হওয়ার প্রয়োজনীয় শর্ত।" },
    { title: "Tangent Length", eq: "$$L = \\sqrt{x_0^2 + y_0^2 + 2gx_0 + 2fy_0 + c}$$", desc: "বহিঃস্থ বিন্দু (x0, y0) হতে বৃত্তে অঙ্কিত স্পর্শকের দৈর্ঘ্য। বিন্দুটি বৃত্তের বাইরে থাকলেই কেবল বাস্তব দৈর্ঘ্য পাওয়া যায়।" }
  ],
  "Trigonometry": [
    { title: "Sum and Difference Formulas", eq: "$$\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B$$", desc: "সংযুক্ত ও যৌগিক কোণের ত্রিকোণমিতিক বিস্তারের সূত্র।" },
    { title: "Double Angle Formulas", eq: "$$\\sin 2A = 2\\sin A \\cos A, \\quad \\cos 2A = \\cos^2 A - \\sin^2 A$$", desc: "দ্বিগুণ কোণকে একক কোণে রূপান্তরের প্রয়োজনীয় সূত্রাবলি (যেমন: cos 2A = 2cos²A - 1 = 1 - 2sin²A)।" },
    { title: "Triple Angle Formulas", eq: "$$\\sin 3A = 3\\sin A - 4\\sin^3 A, \\quad \\cos 3A = 4\\cos^3 A - 3\\sin A$$", desc: "ত্রিগুণ কোণকে একক কোণে রূপান্তরের প্রয়োজনীয় সূত্রাবলি।" },
    { title: "Max & Min of a sin x + b cos x", eq: "$$Range = \\left[-\\sqrt{a^2+b^2}, \\quad +\\sqrt{a^2+b^2}\\right]$$", desc: "রাশিটির সর্বোচ্চ ও সর্বনিম্ন সীমার মান।" },
    { title: "Product to Sum / Sum to Product", eq: "$$\\sin C + \\sin D = 2\\sin\\left(\\frac{C+D}{2}\\right)\\cos\\left(\\frac{C-D}{2}\\right)$$", desc: "ত্রিকোণমিতিক গুণফলকে যোগফলে এবং যোগফলকে গুণফলে রূপান্তরের সূত্র।" }
  ],
  "Differentiation": [
    { title: "Power Rule", eq: "$$\\frac{d}{dx}(x^n) = n x^{n-1}$$", desc: "যেকোনো বাস্তব ঘাত বা পাওয়ার n এর অন্তরীকরণের সাধারণ সূত্র।" },
    { title: "Exponential derivative", eq: "$$\\frac{d}{dx}(a^x) = a^x \\ln a, \\quad \\frac{d}{dx}(e^x) = e^x$$", desc: "সূচকীয় ফাংশনসমূহের অন্তরীকরণের সূত্র।" },
    { title: "Product Rule & Quotient Rule", eq: "$$\\frac{d}{dx}(uv) = u\\frac{dv}{dx} + v\\frac{du}{dx}, \\quad \\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{v\\frac{du}{dx} - u\\frac{dv}{dx}}{v^2}$$", desc: "দুটি ফাংশনের গুণফল ও ভাগফলের অন্তরীকরণ করার নিয়ম।" },
    { title: "Chain Rule", eq: "$$\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$$", desc: "অন্তরীকরণের ক্ষেত্রে যৌগিক বা ফাংশনের ফাংশন অন্তরীকরণের শিকল নিয়ম।" },
    { title: "Trig Derivatives", eq: "$$\\frac{d}{dx}(\\sin x) = \\cos x, \\quad \\frac{d}{dx}(\\cos x) = -\\sin x, \\quad \\frac{d}{dx}(\\tan x) = \\sec^2 x$$", desc: "মৌলিক ত্রিকোণমিতিক ফাংশনসমূহের অন্তরীকরণের রূপ।" }
  ],
  "Integration": [
    { title: "Basic Integration Formulas", eq: "$$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)$$", desc: "ঘাত বা পাওয়ারের বিপরীত যোগজীকরণ সূত্র (n ≠ -1 এর জন্য প্রযোজ্য)।" },
    { title: "Logarithmic integration", eq: "$$\\int \\frac{1}{x} dx = \\ln |x| + C$$", desc: "1/x এর যোগজ ln|x|। ঋণাত্মক মান এড়াতে মডুলাস ব্যবহার করা আবশ্যক।" },
    { title: "Exponential Form Integration", eq: "$$\\int e^x (f(x) + f'(x)) dx = e^x f(x) + C$$", desc: "সূচকীয় ও মূল ফাংশনের যোগজীকরণ শর্টকাট।" },
    { title: "Integration by Parts", eq: "$$\\int u dv = uv - \\int v du$$", desc: "LIATE ক্রমানুসারে u এবং v সিলেক্ট করে আংশিক যোগজীকরণের সূত্র প্রয়োগ করতে হয়।" },
    { title: "Bounded Parabolic Area", eq: "$$Area = \\frac{16ab}{3}$$", desc: "y² = 4ax এবং x² = 4by পরাবৃত্তদ্বয় দ্বারা সীমাবদ্ধ ক্ষেত্রের ক্ষেত্রফল।" }
  ]
};

export default function FormulaHub({ onBack }) {
  const [selectedChap, setSelectedChap] = useState("Matrices & Determinants");
  const listRef = useRef(null);

  // Trigger KaTeX rendering on chapter selection
  useEffect(() => {
    if (listRef.current && window.renderMathInElement) {
      try {
        window.renderMathInElement(listRef.current, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ],
          throwOnError: false
        });
      } catch (err) {
        console.warn("KaTeX rendering error in Formula Hub: ", err);
      }
    }
  }, [selectedChap]);

  return (
    <div className="cute-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button
        className="cute-btn cute-btn-outline"
        style={{ marginBottom: '20px', fontSize: '0.9rem', padding: '6px 15px' }}
        onClick={onBack}
      >
        ⬅️ Back to Dashboard
      </button>

      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>📚 Mathematical Formula Reference Hub</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', marginTop: '5px' }}>
          Master key formulas for HSC 2026 Higher Math 1st Paper. Study smart to avoid exam traps, meow! 🐱🎓
        </p>
      </div>

      {/* Chapter Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '25px',
        borderBottom: '2px solid rgba(0,0,0,0.05)',
        paddingBottom: '15px',
        justifyContent: 'center'
      }}>
        {Object.keys(FORMULA_DATABASE).map(chap => (
          <button
            key={chap}
            className={`cute-btn ${selectedChap === chap ? '' : 'cute-btn-outline'}`}
            style={{ fontSize: '0.85rem', padding: '8px 16px', borderRadius: '14px' }}
            onClick={() => setSelectedChap(chap)}
          >
            {chap}
          </button>
        ))}
      </div>

      {/* Formula List */}
      <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {FORMULA_DATABASE[selectedChap].map((item, idx) => (
          <div
            key={idx}
            style={{
              background: 'white',
              border: '2px solid var(--card-border)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
            }}
          >
            <h4 style={{ color: 'var(--primary-pink-hover)', fontSize: '1.15rem', fontWeight: '700', marginBottom: '8px' }}>
              🌟 {item.title}
            </h4>
            <div style={{
              background: 'var(--bg-gradient)',
              padding: '15px',
              borderRadius: '12px',
              textAlign: 'center',
              margin: '12px 0',
              border: '1px solid rgba(0,0,0,0.03)'
            }}>
              {item.eq}
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
              <strong>Description:</strong> {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
