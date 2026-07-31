import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { generateQuestions } from './data/questionsGenerator';
import { playWelcomeMeow, playHappyMeow, playSadMeow, playVictoryMeow, setSoundEnabled } from './utils/audioSynth';

import AvatarSelector from './components/AvatarSelector';
import Dashboard from './components/Dashboard';
import ExamRoom from './components/ExamRoom';
import Leaderboard from './components/Leaderboard';
import UpgradeCondition from './components/UpgradeCondition';
import CuteFooter from './components/CuteFooter';
import FormulaHub from './components/FormulaHub';

const INITIAL_LEADERBOARD = [
  { name: "Mishkat (Creator) 👑", avatar: "🦁", xp: 5000 }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [tempName, setTempName] = useState('');
  const [tempAvatar, setTempAvatar] = useState('🐱');
  const [view, setView] = useState('register');
  const [examConfig, setExamConfig] = useState({ mode: '', chapterDetails: null });
  const [questionsPool, setQuestionsPool] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [lastExamResult, setLastExamResult] = useState(null);
  const [overallTimeLimit, setOverallTimeLimit] = useState('none'); // 'none', 5, 10, 20, 30
  const [toast, setToast] = useState(null);
  const [soundOn, setSoundOn] = useState(true);

  const reviewContainerRef = useRef(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const toggleSound = () => {
    const nextSound = !soundOn;
    setSoundOn(nextSound);
    setSoundEnabled(nextSound);
    showToast(nextSound ? "🔊 Sound Effects Enabled" : "🔇 Sound Muted", "info");
  };

  useEffect(() => {
    const pool = generateQuestions();
    setQuestionsPool(pool);

    const savedUser = localStorage.getItem('meow_math_user');
    const savedLeaderboard = localStorage.getItem('meow_math_leaderboard');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setView('dashboard');
    }

    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    } else {
      setLeaderboard(INITIAL_LEADERBOARD);
    }
  }, []);

  useEffect(() => {
    if (view === 'dashboard' && user) {
      playWelcomeMeow();
    }
  }, [view]);

  // Trigger KaTeX rendering on review items
  useEffect(() => {
    if (view === 'result' && reviewContainerRef.current && window.renderMathInElement) {
      try {
        window.renderMathInElement(reviewContainerRef.current, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
          ],
          throwOnError: false
        });
      } catch (err) {
        console.warn("KaTeX rendering error in review: ", err);
      }
    }
  }, [view, lastExamResult]);

  const saveUserData = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('meow_math_user', JSON.stringify(updatedUser));

    setLeaderboard(prev => {
      let playerExists = false;
      let newLB = prev.map(player => {
        if (player.name === updatedUser.name) {
          playerExists = true;
          return { ...player, xp: updatedUser.xp, avatar: updatedUser.avatar };
        }
        return player;
      });

      if (!playerExists) {
        newLB.push({ name: updatedUser.name, avatar: updatedUser.avatar, xp: updatedUser.xp });
      }

      newLB.sort((a, b) => b.xp - a.xp);
      localStorage.setItem('meow_math_leaderboard', JSON.stringify(newLB));
      return newLB;
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!tempName.trim()) {
      showToast("Meow! Please enter your name! 🐾", "error");
      return;
    }

    const newUser = {
      name: tempName.trim(),
      avatar: tempAvatar,
      xp: 0,
      stamina: 100,
      activities: [
        { action: "Joined MeowMath Elite Academy! 🌸", time: "Just now", status: "success" }
      ],
      chapterHighScores: {},
      totalCorrect: 0,
      totalAttempted: 0,
      examsCount: 0
    };

    saveUserData(newUser);
    setView('dashboard');
  };

  const handleStartExam = (mode, details = null) => {
    if (mode === 'leaderboard') {
      setView('leaderboard');
    } else if (mode === 'formulas') {
      setView('formulas');
    } else if (mode === 'upgrade') {
      setView('upgrade');
    } else {
      const requiredStamina = mode === 'quick' ? 15 : mode === 'boss' ? 25 : 10;
      if (user.stamina < requiredStamina) {
        playSadMeow();
        showToast(`Meow! Insufficient stamina (${requiredStamina}% required). Visit the Math Spa to recharge! 😿⚡`, "error");
        setView('upgrade');
        return;
      }

      setExamConfig({ mode, chapterDetails: details });
      setView('exam');
    }
  };

  const handleFinishExam = ({ xpGained, staminaUsed, correctCount, totalCount, modeName, isGameOver, timeSpent, userAnswers }) => {
    const newActivity = {
      action: `Completed ${modeName} exam! (Score: ${correctCount}/${totalCount}, +${xpGained} XP) 🏆`,
      time: "Just now",
      status: "success"
    };

    const updatedUser = {
      ...user,
      xp: user.xp + xpGained,
      stamina: Math.max(0, user.stamina - staminaUsed),
      activities: [newActivity, ...(user.activities || [])].slice(0, 10),
      chapterHighScores: {
        ...(user.chapterHighScores || {})
      },
      totalCorrect: (user.totalCorrect || 0) + correctCount,
      totalAttempted: (user.totalAttempted || 0) + totalCount,
      examsCount: (user.examsCount || 0) + 1
    };

    // Update chapter-wise high scores
    const isChapterMode = modeName.startsWith("Chapter: ");
    const chapName = isChapterMode ? modeName.replace("Chapter: ", "") : null;
    
    if (chapName) {
      const prevHigh = (user.chapterHighScores && user.chapterHighScores[chapName]) || 0;
      if (correctCount > prevHigh) {
        updatedUser.chapterHighScores[chapName] = correctCount;
      }
    }

    setLastExamResult({
      correctCount,
      totalCount,
      xpGained,
      staminaUsed,
      modeName,
      isGameOver,
      timeSpent,
      userAnswers: userAnswers || []
    });

    saveUserData(updatedUser);
    setView('result');
  };

  const handleUpgradeComplete = (staminaGained, xpGained) => {
    const newActivity = {
      action: `Upgraded condition at the Math Spa! (+${staminaGained}% Stamina, +${xpGained} XP) ⚡`,
      time: "Just now",
      status: "success"
    };

    const updatedUser = {
      ...user,
      stamina: Math.min(100, user.stamina + staminaGained),
      xp: user.xp + xpGained,
      activities: [newActivity, ...(user.activities || [])].slice(0, 10)
    };
    saveUserData(updatedUser);
  };

  const handleResetUser = () => {
    if (window.confirm("Meow! Are you sure you want to reset all progress and start fresh?")) {
      localStorage.removeItem('meow_math_user');
      localStorage.removeItem('meow_math_leaderboard');
      setUser(null);
      setTempName('');
      setTempAvatar('🐱');
      setLeaderboard(INITIAL_LEADERBOARD);
      setView('register');
      showToast("Progress Reset successfully!", "info");
    }
  };

  // Helper to generate a detailed, step-by-step LaTeX math explanation in Bengali
  const getDetailedExplanation = (ans) => {
    let detail = "";
    
    if (ans.text.includes("ব্যতিক্রমী")) {
      detail = `
\\newline\\newline
\\textbf{📝 বিস্তারিত সমাধান ও বিশ্লেষণ (Step-by-step Solution):}
\\newline
\\textbf{ধাপ-১ (ব্যতিক্রমী শর্ত):} একটি ম্যাট্রিক্স $A$ ব্যতিক্রমী (Singular) হবে যদি $|A| = 0$ হয়।
\\newline
\\textbf{ধাপ-২ (নির্ণায়কের মান বের করা):} $\\begin{vmatrix} x & a \\\\ b & c \\end{vmatrix} = 0 \\implies c \\cdot x - a \\cdot b = 0$।
\\newline
\\textbf{ধাপ-৩ (মান প্রতিস্থাপন ও আরগুণন):} সমীকরণে নির্দিষ্ট ধ্রুবক বসিয়ে পাই, $c \\cdot x = a \\cdot b \\implies x = \\frac{a \\cdot b}{c}$। চিহ্নের বা আরগুণনের হিসাব ভুল করলেই এটি একটি ফাঁদ! 🐾`;
    } else if (ans.text.includes("ম্যাট্রিক্সের মাত্রার যোগফল")) {
      detail = `
\\newline\\newline
\\textbf{📝 বিস্তারিত সমাধান ও বিশ্লেষণ (Step-by-step Solution):}
\\newline
\\textbf{ধাপ-১ (ম্যাট্রিক্স গুণের মাত্রা নিয়ম):} $(r \\times c)$ মাত্রার ম্যাট্রিক্সের সাথে $(c \\times p)$ মাত্রার ম্যাট্রিক্স গুণ করলে গুণফলের মাত্রা হয় $(r \\times p)$।
\\newline
\\textbf{ধাপ-২ (AB ও BA এর মাত্রা):} কলাম ভেক্টর $A$ এর মাত্রা $(s \\times 1)$ এবং সারি ভেক্টর $B$ এর মাত্রা $(1 \\times s)$। 
\\newline
অতএব, $AB$ এর মাত্রা হবে $(s \\times 1) \\times (1 \\times s) = (s \\times s)$ (উপাদান সংখ্যা $s^2$)।
\\newline
এবং $BA$ এর মাত্রা হবে $(1 \\times s) \\times (s \\times 1) = (1 \\times 1)$ (উপাদান সংখ্যা ১)।
\\newline
\\textbf{ধাপ-৩ (ডাইমেনশন যোগফল):} মাত্রার উপাদান সমূহের মোট সমষ্টি হবে $s^2 + 1$। অনেকেই মনে করে উভয় গুণফলের মাত্রাই সমান বা একই হবে, যা একটি ফাঁদ! 🐈`;
    } else if (ans.text.includes("বিপরীত সমসমঞ্জস") || ans.text.includes("Skew-symmetric")) {
      detail = `
\\newline\\newline
\\textbf{📝 বিস্তারিত সমাধান ও বিশ্লেষণ (Step-by-step Solution):}
\\newline
\\textbf{ধাপ-১ (বিপরীত সমসমঞ্জস সংজ্ঞা):} একটি ম্যাট্রিক্সকে Skew-symmetric বলা হয় যদি $A^T = -A$ হয়।
\\newline
\\textbf{ধাপ-২ (কর্ণ উপাদান সমীকরণ):} সংজ্ঞানুযায়ী $a_{ij} = -a_{ji}$। যদি আমরা প্রধান কর্ণের উপাদান হিসাব করি (যেখানে সারি ও কলাম সূচক সমান, অর্থাৎ $i = j$), তবে সমীকরণটি দাঁড়ায় $a_{ii} = -a_{ii} \\implies 2a_{ii} = 0 \\implies a_{ii} = 0$।
\\newline
\\textbf{ধাপ-৩ (কর্ণের সমষ্টি):} যেহেতু প্রধান কর্ণের প্রতিটি উপাদান পৃথকভাবে শূন্য ($0$), তাই মাত্রা যাই হোক না কেন, তাদের সমষ্টি সর্বদা $0$ হবে। 🐾`;
    } else if (ans.text.includes("দিক কোসাইন") || ans.text.includes("sin²α")) {
      detail = `
\\newline\\newline
\\textbf{📝 বিস্তারিত সমাধান ও বিশ্লেষণ (Step-by-step Solution):}
\\newline
\\textbf{ধাপ-১ (দিক কোসাইন সূত্র):} ত্রিমাত্রিক ভেক্টরের ক্ষেত্রে দিক কোসাইনের বর্গের সমষ্টি সর্বদা ১, অর্থাৎ $\\cos^2 \\alpha + \\cos^2 \\beta + \\cos^2 \\gamma = 1$।
\\newline
\\textbf{ধাপ-২ (ত্রিকোণমিতিক রূপান্তর):} আমরা জানি $\\sin^2 \\theta = 1 - \\cos^2 \\theta$।
\\newline
অতএব, $\\sin^2 \\alpha + \\sin^2 \\beta + \\sin^2 \\gamma = (1 - \\cos^2 \\alpha) + (1 - \\cos^2 \\beta) + (1 - \\cos^2 \\gamma)$
\\newline
$= 3 - (\\cos^2 \\alpha + \\cos^2 \\beta + \\cos^2 \\gamma)$
\\newline
$= 3 - 1 = 2$। অনেকেই তাড়াহুড়ো করে ১ দাগিয়ে ট্র্যাপে পা দেয়! 😿`;
    } else if (ans.text.includes("সমান্তরাল রেখাদ্বয়ের মধ্যবর্তী দূরত্ব")) {
      detail = `
\\newline\\newline
\\textbf{📝 বিস্তারিত সমাধান ও বিশ্লেষণ (Step-by-step Solution):}
\\newline
\\textbf{ধাপ-১ (সহগ সমতাকরণ):} সমান্তরাল রেখাদ্বয়ের দূরত্বের সূত্র $d = \\frac{|c_1 - c_2|}{\\sqrt{a^2 + b^2}}$ প্রয়োগের পূর্বে $x$ এবং $y$ এর সহগ সমান করা বাধ্যতামূলক।
\\newline
যেমন $3x - 4y + c_1 = 0$ রেখাটিকে ২ দ্বারা গুণ করে $6x - 8y + 2c_1 = 0$ বানাতে হবে।
\\newline
\\textbf{ধাপ-২ (দূরত্ব গণনা):} এবার সমান্তরাল দূরত্ব হবে $d = \\frac{|2c_1 - c_2|}{\\sqrt{6^2 + 8^2}} = \\frac{|2c_1 - c_2|}{10}$। সহগ সমান না করে সরাসরি বিয়োগ করলেই উত্তর ভুল আসবে! 🙀`;
    } else if (ans.text.includes("বিভক্ত করে")) {
      detail = `
\\newline\\newline
\\textbf{📝 বিস্তারিত সমাধান ও বিশ্লেষণ (Step-by-step Solution):}
\\newline
\\textbf{ধাপ-১ (বিভক্তিকরণ অনুপাত):} $x$-অক্ষ যেকোনো রেখাকে $-y_1 : y_2$ অনুপাতে এবং $y$-অক্ষ $-x_1 : x_2$ অনুপাতে বিভক্ত করে।
\\newline
\\textbf{ধাপ-২ (মান প্রতিস্থাপন):} এখানে কোটিদ্বয় যথাক্রমে $y_1$ এবং $-y_2$। অতএব অনুপাতটি হবে: $-\\frac{y_1}{-y_2} = \\frac{y_1}{y_2}$।
\\newline
\\textbf{ধাপ-৩ (বিভক্তির প্রকৃতি নির্ধারণ):} অনুপাতের চূড়ান্ত মানটি ধনাত্মক (positive) হলে বিভক্তিকরণটি 'অন্তঃস্থ' (Internal) হবে, আর ঋণাত্মক আসলে 'বহিঃস্থ' (External) হতো। 🐾`;
    } else if (ans.text.includes("লম্ববিন্দু")) {
      detail = `
\\newline\\newline
\\textbf{📝 বিস্তারিত সমাধান ও বিশ্লেষণ (Step-by-step Solution):}
\\newline
\\textbf{ধাপ-১ (লম্ববিন্দুর সংজ্ঞা):} ত্রিভুজের শীর্ষবিন্দুসমূহ থেকে বিপরীত বাহুর উপর অঙ্কিত লম্বত্রয়ের সাধারণ ছেদবিন্দুকে লম্ববিন্দু (Orthocenter) বলে।
\\newline
\\textbf{ধাপ-২ (সমকোণী ত্রিভুজের বিশেষ নিয়ম):} যেকোনো সমকোণী ত্রিভুজের লম্ববিন্দু সর্বদা সমকোণ ধারণকারী শীর্ষবিন্দুতেই অবস্থিত হয়।
\\newline
\\textbf{ধাপ-৩ (স্থানাঙ্ক বিশ্লেষণ):} এখানে শীর্ষবিন্দুসমূহ $O(0,0)$ (মূলবিন্দু), $P(a,0)$ (x-অক্ষে) এবং $Q(0,b)$ (y-অক্ষে)। যেহেতু অক্ষদ্বয় পরস্পর লম্ব, তাই সমকোণটি $O(0,0)$ বিন্দুতেই অবস্থিত। অতএব লম্ববিন্দুর স্থানাঙ্ক হবে $(0,0)$। 🌸`;
    } else if (ans.text.includes("স্পর্শকের দৈর্ঘ্য")) {
      detail = `
\\newline\\newline
\\textbf{📝 বিস্তারিত সমাধান ও বিশ্লেষণ (Step-by-step Solution):}
\\newline
\\textbf{ধাপ-১ (বিন্দুর অবস্থান পরীক্ষা):} স্পর্শক অঙ্কন করার পূর্বে বিন্দুটি বৃত্তের ভেতরে নাকি বাইরে তা জানতে হবে। $x_0^2 + y_0^2 - r^2$ এর মান ঋণাত্মক হলে বিন্দুটি বৃত্তের অভ্যন্তরে থাকে।
\\newline
\\textbf{ধাপ-২ (বাস্তবতার সীমাবদ্ধতা):} বৃত্তের অভ্যন্তরে অবস্থিত যেকোনো বিন্দু থেকে বৃত্তে কোনো বাস্তব স্পর্শক আঁকা অসম্ভব। অতএব স্পর্শকটি কাল্পনিক হবে। 😿`;
    } else if (ans.text.includes("স্পর্শক হওয়ার শর্ত")) {
      detail = `
\\newline\\newline
\\textbf{📝 বিস্তারিত সমাধান ও বিশ্লেষণ (Step-by-step Solution):}
\\newline
\\textbf{ধাপ-১ (লম্ব দূরত্বের শর্ত):} কোনো সরলরেখা বৃত্তের স্পর্শক হতে হলে বৃত্তের কেন্দ্র থেকে সরলরেখার লম্ব দূরত্ব ব্যাসার্ধের সমান হতে হবে।
\\newline
\\textbf{ধাপ-২ (গণনা):} $y = mx + c \\implies mx - y + c = 0$। কেন্দ্র $(0,0)$ থেকে লম্ব দূরত্ব $d = \\frac{|c|}{\\sqrt{m^2 + 1}}$।
\\newline
ব্যাসার্ধ $r$ এর সাথে সমতা করে পাই: $\\frac{|c|}{\\sqrt{m^2 + 1}} = r \\implies c = \\pm r \\sqrt{1+m^2}$। 🐱`;
    } else if (ans.text.includes("ছেদবিন্দু কোন চতুর্ভাগে")) {
      detail = `
\\newline\\newline
\\textbf{📝 বিস্তারিত সমাধান ও বিশ্লেষণ (Step-by-step Solution):}
\\newline
\\textbf{ধাপ-১ (মূলবিন্দুগামী রেখা):} $y = mx$ সমীকরণের রেখাসমূহ সর্বদা মূলবিন্দু $(0,0)$ দিয়ে অতিক্রম করে।
\\newline
\\textbf{ধাপ-২ (ছেদবিন্দু):} যেহেতু উভয় রেখার ধ্রুবক পদ শূন্য ($c=0$), তাই তারা পরস্পরকে কেবল মূলবিন্দু $(0,0)$ তেই ছেদ করতে পারে।
\\newline
\\textbf{ধাপ-৩ (ফাঁদ):} মূলবিন্দু কোনো চতুর্ভাগ বা Quadrant-এর অংশ নয়, এটি অক্ষদ্বয়ের ছেদবিন্দু। 🐾`;
    } else if (ans.text.includes("ক্ষেত্রফল কত বর্গ একক")) {
      detail = `
\\newline\\newline
\\textbf{📝 বিস্তারিত সমাধান ও বিশ্লেষণ (Step-by-step Solution):}
\\newline
\\textbf{ধাপ-১ (সমরেখ বিন্দুর ঢাল পরীক্ষা):} প্রদত্ত বিন্দুসমূহ সমরেখ কিনা তা দেখতে হবে। $AB$ এর ঢাল = $BC$ এর ঢাল হলে বিন্দু তিনটি সমরেখ।
\\newline
\\textbf{ধাপ-২ (ক্ষেত্রফল সিদ্ধান্ত):} যদি বিন্দুত্রয় একই সরলরেখায় অবস্থিত হয়, তবে তাদের দ্বারা ত্রিভুজ গঠন অসম্ভব। ফলে গঠিত ত্রিভুজের ক্ষেত্রফল সরাসরি $0$ বর্গ একক হবে। 😹`;
    } else if (ans.text.includes("পর্যায়কাল")) {
      detail = `
\\newline\\newline
\\textbf{📝 বিস্তারিত সমাধান ও বিশ্লেষণ (Step-by-step Solution):}
\\newline
\\textbf{ধাপ-১ (মৌলিক পর্যায়কাল):} $\\sin x$ বা $\\cos x$ এর সাধারণ মৌলিক পর্যায়কাল হলো $2\\pi$।
\\newline
\\textbf{ধাপ-২ (কম্পাঙ্ক স্কেলিং):} যদি কোণের সাথে $k$ গুণ আকারে থাকে, যেমন $\\sin(kx)$, তবে পর্যায়কাল $k$ গুণ হ্রাস পায়।
\\newline
অতএব, পর্যায়কাল হবে $\\frac{2\\pi}{k}$। 🐈`;
    } else if (ans.text.includes("সর্বনিম্ন") && ans.text.includes("মান")) {
      detail = `
\\newline\\newline
\\textbf{📝 বিস্তারিত সমাধান ও বিশ্লেষণ (Step-by-step Solution):}
\\newline
\\textbf{ধাপ-১ (সর্বোচ্চ ও সর্বনিম্ন সীমা সূত্র):} $a \\sin \\theta + b \\cos \\theta$ এর সীমার সূত্র হলো $\\left[-\\sqrt{a^2+b^2}, \\quad +\\sqrt{a^2+b^2}\\right]$।
\\newline
\\textbf{ধাপ-২ (মান প্রতিস্থাপন):} সর্বনিম্ন মান হবে $-\\sqrt{a^2+b^2}$। সহগগুলোর বর্গের সমষ্টির ঋণাত্মক বর্গমূল নির্ণয় করে সহজেই এটি পাওয়া যায়। 🙀`;
    } else if (ans.text.includes("ব্যবধিতে") || ans.text.includes("sin θ =")) {
      detail = `
\\newline\\newline
\\textbf{📝 বিস্তারিত সমাধান ও বিশ্লেষণ (Step-by-step Solution):}
\\newline
\\textbf{ধাপ-১ (ব্যবধি ও চতুর্ভাগ):} কোণটি কোন কোয়াড্রেন্টে অবস্থিত তা নির্ণয় করুন (যেমন $\\pi \\leq \\theta \\leq \\frac{3\\pi}{2}$ নির্দেশ করে ৩য় চতুর্ভাগ)।
\\newline
\\textbf{ধাপ-২ (চিহ্ন সূত্র):} ৩য় চতুর্ভাগে $\\sin$ ঋণাত্মক এবং কোণটির বিস্তৃতি হবে $\\pi + \\theta_0$। সঠিক চতুর্ভাগ অনুযায়ী হিসাব না করলে উত্তর ভুল কোয়াড্রেন্টে চলে যাবে! 🐈`;
    }

    return detail;
  };

  return (
    <div className="app-container">
      {/* Dynamic Toast Notifications Overlay */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: toast.type === 'error' ? '#ffe6e6' : toast.type === 'success' ? '#e6ffe6' : 'rgba(255, 255, 255, 0.9)',
          border: toast.type === 'error' ? '2.5px solid #ff8080' : toast.type === 'success' ? '2.5px solid #62c362' : '2.5px solid var(--primary-pink)',
          color: toast.type === 'error' ? '#7f2626' : toast.type === 'success' ? '#1e591e' : 'var(--text-dark)',
          padding: '15px 25px',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          fontWeight: '700',
          fontFamily: 'var(--font-cute)',
          animation: 'slide-up 0.3s ease',
          maxWidth: '380px'
        }}>
          {toast.message}
        </div>
      )}

      <div className="decorations">
        <div className="floating-cat">🐱</div>
        <div className="floating-cat">😸</div>
        <div className="floating-cat">😻</div>
        <div className="floating-cat">🐾</div>
      </div>

      <header className="app-header">
        <div className="logo-container">
          <span className="logo-icon">🐱🏫</span>
          <h1 className="app-title">MeowMath Elite Academy</h1>
        </div>
        <p className="app-subtitle">HSC 2026 Higher Math 1st Paper Extreme Traps Dojo 🌸</p>
      </header>

      {user && view !== 'register' && (
        <div className="nav-bar">
          <button className="cute-btn cute-btn-outline" style={{ fontSize: '0.9rem', padding: '6px 15px' }} onClick={() => setView('dashboard')}>
            🏠 Dashboard
          </button>
          <button className="cute-btn cute-btn-outline" style={{ fontSize: '0.9rem', padding: '6px 15px', marginLeft: '5px' }} onClick={() => setView('formulas')}>
            📚 Formulas
          </button>
          
          <div className="nav-right">
            <div className="user-score-badge">
              <span>{user.avatar}</span>
              <span>{user.name}</span>
            </div>
            <div className="user-score-badge" style={{ borderColor: 'var(--secondary-purple)' }}>
              <span>⚡</span>
              <span>{user.stamina}% Stamina</span>
            </div>
            <div className="user-score-badge" style={{ borderColor: '#ffe17d' }}>
              <span>✨</span>
              <span>{user.xp} XP</span>
            </div>
            <button 
              className="cute-btn cute-btn-outline" 
              style={{ fontSize: '0.85rem', padding: '6px 10px', marginRight: '5px' }}
              onClick={toggleSound}
            >
              {soundOn ? '🔊 Sound On' : '🔇 Muted'}
            </button>
            <button
              className="cute-btn cute-btn-outline"
              style={{ fontSize: '0.85rem', padding: '6px 10px', color: '#ff6a9f', borderColor: '#ff6a9f' }}
              onClick={handleResetUser}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      )}

      <main style={{ flexGrow: 1 }}>
        {view === 'formulas' && (
          <FormulaHub onBack={() => setView('dashboard')} />
        )}
        {view === 'register' && (
          <div className="cute-card register-container">
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '15px' }}>🌸 MeowMath Elite Academy Entry 🐾</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
              Enter your kitty name and select a sweet avatar to face 500 extreme trap math questions! 🌸🐱
            </p>
            <form onSubmit={handleRegister}>
              <div className="cute-input-group">
                <label className="cute-label" htmlFor="student-name">Your Name 🌸:</label>
                <input
                  id="student-name"
                  type="text"
                  className="cute-input"
                  placeholder="যেমন: Lamia"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  maxLength={25}
                  required
                />
              </div>

              <AvatarSelector selectedAvatar={tempAvatar} onSelect={setTempAvatar} />

              <button type="submit" className="cute-btn" style={{ marginTop: '25px', width: '100%', justifyContent: 'center' }}>
                Enter Dojo 😼✨
              </button>
            </form>
          </div>
        )}

        {view === 'dashboard' && user && (
          <Dashboard
            user={user}
            leaderboard={leaderboard}
            onStartExam={handleStartExam}
            overallTimeLimit={overallTimeLimit}
            setOverallTimeLimit={setOverallTimeLimit}
          />
        )}

        {view === 'exam' && user && (
          <ExamRoom
            mode={examConfig.mode}
            chapterDetails={examConfig.chapterDetails}
            questionsPool={questionsPool}
            overallTimeLimit={overallTimeLimit}
            onFinishExam={handleFinishExam}
            onBack={() => setView('dashboard')}
            onShowToast={showToast}
          />
        )}

        {view === 'leaderboard' && user && (
          <Leaderboard
            leaderboard={leaderboard}
            currentUser={user}
            onBack={() => setView('dashboard')}
          />
        )}

        {view === 'upgrade' && user && (
          <UpgradeCondition
            user={user}
            onUpgradeComplete={handleUpgradeComplete}
            onBack={() => setView('dashboard')}
            onShowToast={showToast}
          />
        )}

        {view === 'result' && lastExamResult && (
          <div className="cute-card" style={{ maxWidth: '800px', margin: '40px auto' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '15px' }}>
                {lastExamResult.correctCount >= lastExamResult.totalCount * 0.8 ? '🎉😸🏆' : '😿🩹💪'}
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>
                {lastExamResult.isGameOver ? 'Game Over' : 'Exam Completed!'}
              </h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
                Mode: <strong>{lastExamResult.modeName}</strong>
              </p>

              <div style={{ background: 'white', borderRadius: '18px', padding: '20px', margin: '20px 0', border: '1.5px solid rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '10px 0', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Score</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'green' }}>
                      {lastExamResult.correctCount} / {lastExamResult.totalCount}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>XP Gained</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-pink-hover)' }}>
                      +{lastExamResult.xpGained}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Stamina Cost</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'orange' }}>
                      -{lastExamResult.staminaUsed}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Time Spent</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--secondary-purple)' }}>
                      {Math.floor(lastExamResult.timeSpent / 60)}m {lastExamResult.timeSpent % 60}s
                    </div>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', marginBottom: '25px', lineHeight: 1.6 }}>
                {lastExamResult.correctCount >= lastExamResult.totalCount * 0.8 
                  ? 'Awesome kitty! You blew the traps away! The top of the leaderboard is close! 🐾🚀'
                  : "You fell into some traps, but that's how we learn! Upgrade your condition and try again! Meow! 🌸"}
              </p>
            </div>

            {/* Answer & Clue Review Section (Bengali) */}
            {lastExamResult.userAnswers && lastExamResult.userAnswers.length > 0 && (
              <div ref={reviewContainerRef} style={{ marginTop: '40px', borderTop: '2px solid rgba(0,0,0,0.05)', paddingTop: '25px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px', color: 'var(--text-dark)' }}>
                  📖 উত্তরমালা ও সমাধান বিশ্লেষণ (Answer Review & Explanations)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {lastExamResult.userAnswers.map((answer, index) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isUserCorrect = answer.selectedIndex === answer.correctIndex;
                    
                    return (
                      <div 
                        key={index} 
                        style={{
                          background: 'white',
                          border: isUserCorrect ? '2px solid #62c362' : '2px solid #ff8080',
                          borderRadius: '16px',
                          padding: '20px',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.9rem', color: 'var(--primary-pink-hover)', fontWeight: 'bold' }}>
                            প্রশ্ন {index + 1} | অধ্যায়: {answer.chapter}
                          </span>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '10px',
                            fontSize: '0.82rem',
                            fontWeight: 'bold',
                            background: isUserCorrect ? '#e6ffe6' : '#ffe6e6',
                            color: isUserCorrect ? '#1e591e' : '#7f2626'
                          }}>
                            {isUserCorrect ? '✅ সঠিক' : '❌ ভুল'}
                          </span>
                        </div>

                        <p style={{ fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '15px' }}>
                          {answer.text}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                          {answer.options.map((opt, oIdx) => {
                            let borderCol = 'rgba(0,0,0,0.06)';
                            let bgCol = 'transparent';
                            let icon = '';

                            if (oIdx === answer.correctIndex) {
                              borderCol = '#62c362';
                              bgCol = '#f0fff0';
                              icon = ' (সঠিক উত্তর)';
                            } else if (oIdx === answer.selectedIndex) {
                              borderCol = '#ff8080';
                              bgCol = '#fff0f0';
                              icon = ' (তোমার উত্তর)';
                            }

                            return (
                              <div 
                                key={oIdx} 
                                style={{
                                  padding: '10px 15px',
                                  border: `1.5px solid ${borderCol}`,
                                  background: bgCol,
                                  borderRadius: '12px',
                                  fontSize: '0.92rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between'
                                }}
                              >
                                <span><strong>{letters[oIdx]}.</strong> {opt}</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: oIdx === answer.correctIndex ? '#1e591e' : '#7f2626' }}>
                                  {icon}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Clue/Trap explanation in Bengali with step-by-step LaTeX details */}
                        <div style={{
                          background: 'rgba(255, 142, 187, 0.05)',
                          border: '1px solid rgba(255, 142, 187, 0.2)',
                          padding: '15px',
                          borderRadius: '12px',
                          fontSize: '0.9rem'
                        }}>
                          <strong>💡 ফাঁদ বিশ্লেষণ ও সমাধান ক্লু (Detailed Explanation):</strong>
                          <div style={{ marginTop: '5px', lineHeight: 1.6, color: '#333' }}>
                            {answer.trapExplanation}
                            {getDetailedExplanation(answer)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
              <button className="cute-btn" onClick={() => setView('dashboard')}>
                🏠 Dashboard
              </button>
              <button className="cute-btn cute-btn-secondary" onClick={() => setView('leaderboard')}>
                🏆 Show Leaderboard
              </button>
            </div>
          </div>
        )}
      </main>

      <CuteFooter onShowToast={showToast} />
    </div>
  );
}
