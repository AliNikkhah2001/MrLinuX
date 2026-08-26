"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Clock3,
  Code2,
  Download,
  ExternalLink,
  Flame,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Search,
  Sparkles,
  Target,
  TerminalSquare,
  Trophy,
  X,
  Zap,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lesson, lessons, videos } from "./course-data";

type View = "dashboard" | "learn" | "lab" | "resources";

type ProgressState = {
  completed: string[];
  quizScores: Record<string, number>;
  labs: string[];
  activity: Record<string, number>;
  lastLesson: string;
};

const STORAGE_KEY = "linux-hacker-academy-v1";

const emptyProgress: ProgressState = {
  completed: [],
  quizScores: {},
  labs: [],
  activity: {},
  lastLesson: lessons[0].id,
};

const decoderMissions = [
  {
    id: "decoder-pwd",
    label: "01",
    prompt: "Print the absolute path of the current directory.",
    placeholder: "$ type one command",
    test: (value: string) => value.trim() === "pwd",
    answer: "pwd",
    success: "Correct. pwd is a shell-facing utility whose only job here is to print the working directory.",
  },
  {
    id: "decoder-hidden",
    label: "02",
    prompt: "List all entries, including hidden ones, in long format.",
    placeholder: "$ combine two ls options",
    test: (value: string) => {
      const normalized = value.trim().replace(/\s+/g, " ");
      return normalized === "ls -la" || normalized === "ls -al" || normalized === "ls -l -a" || normalized === "ls -a -l";
    },
    answer: "ls -la",
    success: "Accepted. The clustered short options -l and -a modify ls; no operand means the current directory.",
  },
  {
    id: "decoder-count",
    label: "03",
    prompt: "Count regular .txt files under the current directory using find and wc.",
    placeholder: "$ connect a producer to a counter",
    test: (value: string) => /find\s+\.\s+-type\s+f\s+-name\s+['\"]\*\.txt['\"]\s*\|\s*wc\s+-l/.test(value.trim()),
    answer: "find . -type f -name '*.txt' | wc -l",
    success: "Correct. find emits one matching pathname per record and the pipe connects that stream to wc -l.",
  },
];

function localDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dayOffset(offset: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return localDate(date);
}

function computeStreak(activity: Record<string, number>) {
  let streak = 0;
  let cursor = activity[dayOffset(0)] ? 0 : -1;
  while (activity[dayOffset(cursor)] && streak < 3650) {
    streak += 1;
    cursor -= 1;
  }
  return streak;
}

function xpFor(progress: ProgressState) {
  const lessonXp = lessons
    .filter((lesson) => progress.completed.includes(lesson.id))
    .reduce((sum, lesson) => sum + lesson.xp, 0);
  const quizXp = Object.values(progress.quizScores).filter((score) => score === 1).length * 35;
  return lessonXp + quizXp + progress.labs.length * 25;
}

function rankFor(xp: number) {
  if (xp >= 2400) return { name: "ROOT ARCHITECT", level: 6, next: 2400 };
  if (xp >= 1500) return { name: "SHELL ENGINEER", level: 5, next: 2400 };
  if (xp >= 900) return { name: "PIPELINE BUILDER", level: 4, next: 1500 };
  if (xp >= 450) return { name: "CLI OPERATOR", level: 3, next: 900 };
  if (xp >= 180) return { name: "PROMPT WALKER", level: 2, next: 450 };
  return { name: "NEW PROCESS", level: 1, next: 180 };
}

function activityLevel(count = 0) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

function Achievement({ icon, title, description, unlocked }: { icon: React.ReactNode; title: string; description: string; unlocked: boolean }) {
  return (
    <div className={`achievement ${unlocked ? "unlocked" : "locked"}`}>
      <div className="achievement-icon">{unlocked ? icon : <LockKeyhole size={20} />}</div>
      <div><strong>{title}</strong><span>{description}</span></div>
    </div>
  );
}

function StatCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: React.ReactNode }) {
  return (
    <article className="stat-card scanline-card">
      <div className="stat-icon">{icon}</div><span className="eyebrow">{label}</span><strong>{value}</strong><small>{detail}</small>
    </article>
  );
}

function Dashboard({ progress, setView, openLesson }: { progress: ProgressState; setView: (view: View) => void; openLesson: (id: string) => void }) {
  const xp = xpFor(progress);
  const rank = rankFor(xp);
  const streak = computeStreak(progress.activity);
  const completedPercent = Math.round((progress.completed.length / lessons.length) * 100);
  const nextLesson = lessons.find((lesson) => !progress.completed.includes(lesson.id)) ?? lessons[lessons.length - 1];
  const heatmapDays = Array.from({ length: 84 }, (_, index) => dayOffset(index - 83));
  const parts = Array.from(new Set(lessons.map((lesson) => lesson.part)));
  const perfect = Object.values(progress.quizScores).filter((score) => score === 1).length;

  return (
    <div className="view-stack dashboard-view">
      <section className="hero-console">
        <div className="ascii-wrap" aria-hidden="true">
          <pre>{` _     ___ _   _ _   ___  __
| |   |_ _| \\ | | | | \\ \\/ /
| |    | ||  \\| | | | |\\  / 
| |___ | || |\\  | |_| |/  \\ 
|_____|___|_| \\_|\\___//_/\\_\\`}</pre>
          <div className="hero-signal"><span /> SYSTEM ONLINE</div>
        </div>
        <div className="hero-copy">
          <span className="kicker">[ INTERACTIVE COMMAND-LINE ACADEMY ]</span>
          <h1>Stop memorizing.<br /><em>Start parsing.</em></h1>
          <p>Master the grammar behind Linux commands through mental models, deliberate practice, evidence-first labs, and a visible learning streak.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => openLesson(nextLesson.id)}><CirclePlay size={18} /> Continue: Ch. {String(nextLesson.number).padStart(2, "0")}</button>
            <button className="ghost-button" onClick={() => setView("lab")}><TerminalSquare size={18} /> Enter practice lab</button>
          </div>
        </div>
      </section>

      <section className="stat-grid" aria-label="Course statistics">
        <StatCard label="completion" value={`${completedPercent}%`} detail={`${progress.completed.length}/${lessons.length} chapters verified`} icon={<Target size={20} />} />
        <StatCard label="current streak" value={`${streak} day${streak === 1 ? "" : "s"}`} detail={streak ? "signal maintained" : "begin a new signal today"} icon={<Flame size={20} />} />
        <StatCard label="experience" value={`${xp} XP`} detail={`level ${rank.level} · ${rank.name}`} icon={<Zap size={20} />} />
        <StatCard label="lab clearance" value={`${progress.labs.length}`} detail="simulated missions solved" icon={<TerminalSquare size={20} />} />
      </section>

      <div className="dashboard-columns">
        <section className="panel progress-panel">
          <div className="panel-heading"><div><span className="eyebrow">LEARNING PATH</span><h2>Chapter transmission</h2></div><span className="mono-muted">{progress.completed.length}/{lessons.length}</span></div>
          <div className="path-list">
            {parts.map((part) => {
              const partLessons = lessons.filter((lesson) => lesson.part === part);
              const done = partLessons.filter((lesson) => progress.completed.includes(lesson.id)).length;
              const value = Math.round((done / partLessons.length) * 100);
              return (
                <div className="path-row" key={part}><div><strong>{part}</strong><span>{done}/{partLessons.length} nodes</span></div><Progress className="hacker-progress" value={value} aria-label={`${part} ${value}% complete`} /><b>{value}%</b></div>
              );
            })}
          </div>
          <button className="text-button" onClick={() => setView("learn")}>open chapter map <ChevronRight size={16} /></button>
        </section>

        <section className="panel continue-panel">
          <span className="eyebrow">NEXT MISSION</span><div className="chapter-number">{String(nextLesson.number).padStart(2, "0")}</div><h2>{nextLesson.title}</h2><code>{nextLesson.prompt}</code><p>{nextLesson.objective}</p>
          <div className="mission-meta"><span><Clock3 size={15} /> {nextLesson.minutes} min</span><span><Zap size={15} /> +{nextLesson.xp} XP</span></div>
          <button className="primary-button full" onClick={() => openLesson(nextLesson.id)}>initialize chapter <ChevronRight size={17} /></button>
        </section>
      </div>

      <section className="panel heatmap-panel">
        <div className="panel-heading"><div><span className="eyebrow">84-DAY SIGNAL</span><h2>Practice transmission matrix</h2></div><div className="heat-legend"><span>quiet</span>{[0, 1, 2, 3, 4].map((level) => <i key={level} data-level={level} />)}<span>strong</span></div></div>
        <div className="heatmap-scroll"><div className="heatmap-grid" role="img" aria-label={`${streak} day practice streak over the last 84 days`}>{heatmapDays.map((date) => <span key={date} data-level={activityLevel(progress.activity[date])} title={`${date}: ${progress.activity[date] ?? 0} learning actions`} />)}</div></div>
        <p className="matrix-note">Each square records local learning activity in this browser. Stronger green means more completed actions that day.</p>
      </section>

      <section className="panel">
        <div className="panel-heading"><div><span className="eyebrow">ACHIEVEMENTS</span><h2>Privilege escalation—earned safely</h2></div><Trophy className="heading-icon" size={25} /></div>
        <div className="achievement-grid">
          <Achievement icon={<TerminalSquare size={22} />} title="Hello, shell" description="complete one chapter" unlocked={progress.completed.length >= 1} />
          <Achievement icon={<Code2 size={22} />} title="Pipe dream" description="master streams & pipelines" unlocked={progress.completed.includes("streams-pipelines")} />
          <Achievement icon={<Flame size={22} />} title="Signal keeper" description="reach a 3-day streak" unlocked={streak >= 3} />
          <Achievement icon={<Sparkles size={22} />} title="Exact status" description="score 100% on three checks" unlocked={perfect >= 3} />
          <Achievement icon={<Award size={22} />} title="Chapter daemon" description="complete five chapters" unlocked={progress.completed.length >= 5} />
          <Achievement icon={<Trophy size={22} />} title="Root architect" description="complete the full course" unlocked={progress.completed.length === lessons.length} />
        </div>
      </section>
    </div>
  );
}

function LessonReader({ lesson, progress, selectLesson, toggleComplete, submitQuiz, completeLab }: {
  lesson: Lesson;
  progress: ProgressState;
  selectLesson: (id: string) => void;
  toggleComplete: (id: string) => void;
  submitQuiz: (id: string, correct: boolean) => void;
  completeLab: (id: string) => void;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [openHints, setOpenHints] = useState<string[]>([]);
  const lessonIndex = lessons.findIndex((item) => item.id === lesson.id);
  const isComplete = progress.completed.includes(lesson.id);
  const savedScore = progress.quizScores[lesson.id];
  const lessonVideos = videos.filter((video) => lesson.videoIds.includes(video.id));

  useEffect(() => { setSelectedAnswer(null); setRevealed(false); setOpenHints([]); }, [lesson.id]);

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    const correct = selectedAnswer === lesson.quiz.correct;
    setRevealed(true);
    submitQuiz(lesson.id, correct);
  };

  return (
    <article className="lesson-reader">
      <header className="lesson-header">
        <div className="lesson-index">CHAPTER {String(lesson.number).padStart(2, "0")} <span>// {lesson.part.split("/")[1]}</span></div>
        <h1>{lesson.title}</h1><code className="lesson-prompt">$ {lesson.prompt}<span className="cursor">_</span></code><p>{lesson.objective}</p>
        <div className="lesson-meta"><span><Clock3 size={15} /> {lesson.minutes} min</span><span><Zap size={15} /> {lesson.xp} XP</span><span className={isComplete ? "status-complete" : ""}>{isComplete ? <Check size={15} /> : <Target size={15} />} {isComplete ? "verified" : "in progress"}</span></div>
      </header>

      <section className="lesson-section reading-copy">
        <div className="section-label"><span>01</span> UNDERSTAND</div><h2>The durable explanation</h2>
        {lesson.explanation.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <blockquote className="mental-model"><span>MENTAL MODEL</span>{lesson.mentalModel}</blockquote>
        <div className="concept-grid">{lesson.concepts.map((concept) => <div key={concept.label}><code>{concept.label}</code><p>{concept.detail}</p></div>)}</div>
      </section>

      <section className="lesson-section">
        <div className="section-label"><span>02</span> DECODE</div><h2>Read the command as a program</h2>
        <div className="code-window"><div className="window-bar"><i /><i /><i /><span>bash — command model</span></div><pre><code>{lesson.code}</code></pre></div>
        <ol className="code-notes">{lesson.codeNotes.map((note, index) => <li key={note}><b>{String(index + 1).padStart(2, "0")}</b><span>{note}</span></li>)}</ol>
      </section>

      <section className="lesson-section">
        <div className="section-label"><span>03</span> PRACTICE</div><h2>Deliberate practice ladder</h2><p className="section-intro">Use only a directory you created for practice. The academy records completion; commands run on your own safe lab system.</p>
        <div className="lab-card-list">
          {lesson.labs.map((lab, index) => {
            const labId = `${lesson.id}-lab-${index}`;
            const complete = progress.labs.includes(labId);
            const hintOpen = openHints.includes(labId);
            return (
              <div className={`lab-card ${complete ? "lab-complete" : ""}`} key={labId}>
                <div className={`difficulty ${lab.level}`}>{lab.level}</div>
                <div className="lab-body"><h3>{lab.title}</h3><p>{lab.task}</p>{hintOpen && <div className="hint"><strong>hint://</strong> {lab.hint}</div>}</div>
                <div className="lab-actions"><button onClick={() => setOpenHints((current) => current.includes(labId) ? current.filter((id) => id !== labId) : [...current, labId])}>{hintOpen ? "hide hint" : "show hint"}</button><label><Checkbox checked={complete} onCheckedChange={() => completeLab(labId)} aria-label={`Mark ${lab.title} complete`} /><span>{complete ? "done" : "mark done"}</span></label></div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="lesson-section knowledge-check">
        <div className="section-label"><span>04</span> VERIFY</div><h2>Knowledge check</h2><p className="question">{lesson.quiz.question}</p>
        <div className="option-list">{lesson.quiz.options.map((option, index) => {
          const chosen = selectedAnswer === index;
          const correct = revealed && index === lesson.quiz.correct;
          const wrong = revealed && chosen && index !== lesson.quiz.correct;
          return <button key={option} className={`${chosen ? "chosen" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`} onClick={() => !revealed && setSelectedAnswer(index)} disabled={revealed}><span>{String.fromCharCode(65 + index)}</span>{option}</button>;
        })}</div>
        {!revealed ? <button className="primary-button" disabled={selectedAnswer === null} onClick={checkAnswer}>verify answer</button> : <div className={`quiz-result ${selectedAnswer === lesson.quiz.correct ? "pass" : "retry"}`}><strong>{selectedAnswer === lesson.quiz.correct ? "STATUS 0 — correct" : "STATUS 1 — review and retry"}</strong><p>{lesson.quiz.explanation}</p>{selectedAnswer !== lesson.quiz.correct && <button onClick={() => { setRevealed(false); setSelectedAnswer(null); }}>try again</button>}</div>}
        {savedScore === 1 && <span className="saved-score"><Check size={14} /> best score: 100%</span>}
      </section>

      <section className="lesson-section references-section">
        <div className="section-label"><span>05</span> GO DEEPER</div><h2>Mapped source reading</h2>
        <div className="reference-list">
          {lesson.readings.map((reading) => <a href={reading.url} target="_blank" rel="noreferrer" key={`${reading.source}-${reading.section}`}><BookOpen size={18} /><span><strong>{reading.source}</strong><small>{reading.section}</small></span><ExternalLink size={15} /></a>)}
          {lessonVideos.map((video) => <a href={video.url} target="_blank" rel="noreferrer" key={video.id}><CirclePlay size={18} /><span><strong>{video.title}</strong><small>{video.creator} · {video.duration}</small></span><ExternalLink size={15} /></a>)}
        </div>
      </section>

      <footer className="lesson-footer">
        <button className="ghost-button" disabled={lessonIndex === 0} onClick={() => selectLesson(lessons[lessonIndex - 1]?.id)}><ChevronLeft size={17} /> previous</button>
        <label className={`complete-toggle ${isComplete ? "active" : ""}`}><Checkbox checked={isComplete} onCheckedChange={() => toggleComplete(lesson.id)} /><span>{isComplete ? "chapter verified" : "mark chapter complete"}</span></label>
        <button className="ghost-button" disabled={lessonIndex === lessons.length - 1} onClick={() => selectLesson(lessons[lessonIndex + 1]?.id)}>next <ChevronRight size={17} /></button>
      </footer>
    </article>
  );
}

function LearnView({ progress, activeLesson, setActiveLesson, actions }: {
  progress: ProgressState;
  activeLesson: string;
  setActiveLesson: (id: string) => void;
  actions: { toggleComplete: (id: string) => void; submitQuiz: (id: string, correct: boolean) => void; completeLab: (id: string) => void };
}) {
  const [query, setQuery] = useState("");
  const [mobileMap, setMobileMap] = useState(false);
  const current = lessons.find((lesson) => lesson.id === activeLesson) ?? lessons[0];
  const filtered = lessons.filter((lesson) => `${lesson.title} ${lesson.part} ${lesson.prompt}`.toLowerCase().includes(query.toLowerCase()));
  const groups = Array.from(new Set(filtered.map((lesson) => lesson.part)));

  return (
    <div className="learn-layout">
      <button className="mobile-map-button" onClick={() => setMobileMap(true)}><Menu size={18} /> chapter map</button>
      <aside className={`chapter-sidebar ${mobileMap ? "open" : ""}`}>
        <div className="sidebar-head"><span className="eyebrow">COURSE MAP</span><button onClick={() => setMobileMap(false)} aria-label="Close chapter map"><X size={18} /></button></div>
        <div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="search chapters" aria-label="Search chapters" /></div>
        <div className="chapter-groups">{groups.map((group) => <div key={group} className="chapter-group"><h3>{group}</h3>{filtered.filter((lesson) => lesson.part === group).map((lesson) => {
          const complete = progress.completed.includes(lesson.id);
          return <button key={lesson.id} className={lesson.id === current.id ? "active" : ""} onClick={() => { setActiveLesson(lesson.id); setMobileMap(false); }}><span className={complete ? "done" : ""}>{complete ? <Check size={13} /> : String(lesson.number).padStart(2, "0")}</span><div><strong>{lesson.title}</strong><small>{lesson.minutes} min · {lesson.xp} XP</small></div></button>;
        })}</div>)}</div>
      </aside>
      {mobileMap && <button className="sidebar-scrim" aria-label="Close chapter map" onClick={() => setMobileMap(false)} />}
      <LessonReader lesson={current} progress={progress} selectLesson={setActiveLesson} {...actions} />
    </div>
  );
}

function PracticeLab({ progress, completeLab }: { progress: ProgressState; completeLab: (id: string) => void }) {
  const [missionIndex, setMissionIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "pass" | "fail">("idle");
  const mission = decoderMissions[missionIndex];
  const solved = progress.labs.includes(mission.id);

  const run = () => {
    if (mission.test(input)) { setFeedback("pass"); completeLab(mission.id); }
    else setFeedback("fail");
  };

  return (
    <div className="view-stack lab-view">
      <section className="page-heading"><span className="kicker">[ SAFE SIMULATION / NO COMMANDS EXECUTED ]</span><h1>Command decoder</h1><p>Build commands from intent. The evaluator checks syntax patterns in your browser; it never runs them on a machine.</p></section>
      <div className="lab-layout">
        <aside className="mission-rail"><span className="eyebrow">MISSION QUEUE</span>{decoderMissions.map((item, index) => <button key={item.id} className={index === missionIndex ? "active" : ""} onClick={() => { setMissionIndex(index); setInput(""); setFeedback("idle"); }}><span>{progress.labs.includes(item.id) ? <Check size={14} /> : item.label}</span><div><strong>{item.prompt}</strong><small>{progress.labs.includes(item.id) ? "cleared" : "pending"}</small></div></button>)}</aside>
        <section className="terminal-lab">
          <div className="window-bar"><i /><i /><i /><span>academy@lab:~/safe-sandbox</span></div>
          <div className="terminal-screen"><pre>{`Linux Hacker Academy simulator
mission ${mission.label}/0${decoderMissions.length} :: ${solved ? "CLEARED" : "ACTIVE"}
--------------------------------------------------`}</pre><h2>{mission.prompt}</h2><label className="terminal-input"><span>academy@lab:~$</span><input autoCapitalize="none" autoCorrect="off" spellCheck={false} value={input} onChange={(event) => { setInput(event.target.value); setFeedback("idle"); }} onKeyDown={(event) => event.key === "Enter" && run()} placeholder={mission.placeholder} aria-label="Enter simulated command" /></label><div className="terminal-controls"><button className="run-button" onClick={run} disabled={!input.trim()}><CirclePlay size={17} /> evaluate</button><button onClick={() => { setInput(mission.answer); setFeedback("idle"); }}>reveal syntax</button></div>{feedback === "pass" && <div className="terminal-feedback pass"><strong>[status:0]</strong> {mission.success}</div>}{feedback === "fail" && <div className="terminal-feedback fail"><strong>[status:1]</strong> Not yet. Translate the verb, add only needed options, then check operators and quoting.</div>}</div>
        </section>
      </div>
      <section className="panel lab-principles"><div><Target size={20} /><strong>State intent</strong><span>What should be observed or transformed?</span></div><div><Code2 size={20} /><strong>Build argv</strong><span>Choose the command, options, and operands.</span></div><div><TerminalSquare size={20} /><strong>Wire grammar</strong><span>Add quoting, redirections, and operators.</span></div><div><Check size={20} /><strong>Verify evidence</strong><span>Inspect data, diagnostics, and status.</span></div></section>
    </div>
  );
}

function ResourcesView() {
  const sourceGroups = [
    { title: "The Linux Command Line", tag: "FREE BOOK · 596 PAGES", detail: "William Shotts' beginner-to-practitioner progression through shell use, common tools, redirection, expansion, and scripting.", url: "https://linuxcommand.org/tlcl.php" },
    { title: "GNU Bash Reference Manual", tag: "AUTHORITATIVE · BASH", detail: "Exact Bash behavior for parsing, quoting, expansion, compound commands, arrays, job control, redirection, and functions.", url: "https://www.gnu.org/software/bash/manual/bash.html" },
    { title: "POSIX.1-2024 Shell & Utilities", tag: "PORTABILITY BASELINE", detail: "The standard model for shell grammar, token recognition, expansion, redirection, execution, status, and portable utilities.", url: "https://pubs.opengroup.org/onlinepubs/9799919799/" },
    { title: "GNU Coreutils Manual", tag: "UTILITY CONTRACTS", detail: "Precise GNU behavior for ls, cp, mv, rm, sort, uniq, cut, text formatting, and system context tools.", url: "https://www.gnu.org/software/coreutils/manual/coreutils.html" },
    { title: "Linux man-pages", tag: "SYSTEM INTERFACES", detail: "Manual pages for Linux user-space APIs and the foundation for reading installed documentation by section.", url: "https://man7.org/linux/man-pages/" },
    { title: "OverTheWire Bandit", tag: "CHALLENGE LOOP", detail: "A beginner-oriented environment for practicing inspection, hypothesis, manual lookup, testing, and transfer.", url: "https://overthewire.org/wargames/bandit/" },
  ];
  return (
    <div className="view-stack resources-view">
      <section className="page-heading"><span className="kicker">[ SOURCE-GROUNDED LEARNING STACK ]</span><h1>Further transmissions</h1><p>Read the academy explanation first, then use these primary and authoritative sources to resolve exact behavior on the system you are using.</p></section>
      <section><div className="resource-heading"><span className="eyebrow">WATCH</span><h2>Curated video path</h2></div><div className="video-grid">{videos.map((video, index) => <a className="video-card" key={video.id} href={video.url} target="_blank" rel="noreferrer"><div className="video-sigil"><span>{String(index + 1).padStart(2, "0")}</span><CirclePlay size={34} /></div><div><small>{video.creator} · {video.duration}</small><h3>{video.title}</h3><p>{video.focus}</p><span className="watch-link">watch on YouTube <ExternalLink size={14} /></span></div></a>)}</div></section>
      <section><div className="resource-heading"><span className="eyebrow">READ</span><h2>Authoritative source stack</h2></div><div className="source-grid">{sourceGroups.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.title}><div className="source-top"><BookOpen size={20} /><span>{source.tag}</span><ExternalLink size={15} /></div><h3>{source.title}</h3><p>{source.detail}</p></a>)}</div></section>
      <section className="source-policy"><strong>academy rule://</strong><p>Versions and distributions differ. The installed machine remains authoritative: use <code>man</code>, <code>info</code>, Bash <code>help</code>, and <code>--version</code> before relying on operational details.</p></section>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const [activeLesson, setActiveLesson] = useState(lessons[0].id);
  const [progress, setProgress] = useState<ProgressState>(emptyProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? { ...emptyProgress, ...JSON.parse(saved) } as ProgressState : emptyProgress;
      const today = localDate();
      parsed.activity = { ...parsed.activity, [today]: Math.min((parsed.activity[today] ?? 0) + 1, 4) };
      setProgress(parsed);
      setActiveLesson(parsed.lastLesson || lessons[0].id);
    } catch { setProgress({ ...emptyProgress, activity: { [localDate()]: 1 } }); }
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }, [progress, hydrated]);

  const recordAction = (update: (current: ProgressState) => ProgressState) => {
    setProgress((current) => {
      const next = update(current);
      const today = localDate();
      return { ...next, activity: { ...next.activity, [today]: Math.min((next.activity[today] ?? 0) + 1, 4) } };
    });
  };

  const setLesson = (id: string) => { setActiveLesson(id); setProgress((current) => ({ ...current, lastLesson: id })); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openLesson = (id: string) => { setLesson(id); setView("learn"); };
  const toggleComplete = (id: string) => recordAction((current) => ({ ...current, completed: current.completed.includes(id) ? current.completed.filter((item) => item !== id) : [...current.completed, id] }));
  const submitQuiz = (id: string, correct: boolean) => recordAction((current) => ({ ...current, quizScores: { ...current.quizScores, [id]: Math.max(current.quizScores[id] ?? 0, correct ? 1 : 0) } }));
  const completeLab = (id: string) => recordAction((current) => ({ ...current, labs: current.labs.includes(id) ? current.labs : [...current.labs, id] }));

  const exportProgress = () => {
    const payload = JSON.stringify({ exportedAt: new Date().toISOString(), ...progress }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url; link.download = "linux-hacker-academy-progress.json"; link.click(); URL.revokeObjectURL(url);
  };

  const xp = useMemo(() => xpFor(progress), [progress]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setView("dashboard")} aria-label="Linux Hacker Academy dashboard"><span className="brand-mark">&gt;_</span><span><strong>LINUX//ACADEMY</strong><small>COMMAND-LINE MASTERY SYSTEM</small></span></button>
        <Tabs value={view} onValueChange={(value) => setView(value as View)} className="nav-tabs"><TabsList variant="line"><TabsTrigger value="dashboard"><LayoutDashboard size={16} /> dashboard</TabsTrigger><TabsTrigger value="learn"><BookOpen size={16} /> learn</TabsTrigger><TabsTrigger value="lab"><TerminalSquare size={16} /> practice</TabsTrigger><TabsTrigger value="resources"><CirclePlay size={16} /> sources</TabsTrigger></TabsList></Tabs>
        <div className="user-strip"><button onClick={exportProgress} title="Export progress" aria-label="Export progress"><Download size={17} /></button><span><Zap size={15} /> {xp} XP</span><div className="avatar">LN</div></div>
      </header>

      <Tabs value={view} onValueChange={(value) => setView(value as View)} className="main-tabs">
        <TabsContent value="dashboard"><Dashboard progress={progress} setView={setView} openLesson={openLesson} /></TabsContent>
        <TabsContent value="learn"><LearnView progress={progress} activeLesson={activeLesson} setActiveLesson={setLesson} actions={{ toggleComplete, submitQuiz, completeLab }} /></TabsContent>
        <TabsContent value="lab"><PracticeLab progress={progress} completeLab={completeLab} /></TabsContent>
        <TabsContent value="resources"><ResourcesView /></TabsContent>
      </Tabs>

      <footer className="site-footer"><span><TerminalSquare size={15} /> LINUX HACKER ACADEMY</span><span>source-grounded · local-first progress · safe practice</span><a href="https://github.com/" target="_blank" rel="noreferrer"><Code2 size={15} /> GitHub Pages ready</a></footer>
    </main>
  );
}
