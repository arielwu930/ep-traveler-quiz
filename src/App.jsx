import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Map, Camera, RotateCcw, Share2, Headphones, Luggage, Ticket, Play, Pause } from "lucide-react";

const TRACKS = {
  no5: {
    song: "No.5",
    color: "from-orange-300/25 to-rose-400/10",
    image: "/assets/results/no5.jpg",
    zh: {
      title: "衝動訂票仔",
      subtitle: "先買票，其他再說。",
      description: "你的人生信念是：先出發再說。行程可以晚點排，住宿可以路上找，語言不通也能靠比手畫腳活下來。跟你旅行有點刺激，但絕對不無聊。",
      share: "我是《No.5》型旅行者：衝動訂票仔，先買票其他再說。"
    },
    en: {
      title: "The Impulsive Booker",
      subtitle: "Book first, figure it out later.",
      description: "Your travel motto is: book first, figure it out later. The plan can wait, the hotel can wait, and language barriers are just part of the plot. Traveling with you might be chaotic, but it will never be boring.",
      share: "I got No.5: The Impulsive Booker. Book first, figure it out later."
    }
  },
  nonstop: {
    song: "nonstop",
    color: "from-sky-300/25 to-cyan-500/10",
    image: "/assets/results/nonstop.jpg",
    zh: {
      title: "大 J 行程控",
      subtitle: "自由時間也是需要被安排的。",
      description: "你不是來旅行的，你是來執行企劃的。景點、交通、餐廳、備案全部排好，連自由時間都在 schedule 裡。你看起來超可靠，其實只是很怕空下來不知道要幹嘛。",
      share: "我是《nonstop》型旅行者：大 J 行程控，連自由時間都要排進 schedule。"
    },
    en: {
      title: "The Overplanner",
      subtitle: "Free time also needs to be scheduled.",
      description: "You’re not traveling. You’re executing a full-scale project. The sights, transport, restaurants, and backup plans are all ready. You look super reliable, but deep down, you just don’t like not knowing what to do next.",
      share: "I got nonstop: The Overplanner. Free time also needs to be scheduled."
    }
  },
  betweenLines: {
    song: "between lines",
    color: "from-violet-300/25 to-amber-300/10",
    image: "/assets/results/between-lines.jpg",
    zh: {
      title: "相機存檔派",
      subtitle: "先清相簿，因為每一刻都要留下來。",
      description: "你旅行時最怕的不是迷路，是手機沒容量。路邊的招牌、咖啡店的味道、某天走在街上的心情，你都想記錄下來。別人是在打卡，你是在幫未來的自己存檔。",
      share: "我是《between lines》型旅行者：相機存檔派，怕的不是迷路，是手機沒容量。"
    },
    en: {
      title: "The Camera Roll Archivist",
      subtitle: "Clear storage first. Every moment needs proof.",
      description: "The thing you fear most while traveling is not getting lost. It’s running out of storage. A street sign, a cafe smell, the feeling of walking through a new city — you want to save it all for your future self.",
      share: "I got between lines: The Camera Roll Archivist. My biggest travel fear is no storage."
    }
  }
};

const COPY = {
  zh: {
    eyebrow: "EP Traveler Quiz",
    title: "測出你是哪一種旅行者",
    intro: "三首歌，三種旅行方式。從出發前一晚到旅程結束，看看哪一首最像現在的你。",
    start: "開始測驗",
    progress: "題",
    resultLabel: "你的旅行人格是",
    matchedTrack: "對應 EP track",
    listen: "Listen / Pre-save",
    share: "分享結果",
    copied: "結果已複製，可以貼到限動或傳給朋友！",
    retake: "重新測驗",
    soundHint: "音訊位置：之後可替換成 5–8 秒 sound collage",
    audioNotReady: "音檔還沒放進專案。"
  },
  en: {
    eyebrow: "EP Traveler Quiz",
    title: "Which kind of traveler are you?",
    intro: "Three songs, three travel personalities. From the night before departure to the end of the trip, find out which track feels most like you.",
    start: "Start Quiz",
    progress: "Question",
    resultLabel: "Your travel personality is",
    matchedTrack: "Matched EP track",
    listen: "Listen / Pre-save",
    share: "Share Result",
    copied: "Result copied — paste it to your story or send it to a friend!",
    retake: "Retake Quiz",
    soundHint: "Audio placeholder: replace later with 5–8 sec sound collages",
    audioNotReady: "Audio file is not added yet."
  }
};

const QUESTIONS = {
  zh: [
    { icon: Luggage, question: "出發前一晚，你通常是？", options: [
      { text: "行李還沒收，但覺得明天再說也可以", track: "no5" },
      { text: "行李、文件、交通、SIM 卡全部確認完，甚至列了 checklist", track: "nonstop" },
      { text: "清空相簿，怕沒容量拍照", track: "betweenLines" }
    ]},
    { icon: Ticket, question: "看到一張很便宜的機票，你會？", options: [
      { text: "先買，其他之後再說", track: "no5" },
      { text: "立刻打開行事曆，看怎麼排出最有效率的行程", track: "nonstop" },
      { text: "先開始存景點、照片和別人的遊記，想像自己到了會是什麼感覺", track: "betweenLines" }
    ]},
    { icon: Plane, question: "你抵達一個陌生城市的第一件事是？", options: [
      { text: "先亂走，迷路也是旅行的一部分", track: "no5" },
      { text: "照著行程表去第一個點，不能浪費時間", track: "nonstop" },
      { text: "先拍一張落地照，感受一下「我真的到了」", track: "betweenLines" }
    ]},
    { icon: Headphones, isAudioQuestion: true, question: "選一個最像你的「旅程音效包」：", options: [
      { label: "不管啦先出去", text: "行李箱輪子聲、深夜街道、突然想到就出門的節奏", track: "no5", audio: "/assets/audio/no5-soundpack.mp3" },
      { label: "行程不能 delay", text: "鬧鐘、地鐵進站、Google Maps 導航聲", track: "nonstop", audio: "/assets/audio/nonstop-soundpack.mp3" },
      { label: "我要記下這一刻", text: "相機快門、咖啡店背景聲、手機打字聲", track: "betweenLines", audio: "/assets/audio/between-lines-soundpack.mp3" }
    ]},
    { icon: Map, question: "原本想去的景點 / 餐廳突然沒開，你的反應是？", options: [
      { text: "完全沒關係，附近隨便晃晃，搞不好會有新發現", track: "no5" },
      { text: "超級焦慮，開始打開地圖、上網找下一個可以銜接的行程", track: "nonstop" },
      { text: "先拍照記錄一下，這種撲空的瞬間以後反而會很好笑", track: "betweenLines" }
    ]},
    { icon: Plane, question: "朋友眼中的你是哪種旅伴？", options: [
      { text: "負責說：「走啦，去看看！」的人", track: "no5" },
      { text: "負責說：「我們 3:20 要到下一站」的人", track: "nonstop" },
      { text: "負責說：「等一下，這邊好值得拍一下 / 記一下」的人", track: "betweenLines" }
    ]},
    { icon: Camera, question: "旅行中你最常打開哪個 app？", options: [
      { text: "Dating App，看有沒有當地人可以帶你玩，或是意想不到的豔遇", track: "no5" },
      { text: "Google Maps / 行程表，隨時確認自己有照計畫走", track: "nonstop" },
      { text: "相機，新的地方都要記錄一下，之後才可以慢慢回味", track: "betweenLines" }
    ]},
    { icon: Camera, question: "旅行結束後，你最想帶走的是？", options: [
      { text: "一個聽起來有點瘋、很適合拿來講的故事", track: "no5" },
      { text: "一份可以分享的高效旅遊行程，一天跑超多點，CP 值超高", track: "nonstop" },
      { text: "一堆照片、影片和小記錄，之後可以慢慢回味", track: "betweenLines" }
    ]}
  ],
  en: [
    { icon: Luggage, question: "The night before departure, you are usually...", options: [
      { text: "Still not packed, but tomorrow-you can deal with it", track: "no5" },
      { text: "Packed, checked in, SIM card ready, checklist completed", track: "nonstop" },
      { text: "Clearing your camera roll because storage anxiety is real", track: "betweenLines" }
    ]},
    { icon: Ticket, question: "You see a super cheap flight. What do you do?", options: [
      { text: "Book first, figure everything else out later", track: "no5" },
      { text: "Open your calendar immediately and build the most efficient itinerary", track: "nonstop" },
      { text: "Start saving places, photos, and travel blogs to imagine what it’ll feel like", track: "betweenLines" }
    ]},
    { icon: Plane, question: "What’s the first thing you do in a new city?", options: [
      { text: "Wander around. Getting lost is part of the trip", track: "no5" },
      { text: "Follow the itinerary and head to the first stop", track: "nonstop" },
      { text: "Take an arrival photo and let the “I’m really here” feeling sink in", track: "betweenLines" }
    ]},
    { icon: Headphones, isAudioQuestion: true, question: "Choose your travel sound pack:", options: [
      { label: "Going out anyway", text: "Suitcase wheels, late-night streets, and a beat that makes you leave now", track: "no5", audio: "/assets/audio/no5-soundpack.mp3" },
      { label: "No delays allowed", text: "Alarms, subway arrivals, and Google Maps navigation", track: "nonstop", audio: "/assets/audio/nonstop-soundpack.mp3" },
      { label: "Saving this moment", text: "Camera shutter, cafe ambience, and typing in the Notes app", track: "betweenLines", audio: "/assets/audio/between-lines-soundpack.mp3" }
    ]},
    { icon: Map, question: "The place you planned to visit is unexpectedly closed. You...", options: [
      { text: "Don’t mind at all. Wandering nearby might lead to something better", track: "no5" },
      { text: "Panic a little and immediately look for the next route that still fits the schedule", track: "nonstop" },
      { text: "Take a photo. This failed stop will probably be funny later", track: "betweenLines" }
    ]},
    { icon: Plane, question: "Which travel friend are you?", options: [
      { text: "The one saying: “Come on, let’s go check it out!”", track: "no5" },
      { text: "The one saying: “We need to be at the next stop by 3:20.”", track: "nonstop" },
      { text: "The one saying: “Wait, this is worth taking a photo / note.”", track: "betweenLines" }
    ]},
    { icon: Camera, question: "Which app do you open the most while traveling?", options: [
      { text: "Dating apps, to see if a local can show you around or if something unexpected happens", track: "no5" },
      { text: "Google Maps / itinerary, to make sure everything is still on track", track: "nonstop" },
      { text: "Camera, because every new place needs to be saved for later", track: "betweenLines" }
    ]},
    { icon: Camera, question: "At the end of a trip, what do you want to bring home most?", options: [
      { text: "A slightly chaotic story that’s perfect to retell", track: "no5" },
      { text: "A high-efficiency itinerary you can proudly recommend to everyone", track: "nonstop" },
      { text: "A camera roll full of photos, videos, and tiny moments to revisit later", track: "betweenLines" }
    ]}
  ]
};

export default function App() {
  const [lang, setLang] = useState("zh");
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState({ no5: 0, nonstop: 0, betweenLines: 0 });
  const [resultKey, setResultKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [audioMessage, setAudioMessage] = useState("");

  const copy = COPY[lang];
  const questions = QUESTIONS[lang];
  const question = questions[index];
  const result = resultKey ? TRACKS[resultKey] : null;
  const progress = useMemo(() => ((index + 1) / questions.length) * 100, [index, questions.length]);

  function playAudio(event, option) {
    event.stopPropagation();
    setAudioMessage("");
    if (!option.audio) return;
    if (playingAudio?.src === option.audio) {
      playingAudio.audio.pause();
      playingAudio.audio.currentTime = 0;
      setPlayingAudio(null);
      return;
    }
    if (playingAudio?.audio) {
      playingAudio.audio.pause();
      playingAudio.audio.currentTime = 0;
    }
    const audio = new Audio(option.audio);
    audio.onended = () => setPlayingAudio(null);
    audio.play().then(() => {
      setPlayingAudio({ src: option.audio, audio });
    }).catch(() => {
      setAudioMessage(copy.audioNotReady);
      setPlayingAudio(null);
    });
  }

  function choose(track) {
    if (playingAudio?.audio) {
      playingAudio.audio.pause();
      playingAudio.audio.currentTime = 0;
      setPlayingAudio(null);
    }
    const nextScores = { ...scores, [track]: scores[track] + 1 };
    setScores(nextScores);
    if (index < questions.length - 1) setIndex(index + 1);
    else {
      const winner = Object.keys(nextScores).sort((a, b) => nextScores[b] - nextScores[a])[0];
      setResultKey(winner);
    }
  }

  function reset() {
    setStarted(false);
    setIndex(0);
    setScores({ no5: 0, nonstop: 0, betweenLines: 0 });
    setResultKey(null);
    setCopied(false);
    setAudioMessage("");
  }

  async function share() {
    if (!result) return;
    const text = result[lang].share;
    if (navigator.share) await navigator.share({ title: "EP Traveler Quiz", text, url: window.location.href });
    else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  }

  const Icon = question?.icon || Plane;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-stone-100 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      <div className="fixed inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(168,85,247,0.12),transparent_35%)]" />
      <div className="fixed inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:42px_42px]" />
      <main className="relative w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {!started && !resultKey && (
            <motion.section key="landing" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-2xl p-6 sm:p-10">
              <div className="flex items-center justify-between gap-4 mb-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.22em] text-amber-100/80"><Plane size={14} /> {copy.eyebrow}</div>
                <div className="flex gap-2 rounded-full border border-white/10 bg-black/20 p-1">
                  <button onClick={() => setLang("zh")} className={`rounded-full px-3 py-1.5 text-sm transition ${lang === "zh" ? "bg-stone-100 text-stone-950" : "text-stone-300"}`}>繁中</button>
                  <button onClick={() => setLang("en")} className={`rounded-full px-3 py-1.5 text-sm transition ${lang === "en" ? "bg-stone-100 text-stone-950" : "text-stone-300"}`}>EN</button>
                </div>
              </div>
              <div className="space-y-5">
                <motion.div initial={{ rotate: -4 }} animate={{ rotate: 3 }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.8 }} className="w-fit rounded-2xl border border-amber-200/25 bg-amber-100/10 px-4 py-3 text-amber-100"><Ticket size={28} /></motion.div>
                <h1 className="text-4xl sm:text-6xl font-semibold leading-[0.95] tracking-tight">{copy.title}</h1>
                <p className="text-base sm:text-lg leading-8 text-stone-300 max-w-xl">{copy.intro}</p>
              </div>
              <button onClick={() => setStarted(true)} className="mt-10 w-full rounded-full bg-stone-100 px-6 py-4 text-base font-semibold text-stone-950 transition hover:scale-[1.01] active:scale-[0.99]">{copy.start}</button>
            </motion.section>
          )}

          {started && !resultKey && (
            <motion.section key={`q-${index}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-2xl p-6 sm:p-10">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-[0.18em] text-stone-400"><span>{copy.progress} {index + 1} / {questions.length}</span><span>EP Traveler Quiz</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full rounded-full bg-stone-100" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.35 }} /></div>
              </div>
              <div className="mb-8 flex items-start gap-4"><div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-amber-100"><Icon size={26} /></div><h2 className="text-2xl sm:text-4xl font-semibold leading-tight tracking-tight">{question.question}</h2></div>
              {question.isAudioQuestion && <p className="mb-4 rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-3 text-sm text-stone-400">{copy.soundHint}</p>}
              {audioMessage && <p className="mb-4 rounded-2xl border border-amber-200/20 bg-amber-100/10 px-4 py-3 text-sm text-amber-100">{audioMessage}</p>}
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <button key={`${option.text}-${option.track}`} onClick={() => choose(option.track)} className="group w-full rounded-3xl border border-white/10 bg-black/20 p-4 text-left transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] active:translate-y-0">
                    <div className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-bold text-stone-950">{String.fromCharCode(65 + optionIndex)}</span>
                      <span className="w-full">
                        {option.label && <span className="mb-1 block font-semibold text-stone-100">{option.label}</span>}
                        <span className="leading-7 text-stone-300 group-hover:text-stone-100">{option.text}</span>
                        {question.isAudioQuestion && (
                          <span role="button" tabIndex={0} onClick={(event) => playAudio(event, option)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") playAudio(event, option); }} className="mt-3 flex h-10 w-full items-center gap-2 rounded-full bg-white/5 px-3 text-xs text-stone-300 transition hover:bg-white/10">
                            {playingAudio?.src === option.audio ? <Pause size={14} /> : <Play size={14} />}
                            {playingAudio?.src === option.audio ? "playing preview" : "play sound preview"}
                            <span className="h-1 flex-1 rounded-full bg-white/10" />
                          </span>
                        )}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.section>
          )}

          {resultKey && result && (
            <motion.section key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className={`rounded-[2rem] border border-white/10 bg-gradient-to-br ${result.color} backdrop-blur-xl shadow-2xl p-6 sm:p-10`}>
              <div className="overflow-hidden rounded-[1.7rem] border border-white/15 bg-black/35">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
                  <img src={result.image} alt={`${result.song} result visual`} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.18em] text-stone-100 backdrop-blur">{result.song}</div>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="mb-4 text-xs uppercase tracking-[0.22em] text-amber-100/80">{copy.resultLabel}</p>
                  <h2 className="text-4xl sm:text-6xl font-semibold leading-[0.95] tracking-tight">{result[lang].title}</h2>
                  <p className="mt-4 text-lg text-amber-100">{result[lang].subtitle}</p>
                  <div className="my-7 h-px bg-white/10" />
                  <p className="text-base sm:text-lg leading-8 text-stone-200">{result[lang].description}</p>
                  <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.06] p-5"><p className="text-xs uppercase tracking-[0.18em] text-stone-400">{copy.matchedTrack}</p><p className="mt-2 text-2xl font-semibold">{result.song}</p></div>
                </div>
              </div>
              {copied && <p className="mt-4 text-center text-sm text-amber-100">{copy.copied}</p>}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <button className="rounded-full bg-stone-100 px-5 py-3 font-semibold text-stone-950 transition hover:scale-[1.01]">{copy.listen}</button>
                <button onClick={share} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 font-semibold transition hover:bg-white/10"><Share2 size={17} /> {copy.share}</button>
                <button onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 font-semibold transition hover:bg-white/10"><RotateCcw size={17} /> {copy.retake}</button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
