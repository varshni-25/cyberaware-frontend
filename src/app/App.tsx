import { QRCodeSVG } from "qrcode.react";
import AuthPage from "./components/AuthPage";
import { apiFetch, getToken, clearToken } from "./lib/api";
import { useState, useEffect, useRef, useMemo } from "react"
import {
  Shield, Lock, Mail, Wifi, Bell, AlertTriangle, Eye, EyeOff,
  CheckCircle, XCircle, Star, Trophy, Zap, BookOpen, Users, Target,
  Award, ChevronRight, ChevronDown, ChevronLeft, Menu, X, BarChart2,
  Key, Smartphone, Cloud, Database, UserX, Activity, AlertCircle,
  RefreshCw, Check, TrendingUp, Flame, Calendar, Globe, Phone, Info,
  Cpu, ArrowRight, Home, ExternalLink, Hash, Download, CreditCard,
  Layers, Search, Server, Fingerprint, ShieldCheck,
  MessageSquare, CircleCheck, CircleX, Lightbulb, Play, RotateCcw,
  Sparkles, GraduationCap, Terminal, Radio, HelpCircle
} from "lucide-react"
import {
  RadarChart, Radar as RadarViz, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts"

// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes float {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-14px) rotate(3deg); }
    66% { transform: translateY(-6px) rotate(-2deg); }
  }
  @keyframes pulse-glow {
    0%,100% { box-shadow: 0 0 20px rgba(0,212,255,0.3), 0 0 60px rgba(0,212,255,0.1); }
    50% { box-shadow: 0 0 40px rgba(0,212,255,0.7), 0 0 100px rgba(0,212,255,0.3); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes spin-slow-rev {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }
  @keyframes scanline {
    0% { top: -10%; }
    100% { top: 110%; }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes blink-cursor {
    0%,100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes matrix-rain {
    0% { transform: translateY(-100%); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
  }
  @keyframes ping-slow {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delay-1 { animation: float 7s ease-in-out infinite 1s; }
  .animate-float-delay-2 { animation: float 8s ease-in-out infinite 2s; }
  .animate-float-delay-3 { animation: float 6.5s ease-in-out infinite 0.5s; }
  .animate-float-delay-4 { animation: float 7.5s ease-in-out infinite 1.5s; }
  .animate-float-delay-5 { animation: float 9s ease-in-out infinite 3s; }
  .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }
  .animate-spin-slow-rev { animation: spin-slow-rev 15s linear infinite; }
  .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
  .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
  .animate-blink { animation: blink-cursor 1s infinite; }
  .animate-ping-slow { animation: ping-slow 2s ease-out infinite; }
  .animate-gradient { animation: gradient-shift 4s ease infinite; background-size: 200% 200%; }
  .font-exo { font-family: 'Exo 2', sans-serif; }
  .font-mono-jet { font-family: 'JetBrains Mono', monospace; }
  .glass { background: rgba(10, 22, 40, 0.6); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(0, 212, 255, 0.12); }
  .glass-strong { background: rgba(5, 15, 30, 0.85); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border: 1px solid rgba(0, 212, 255, 0.2); }
  .glow-cyan { box-shadow: 0 0 20px rgba(0,212,255,0.3), inset 0 0 20px rgba(0,212,255,0.05); }
  .glow-cyan-strong { box-shadow: 0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.2); }
  .glow-green { box-shadow: 0 0 20px rgba(0,255,157,0.3); }
  .glow-amber { box-shadow: 0 0 20px rgba(245,158,11,0.3); }
  .glow-red { box-shadow: 0 0 20px rgba(239,68,68,0.3); }
  .glow-purple { box-shadow: 0 0 20px rgba(99,102,241,0.3); }
  .text-glow-cyan { text-shadow: 0 0 20px rgba(0,212,255,0.6); }
  .grid-bg { background-image: linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px); background-size: 50px 50px; }
  .hex-border { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
  .scanline { position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(transparent, rgba(0,212,255,0.4), transparent); animation: scanline 4s linear infinite; pointer-events: none; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: rgba(2,12,27,0.8); }
  ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.3); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,212,255,0.6); }
  .lesson-card:hover .lesson-icon { transform: scale(1.1) rotate(5deg); transition: transform 0.3s ease; }
  .lesson-icon { transition: transform 0.3s ease; }
  .progress-bar-fill { transition: width 1s ease-in-out; }
  .tab-active { background: rgba(0,212,255,0.15); border-bottom: 2px solid #00d4ff; color: #00d4ff; }
  .hover-glow:hover { box-shadow: 0 0 25px rgba(0,212,255,0.3); transform: translateY(-2px); transition: all 0.3s ease; }
  .card-hover { transition: all 0.3s ease; }
  .card-hover:hover { transform: translateY(-4px); box-shadow: 0 8px 40px rgba(0,212,255,0.15); border-color: rgba(0,212,255,0.3) !important; }
  .btn-cyber { position: relative; overflow: hidden; }
  .btn-cyber::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); transition: left 0.5s; }
  .btn-cyber:hover::before { left: 100%; }
`

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type Page = "auth" |"home" | "lessons" | "lesson-detail" | "dashboard" | "cyber-id" | "tools" | "resources" | "about"
type LessonLevel = "beginner" | "intermediate" | "advanced"

interface QuizQ {
  q: string
  options: string[]
  answer: number
  explanation: string
}
interface LessonType { name: string; desc: string }
interface Myth { myth: string; truth: string }

interface Lesson {
  id: number
  title: string
  subtitle: string
  icon: React.ElementType
  color: string
  bgColor: string
  level: LessonLevel
  xp: number
  duration: string
  category: string
  intro: string
  whyCare: string
  concepts: string[]
  types: LessonType[]
  examples: string[]
  warnings: string[]
  prevention: string[]
  myths: Myth[]
  takeaways: string[]
  
}

interface StudentData {
  name: string
  xp: number
  completedLessons: number[]
  quizScores: Record<number, number>
  streak: number
  badges: string[]
  joinDate: string
}

// ─────────────────────────────────────────────
// LESSONS DATA
// ─────────────────────────────────────────────
const LESSONS: Lesson[] = [
  {
    id: 1, title: "Introduction to Cybersecurity", subtitle: "Your first step into digital safety", icon: Shield,
    color: "#00d4ff", bgColor: "rgba(0,212,255,0.1)", level: "beginner", xp: 100, duration: "20 min", category: "Foundation",
    intro: "Cybersecurity is the practice of protecting computers, networks, programs, and data from unauthorized access, damage, or attack. In our connected world, digital safety is as essential as road safety.",
    whyCare: "Every student is a digital citizen. From online banking to academic portals, your personal information is constantly at risk. Cybercriminals target students specifically because they often use unsecured networks and reuse passwords.",
    concepts: ["Confidentiality: Keeping your information private and accessible only to authorized people", "Integrity: Ensuring data hasn't been tampered with or modified", "Availability: Making sure systems and data are accessible when needed", "Authentication: Verifying that you are who you claim to be", "Authorization: Determining what you're allowed to access"],
    types: [{ name: "Network Security", desc: "Protecting network infrastructure from unauthorized access" }, { name: "Application Security", desc: "Making software resistant to threats" }, { name: "Information Security", desc: "Protecting data in storage and transit" }, { name: "Endpoint Security", desc: "Securing individual devices like laptops and phones" }, { name: "Cloud Security", desc: "Protecting data in cloud services" }],
    examples: ["A student's email being hacked due to a weak password '123456'", "A college network disrupted by malware spread through a USB drive", "Personal photos leaked because of weak social media privacy settings"],
    warnings: ["Unusual login activity from unknown locations", "Unexpected password reset emails", "Accounts posting without your knowledge", "Slow device performance with unusual processes", "Friends receiving strange messages 'from you'"],
    prevention: ["Use strong, unique passwords for every account", "Enable two-factor authentication wherever available", "Keep all software and operating systems updated", "Be cautious about what you share online", "Use trusted, secure networks for sensitive activities"],
    myths: [{ myth: "Only large companies get hacked", truth: "Individuals and students are frequent targets due to weaker security practices" }, { myth: "I have nothing worth stealing", truth: "Your identity, credentials, and personal data are extremely valuable to cybercriminals" }, { myth: "Antivirus alone keeps you safe", truth: "Security requires multiple layers including behavior, habits, and regular updates" }],
    takeaways: ["Cybersecurity protects people, not just computers", "CIA Triad = Confidentiality, Integrity, Availability", "Good cyber habits are your strongest defense", "Everyone is a potential target — stay aware and prepared"],
   
  },
  {
    id: 2, title: "Password Security & MFA", subtitle: "Building your first line of defense", icon: Lock,
    color: "#00ff9d", bgColor: "rgba(0,255,157,0.1)", level: "beginner", xp: 120, duration: "25 min", category: "Foundation",
    intro: "Passwords are your digital keys. A weak password is like leaving your house key under the doormat — visible to anyone looking. MFA adds extra security layers beyond just passwords.",
    whyCare: "Over 80% of data breaches involve compromised passwords. Students often reuse simple passwords across multiple platforms, meaning one breach can unlock all your accounts.",
    concepts: ["Password strength: Combination of length, complexity, and unpredictability", "Password manager: Secure app that stores and generates complex passwords", "Multi-Factor Authentication (MFA): Requiring multiple verification methods", "Brute force attack: Trying all possible password combinations", "Credential stuffing: Using leaked passwords to access other accounts"],
    types: [{ name: "SMS-based MFA", desc: "A code sent to your phone via text message" }, { name: "Authenticator App", desc: "Apps like Google Authenticator generate time-based codes" }, { name: "Hardware Key", desc: "Physical devices like YubiKey for highest security" }, { name: "Biometric MFA", desc: "Fingerprint or face recognition as an additional factor" }, { name: "Email OTP", desc: "One-time passwords sent to your registered email" }],
    examples: ["'123456' is the most common password — used by millions of accounts worldwide", "The 2016 LinkedIn breach exposed 117 million passwords", "Students using name + birth year as passwords can be cracked in seconds"],
    warnings: ["Password reset emails you did not request", "Unable to log in to your own accounts", "Notifications of logins from unfamiliar devices", "Emails sent from your account that you do not recognize", "Security alerts about suspicious activity"],
    prevention: ["Use passwords of at least 12-16 characters with mixed character types", "Never reuse passwords across different accounts", "Use a reputable password manager like Bitwarden or 1Password", "Enable MFA on all critical accounts immediately", "Never share passwords with anyone"],
    myths: [{ myth: "A complex 8-character password is strong enough", truth: "Modern computers crack 8-character passwords in minutes. Use 12-16+ characters." }, { myth: "I can remember all my passwords", truth: "Memorable passwords tend to be weak or reused — a password manager is safer." }, { myth: "MFA is too inconvenient", truth: "MFA adds only 10-30 seconds to login and blocks 99.9% of automated attacks." }],
    takeaways: ["Longer passwords are stronger than complex short ones", "MFA prevents account takeover even if your password is stolen", "Password managers are the safest way to use unique passwords everywhere", "Legitimate services never ask for your password"],
   
  },
  {
    id: 3, title: "Phishing & Social Engineering", subtitle: "Recognizing manipulation and deception online", icon: Mail,
    color: "#f59e0b", bgColor: "rgba(245,158,11,0.1)", level: "beginner", xp: 130, duration: "30 min", category: "Threats",
    intro: "Phishing disguises criminals as trusted entities to steal your information. Social engineering manipulates human psychology rather than exploiting technical vulnerabilities — humans are often the weakest link.",
    whyCare: "91% of data breaches start with a phishing email. Criminals specifically target students with fake scholarship offers, account suspension warnings, and too-good-to-be-true deals.",
    concepts: ["Phishing: Deceptive messages designed to trick you into revealing sensitive information", "Spear phishing: Targeted phishing using personal details about the victim", "Social engineering: Manipulating people's psychology to gain unauthorized access", "Pretexting: Creating a fake scenario to extract information", "Baiting: Offering something enticing to lure victims into a trap"],
    types: [{ name: "Email Phishing", desc: "Fake emails mimicking trusted organizations" }, { name: "Smishing", desc: "Deceptive SMS messages with malicious links" }, { name: "Vishing", desc: "Fraudulent phone calls impersonating authority figures" }, { name: "Spear Phishing", desc: "Highly targeted attacks using personal information" }, { name: "Clone Phishing", desc: "Duplicating legitimate emails with malicious links swapped in" }],
    examples: ["Email from 'admin@g00gle.com' claiming your Google account will be suspended", "WhatsApp message claiming you won a prize requiring a link click to claim", "Call from someone claiming to be from your bank's fraud department asking for your OTP"],
    warnings: ["Urgent language demanding immediate action ('Act now or lose access')", "Requests for sensitive information like passwords or OTPs", "Suspicious sender addresses with typos (amazon-support@gmail.com)", "Generic greetings like 'Dear Customer' instead of your name", "Links that do not match the claimed organization when hovering"],
    prevention: ["Verify sender email addresses carefully before responding", "Never click links in unexpected emails — go directly to the website", "Legitimate organizations never ask for your password via email", "Hover over links before clicking to see the actual URL", "When in doubt, call the organization directly using a number from their official website"],
    myths: [{ myth: "Phishing only happens via email", truth: "Phishing occurs through SMS, phone calls, social media, and fake websites too." }, { myth: "I can spot phishing by bad grammar", truth: "Modern phishing attacks are highly polished and professionally written." }, { myth: "Antivirus protects against all phishing", truth: "Antivirus cannot protect you from voluntarily giving away credentials on a fake site." }],
    takeaways: ["Urgency and fear are the most common social engineering tactics", "Legitimate organizations never ask for passwords or OTPs", "Always verify through independent means before acting", "When in doubt, do not click — go directly to the official website"],
    
  },
  {
    id: 4, title: "Malware Overview", subtitle: "Understanding digital threats and infections", icon: AlertTriangle,
    color: "#f59e0b", bgColor: "rgba(245,158,11,0.1)", level: "intermediate", xp: 140, duration: "35 min", category: "Threats",
    intro: "Malware (malicious software) is any software intentionally designed to cause disruption, steal data, or gain unauthorized access. Understanding types of malware helps you recognize and avoid them.",
    whyCare: "Malware infections cost billions annually. Students downloading pirated software, clicking suspicious links, or using infected USB drives are among the most common infection vectors.",
    concepts: ["Virus: Self-replicating malware that attaches itself to legitimate programs", "Worm: Spreads automatically across networks without user action", "Trojan: Disguises itself as legitimate software to gain entry", "Spyware: Secretly monitors your activity and steals information", "Adware: Delivers unwanted advertisements and may track behavior"],
    types: [{ name: "Virus", desc: "Attaches to files and spreads when infected files are shared" }, { name: "Worm", desc: "Self-replicates across networks, consuming bandwidth and resources" }, { name: "Trojan Horse", desc: "Appears legitimate but contains malicious code" }, { name: "Spyware", desc: "Silently monitors and reports your activities to attackers" }, { name: "Rootkit", desc: "Hides deep in the OS, giving attackers persistent access" }],
    examples: ["Downloading a 'free' game that installs spyware capturing your keystrokes", "A USB drive found in a parking lot that automatically installs malware when plugged in", "Browser extensions that seem useful but secretly track all your browsing"],
    warnings: ["Significantly slower device performance", "Unexpected pop-ups and advertisements", "Programs opening or closing by themselves", "Unusual network activity or high data usage", "Antivirus disabled without your action"],
    prevention: ["Only download software from official, trusted sources", "Never plug in unknown USB drives", "Keep antivirus software updated and run regular scans", "Be suspicious of files with double extensions (photo.jpg.exe)", "Avoid pirated software — it often contains malware"],
    myths: [{ myth: "Macs do not get malware", truth: "All operating systems can be infected. Mac malware is increasing as popularity grows." }, { myth: "I would notice if my device had malware", truth: "Many malware types are designed to be completely invisible to users." }, { myth: "Malware only comes from shady websites", truth: "Legitimate websites can be compromised to serve malware through ads or downloads." }],
    takeaways: ["Never plug in unknown USB drives — even if they seem harmless", "Pirated software is one of the most common malware delivery methods", "Keep your OS and antivirus up to date at all times", "If your device behaves strangely, run a full security scan immediately"],
    
  },
  {
    id: 5, title: "Ransomware", subtitle: "Understanding digital extortion and how to stay safe", icon: Database,
    color: "#ef4444", bgColor: "rgba(239,68,68,0.1)", level: "intermediate", xp: 150, duration: "35 min", category: "Threats",
    intro: "Ransomware is malware that encrypts your files and demands payment for the decryption key. It is one of the most financially damaging forms of cybercrime affecting individuals, schools, and organizations.",
    whyCare: "Ransomware attacks on educational institutions increased 800% in recent years. Students lose irreplaceable assignments, projects, and photos. Recovery costs thousands of dollars and data is often never fully recovered.",
    concepts: ["Encryption: Locking files so only someone with the right key can open them", "Ransom demand: Payment (usually cryptocurrency) demanded for the decryption key", "Backup: Copies of your files stored separately for recovery", "Attack vector: The method used to deliver ransomware (email, website, USB)", "Decryption key: The unique code that unlocks encrypted files"],
    types: [{ name: "Locker Ransomware", desc: "Locks you out of your device entirely" }, { name: "Crypto Ransomware", desc: "Encrypts specific files while the device remains usable" }, { name: "Scareware", desc: "Fake warnings claiming your device is infected, demanding payment to 'fix' it" }, { name: "Doxware", desc: "Threatens to publish your private data unless ransom is paid" }, { name: "RaaS", desc: "Ransomware-as-a-Service: criminals rent ransomware tools to others" }],
    examples: ["A student opens a fake scholarship application email attachment, encrypting all their coursework", "A school's systems locked down with a ransom demand, disrupting exams", "A hospital's patient records encrypted, forcing them to pay to restore care services"],
    warnings: ["Files suddenly cannot be opened", "File extensions changed to unknown types (.locked, .encrypted)", "A ransom note appears on screen demanding payment", "Desktop background changed to a ransom message", "Files being renamed or modified rapidly"],
    prevention: ["Back up important files regularly to an external drive or cloud (not connected to your main device)", "Never open email attachments from unknown senders", "Keep your operating system and software updated", "Use reputable antivirus with ransomware protection features", "Never pay the ransom — it does not guarantee file recovery and funds criminals"],
    myths: [{ myth: "Paying the ransom will get my files back", truth: "About 40% of victims who pay still do not get their files back. Paying funds criminal operations." }, { myth: "Ransomware only targets businesses", truth: "Individuals and students are increasingly targeted, especially through pirated software and malicious emails." }, { myth: "Cloud storage protects against ransomware", truth: "Ransomware can spread to connected cloud storage. Keep offline backups too." }],
    takeaways: ["Regular offline backups are your best protection against ransomware", "Never pay the ransom — it does not guarantee recovery", "Keep systems updated to patch vulnerabilities ransomware exploits", "The 3-2-1 backup rule: 3 copies, 2 different media types, 1 offsite"],
    
  },
  {
    id: 6, title: "The Dark Web", subtitle: "Understanding the hidden internet — risks, myths, and safety", icon: Globe,
    color: "#a855f7", bgColor: "rgba(168,85,247,0.1)", level: "intermediate", xp: 160, duration: "40 min", category: "Awareness",
    intro: "The internet has layers: the Surface Web we use daily, the Deep Web of private databases, and the Dark Web — accessible only through special software. Understanding these distinctions helps you navigate online risks wisely.",
    whyCare: "Students' personal data stolen in breaches often ends up sold on dark web marketplaces. Understanding what the dark web is (and is not) prevents panic and helps you protect your information proactively.",
    concepts: ["Surface Web: Publicly indexed websites accessible through regular browsers (about 4% of the internet)", "Deep Web: Private, unindexed content like banking portals, medical records, and email (about 90% of internet)", "Dark Web: A small portion requiring special software (Tor) to access, hosting both legitimate and illegal content", "Tor Network: Software that anonymizes internet traffic by routing it through multiple servers", "Onion routing: The privacy technology behind the dark web, using layered encryption"],
    types: [{ name: "Surface Web", desc: "Google-indexed sites accessible to everyone (news, social media, e-commerce)" }, { name: "Deep Web", desc: "Password-protected pages, academic databases, personal email — not indexed by search engines" }, { name: "Dark Web", desc: "Requires Tor browser, contains anonymous forums, privacy tools, and unfortunately illegal markets" }, { name: "Darknet Markets", desc: "Underground marketplaces selling stolen data, drugs, and illegal items" }, { name: "Data Dumps", desc: "Stolen credential databases sold or shared on dark web forums" }],
    examples: ["Stolen student login credentials from a university breach sold for $5-$10 each on dark web markets", "A student's banking details found in a data dump after a fintech company breach", "Identity documents (Aadhaar details) traded on dark web marketplaces"],
    warnings: ["Breach notification emails saying your data was found on the dark web", "Unusual account activity suggesting credential stuffing attacks", "Unexpected credit applications or financial activity in your name", "New accounts opened using your identity that you did not create", "Receiving OTPs for services you did not sign up for"],
    prevention: ["Use HaveIBeenPwned.com to check if your email was in any known breaches", "Use unique passwords so one breach does not compromise all accounts", "Enable MFA — stolen passwords alone cannot access MFA-protected accounts", "Monitor your bank statements and credit reports regularly", "Set up breach alerts through reputable services"],
    myths: [{ myth: "The dark web is mostly illegal content", truth: "Many dark web sites host legitimate privacy tools, journalism, and political activism in oppressive regimes." }, { myth: "Just browsing the dark web is illegal", truth: "Using Tor and accessing the dark web is not illegal in most countries. What you do there determines legality." }, { myth: "You need dark web access to be a hacking victim", truth: "Most cybercrime victims are on the regular internet. Dark web activity affects you indirectly through data breaches." }],
    takeaways: ["The deep web is just private internet content — completely normal and used daily", "Dark web data breaches affect you even if you never visit the dark web", "Use breach monitoring tools to protect yourself proactively", "Strong, unique passwords and MFA are your best defense against data being misused"],
   
  },
  {
    id: 7, title: "Safe Internet Browsing", subtitle: "Navigating the web securely and confidently", icon: Globe,
    color: "#00d4ff", bgColor: "rgba(0,212,255,0.1)", level: "beginner", xp: 110, duration: "20 min", category: "Foundation",
    intro: "Safe browsing means understanding how to identify legitimate websites, recognizing dangerous signs, protecting your privacy, and making smart decisions about what you click and download.",
    whyCare: "Students spend hours daily online for research, social media, and entertainment. A single unsafe click can compromise your device, personal data, and even your academic work.",
    concepts: ["HTTPS: Secure protocol encrypting data between your browser and websites", "Browser extensions: Small programs that can enhance or compromise browser security", "Cookie tracking: How websites track your behavior for advertising", "Drive-by downloads: Malware automatically downloaded without your explicit consent", "DNS poisoning: Redirecting you to fake versions of legitimate websites"],
    types: [{ name: "Secure websites", desc: "HTTPS with a padlock icon — data is encrypted in transit" }, { name: "Suspicious websites", desc: "HTTP only, typosquatted domains, poor design, excessive pop-ups" }, { name: "Phishing sites", desc: "Fake versions of real websites designed to steal credentials" }, { name: "Malvertising", desc: "Legitimate advertising networks serving malicious ads" }, { name: "Fake download sites", desc: "Sites mimicking official software download pages with malicious installers" }],
    examples: ["A student searching for a textbook PDF finding a site that installs malware instead", "Clicking a 'Download Now' banner that installs adware, not the intended software", "A fake bank website with URL 'yourbank.security-verify.net' instead of 'yourbank.com'"],
    warnings: ["Browser redirecting you to unexpected websites", "Excessive pop-ups or new browser tabs opening automatically", "Homepage or search engine changed without your permission", "Unknown browser extensions installed", "Padlock icon missing or showing 'Not Secure'"],
    prevention: ["Always check for HTTPS and verify the domain before entering sensitive information", "Use a reputable browser with built-in phishing protection (Chrome, Firefox, Edge)", "Install only trusted browser extensions from official stores", "Use an ad blocker to reduce exposure to malvertising", "Do not ignore browser security warnings"],
    myths: [{ myth: "HTTPS means a website is safe and legitimate", truth: "HTTPS only means the connection is encrypted. Phishing sites also use HTTPS." }, { myth: "Incognito mode makes you anonymous", truth: "Incognito only prevents local browsing history — your ISP and websites still see your traffic." }, { myth: "Downloading from Google results is always safe", truth: "Malicious sites can appear in search results, especially for software downloads." }],
    takeaways: ["HTTPS encrypts your connection but does not guarantee a site is legitimate", "Always verify the complete domain name before entering passwords or payment details", "Incognito mode protects local privacy only, not online anonymity", "Be extra cautious on sites offering free software, movies, or game hacks"],
    
  },
  {
    id: 8, title: "Wi-Fi Security", subtitle: "Staying safe on public and private networks", icon: Wifi,
    color: "#00d4ff", bgColor: "rgba(0,212,255,0.1)", level: "beginner", xp: 110, duration: "20 min", category: "Foundation",
    intro: "Wi-Fi security matters because unsecured wireless networks allow attackers to intercept your data, redirect your traffic, or even access your device. Understanding network risks keeps your data private.",
    whyCare: "Students constantly connect to public Wi-Fi in cafes, libraries, and campus networks. Attackers set up fake hotspots or intercept unencrypted traffic on real networks — capturing passwords, emails, and personal data.",
    concepts: ["WPA3: The latest, strongest Wi-Fi security protocol", "MITM attack: Attacker positions themselves between you and the internet to intercept data", "Evil twin: Fake access point mimicking a legitimate Wi-Fi network", "VPN: Encrypts all your internet traffic for privacy on any network", "Network sniffing: Capturing data packets on a shared network"],
    types: [{ name: "Secured Home Network", desc: "WPA3/WPA2 protected, private network with strong password" }, { name: "Public Wi-Fi", desc: "Open or shared networks in cafes, airports — treat all traffic as potentially visible" }, { name: "Evil Twin", desc: "Fake hotspot with the same name as a legitimate network" }, { name: "Corporate/Campus Network", desc: "Often more secure but still requires careful behavior" }, { name: "Mobile Hotspot", desc: "Your phone's data shared as a Wi-Fi network — generally secure" }],
    examples: ["Connecting to 'CafeWifi_Free' which is actually an attacker's hotspot capturing your login credentials", "Using university Wi-Fi to access your bank account — visible to network administrators", "An attacker on the same coffee shop Wi-Fi intercepting your unencrypted HTTP traffic"],
    warnings: ["Wi-Fi networks without passwords asking for no authentication", "Multiple networks with very similar names (both 'UniversityWiFi' and 'UniversityWiFi_')", "Sudden disconnections followed by reconnection requests", "Certificate errors when using HTTPS on public networks", "Your device connecting to a network without you initiating it"],
    prevention: ["Use a VPN on public Wi-Fi networks", "Only access HTTPS websites when on public networks", "Turn off automatic Wi-Fi connection to known network names", "Avoid accessing banking or sensitive accounts on public Wi-Fi", "Use your mobile data for sensitive transactions when on the go"],
    myths: [{ myth: "Password-protected public Wi-Fi is fully secure", truth: "Anyone with the password on the same network can still intercept unencrypted traffic." }, { myth: "Only HTTPS protects you on public Wi-Fi", truth: "While HTTPS encrypts content, metadata (sites visited, timing) can still be visible. A VPN adds more protection." }, { myth: "My device will warn me about evil twin networks", truth: "Devices usually connect to the strongest signal with a known network name — evil twins exploit this." }],
    takeaways: ["Always use a VPN on public Wi-Fi networks", "Never access banking or sensitive accounts on public Wi-Fi without a VPN", "Turn off auto-connect to avoid connecting to evil twin networks", "Use your mobile data for sensitive activities when in public"],
    
  },
  {
    id: 9, title: "Email Security", subtitle: "Protecting your inbox and your identity", icon: Mail,
    color: "#00d4ff", bgColor: "rgba(0,212,255,0.1)", level: "beginner", xp: 115, duration: "22 min", category: "Foundation",
    intro: "Email remains the primary communication tool for students and professionals — and the primary attack vector for cybercriminals. Secure email habits protect your identity, data, and reputation.",
    whyCare: "Students receive phishing emails disguised as scholarship offers, university notifications, and job opportunities. One careless click can compromise your entire digital life.",
    concepts: ["Email spoofing: Forging the sender address to appear as a trusted source", "Attachment malware: Malicious files hidden in email attachments", "Email encryption: Scrambling email content so only the intended recipient can read it", "SPF/DKIM: Technical standards that verify email authenticity", "Spam filters: Automated systems that identify and block unwanted or malicious emails"],
    types: [{ name: "Phishing emails", desc: "Designed to steal credentials by impersonating trusted senders" }, { name: "Malicious attachments", desc: "Documents, PDFs, or archives containing malware" }, { name: "Business Email Compromise", desc: "Impersonating executives or trusted contacts to request transfers" }, { name: "Spam", desc: "Unsolicited bulk emails, often containing scams or advertising" }, { name: "Email spoofing", desc: "Forging sender details to appear as a legitimate sender" }],
    examples: ["Email from 'admin@university.edu' (actually admin@university.edu.fake.com) asking you to verify your student account", "A 'Google Drive file share' email that leads to a credential-harvesting page", "An invoice attachment in PDF format that installs malware when opened"],
    warnings: ["Unexpected emails asking you to verify, confirm, or update account details", "Attachments from unknown or unexpected senders", "Emails creating urgency or threatening negative consequences", "Links that reveal a different URL than expected when you hover", "Emails from known contacts with unusual requests or out-of-character language"],
    prevention: ["Use a primary and a secondary 'throwaway' email for different purposes", "Never open unexpected attachments without verifying with the sender by phone or in person", "Report phishing emails using your email provider's tools", "Enable two-factor authentication on your email account immediately", "Use email services with strong spam and phishing filters (Gmail, Outlook)"],
    myths: [{ myth: "My spam filter catches all dangerous emails", truth: "Sophisticated phishing emails bypass spam filters regularly. Human judgment is essential." }, { myth: "Emails from known contacts are always safe", truth: "Attackers compromise email accounts and send malicious emails to all contacts from legitimate addresses." }, { myth: "I can spot fake emails by checking the sender name", truth: "Sender names are trivially spoofable — always check the actual email address domain." }],
    takeaways: ["Always verify the actual email domain, not just the sender's display name", "If an email creates urgency or requests sensitive information — pause and verify independently", "Your email account is the master key to all other accounts — protect it with MFA", "Never open unexpected attachments, even from people you know"],
    
  },
  {
    id: 10, title: "Mobile Security", subtitle: "Keeping your smartphone safe from threats", icon: Smartphone,
    color: "#f59e0b", bgColor: "rgba(245,158,11,0.1)", level: "intermediate", xp: 135, duration: "28 min", category: "Devices",
    intro: "Smartphones contain more sensitive personal information than almost any other device — banking apps, personal photos, location data, emails, and passwords. Securing your phone is securing your life.",
    whyCare: "Students use smartphones for banking, academics, social media, and communication. Phone theft, malicious apps, and unsecured connections can expose all this data to criminals.",
    concepts: ["App permissions: What data and features an app can access", "Device encryption: Scrambling all data on your device so only you can access it", "Remote wipe: Ability to erase your device remotely if it is lost or stolen", "Sideloading: Installing apps from outside the official app store — high risk", "Jailbreaking/Rooting: Removing OS restrictions — bypasses security protections"],
    types: [{ name: "Malicious apps", desc: "Apps designed to steal data, display ads, or take control of your device" }, { name: "SMS phishing (Smishing)", desc: "Phishing attacks delivered via text message" }, { name: "SIM swapping", desc: "Convincing your carrier to transfer your number to an attacker's SIM" }, { name: "Stalkerware", desc: "Hidden apps that monitor your location and communications" }, { name: "Unsecured Bluetooth", desc: "Bluetooth vulnerabilities exploited to access nearby devices" }],
    examples: ["A flashlight app requesting access to your contacts, location, and camera", "A text message saying your package could not be delivered with a link to 'reschedule'", "An attacker calling your carrier claiming to be you and transferring your phone number to a new SIM"],
    warnings: ["Unusual battery drain without heavy use", "Unexpected data usage spikes", "Apps crashing frequently or behaving strangely", "Phone getting very hot when not in use", "Unexpected charges or messages sent from your number"],
    prevention: ["Only install apps from official stores (Google Play, Apple App Store)", "Review and limit app permissions to only what is necessary", "Enable device encryption and use biometric lock", "Keep your operating system and apps updated", "Enable remote wipe capability through your device settings"],
    myths: [{ myth: "iPhones cannot get malware", truth: "iOS devices are more secure but not immune — malicious apps and phishing still affect iPhone users." }, { myth: "All apps on official stores are safe", truth: "Malicious apps occasionally bypass store review processes. Check ratings, reviews, and permissions." }, { myth: "I do not need a screen lock if I never leave my phone unattended", truth: "Phones can be stolen in seconds. A screen lock is the first and easiest protection." }],
    takeaways: ["Review app permissions before and after installing any app", "Enable device encryption and remote wipe capability", "Only install from official app stores and check reviews", "Keep your phone's OS updated to patch security vulnerabilities"],
   
  },
  {
    id: 11, title: "UPI & Digital Payment Safety", subtitle: "Protecting your money in the digital economy", icon: CreditCard,
    color: "#f59e0b", bgColor: "rgba(245,158,11,0.1)", level: "intermediate", xp: 145, duration: "32 min", category: "Finance",
    intro: "UPI (Unified Payments Interface) and digital wallets have transformed how Indians pay. Understanding payment scams and secure practices protects your hard-earned money from criminals who exploit this digital ecosystem.",
    whyCare: "Digital payment fraud in India increased dramatically as more students began using apps like PhonePe, GPay, and Paytm. Scammers specifically target students with job offers, scholarship claims, and prize money tricks.",
    concepts: ["UPI PIN: Your secret 4-6 digit PIN — never share this with anyone", "MPIN: Mobile banking PIN distinct from your UPI PIN", "Collect request: A payment request sent TO you — accepting means money leaves your account", "Screen sharing scams: Fraudsters ask you to share your screen to 'help' with UPI issues", "QR code fraud: Fake QR codes that debit your account instead of crediting it"],
    types: [{ name: "Collect Request Scam", desc: "Sending you a payment request claiming it is how you receive money" }, { name: "Screen Share Fraud", desc: "Fraudsters guide you to share your screen to steal your banking details" }, { name: "Fake Customer Support", desc: "Fake UPI app customer support that asks for PIN or OTP" }, { name: "QR Code Scam", desc: "Sharing fake QR codes that debit instead of credit your account" }, { name: "Job/Scholarship Scams", desc: "Promising payment or scholarship but requiring 'registration fee' via UPI first" }],
    examples: ["A student 'selling' something online receives a collect request from the 'buyer' — approving it sends money away instead of receiving it", "Someone claiming to be from PhonePe support asking for your UPI PIN to 'resolve an issue'", "A fake scholarship portal asking students to pay a Rs. 100 registration fee via UPI to 'unlock' Rs. 50,000 scholarship"],
    warnings: ["Anyone asking for your UPI PIN or OTP — for any reason", "Collect requests from strangers claiming to be 'sending' money", "Calls or messages offering to help set up or fix your UPI account", "Requests to install screen-sharing apps like AnyDesk or TeamViewer for 'bank support'", "Offers that seem too good to be true requiring a small advance payment"],
    prevention: ["Never share your UPI PIN, OTP, or MPIN with anyone — not even bank staff", "To receive money, you never need to approve anything or scan a QR code", "Verify the identity of anyone claiming to be bank support through the bank's official helpline", "Enable transaction limits and notifications for all digital payments", "Always double-check the recipient's name before confirming any transfer"],
    myths: [{ myth: "You need to scan a QR code or enter your PIN to receive money", truth: "You never need to scan or enter any PIN to receive money. Scanning a QR code or entering a PIN only sends money." }, { myth: "UPI transactions can be reversed if you report immediately", truth: "UPI transactions are instant and mostly irreversible. Recovery is not guaranteed even with police reports." }, { myth: "Bank customer support will ask for your PIN for security verification", truth: "Legitimate bank staff never ask for your PIN, OTP, or password — this is always fraud." }],
    takeaways: ["To receive money via UPI, you do nothing — no PIN, no QR scan, no approval needed", "Any 'collect request' takes money FROM you — never accept from strangers", "Your UPI PIN is yours alone — never share it with anyone for any reason", "When in doubt about any transaction, call your bank through their official number"],
    
  },
  {
    id: 12, title: "AI Scams & Deepfakes", subtitle: "Recognizing AI-powered deception in the modern age", icon: Cpu,
    color: "#ef4444", bgColor: "rgba(239,68,68,0.1)", level: "advanced", xp: 170, duration: "40 min", category: "Emerging Threats",
    intro: "Artificial intelligence has made it possible to create highly convincing fake audio, video, and images — called deepfakes. AI also powers sophisticated scam operations at unprecedented scale, making digital deception harder to detect.",
    whyCare: "AI scams and deepfakes are being used to impersonate teachers, parents, and government officials to defraud students. A deepfake voice call claiming to be a family member in distress is becoming a real threat.",
    concepts: ["Deepfake: AI-generated synthetic media where someone's likeness is convincingly manipulated", "Voice cloning: Creating a synthetic voice indistinguishable from a real person's using just seconds of audio", "AI chatbots in scams: Automated, convincing conversation bots used in romance and fraud scams", "Synthetic identity fraud: Using AI to create entirely fake identities combining real and fabricated information", "Liveness detection: Security technology that verifies you are a real human, not a deepfake video"],
    types: [{ name: "Deepfake video", desc: "Fake videos of real people saying or doing things they never did" }, { name: "Voice cloning scams", desc: "Cloned voices of family members or officials used to request emergency money" }, { name: "AI phishing", desc: "AI-written personalized phishing messages using scraped social media data" }, { name: "Deepfake KYC fraud", desc: "Using deepfakes to bypass video-based identity verification" }, { name: "Synthetic romance scams", desc: "AI-powered chatbots maintaining long-term romantic relationships to extract money" }],
    examples: ["A student receives a voice call from their 'parent' (cloned voice) claiming to be in an accident and needing immediate UPI transfer", "Deepfake videos of celebrities endorsing fake investment schemes circulating on social media", "AI-generated phishing emails personalized with details scraped from your social media profiles"],
    warnings: ["Urgent requests for money via video or audio calls, even from seemingly known contacts", "Calls or videos with slight audio sync issues, unnatural blinking, or facial distortions", "Investment opportunities endorsed by celebrities on social media promising guaranteed returns", "Romance connections that only ever communicate through text, never meeting in person", "Any request for money following unexpected contact, no matter how convincing the voice or face"],
    prevention: ["Establish a family code word that only real family members know — use it to verify emergency calls", "Be skeptical of any urgent financial request, even from familiar voices or faces", "Never make financial decisions based solely on a phone or video call — verify through a different channel", "Report deepfake fraud to the National Cyber Crime Reporting Portal (cybercrime.gov.in)", "Be cautious about how much of your voice and face you share publicly online"],
    myths: [{ myth: "I can always spot a deepfake by looking carefully", truth: "State-of-the-art deepfakes are indistinguishable to the human eye. Technical detection tools are needed." }, { myth: "Deepfakes are only used to harm celebrities", truth: "Deepfakes increasingly target ordinary people for financial fraud and harassment." }, { myth: "AI scam calls have a robotic voice that is easy to identify", truth: "Modern voice cloning is so convincing that family members cannot tell their loved one's voice from the clone." }],
    takeaways: ["Establish a family code word for verifying emergency calls", "Always verify unexpected urgent requests through a separate, trusted channel", "Deepfakes are becoming undetectable to the human eye — rely on verification, not visual inspection", "Be thoughtful about what audio and video you share publicly online"],
   
  },
  {
    id: 13, title: "Identity Theft", subtitle: "Protecting who you are in the digital world", icon: UserX,
    color: "#f59e0b", bgColor: "rgba(245,158,11,0.1)", level: "intermediate", xp: 145, duration: "32 min", category: "Privacy",
    intro: "Identity theft occurs when someone steals your personal information — name, Aadhaar, PAN, bank details — and uses it to impersonate you for financial gain or other fraudulent purposes.",
    whyCare: "Students' identities are valuable because they often have clean financial histories. Student Aadhaar and PAN details are used to open fraudulent loans, mobile connections, and bank accounts.",
    concepts: ["PII (Personally Identifiable Information): Data that can uniquely identify you — name, Aadhaar, phone number, address", "Financial identity theft: Using your identity to apply for loans, cards, or make purchases", "Medical identity theft: Using your identity to claim medical benefits or prescriptions", "Synthetic identity theft: Combining your real information with fabricated details", "Credit monitoring: Regularly checking if loans or credit lines have been opened in your name"],
    types: [{ name: "Financial Identity Theft", desc: "Opening accounts, loans, or making purchases using your stolen identity" }, { name: "Aadhaar-based Fraud", desc: "Using your Aadhaar to get SIM cards, bank accounts, or government benefits fraudulently" }, { name: "Account Takeover", desc: "Taking control of your existing accounts using stolen credentials" }, { name: "Tax Identity Theft", desc: "Filing tax returns in your name to claim refunds" }, { name: "Medical Identity Theft", desc: "Using your identity to obtain medical care or insurance claims" }],
    examples: ["A student finds out a loan was taken in their name after applying for education loan and discovering existing debt", "Someone using a leaked Aadhaar to get multiple SIM cards for OTP-based fraud", "A student's university email account taken over and used to send phishing emails to faculty"],
    warnings: ["Unexpected bills or collection calls for accounts you did not open", "Credit or loan rejection for no apparent reason", "Missing mail that should have arrived (bills, cards)", "Unknown inquiries on your credit report", "Unfamiliar accounts when you review your credit or banking history"],
    prevention: ["Minimize what personal information you share online", "Shred physical documents containing personal information before disposal", "Regularly review your banking statements and credit reports for unfamiliar activity", "Lock your Aadhaar biometric authentication when not in use (through UIDAI)", "Use unique email addresses and passwords for financial accounts"],
    myths: [{ myth: "Only older people get their identities stolen", truth: "Students and young people are prime targets because they rarely monitor their credit." }, { myth: "I would know immediately if my identity was stolen", truth: "Identity theft often goes undetected for months or years, discovered only when applying for credit." }, { myth: "Identity theft only causes financial harm", truth: "Identity theft can affect employment background checks, academic records, and legal standing too." }],
    takeaways: ["Monitor your bank statements and credit reports regularly", "Lock your Aadhaar biometric when not actively needed", "Never share Aadhaar, PAN, or other PII in response to unsolicited requests", "Act quickly if you suspect identity theft — contact your bank and report to cybercrime"],
    
  },
  {
    id: 14, title: "Data Privacy", subtitle: "Understanding and protecting your digital footprint", icon: Shield,
    color: "#a855f7", bgColor: "rgba(168,85,247,0.1)", level: "intermediate", xp: 140, duration: "30 min", category: "Privacy",
    intro: "Data privacy is your right to control how your personal information is collected, used, and shared. In the digital age, your data is constantly being harvested — understanding this empowers you to protect what is yours.",
    whyCare: "Every app, website, and service collects data about you. This data is used for advertising, sold to third parties, and in breaches, exposed to criminals. Students share enormous amounts of data without realizing its value and risks.",
    concepts: ["Data minimization: Only sharing data that is absolutely necessary for a service", "Privacy policy: Legal document explaining what data a company collects and how it is used", "DPDP Act: India's Digital Personal Data Protection Act governing data rights", "Tracking cookies: Small files tracking your online behavior across websites", "Data broker: Companies that collect and sell personal information"],
    types: [{ name: "Behavioral data", desc: "What you click, search, buy, and how long you spend on each page" }, { name: "Location data", desc: "Your physical movements tracked through your phone's GPS and Wi-Fi" }, { name: "Biometric data", desc: "Fingerprints, face recognition data, voice prints" }, { name: "Financial data", desc: "Purchase history, bank details, creditworthiness" }, { name: "Social graph", desc: "Your relationships, contacts, and social interactions" }],
    examples: ["A free app tracking your precise location 24/7 to sell your movement patterns to advertisers", "A quiz website collecting your name, email, and responses to sell to political campaigns", "Health and fitness app data sold to insurance companies, potentially affecting your premiums"],
    warnings: ["Apps requesting location access even when not in use", "Free services with no obvious business model (you are the product)", "Privacy policies that are vague about data sharing with 'partners'", "Account registrations requiring more information than logically necessary", "Social media platforms with very broad data collection permissions"],
    prevention: ["Read privacy policies — at minimum skim for data sharing and third-party sections", "Use privacy-focused browsers and search engines (Firefox, DuckDuckGo)", "Regularly audit and revoke app permissions you do not actively use", "Use temporary email addresses for non-essential registrations", "Enable privacy settings on all social media platforms"],
    myths: [{ myth: "'I have nothing to hide' so privacy does not matter", truth: "Privacy is about control, not hiding. Everyone has private information — medical, financial, relational — worth protecting." }, { myth: "Free services have no cost", truth: "Free services collect and monetize your personal data. You pay with your privacy." }, { myth: "Privacy settings guarantee your data is not collected", truth: "Privacy settings may limit how data is used but often cannot prevent collection entirely." }],
    takeaways: ["Your data has real value — treat it like a valuable asset", "Free services are usually paid for with your personal data", "Data minimization — share only what is necessary — is your most powerful privacy tool", "Know your rights under India's DPDP Act"],
   
  },
  {
    id: 15, title: "Cloud Security Basics", subtitle: "Keeping your data safe in the cloud", icon: Cloud,
    color: "#a855f7", bgColor: "rgba(168,85,247,0.1)", level: "advanced", xp: 155, duration: "35 min", category: "Advanced",
    intro: "Cloud computing stores your files, photos, and data on remote servers rather than your local device. Understanding cloud security helps you use these powerful services safely without exposing your data.",
    whyCare: "Students store assignments, research, personal photos, and sensitive documents on Google Drive, iCloud, and OneDrive. A misconfigured sharing setting or compromised account can expose all of this publicly.",
    concepts: ["Shared responsibility model: Cloud providers secure the infrastructure; you secure your data and access", "Access control: Managing who can view, edit, or share your cloud data", "Data encryption at rest: Data encrypted while stored on cloud servers", "Data encryption in transit: Data encrypted while being transferred", "Cloud misconfigurations: Improperly set permissions making private data public"],
    types: [{ name: "Public cloud misconfiguration", desc: "Accidentally making private files or folders publicly accessible" }, { name: "Compromised cloud account", desc: "Your cloud account accessed through stolen credentials" }, { name: "Insecure file sharing", desc: "Sharing sensitive documents with 'anyone with the link' settings" }, { name: "Shadow IT", desc: "Using unauthorized cloud services that bypass security policies" }, { name: "Third-party app access", desc: "Granting excessive permissions to apps connected to your cloud accounts" }],
    examples: ["A student inadvertently sets a Google Drive folder to 'anyone with link can view' including sensitive documents", "A university's cloud-stored student database exposed due to misconfigured access permissions", "Personal photos from iCloud exposed after account takeover through weak password and no MFA"],
    warnings: ["Files or folders shared with 'anyone on the internet'", "Unknown devices showing as connected to your cloud account", "Unusual storage usage you did not create", "Unfamiliar files or folders appearing in your cloud storage", "Third-party apps with broad access to your cloud account you do not use"],
    prevention: ["Enable MFA on all cloud accounts immediately", "Regularly review file and folder sharing settings", "Use 'specific people only' sharing instead of 'anyone with link'", "Periodically review and revoke third-party app access to cloud accounts", "Check account activity for unfamiliar device logins"],
    myths: [{ myth: "Cloud storage automatically keeps my data private", truth: "Cloud data privacy depends entirely on your sharing settings and account security." }, { myth: "Cloud providers are responsible for all my data security", truth: "Under the shared responsibility model, you are responsible for access control and data classification." }, { myth: "Deleted cloud files are gone immediately", truth: "Deleted files often remain in a 'Trash' or recycle bin for weeks and may persist in backups." }],
    takeaways: ["Enable MFA on every cloud account — it is the single most impactful protection", "Regularly audit who has access to your shared cloud files and folders", "The shared responsibility model means you are responsible for your data, not just the provider", "Use 'specific people' sharing over 'anyone with a link' for sensitive documents"],
    
  },
  {
    id: 16, title: "Cyber Hygiene", subtitle: "Daily habits for a safer digital life", icon: Activity,
    color: "#00ff9d", bgColor: "rgba(0,255,157,0.1)", level: "beginner", xp: 105, duration: "18 min", category: "Foundation",
    intro: "Cyber hygiene refers to the regular practices and habits that keep you secure online — much like personal hygiene keeps you physically healthy. Consistent small actions prevent major security incidents.",
    whyCare: "Most successful cyber attacks exploit poor cyber hygiene — outdated software, reused passwords, ignored updates. Students who build good digital habits early are protected throughout their lives.",
    concepts: ["Software updates: Patches that fix security vulnerabilities in your software and OS", "Security audit: Regular review of your accounts, passwords, and permissions", "Principle of least privilege: Only granting minimum necessary access to accounts and apps", "Digital footprint: The trail of data you leave from all online activity", "Incident response: Knowing what to do immediately if you are compromised"],
    types: [{ name: "Account hygiene", desc: "Regular password changes, MFA reviews, and removing unused accounts" }, { name: "Device hygiene", desc: "Keeping software updated, running security scans, managing storage" }, { name: "Network hygiene", desc: "Using secure connections, reviewing connected devices, checking router settings" }, { name: "Data hygiene", desc: "Organizing, encrypting, and safely deleting data you no longer need" }, { name: "Social hygiene", desc: "Reviewing privacy settings, minimizing what you share, cleaning up your digital footprint" }],
    examples: ["A student who updates their phone immediately receives security patches that prevent a known malware infection", "Regularly removing unused apps reduces attack surface and stops background data collection", "Running a password audit reveals 12 accounts still using a password leaked in a 2021 breach"],
    warnings: ["Notifications for software updates ignored for weeks or months", "Using the same password across 5+ accounts", "Not reviewing app permissions in over 6 months", "Unknown or unused apps still installed on your device", "Security notifications from accounts you have not checked in months"],
    prevention: ["Enable automatic updates for your OS and apps", "Conduct a monthly 5-minute security check (update, scan, review)", "Delete accounts and apps you no longer use", "Run a password audit every 6 months using your password manager", "Check HaveIBeenPwned.com regularly for new breach notifications"],
    myths: [{ myth: "Updates are just about new features — I can skip them", truth: "Security updates patch critical vulnerabilities. Unpatched systems are the primary malware infection vector." }, { myth: "Good cyber hygiene takes hours each week", truth: "5-10 minutes per month is enough for a solid routine: update, scan, check breach alerts." }, { myth: "Once secured, you do not need to check again", truth: "Security is ongoing. New threats emerge constantly and your situation changes — regular review is essential." }],
    takeaways: ["Enable auto-updates for all software — this alone prevents most malware infections", "Monthly 5-minute security checks are more effective than occasional major overhauls", "Delete accounts and apps you no longer use — they are unnecessary attack surfaces", "Cyber hygiene is a habit, not a one-time event"],
    
  },
  {
    id: 17, title: "Safe Social Media Usage", subtitle: "Protecting yourself and others on social platforms", icon: Users,
    color: "#00ff9d", bgColor: "rgba(0,255,157,0.1)", level: "beginner", xp: 115, duration: "22 min", category: "Foundation",
    intro: "Social media connects billions of people but also creates unique risks — oversharing enables social engineering, weak privacy settings expose personal data, and misinformation spreads rapidly. Smart social media use protects you and your community.",
    whyCare: "Students share enormous amounts of personal information on Instagram, Snapchat, and LinkedIn. This data is used by advertisers, data brokers, and criminals for profiling, targeting, and fraud.",
    concepts: ["OSINT: Open Source Intelligence — publicly available information used to learn about a target", "Social engineering: Using social media information to craft convincing phishing attacks", "Oversharing: Sharing information that reveals your location, schedule, or financial status", "Privacy settings: Controls over who sees your posts, profile, and personal information", "Digital permanence: Content you post online can persist even after deletion"],
    types: [{ name: "Account takeover", desc: "Gaining access to your social accounts through credential theft or social engineering" }, { name: "Catfishing", desc: "Creating a fake profile to deceive you emotionally or financially" }, { name: "Social engineering via OSINT", desc: "Using your public posts to craft convincing phishing attacks" }, { name: "Reputation damage", desc: "Screenshots and reposts of old content used to harm your reputation" }, { name: "Stalking/Doxxing", desc: "Using social media to locate and expose your personal information" }],
    examples: ["A student posts their daily college schedule, allowing someone to know exactly when their house is empty", "A criminal uses your public LinkedIn to craft a convincing spear phishing email from your 'university'", "Old social media posts from high school affecting college admissions or job applications"],
    warnings: ["Strangers sending friend requests with very few posts or connections", "Direct messages from unknown people offering gifts, jobs, or romantic interest", "Posts revealing your current location, home address, or daily routine", "Friend requests from someone you are 'already connected with' (account clone)", "Requests to share personal information through social media direct messages"],
    prevention: ["Set all social media profiles to private or friends-only", "Avoid posting your real-time location, home address, or daily routine", "Review your friend/follower lists regularly and remove unfamiliar accounts", "Enable login notifications and two-factor authentication on all social platforms", "Think before posting: would you be comfortable if your employer or parents saw this?"],
    myths: [{ myth: "Private accounts are completely secure", truth: "Friends can screenshot and share your private posts. 'Private' means fewer people see it, not that it is protected." }, { myth: "Deleting a post removes it from the internet", truth: "Screenshots, caches, and web archives can preserve deleted content indefinitely." }, { myth: "Accepting a friend request from a stranger is harmless", truth: "Unknown connections gain access to your private posts and can use that information to craft convincing attacks." }],
    takeaways: ["Treat every social media post as potentially permanent and public", "Real-time location sharing gives criminals knowledge of your physical whereabouts", "Enable MFA on all social accounts — they contain significant personal data", "Review privacy settings every 6 months as platforms frequently change defaults"],
    
  },
  {
    id: 18, title: "Real-World Cyber Incidents", subtitle: "Learning from history to build better defenses", icon: Target,
    color: "#ef4444", bgColor: "rgba(239,68,68,0.1)", level: "advanced", xp: 180, duration: "45 min", category: "Case Studies",
    intro: "Studying real cybersecurity incidents from a defensive perspective reveals patterns in how attacks occur, what made organizations and individuals vulnerable, and most importantly — what preventive measures would have stopped them.",
    whyCare: "Understanding real incidents turns abstract security concepts into concrete lessons. Every major breach teaches preventive techniques that protect you from similar attacks.",
    concepts: ["Attack timeline: The sequence of events from initial access to breach discovery", "Indicators of Compromise (IoC): Evidence that a breach has occurred", "Lateral movement: Attackers moving through a network after initial access", "Dwell time: How long attackers remain undetected in a compromised system", "Post-incident analysis: Examining what went wrong and how to prevent recurrence"],
    types: [{ name: "Data breach analysis", desc: "Examining how personal data was exposed and what controls failed" }, { name: "Ransomware incident study", desc: "Understanding attack vectors and why backup strategies matter" }, { name: "Phishing campaign analysis", desc: "Seeing how mass phishing campaigns are structured and detected" }, { name: "Social engineering case study", desc: "How human factors contributed to successful attacks" }, { name: "Supply chain attack", desc: "Understanding how trusted software can be compromised to attack users" }],
    examples: ["2017 WannaCry ransomware: Exploited unpatched Windows systems, affecting 200,000+ computers — prevented by prompt patching", "2021 Facebook breach: 533 million users' data exposed due to unpatched vulnerability — data scraped by attackers", "Aadhaar data leaks: Multiple incidents where API vulnerabilities allowed unauthorized access to citizen data"],
    warnings: ["The same attack patterns (unpatched software, weak passwords, phishing) appear in nearly every major breach", "Breaches are rarely discovered immediately — average dwell time is 207 days", "Most breaches involve multiple failures layered together — single points of failure are dangerous", "Small organizations (including educational institutions) are just as vulnerable as large corporations", "The human element (phishing, social engineering) is involved in 82% of breaches"],
    prevention: ["Apply the lessons from every incident: patch promptly, use MFA, train users to recognize phishing", "Never assume you are too small or unimportant to be targeted", "Develop an incident response plan before an incident occurs", "Test your own resilience through regular security reviews and backup tests", "Stay informed about current threats through reputable cybersecurity news sources"],
    myths: [{ myth: "Sophisticated attackers always use sophisticated technical methods", truth: "Most successful attacks use simple, well-documented techniques against known, unpatched vulnerabilities." }, { myth: "Breaches only happen to organizations with poor security teams", truth: "Even security-focused organizations get breached — the difference is in detection speed and response quality." }, { myth: "Major cybersecurity incidents are rare", truth: "Thousands of significant breaches occur annually — most go unreported or unnoticed by the public." }],
    takeaways: ["Patch promptly — the majority of successful attacks exploit known, patched vulnerabilities", "The human element is involved in 82% of breaches — awareness is your best defense", "Plan your incident response before you need it — being prepared dramatically reduces damage", "Every breach you learn from adds to your defensive knowledge"],
    
  }
]

// ─────────────────────────────────────────────
// BADGES
// ─────────────────────────────────────────────
const BADGES = [
  { id: "explorer", name: "Explorer", icon: "🔍", desc: "Completed your first lesson", threshold: 1, color: "#00d4ff" },
  { id: "defender", name: "Defender", icon: "🛡️", desc: "Completed 5 lessons", threshold: 5, color: "#00ff9d" },
  { id: "guardian", name: "Guardian", icon: "⚔️", desc: "Completed 10 lessons", threshold: 10, color: "#a855f7" },
  { id: "sentinel", name: "Sentinel", icon: "🏆", desc: "Completed all lessons", threshold: 18, color: "#f59e0b" },
  { id: "quiz-ace", name: "Quiz Ace", icon: "🎯", desc: "Scored 100% on any quiz", threshold: 0, color: "#ef4444" },
  { id: "streak-7", name: "Week Warrior", icon: "🔥", desc: "7-day learning streak", threshold: 0, color: "#f59e0b" },
]

const LEVEL_NAMES = ["Novice", "Explorer", "Learner", "Aware", "Defender", "Protector", "Guardian", "Sentinel", "Champion", "Cyber Expert"]

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────
function getLevel(xp: number) { return Math.min(9, Math.floor(xp / 200)) }
function getLevelName(xp: number) { return LEVEL_NAMES[getLevel(xp)] }
function getXpToNext(xp: number) { return (getLevel(xp) + 1) * 200 }
function getLevelProgress(xp: number) { const l = getLevel(xp); return ((xp - l * 200) / 200) * 100 }
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function selectQuizQuestions(questions: QuizQ[], count = 5): QuizQ[] { return shuffle(questions).slice(0, count) }

function checkPassword(pw: string) {
  const checks = {
    length: pw.length >= 12,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
    noCommon: !["password", "123456", "qwerty", "abc123", "letmein", "iloveyou"].some(c => pw.toLowerCase().includes(c))
  }
  const score = Object.values(checks).filter(Boolean).length
  const strength = score <= 2 ? "Very Weak" : score <= 3 ? "Weak" : score <= 4 ? "Fair" : score <= 5 ? "Strong" : "Very Strong"
  const color = score <= 2 ? "#ef4444" : score <= 3 ? "#f59e0b" : score <= 4 ? "#eab308" : score <= 5 ? "#00ff9d" : "#00d4ff"
  return { checks, score, strength, color, pct: (score / 6) * 100 }
}

// ─────────────────────────────────────────────
// REUSABLE COMPONENTS
// ─────────────────────────────────────────────
function GlassCard({ children, className = "", onClick, hoverable = false }: { children: React.ReactNode; className?: string; onClick?: () => void; hoverable?: boolean }) {
  return (
    <div onClick={onClick} className={`glass rounded-2xl p-6 ${hoverable ? "card-hover cursor-pointer" : ""} ${className}`}>
      {children}
    </div>
  )
}

function CyberBadge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-exo uppercase tracking-wide"
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}>
      {children}
    </span>
  )
}

function GlowButton({ children, onClick, variant = "primary", size = "md", className = "" }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "outline" | "danger"; size?: "sm" | "md" | "lg"; className?: string
}) {
  const base = "btn-cyber font-exo font-bold rounded-xl transition-all duration-300 flex items-center gap-2"
  const sizes = { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-base", lg: "px-8 py-4 text-lg" }
  const variants = {
    primary: "bg-[#00d4ff] text-[#020c1b] hover:bg-[#00b8e0] glow-cyan",
    secondary: "bg-[rgba(0,212,255,0.12)] text-[#00d4ff] border border-[#00d4ff33] hover:bg-[rgba(0,212,255,0.2)]",
    outline: "bg-transparent text-[#00d4ff] border-2 border-[#00d4ff44] hover:border-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)]",
    danger: "bg-[#ef4444] text-white hover:bg-[#dc2626] glow-red"
  }
  return (
    <button onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

function ProgressBar({ value, color = "#00d4ff", label }: { value: number; color?: string; label?: string }) {
  return (
    <div className="w-full">
      {label && <div className="flex justify-between text-xs text-[#8892b0] mb-1 font-mono-jet"><span>{label}</span><span>{Math.round(value)}%</span></div>}
      <div className="h-2 rounded-full bg-[#0d1f38] overflow-hidden">
        <div className="h-full rounded-full progress-bar-fill" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}, ${color}99)`, boxShadow: `0 0 8px ${color}66` }} />
      </div>
    </div>
  )
}

function SectionHeader({ title, subtitle, tag }: { title: string; subtitle?: string; tag?: string }) {
  return (
    <div className="text-center mb-12">
      {tag && <CyberBadge color="#00d4ff">{tag}</CyberBadge>}
      <h2 className="font-exo text-4xl font-bold mt-4 mb-3 text-glow-cyan" style={{ background: "linear-gradient(135deg, #00d4ff, #ffffff 60%, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {title}
      </h2>
      {subtitle && <p className="text-[#8892b0] text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  )
}

// ─────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────
function HeroSection({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const floatingIcons = [
    { icon: Lock, cls: "animate-float", style: { top: "8%", left: "12%" }, color: "#00d4ff" },
    { icon: Mail, cls: "animate-float-delay-1", style: { top: "15%", right: "14%" }, color: "#f59e0b" },
    { icon: Wifi, cls: "animate-float-delay-2", style: { bottom: "28%", left: "8%" }, color: "#00ff9d" },
    { icon: Bell, cls: "animate-float-delay-3", style: { bottom: "20%", right: "10%" }, color: "#a855f7" },
    { icon: Key, cls: "animate-float-delay-4", style: { top: "42%", left: "5%" }, color: "#00d4ff" },
    { icon: Smartphone, cls: "animate-float-delay-5", style: { top: "38%", right: "6%" }, color: "#ef4444" },
    { icon: Database, cls: "animate-float-delay-1", style: { bottom: "48%", right: "18%" }, color: "#00ff9d" },
    { icon: AlertTriangle, cls: "animate-float-delay-3", style: { bottom: "48%", left: "18%" }, color: "#f59e0b" },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #00d4ff, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8" style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5" style={{ background: "radial-gradient(circle, #00d4ff, transparent)" }} />
        <div className="scanline" />
      </div>

      {/* Floating icons */}
      {floatingIcons.map(({ icon: Icon, cls, style, color }, i) => (
        <div key={i} className={`absolute ${cls} hidden md:block`} style={style}>
          <div className="p-3 rounded-xl" style={{ background: `${color}15`, border: `1px solid ${color}33`, boxShadow: `0 0 15px ${color}22` }}>
            <Icon style={{ color, width: 22, height: 22 }} />
          </div>
        </div>
      ))}

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Central shield animation */}
        <div className="relative flex items-center justify-center mb-10">
          {/* Outer orbit ring */}
          <div className="absolute w-52 h-52 rounded-full border border-[#00d4ff15] animate-spin-slow" />
          <div className="absolute w-36 h-36 rounded-full border border-[#00d4ff25] animate-spin-slow-rev" />
          {/* Ping effect */}
          <div className="absolute w-28 h-28 rounded-full bg-[#00d4ff] opacity-5 animate-ping-slow" />
          {/* Central shield */}
          <div className="relative animate-pulse-glow rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(99,102,241,0.1))", border: "1px solid rgba(0,212,255,0.4)" }}>
            <ShieldCheck className="w-16 h-16 text-[#00d4ff] text-glow-cyan" />
          </div>
        </div>

        <div className="animate-fade-in-up">
          <div className="mb-4">
            <CyberBadge color="#00d4ff">Cybersecurity Awareness Platform</CyberBadge>
          </div>
          <h1 className="font-exo text-5xl md:text-7xl font-black mb-6 leading-tight"
            style={{ background: "linear-gradient(135deg, #ffffff 0%, #00d4ff 50%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Learn Cybersecurity<br />the Right Way.
          </h1>
          <p className="text-[#8892b0] text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Build real digital safety skills. Understand threats, recognize warning signs, and develop habits that protect you, your data, and your future. Awareness is your strongest shield.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlowButton onClick={() => onNavigate("lessons")} size="lg">
              <Play className="w-5 h-5" /> Start Learning
            </GlowButton>
            <GlowButton onClick={() => onNavigate("lessons")} variant="secondary" size="lg">
              <BookOpen className="w-5 h-5" /> Explore Lessons
            </GlowButton>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Lessons", value: "18", icon: BookOpen, color: "#00d4ff" },
            { label: "Quiz Questions", value: "144+", icon: Target, color: "#00ff9d" },
            { label: "XP Available", value: "2,625", icon: Zap, color: "#f59e0b" },
            { label: "Badges to Earn", value: "6", icon: Award, color: "#a855f7" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass rounded-xl p-4 text-center">
              <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
              <div className="font-exo text-2xl font-bold" style={{ color }}>{value}</div>
              <div className="text-[#8892b0] text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// WHY IT MATTERS
// ─────────────────────────────────────────────
function WhyMattersSection() {
  const stats = [
    { value: "91%", label: "of breaches start with phishing", icon: Mail, color: "#f59e0b" },
    { value: "80%", label: "involve compromised passwords", icon: Lock, color: "#ef4444" },
    { value: "207", label: "days avg. breach dwell time", icon: Activity, color: "#a855f7" },
    { value: "₹1.7L", label: "avg. individual fraud loss in India", icon: AlertTriangle, color: "#00ff9d" },
  ]
  const reasons = [
    { title: "Students Are Prime Targets", desc: "Young people are specifically targeted due to clean financial histories, reused passwords, and frequent use of unsecured public Wi-Fi.", icon: Target, color: "#ef4444" },
    { title: "Prevention is 1000x Easier", desc: "Developing safe digital habits now prevents years of financial loss, identity theft, and data breaches that are extremely difficult to recover from.", icon: ShieldCheck, color: "#00ff9d" },
    { title: "Your Digital Future Depends on It", desc: "Your academic records, career opportunities, financial health, and personal reputation are all connected to your digital security posture.", icon: TrendingUp, color: "#00d4ff" },
    { title: "Awareness Protects Others Too", desc: "When you know how to recognize threats, you protect not just yourself but your family, friends, and community from social engineering attacks that exploit trust.", icon: Users, color: "#a855f7" },
  ]
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <SectionHeader title="Why Cyber Awareness Matters" subtitle="The digital threat landscape is real, growing, and specifically targeting people like you." tag="The Stakes" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {stats.map(({ value, label, icon: Icon, color }) => (
          <GlassCard key={label} className="text-center">
            <Icon className="w-8 h-8 mx-auto mb-3" style={{ color }} />
            <div className="font-exo text-3xl font-black mb-1" style={{ color }}>{value}</div>
            <div className="text-[#8892b0] text-sm leading-snug">{label}</div>
          </GlassCard>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {reasons.map(({ title, desc, icon: Icon, color }) => (
          <GlassCard key={title} className="flex gap-5 items-start">
            <div className="p-3 rounded-xl flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}33` }}>
              <Icon className="w-7 h-7" style={{ color }} />
            </div>
            <div>
              <h3 className="font-exo text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-[#8892b0] leading-relaxed text-sm">{desc}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// LEARNING ROADMAP
// ─────────────────────────────────────────────
function RoadmapSection({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const tiers = [
    {
      level: "Beginner", color: "#00d4ff", icon: GraduationCap, range: "Lessons 1–9",
      title: "Digital Safety Foundations",
      topics: ["Intro to Cybersecurity", "Password Security & MFA", "Phishing & Social Engineering", "Safe Browsing & Wi-Fi Security", "Email Security & Cyber Hygiene", "Safe Social Media Usage"],
      outcome: "Understand the basic threat landscape and establish essential safe digital habits that protect you daily."
    },
    {
      level: "Intermediate", color: "#f59e0b", icon: Radio, range: "Lessons 10–14",
      title: "Threat Recognition & Protection",
      topics: ["Malware & Ransomware Defense", "Mobile & Payment Security", "Identity Theft Prevention", "Dark Web Awareness", "Data Privacy & Rights"],
      outcome: "Recognize specific attack types, understand how criminals operate, and implement targeted protection strategies."
    },
    {
      level: "Advanced", color: "#a855f7", icon: ShieldCheck, range: "Lessons 15–18",
      title: "Advanced Awareness & Analysis",
      topics: ["Cloud Security Fundamentals", "AI Scams & Deepfakes", "Real-World Incident Analysis", "Comprehensive Cyber Defense"],
      outcome: "Analyze sophisticated threats, understand emerging technologies, and apply defense-in-depth thinking."
    }
  ]
  return (
    <section className="py-24 px-6" style={{ background: "linear-gradient(180deg, transparent, rgba(0,212,255,0.03), transparent)" }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader title="Your Learning Roadmap" subtitle="A structured progression from digital basics to advanced threat awareness — at your own pace." tag="Learning Path" />
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <div key={tier.level} className="relative">
              {i < tiers.length - 1 && (
                <div className="hidden md:block absolute top-16 -right-3 z-10">
                  <ChevronRight className="w-6 h-6 text-[#8892b0]" />
                </div>
              )}
              <GlassCard className="h-full flex flex-col" style={{ borderColor: `${tier.color}33` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl" style={{ background: `${tier.color}15`, border: `1px solid ${tier.color}33` }}>
                    <tier.icon className="w-6 h-6" style={{ color: tier.color }} />
                  </div>
                  <div>
                    <CyberBadge color={tier.color}>{tier.level}</CyberBadge>
                    <div className="text-[#8892b0] text-xs mt-1 font-mono-jet">{tier.range}</div>
                  </div>
                </div>
                <h3 className="font-exo text-xl font-bold text-white mb-3">{tier.title}</h3>
                <ul className="space-y-2 mb-4 flex-1">
                  {tier.topics.map(t => (
                    <li key={t} className="flex items-center gap-2 text-[#8892b0] text-sm">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: tier.color }} />
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="text-[#8892b0] text-xs leading-relaxed border-t border-[#ffffff10] pt-4">{tier.outcome}</p>
              </GlassCard>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <GlowButton onClick={() => onNavigate("lessons")} size="lg">
            <ArrowRight className="w-5 h-5" /> Begin Your Journey
          </GlowButton>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// GAMIFICATION PREVIEW
// ─────────────────────────────────────────────
function GamificationPreview({ student }: { student: StudentData }) {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <SectionHeader title="Track Your Progress" subtitle="Every lesson, quiz, and challenge earns XP, badges, and skills on your way to becoming a Cyber Sentinel." tag="Gamification" />
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-[#f59e0b]" />
            <h3 className="font-exo text-lg font-bold text-white">XP & Levels</h3>
          </div>
          <div className="font-exo text-4xl font-black text-[#f59e0b] mb-1">{student.xp} XP</div>
          <div className="text-[#8892b0] text-sm mb-4">Level: <span className="text-white font-bold">{getLevelName(student.xp)}</span></div>
          <ProgressBar value={getLevelProgress(student.xp)} color="#f59e0b" label={`${student.xp} / ${getXpToNext(student.xp)} XP`} />
          <div className="mt-4 space-y-2">
            {["Complete lessons (+100 XP)", "Pass quizzes (+50 XP bonus)", "Perfect score (+25 XP bonus)"].map(t => (
              <div key={t} className="flex items-center gap-2 text-[#8892b0] text-xs">
                <Check className="w-3 h-3 text-[#f59e0b]" />{t}
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-[#a855f7]" />
            <h3 className="font-exo text-lg font-bold text-white">Badges & Achievements</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map(b => {
              const earned = student.badges.includes(b.id)
              return (
                <div key={b.id} title={b.desc} className={`text-center p-2 rounded-xl transition-all ${earned ? "" : "opacity-30 grayscale"}`}
                  style={{ background: earned ? `${b.color}15` : "rgba(255,255,255,0.03)", border: `1px solid ${earned ? b.color : "#ffffff11"}44` }}>
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <div className="text-xs font-bold font-exo" style={{ color: earned ? b.color : "#8892b0" }}>{b.name}</div>
                </div>
              )
            })}
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-6 h-6 text-[#ef4444]" />
            <h3 className="font-exo text-lg font-bold text-white">Learning Streak</h3>
          </div>
          <div className="font-exo text-5xl font-black text-[#ef4444] mb-1">{student.streak}</div>
          <div className="text-[#8892b0] text-sm mb-4">Day streak</div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="h-8 rounded-md" style={{ background: i < student.streak ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }} />
            ))}
          </div>
          <div className="mt-4 text-[#8892b0] text-xs">Complete at least one lesson per day to maintain your streak.</div>
        </GlassCard>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// LESSONS PAGE
// ─────────────────────────────────────────────
function LessonsPage({ student, onSelectLesson }: { student: StudentData; onSelectLesson: (id: number) => void }) {
  const [filter, setFilter] = useState<"all" | LessonLevel>("all")
  const [searchQ, setSearchQ] = useState("")
  const filtered = LESSONS.filter(l => {
    const matchLevel = filter === "all" || l.level === filter
    const matchSearch = l.title.toLowerCase().includes(searchQ.toLowerCase()) || l.category.toLowerCase().includes(searchQ.toLowerCase())
    return matchLevel && matchSearch
  })
  const levelColors: Record<LessonLevel, string> = { beginner: "#00d4ff", intermediate: "#f59e0b", advanced: "#a855f7" }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <SectionHeader title="All Lessons" subtitle="18 comprehensive awareness modules covering every major cybersecurity domain." tag="Learning Library" />

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8892b0]" />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search lessons..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0d1f38] border border-[#00d4ff22] text-[#ccd6f6] placeholder-[#8892b0] focus:outline-none focus:border-[#00d4ff] text-sm" />
        </div>
        <div className="flex gap-2">
          {(["all", "beginner", "intermediate", "advanced"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-3 rounded-xl text-sm font-exo font-bold capitalize transition-all ${filter === f ? "bg-[#00d4ff] text-[#020c1b]" : "bg-[#0d1f38] text-[#8892b0] hover:text-white border border-[#ffffff11]"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(lesson => {
          const completed = student.completedLessons.includes(lesson.id)
          const score = student.quizScores[lesson.id]
          const LIcon = lesson.icon
          return (
            <div key={lesson.id} onClick={() => onSelectLesson(lesson.id)}
              className="lesson-card glass rounded-2xl p-5 cursor-pointer card-hover border border-transparent group"
              style={{ borderColor: completed ? `${lesson.color}33` : undefined }}>
              <div className="flex items-start justify-between mb-4">
                <div className="lesson-icon p-3 rounded-xl" style={{ background: lesson.bgColor, border: `1px solid ${lesson.color}33` }}>
                  <LIcon className="w-6 h-6" style={{ color: lesson.color }} />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <CyberBadge color={levelColors[lesson.level]}>{lesson.level}</CyberBadge>
                  {completed && <span className="flex items-center gap-1 text-xs text-[#00ff9d] font-mono-jet"><CheckCircle className="w-3 h-3" /> Done</span>}
                </div>
              </div>
              <h3 className="font-exo text-lg font-bold text-white mb-1 group-hover:text-[#00d4ff] transition-colors">{lesson.title}</h3>
              <p className="text-[#8892b0] text-sm mb-4 line-clamp-2">{lesson.subtitle}</p>
              <div className="flex items-center justify-between text-xs text-[#8892b0]">
                <span className="flex items-center gap-1 font-mono-jet"><Zap className="w-3 h-3 text-[#f59e0b]" />{lesson.xp} XP</span>
                <span className="flex items-center gap-1 font-mono-jet"><Calendar className="w-3 h-3" />{lesson.duration}</span>
                {score !== undefined && <span className="font-mono-jet" style={{ color: score >= 75 ? "#00ff9d" : "#ef4444" }}>{score}% quiz</span>}
              </div>
              {completed && <div className="mt-3"><ProgressBar value={score ?? 100} color={lesson.color} /></div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// LESSON DETAIL
// ─────────────────────────────────────────────
interface ApiQuizQuestion {
  index: number
  q: string
  options: string[]
}

interface QuizResult {
  index: number
  correct: boolean
  correctAnswer: number
  explanation: string
}

function LessonDetail({ lessonId, student, onBack, onComplete }: {
  lessonId: number; student: StudentData; onBack: () => void
  onComplete: (id: number, score: number, xpEarned: number, updatedUser: any) => void
}) {
  const lesson = LESSONS.find(l => l.id === lessonId)!
  const [tab, setTab] = useState<"content" | "quiz">("content")
  const [quizState, setQuizState] = useState<"idle" | "loading" | "active" | "submitting" | "done">("idle")
  const [questions, setQuestions] = useState<ApiQuizQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [quizError, setQuizError] = useState("")
  const [results, setResults] = useState<QuizResult[]>([])
  const [finalScore, setFinalScore] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [contentTab, setContentTab] = useState<"intro" | "concepts" | "warnings" | "prevention" | "myths">("intro")

  const startQuiz = async () => {
    setQuizError("")
    setQuizState("loading")
    setTab("quiz")
    try {
      const data = await apiFetch(`/quiz/${lesson.id}/start`)
      setQuestions(data.questions)
      setCurrent(0)
      setSelected(null)
      setSelectedAnswers([])
      setResults([])
      setQuizState("active")
    } catch (err: any) {
      setQuizError(err.message || "Could not load quiz. Please try again.")
      setQuizState("idle")
    }
  }

  const handleAnswer = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
  }

  const nextQuestion = async () => {
    const newAnswers = [...selectedAnswers, selected as number]
    setSelectedAnswers(newAnswers)

    if (current + 1 >= questions.length) {
      setQuizState("submitting")
      setQuizError("")
      try {
        const questionIndices = questions.map(q => q.index)
        const data = await apiFetch(`/quiz/${lesson.id}/submit`, {
          method: "POST",
          body: JSON.stringify({ questionIndices, answers: newAnswers }),
        })
        setResults(data.results)
        setFinalScore(data.score)
        setXpEarned(data.xpEarned)
        setQuizState("done")
        onComplete(lesson.id, data.score, data.xpEarned, data.user)
      } catch (err: any) {
        setQuizError(err.message || "Could not submit quiz. Please try again.")
        setQuizState("active")
      }
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
    }
  }

  const LIcon = lesson.icon

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8892b0] hover:text-[#00d4ff] transition-colors mb-6 font-exo">
        <ChevronLeft className="w-4 h-4" /> Back to Lessons
      </button>

      <GlassCard className="mb-6" style={{ borderColor: `${lesson.color}33` }}>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="p-4 rounded-2xl flex-shrink-0" style={{ background: lesson.bgColor, border: `1px solid ${lesson.color}33` }}>
            <LIcon className="w-10 h-10" style={{ color: lesson.color }} />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <CyberBadge color={lesson.color}>{lesson.level}</CyberBadge>
              <CyberBadge color="#8892b0">{lesson.category}</CyberBadge>
            </div>
            <h1 className="font-exo text-3xl font-black text-white">{lesson.title}</h1>
            <p className="text-[#8892b0] mt-1">{lesson.subtitle}</p>
          </div>
          <div className="flex gap-6 text-center">
            <div><div className="font-exo text-xl font-bold text-[#f59e0b]">{lesson.xp}</div><div className="text-[#8892b0] text-xs">XP</div></div>
            <div><div className="font-exo text-xl font-bold text-white">{lesson.duration}</div><div className="text-[#8892b0] text-xs">Duration</div></div>
          </div>
        </div>
      </GlassCard>

      <div className="flex gap-1 mb-6 glass rounded-xl p-1">
        {(["content", "quiz"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3 rounded-lg font-exo font-bold text-sm capitalize transition-all ${tab === t ? "bg-[#00d4ff] text-[#020c1b]" : "text-[#8892b0] hover:text-white"}`}>
            {t === "content" ? "📚 Lesson Content" : "🎯 Quiz & Assessment"}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(["intro", "concepts", "warnings", "prevention", "myths"] as const).map(t => (
              <button key={t} onClick={() => setContentTab(t)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-exo font-bold capitalize transition-all ${contentTab === t ? "bg-[rgba(0,212,255,0.15)] text-[#00d4ff] border border-[#00d4ff33]" : "text-[#8892b0] hover:text-white bg-[#0d1f38] border border-transparent"}`}>
                {t}
              </button>
            ))}
          </div>

          {contentTab === "intro" && (
            <div className="space-y-5">
              <GlassCard>
                <h3 className="font-exo text-lg font-bold text-[#00d4ff] mb-3 flex items-center gap-2"><Info className="w-5 h-5" /> Introduction</h3>
                <p className="text-[#8892b0] leading-relaxed">{lesson.intro}</p>
              </GlassCard>
              <GlassCard>
                <h3 className="font-exo text-lg font-bold text-[#f59e0b] mb-3 flex items-center gap-2"><Lightbulb className="w-5 h-5" /> Why Should You Care?</h3>
                <p className="text-[#8892b0] leading-relaxed">{lesson.whyCare}</p>
              </GlassCard>
              <GlassCard>
                <h3 className="font-exo text-lg font-bold text-[#a855f7] mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Types & Categories</h3>
                <div className="space-y-3">
                  {lesson.types.map(t => (
                    <div key={t.name} className="flex gap-3">
                      <div className="w-1 bg-[#a855f7] rounded-full flex-shrink-0" />
                      <div><span className="text-white font-bold text-sm">{t.name}:</span> <span className="text-[#8892b0] text-sm">{t.desc}</span></div>
                    </div>
                  ))}
                </div>
              </GlassCard>
              <GlassCard>
                <h3 className="font-exo text-lg font-bold text-[#00ff9d] mb-3 flex items-center gap-2"><Target className="w-5 h-5" /> Key Takeaways</h3>
                <div className="space-y-2">
                  {lesson.takeaways.map(t => (
                    <div key={t} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#00ff9d] flex-shrink-0 mt-0.5" />
                      <span className="text-[#8892b0] text-sm">{t}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
              <GlassCard>
                <h3 className="font-exo text-lg font-bold text-[#ef4444] mb-3 flex items-center gap-2"><Globe className="w-5 h-5" /> Real-World Examples</h3>
                <div className="space-y-2">
                  {lesson.examples.map(e => (
                    <div key={e} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] flex-shrink-0 mt-2" />
                      <span className="text-[#8892b0] text-sm">{e}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {contentTab === "concepts" && (
            <GlassCard>
              <h3 className="font-exo text-xl font-bold text-[#00d4ff] mb-5">Key Concepts</h3>
              <div className="space-y-4">
                {lesson.concepts.map((c, i) => {
                  const [term, ...def] = c.split(": ")
                  return (
                    <div key={i} className="p-4 rounded-xl" style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)" }}>
                      <div className="font-exo font-bold text-white mb-1">{term}</div>
                      <div className="text-[#8892b0] text-sm">{def.join(": ")}</div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          )}

          {contentTab === "warnings" && (
            <GlassCard>
              <h3 className="font-exo text-xl font-bold text-[#f59e0b] mb-5 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Warning Signs to Watch For</h3>
              <div className="space-y-3">
                {lesson.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)" }}>
                    <AlertCircle className="w-4 h-4 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                    <span className="text-[#8892b0] text-sm">{w}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {contentTab === "prevention" && (
            <GlassCard>
              <h3 className="font-exo text-xl font-bold text-[#00ff9d] mb-5 flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Prevention Checklist</h3>
              <div className="space-y-3">
                {lesson.prevention.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.15)" }}>
                    <Check className="w-4 h-4 text-[#00ff9d] flex-shrink-0 mt-0.5" />
                    <span className="text-[#8892b0] text-sm">{p}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {contentTab === "myths" && (
            <div className="space-y-4">
              {lesson.myths.map((m, i) => (
                <GlassCard key={i}>
                  <div className="flex items-start gap-3 mb-3">
                    <XCircle className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[#ef4444] font-bold text-sm font-exo mb-1">MYTH</div>
                      <div className="text-white text-sm">"{m.myth}"</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pl-8">
                    <CheckCircle className="w-5 h-5 text-[#00ff9d] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[#00ff9d] font-bold text-sm font-exo mb-1">TRUTH</div>
                      <div className="text-[#8892b0] text-sm">{m.truth}</div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <GlowButton onClick={startQuiz} size="lg">
              <Target className="w-5 h-5" /> Take the Quiz
            </GlowButton>
          </div>
        </>
      )}

      {tab === "quiz" && (
        <div>
          {quizState === "idle" && (
            <GlassCard className="text-center py-12">
              <Target className="w-16 h-16 text-[#00d4ff] mx-auto mb-4" />
              <h3 className="font-exo text-2xl font-bold text-white mb-3">Ready for the Quiz?</h3>
              <p className="text-[#8892b0] mb-2">5 randomized questions.</p>
              <p className="text-[#8892b0] mb-6">You need <span className="text-[#00ff9d] font-bold">75% or higher</span> to pass and earn your full XP reward.</p>
              {quizError && <p className="text-[#ef4444] mb-4 text-sm">{quizError}</p>}
              <GlowButton onClick={startQuiz} size="lg"><Play className="w-5 h-5" /> Start Quiz</GlowButton>
            </GlassCard>
          )}

          {quizState === "loading" && (
            <GlassCard className="text-center py-12">
              <p className="text-[#8892b0]">Loading quiz questions...</p>
            </GlassCard>
          )}

          {(quizState === "active" || quizState === "submitting") && questions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="font-mono-jet text-[#8892b0] text-sm">Question {current + 1} of {questions.length}</div>
                <div className="flex gap-1">{questions.map((_, i) => (
                  <div key={i} className={`w-8 h-1 rounded-full ${i < current ? "bg-[#00ff9d]" : i === current ? "bg-[#00d4ff]" : "bg-[#0d1f38]"}`} />
                ))}</div>
              </div>

              <GlassCard className="mb-5">
                <div className="flex items-start gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-[rgba(0,212,255,0.1)] flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-[#00d4ff]" />
                  </div>
                  <p className="font-exo text-lg font-bold text-white leading-snug">{questions[current].q}</p>
                </div>
                <div className="space-y-3">
                  {questions[current].options.map((opt, i) => {
                    const style = selected === i
                      ? "border-[#00d4ff] bg-[rgba(0,212,255,0.1)] text-[#00d4ff]"
                      : "border-[#ffffff11] text-[#8892b0] hover:border-[#00d4ff44] hover:text-white"
                    return (
                      <button key={i} onClick={() => handleAnswer(i)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all font-exo ${style} ${selected === null ? "cursor-pointer" : "cursor-default"}`}>
                        <span className="font-mono-jet text-xs mr-3 opacity-60">{String.fromCharCode(65 + i)}.</span>{opt}
                      </button>
                    )
                  })}
                </div>
                <p className="text-[#8892b0] text-xs mt-4">Correct answers and explanations are revealed after you submit the full quiz.</p>
              </GlassCard>
              {quizError && <p className="text-[#ef4444] mb-4 text-sm text-center">{quizError}</p>}
              {selected !== null && (
                <div className="text-center">
                  <GlowButton onClick={nextQuestion} className={quizState === "submitting" ? "opacity-60 pointer-events-none" : ""}>
                    {quizState === "submitting"
                      ? <>Submitting...</>
                      : current + 1 < questions.length
                        ? <><ArrowRight className="w-4 h-4" /> Next Question</>
                        : <><Check className="w-4 h-4" /> Finish Quiz</>}
                  </GlowButton>
                </div>
              )}
            </div>
          )}

          {quizState === "done" && (
            <div>
              <GlassCard className="text-center py-10 mb-6" style={{ borderColor: finalScore >= 75 ? "#00ff9d33" : "#ef444433" }}>
                <div className="text-6xl mb-4">{finalScore >= 75 ? "🎉" : "📚"}</div>
                <div className="font-exo text-5xl font-black mb-2" style={{ color: finalScore >= 75 ? "#00ff9d" : "#ef4444" }}>{finalScore}%</div>
                <div className="font-exo text-xl font-bold text-white mb-2">{finalScore >= 75 ? "Excellent! You Passed!" : "Keep Practicing!"}</div>
                <p className="text-[#8892b0] mb-6">
                  You answered {results.filter(r => r.correct).length} of {results.length} correctly.
                </p>
                {xpEarned > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
                    <Zap className="w-4 h-4 text-[#f59e0b]" />
                    <span className="text-[#f59e0b] font-bold font-mono-jet">+{xpEarned} XP earned!</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <GlowButton onClick={startQuiz} variant="secondary"><RotateCcw className="w-4 h-4" /> Try Again</GlowButton>
                  <GlowButton onClick={() => setTab("content")}><BookOpen className="w-4 h-4" /> Review Lesson</GlowButton>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-exo text-lg font-bold text-white mb-4">Question Results</h3>
                <div className="space-y-2">
                  {questions.map((q, i) => {
                    const result = results.find(r => r.index === q.index)
                    if (!result) return null
                    return (
                      <div key={i} className="p-3 rounded-xl" style={{ background: result.correct ? "rgba(0,255,157,0.05)" : "rgba(239,68,68,0.05)", border: `1px solid ${result.correct ? "rgba(0,255,157,0.15)" : "rgba(239,68,68,0.15)"}` }}>
                        <div className="flex items-start gap-3 mb-2">
                          {result.correct ? <CircleCheck className="w-4 h-4 text-[#00ff9d] flex-shrink-0 mt-0.5" /> : <CircleX className="w-4 h-4 text-[#ef4444] flex-shrink-0 mt-0.5" />}
                          <span className="text-sm text-[#8892b0]">{q.q}</span>
                        </div>
                        <div className="pl-7 text-xs text-[#8892b0]">
                          Correct answer: <span className="text-white">{q.options[result.correctAnswer]}</span>
                          <div className="mt-1">{result.explanation}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────
function DashboardPage({ student }: { student: StudentData }) {
  const completed = student.completedLessons.length
  const totalLessons = LESSONS.length
  const avgScore = Object.values(student.quizScores).length > 0
    ? Math.round(Object.values(student.quizScores).reduce((a, b) => a + b, 0) / Object.values(student.quizScores).length)
    : 0

  const skillData = [
    { subject: "Phishing Defense", A: student.completedLessons.includes(3) ? 85 : 30 },
    { subject: "Password Security", A: student.completedLessons.includes(2) ? 90 : 25 },
    { subject: "Mobile Safety", A: student.completedLessons.includes(10) ? 75 : 20 },
    { subject: "Threat Recognition", A: completed >= 5 ? 80 : 15 },
    { subject: "Privacy Awareness", A: student.completedLessons.includes(14) ? 85 : 30 },
    { subject: "Incident Response", A: completed >= 12 ? 70 : 10 },
  ]

  const progressData = Array.from({ length: 8 }, (_, i) => ({
    week: `Wk ${i + 1}`, xp: Math.min(student.xp, (i + 1) * 50 + Math.random() * 30)
  }))

  const lessonProgress = LESSONS.slice(0, 8).map(l => ({
    name: l.title.split(" ").slice(0, 2).join(" "),
    progress: student.completedLessons.includes(l.id) ? 100 : 0,
    color: l.color
  }))

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <SectionHeader title="Student Dashboard" subtitle={`Welcome back, ${student.name}. Here is your learning overview.`} tag="My Progress" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total XP", value: student.xp, icon: Zap, color: "#f59e0b", unit: "" },
          { label: "Lessons Done", value: `${completed}/${totalLessons}`, icon: BookOpen, color: "#00d4ff", unit: "" },
          { label: "Quiz Accuracy", value: avgScore, icon: Target, color: "#00ff9d", unit: "%" },
          { label: "Current Streak", value: student.streak, icon: Flame, color: "#ef4444", unit: " days" },
        ].map(({ label, value, icon: Icon, color, unit }) => (
          <GlassCard key={label} className="text-center">
            <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }} />
            <div className="font-exo text-3xl font-black" style={{ color }}>{value}{unit}</div>
            <div className="text-[#8892b0] text-sm mt-1">{label}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <GlassCard>
          <h3 className="font-exo text-lg font-bold text-white mb-1">Level Progress</h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="font-exo text-2xl font-black text-[#00d4ff]">{getLevelName(student.xp)}</div>
            <div className="text-[#8892b0] text-sm font-mono-jet">Level {getLevel(student.xp)}</div>
          </div>
          <ProgressBar value={getLevelProgress(student.xp)} color="#00d4ff" label={`${student.xp} / ${getXpToNext(student.xp)} XP to next level`} />
        </GlassCard>
        <GlassCard>
          <h3 className="font-exo text-lg font-bold text-white mb-4">Earned Badges</h3>
          <div className="flex flex-wrap gap-3">
            {BADGES.map(b => {
              const earned = student.badges.includes(b.id)
              return (
                <div key={b.id} title={b.desc} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${earned ? "" : "opacity-30"}`}
                  style={{ background: `${b.color}15`, border: `1px solid ${b.color}33` }}>
                  <span>{b.icon}</span>
                  <span className="font-exo text-xs font-bold" style={{ color: b.color }}>{b.name}</span>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <GlassCard>
          <h3 className="font-exo text-lg font-bold text-white mb-4">Awareness Skill Map</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={skillData}>
              <PolarGrid stroke="rgba(0,212,255,0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#8892b0", fontSize: 10, fontFamily: "Inter" }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#8892b0", fontSize: 8 }} />
              <RadarViz dataKey="A" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard>
          <h3 className="font-exo text-lg font-bold text-white mb-4">XP Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={progressData}>
              <CartesianGrid stroke="rgba(0,212,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill: "#8892b0", fontSize: 10 }} />
              <YAxis tick={{ fill: "#8892b0", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 8, color: "#ccd6f6" }} />
              <Area type="monotone" dataKey="xp" stroke="#00d4ff" fill="url(#xpGrad)" strokeWidth={2} />
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="font-exo text-lg font-bold text-white mb-5">Lesson Completion Status</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LESSONS.map(l => {
            const done = student.completedLessons.includes(l.id)
            const score = student.quizScores[l.id]
            const LIcon = l.icon
            return (
              <div key={l.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: done ? `${l.color}08` : "rgba(255,255,255,0.02)", border: `1px solid ${done ? l.color + "22" : "#ffffff08"}` }}>
                <LIcon className="w-4 h-4 flex-shrink-0" style={{ color: done ? l.color : "#8892b0" }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold font-exo truncate" style={{ color: done ? l.color : "#8892b0" }}>{l.title}</div>
                  {score !== undefined && <div className="text-xs font-mono-jet" style={{ color: score >= 75 ? "#00ff9d" : "#ef4444" }}>{score}%</div>}
                </div>
                {done ? <CheckCircle className="w-4 h-4 text-[#00ff9d] flex-shrink-0" /> : <div className="w-4 h-4 rounded-full border border-[#8892b0] flex-shrink-0" />}
              </div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}

// ─────────────────────────────────────────────
// CYBER ID PAGE
// ─────────────────────────────────────────────
function CyberIDPage({ student }: { student: StudentData }) {
  const completed = student.completedLessons.length
  const avgScore = Object.values(student.quizScores).length > 0
    ? Math.round(Object.values(student.quizScores).reduce((a, b) => a + b, 0) / Object.values(student.quizScores).length) : 0
  const cyberScore = Math.min(100, Math.round((completed / 18) * 50 + (avgScore / 100) * 30 + Math.min(20, student.streak * 2)))
  const awarenessLevel = completed === 0 ? "Novice" : completed < 5 ? "Explorer" : completed < 10 ? "Defender" : completed < 15 ? "Guardian" : "Sentinel"
  const badgeIcon = completed === 0 ? "🔰" : completed < 5 ? "🔍" : completed < 10 ? "🛡️" : completed < 15 ? "⚔️" : "🏆"
  const badgeColor = completed === 0 ? "#8892b0" : completed < 5 ? "#00d4ff" : completed < 10 ? "#00ff9d" : completed < 15 ? "#a855f7" : "#f59e0b"

  


  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <SectionHeader title="Your Digital Cyber ID" subtitle="A verified record of your cybersecurity awareness journey." tag="Cyber ID" />

      <div className="relative max-w-2xl mx-auto">
        <div className="glass-strong rounded-3xl overflow-hidden" style={{ border: `2px solid ${badgeColor}44` }}>
          {/* Header bar */}
          <div className="p-6 pb-4" style={{ background: `linear-gradient(135deg, ${badgeColor}22, transparent)` }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-6 h-6" style={{ color: badgeColor }} />
                  <span className="font-exo font-bold text-sm tracking-widest uppercase" style={{ color: badgeColor }}>Cybersecurity Awareness Platform</span>
                </div>
                <div className="font-mono-jet text-[#8892b0] text-xs">DIGITAL CYBER ID • {student.joinDate}</div>
              </div>
              <div className="text-right">
                <div className="text-4xl mb-1">{badgeIcon}</div>
                <div className="font-exo text-sm font-bold" style={{ color: badgeColor }}>{awarenessLevel}</div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            {/* Student info */}
            <div className="border-t border-b mb-6 py-4" style={{ borderColor: `${badgeColor}22` }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl" style={{ background: `${badgeColor}22`, border: `2px solid ${badgeColor}44` }}>
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-exo text-2xl font-black text-white">{student.name}</h2>
                  <div className="font-mono-jet text-[#8892b0] text-sm">ID: CAP-{student.joinDate.replace(/-/g, "")}</div>
                  <CyberBadge color={badgeColor}>{awarenessLevel} Level</CyberBadge>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Lessons Completed", value: `${completed}/18`, color: "#00d4ff" },
                { label: "Quiz Accuracy", value: `${avgScore}%`, color: "#00ff9d" },
                { label: "Cyber Safety Score", value: `${cyberScore}/100`, color: badgeColor },
                { label: "XP Earned", value: student.xp, color: "#f59e0b" },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center p-3 rounded-xl" style={{ background: `${color}08`, border: `1px solid ${color}22` }}>
                  <div className="font-exo text-xl font-black" style={{ color }}>{value}</div>
                  <div className="text-[#8892b0] text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Cyber score bar */}
            <div className="mb-6">
              <ProgressBar value={cyberScore} color={badgeColor} label="Cyber Safety Score" />
            </div>

            {/* Badges earned */}
            <div className="mb-6">
              <div className="text-[#8892b0] text-xs font-mono-jet mb-2">ACHIEVEMENTS EARNED</div>
              <div className="flex flex-wrap gap-2">
                {BADGES.filter(b => student.badges.includes(b.id)).map(b => (
                  <div key={b.id} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: `${b.color}15`, border: `1px solid ${b.color}44`, color: b.color }}>
                    {b.icon} {b.name}
                  </div>
                ))}
                {student.badges.length === 0 && <span className="text-[#8892b0] text-xs italic">Complete lessons to earn badges</span>}
              </div>
            </div>

            {/* QR and verification */}
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[#8892b0] text-xs font-mono-jet mb-1">LAST ACHIEVEMENT</div>
                <div className="font-exo text-white font-bold">{student.joinDate}</div>
                <div className="text-[#8892b0] text-xs mt-2">This ID verifies completion of cybersecurity<br />awareness training on this platform.</div>
              </div>
              <div className="text-right">
                <div className="text-[#8892b0] text-xs font-mono-jet mb-2">VERIFICATION QR</div>
                <QRCodeSVG
  value={`https://cyberaware-hub.netlify.app/verify?name=${encodeURIComponent(student.name)}&joined=${student.joinDate}&xp=${student.xp}`}
  size={80}
  bgColor="transparent"
  fgColor="#00d4ff"
/>
              </div>
            </div>
          </div>
        </div>

        {/* Download button */}
        <div className="text-center mt-6">
          <GlowButton variant="secondary">
            <Download className="w-4 h-4" /> Download Cyber ID
          </GlowButton>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// INTERACTIVE TOOLS PAGE
// ─────────────────────────────────────────────
function ToolsPage() {
  const [activeTool, setActiveTool] = useState<"password" | "phishing" | "scam">("password")
  const [pw, setPw] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [phishingStep, setPhishingStep] = useState(0)
  const [phishingScore, setPhishingScore] = useState(0)
  const [phishingDone, setPhishingDone] = useState(false)
  const [scamRevealed, setScamRevealed] = useState([false, false, false])

  const pwResult = pw ? checkPassword(pw) : null

  const phishingEmails = [
    {
      from: "security@amaz0n.com", subject: "⚠️ Your account access is suspended!",
      body: "Dear Customer, We have detected unusual activity on your Amazon account. Your account will be permanently suspended in 24 hours unless you verify your information immediately. Click here: http://amazon-verify.suspicious.ru/account",
      clues: ["Sender domain 'amaz0n.com' uses zero instead of 'o'", "Urgent threat language (24-hour suspension)", "Generic greeting 'Dear Customer'", "Suspicious URL domain (not amazon.com)", "Excessive urgency is a manipulation tactic"],
      isPhish: true
    },
    {
      from: "noreply@github.com", subject: "Your SSH key has been added",
      body: "Hey there! A new public key was recently added to your account. If you believe this was done in error, please visit https://github.com/settings/keys immediately. The GitHub Team.",
      clues: ["Sender domain is exactly github.com", "URL matches the sender's domain", "No urgent threats or excessive pressure", "Specific technical action described", "Personalized (not 'Dear Customer')"],
      isPhish: false
    },
    {
      from: "scholarships@india-govt-edu.in", subject: "CONGRATULATIONS! You have been selected for ₹50,000 scholarship",
      body: "You have been SELECTED for the National Student Scholarship Program worth ₹50,000! To claim your scholarship, pay a small processing fee of ₹500 via UPI immediately. Offer valid for 2 hours only! UPI ID: scholarshipfund@paytm",
      clues: ["Unknown domain not matching any government portal", "Advance fee fraud (pay ₹500 to get ₹50,000)", "Extreme time pressure (2 hours only)", "All-caps urgency is a manipulation tactic", "Legitimate scholarships never require upfront payment"],
      isPhish: true
    },
  ]

  const scamMessages = [
    { text: "Hi! You have won a brand new iPhone 15 Pro! You are our 1000th visitor today! Click the link to claim your prize now!", verdict: "scam", reason: "Unsolicited prize notifications requiring you to click a link are almost always scams. Legitimate prize notifications have verifiable claim processes." },
    { text: "Your OTP for login to SBI NetBanking is 482917. This OTP is valid for 10 minutes. Do NOT share this OTP with anyone including bank employees.", verdict: "legitimate", reason: "This is a standard bank OTP message with a clear warning not to share it — consistent with legitimate messages from SBI." },
    { text: "Dear Customer, ICICI Bank: Your account will be blocked today. To avoid, update your KYC immediately: [suspicious link]. Ignore at your own risk.", verdict: "scam", reason: "Banks do not threaten immediate account blocking via SMS links. The threatening language and link are classic phishing tactics." },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <SectionHeader title="Interactive Learning Tools" subtitle="Practice recognizing threats with these hands-on security exercises." tag="Practice" />

      <div className="flex gap-2 mb-8">
        {(["password", "phishing", "scam"] as const).map(t => (
          <button key={t} onClick={() => setActiveTool(t)}
            className={`flex-1 py-3 rounded-xl font-exo font-bold text-sm capitalize transition-all ${activeTool === t ? "bg-[#00d4ff] text-[#020c1b]" : "glass text-[#8892b0] hover:text-white"}`}>
            {t === "password" ? "🔐 Password Checker" : t === "phishing" ? "🎣 Phishing Spotter" : "🕵️ Scam Analyzer"}
          </button>
        ))}
      </div>

      {activeTool === "password" && (
        <GlassCard>
          <h3 className="font-exo text-xl font-bold text-white mb-2">Password Strength Checker</h3>
          <p className="text-[#8892b0] text-sm mb-6">Test the strength of a password. Your input is never stored or transmitted.</p>

          <div className="relative mb-6">
            <input type={showPw ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)}
              placeholder="Type a password to analyze..."
              className="w-full px-4 py-4 pr-12 rounded-xl bg-[#0d1f38] border border-[#00d4ff22] text-white font-mono-jet placeholder-[#8892b0] focus:outline-none focus:border-[#00d4ff] text-sm" />
            <button onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8892b0] hover:text-white">
              {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {pwResult && (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-exo font-bold text-lg" style={{ color: pwResult.color }}>{pwResult.strength}</span>
                  <span className="font-mono-jet text-[#8892b0] text-sm">{pwResult.score}/6 criteria</span>
                </div>
                <ProgressBar value={pwResult.pct} color={pwResult.color} />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { key: "length", label: "12+ characters" },
                  { key: "upper", label: "Uppercase letters" },
                  { key: "lower", label: "Lowercase letters" },
                  { key: "number", label: "Numbers" },
                  { key: "special", label: "Special characters (!@#$)" },
                  { key: "noCommon", label: "Not a common word" },
                ].map(({ key, label }) => {
                  const passed = pwResult.checks[key as keyof typeof pwResult.checks]
                  return (
                    <div key={key} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: passed ? "rgba(0,255,157,0.05)" : "rgba(239,68,68,0.05)" }}>
                      {passed ? <CheckCircle className="w-4 h-4 text-[#00ff9d]" /> : <XCircle className="w-4 h-4 text-[#ef4444]" />}
                      <span className="text-sm font-exo" style={{ color: passed ? "#00ff9d" : "#ef4444" }}>{label}</span>
                    </div>
                  )
                })}
              </div>

              <div className="p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <div className="font-exo text-sm font-bold text-[#a855f7] mb-2">💡 Tip</div>
                <p className="text-[#8892b0] text-sm">
                  {pwResult.score < 4
                    ? "Try a long passphrase like 'correct-horse-battery-staple-2024!' — easy to remember, very hard to crack."
                    : pwResult.score < 6
                      ? "Good start! Add special characters and ensure it is at least 12 characters long."
                      : "Excellent password! Use a password manager to generate and store unique passwords like this for every account."}
                </p>
              </div>
            </>
          )}
        </GlassCard>
      )}

      {activeTool === "phishing" && (
        <div>
          {!phishingDone ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="font-exo text-[#8892b0] text-sm">Email {phishingStep + 1} of {phishingEmails.length}</div>
                <div className="font-mono-jet text-[#00d4ff] text-sm">Score: {phishingScore}/{phishingEmails.length}</div>
              </div>
              <GlassCard className="mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                {/* Fake email UI */}
                <div className="bg-[#050f1e] rounded-xl p-4 mb-4 border border-[#ffffff08]">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center text-lg flex-shrink-0">
                      {phishingEmails[phishingStep].from.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-bold">{phishingEmails[phishingStep].from}</div>
                      <div className="text-[#8892b0] text-xs">Subject: {phishingEmails[phishingStep].subject}</div>
                    </div>
                  </div>
                  <div className="text-[#ccd6f6] text-sm leading-relaxed border-t border-[#ffffff08] pt-3">
                    {phishingEmails[phishingStep].body}
                  </div>
                </div>
                <p className="text-[#8892b0] text-sm mb-4 font-exo">Is this email a phishing attempt?</p>
                <div className="flex gap-3">
                  <GlowButton onClick={() => {
                    const correct = phishingEmails[phishingStep].isPhish
                    if (correct) setPhishingScore(s => s + 1)
                    if (phishingStep + 1 >= phishingEmails.length) setPhishingDone(true)
                    else setPhishingStep(s => s + 1)
                  }} variant="danger" className="flex-1 justify-center">
                    🎣 Phishing!
                  </GlowButton>
                  <GlowButton onClick={() => {
                    const correct = !phishingEmails[phishingStep].isPhish
                    if (correct) setPhishingScore(s => s + 1)
                    if (phishingStep + 1 >= phishingEmails.length) setPhishingDone(true)
                    else setPhishingStep(s => s + 1)
                  }} variant="secondary" className="flex-1 justify-center">
                    ✅ Legitimate
                  </GlowButton>
                </div>
              </GlassCard>
              <GlassCard>
                <div className="font-exo text-sm font-bold text-[#00d4ff] mb-2">🔍 What to look for:</div>
                <div className="space-y-1">
                  {phishingEmails[phishingStep].clues.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#8892b0]">
                      <Info className="w-3 h-3 text-[#00d4ff] flex-shrink-0 mt-0.5" /> {c}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          ) : (
            <GlassCard className="text-center py-10">
              <div className="text-5xl mb-4">{phishingScore === phishingEmails.length ? "🏆" : phishingScore >= 2 ? "👍" : "📚"}</div>
              <div className="font-exo text-4xl font-black text-[#00d4ff] mb-2">{phishingScore}/{phishingEmails.length}</div>
              <div className="font-exo text-xl font-bold text-white mb-4">
                {phishingScore === phishingEmails.length ? "Perfect Phishing Detector!" : phishingScore >= 2 ? "Good Awareness!" : "Keep Practicing!"}
              </div>
              <p className="text-[#8892b0] mb-6">Phishing recognition is a skill that improves with practice. Review the lesson on Phishing & Social Engineering for more tips.</p>
              <GlowButton onClick={() => { setPhishingStep(0); setPhishingScore(0); setPhishingDone(false) }}>
                <RotateCcw className="w-4 h-4" /> Try Again
              </GlowButton>
            </GlassCard>
          )}
        </div>
      )}

      {activeTool === "scam" && (
        <div className="space-y-5">
          <p className="text-[#8892b0] text-sm">Analyze these messages and identify which are scams and which are legitimate.</p>
          {scamMessages.map((msg, i) => (
            <GlassCard key={i}>
              <div className="p-4 rounded-xl bg-[#050f1e] border border-[#ffffff08] mb-4 font-mono-jet text-sm text-[#ccd6f6]">
                "{msg.text}"
              </div>
              {!scamRevealed[i] ? (
                <div className="flex gap-3">
                  <GlowButton onClick={() => setScamRevealed(r => { const n = [...r]; n[i] = true; return n })} variant="danger" size="sm">🚫 Scam</GlowButton>
                  <GlowButton onClick={() => setScamRevealed(r => { const n = [...r]; n[i] = true; return n })} variant="secondary" size="sm">✅ Legitimate</GlowButton>
                </div>
              ) : (
                <div className="p-4 rounded-xl" style={{ background: msg.verdict === "scam" ? "rgba(239,68,68,0.08)" : "rgba(0,255,157,0.08)", border: `1px solid ${msg.verdict === "scam" ? "rgba(239,68,68,0.25)" : "rgba(0,255,157,0.25)"}` }}>
                  <div className="font-exo font-bold mb-2" style={{ color: msg.verdict === "scam" ? "#ef4444" : "#00ff9d" }}>
                    {msg.verdict === "scam" ? "🚫 This is a SCAM" : "✅ This is LEGITIMATE"}
                  </div>
                  <p className="text-[#8892b0] text-sm">{msg.reason}</p>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// RESOURCES PAGE
// ─────────────────────────────────────────────
function ResourcesPage() {
  const resources = [
    { category: "India Cybercrime Reporting", items: [
      { name: "National Cyber Crime Reporting Portal", url: "cybercrime.gov.in", desc: "Official portal to report cybercrime in India", icon: Globe },
      { name: "Cyber Dost (MHA)", url: "cyberdost.gov.in", desc: "Cybersecurity awareness by Ministry of Home Affairs", icon: ShieldCheck },
      { name: "Cyber Swachhta Kendra", url: "cyberswachhtakendra.gov.in", desc: "Free malware removal and botnet cleaning tools", icon: Activity },
    ]},
    { category: "Free Security Tools", items: [
      { name: "HaveIBeenPwned", url: "haveibeenpwned.com", desc: "Check if your email appeared in data breaches", icon: Search },
      { name: "Bitwarden (Free)", url: "bitwarden.com", desc: "Open-source, free password manager", icon: Lock },
      { name: "Authy / Google Authenticator", url: "authy.com", desc: "Free MFA authenticator apps", icon: Smartphone },
    ]},
    { category: "Learning & Reference", items: [
      { name: "CERT-In", url: "cert-in.org.in", desc: "India's Computer Emergency Response Team", icon: Server },
      { name: "StaySafeOnline.org", url: "staysafeonline.org", desc: "National Cybersecurity Alliance awareness resources", icon: BookOpen },
      { name: "CISA Free Resources", url: "cisa.gov", desc: "US Cybersecurity and Infrastructure Security Agency", icon: Database },
    ]},
  ]
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <SectionHeader title="Resources & References" subtitle="Trusted tools, official portals, and free resources for cybersecurity awareness." tag="Resources" />
      <div className="space-y-8">
        {resources.map(({ category, items }) => (
          <div key={category}>
            <h3 className="font-exo text-xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 rounded-full bg-[#00d4ff]" />{category}
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {items.map(({ name, url, desc, icon: Icon }) => (
                <GlassCard key={name} className="hover-glow">
                  <Icon className="w-6 h-6 text-[#00d4ff] mb-3" />
                  <h4 className="font-exo font-bold text-white text-sm mb-1">{name}</h4>
                  <p className="text-[#8892b0] text-xs mb-3">{desc}</p>
                  <div className="flex items-center gap-1 text-[#00d4ff] text-xs font-mono-jet">
                    <ExternalLink className="w-3 h-3" />{url}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        ))}
      </div>

      <GlassCard className="mt-10" style={{ borderColor: "#f59e0b33" }}>
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-[#f59e0b] flex-shrink-0" />
          <div>
            <h3 className="font-exo text-lg font-bold text-[#f59e0b] mb-2">Emergency Cyber Helplines</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Cybercrime Helpline (India)", number: "1930" },
                { label: "Women Helpline", number: "181" },
                { label: "Police Emergency", number: "112" },
                { label: "Cyber Dost Twitter/X", number: "@CyberDost" },
              ].map(({ label, number }) => (
                <div key={label} className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#f59e0b]" />
                  <span className="text-[#8892b0] text-sm">{label}:</span>
                  <span className="font-mono-jet text-white font-bold text-sm">{number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

// ─────────────────────────────────────────────
// ABOUT & CONTACT PAGE
// ─────────────────────────────────────────────
function AboutPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <SectionHeader title="About This Platform" subtitle="A student-focused cybersecurity awareness learning environment." tag="About" />
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <GlassCard>
          <ShieldCheck className="w-10 h-10 text-[#00d4ff] mb-4" />
          <h3 className="font-exo text-xl font-bold text-white mb-3">Our Mission</h3>
          <p className="text-[#8892b0] leading-relaxed">To empower students with the knowledge and practical awareness needed to navigate the digital world safely. Every lesson is designed around understanding threats and building preventive habits — never offensive techniques.</p>
        </GlassCard>
        <GlassCard>
          <Users className="w-10 h-10 text-[#a855f7] mb-4" />
          <h3 className="font-exo text-xl font-bold text-white mb-3">Built For Students</h3>
          <p className="text-[#8892b0] leading-relaxed">Plain language, relatable examples, and student-specific scenarios. This platform is designed to be accessible to anyone with no prior security background while providing genuinely useful, practical knowledge.</p>
        </GlassCard>
        <GlassCard>
          <BookOpen className="w-10 h-10 text-[#00ff9d] mb-4" />
          <h3 className="font-exo text-xl font-bold text-white mb-3">What We Cover</h3>
          <p className="text-[#8892b0] leading-relaxed">18 comprehensive awareness modules covering the full spectrum of digital threats students face — from password security and phishing to AI deepfakes and UPI payment fraud.</p>
        </GlassCard>
        <GlassCard>
          <Award className="w-10 h-10 text-[#f59e0b] mb-4" />
          <h3 className="font-exo text-xl font-bold text-white mb-3">Ethical Commitment</h3>
          <p className="text-[#8892b0] leading-relaxed">This platform never teaches hacking techniques, exploit development, or attack execution. Every module focuses exclusively on recognition, prevention, and responsible digital citizenship.</p>
        </GlassCard>
      </div>

      <SectionHeader title="Contact Us" subtitle="Questions, feedback, or suggestions? We would love to hear from you." tag="Contact" />
      {sent ? (
        <GlassCard className="text-center py-10">
          <CheckCircle className="w-16 h-16 text-[#00ff9d] mx-auto mb-4" />
          <h3 className="font-exo text-xl font-bold text-white mb-2">Message Sent!</h3>
          <p className="text-[#8892b0]">Thank you for reaching out. We will respond within 24-48 hours.</p>
        </GlassCard>
      ) : (
        <GlassCard className="max-w-2xl mx-auto">
          <div className="space-y-4">
            {[
              { key: "name", label: "Your Name", placeholder: "Enter your name", type: "text" },
              { key: "email", label: "Email Address", placeholder: "your@email.com", type: "email" },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-[#8892b0] text-sm mb-2 font-exo">{label}</label>
                <input type={type} value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl bg-[#0d1f38] border border-[#00d4ff22] text-[#ccd6f6] placeholder-[#8892b0] focus:outline-none focus:border-[#00d4ff] text-sm" />
              </div>
            ))}
            <div>
              <label className="block text-[#8892b0] text-sm mb-2 font-exo">Message</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Share your thoughts, questions, or feedback..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-[#0d1f38] border border-[#00d4ff22] text-[#ccd6f6] placeholder-[#8892b0] focus:outline-none focus:border-[#00d4ff] text-sm resize-none" />
            </div>
            <GlowButton onClick={() => setSent(true)} className="w-full justify-center">
              <MessageSquare className="w-4 h-4" /> Send Message
            </GlowButton>
          </div>
        </GlassCard>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
function Navbar({ currentPage, onNavigate, student }: { currentPage: Page; onNavigate: (p: Page) => void; student: StudentData }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "lessons", label: "Lessons", icon: BookOpen },
    { id: "tools", label: "Tools", icon: Terminal },
    { id: "dashboard", label: "Dashboard", icon: BarChart2 },
    { id: "cyber-id", label: "Cyber ID", icon: Fingerprint },
    { id: "resources", label: "Resources", icon: Database },
    { id: "about", label: "About", icon: Info },
  ]
  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-[#00d4ff12]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[rgba(0,212,255,0.15)] border border-[rgba(0,212,255,0.3)]">
              <ShieldCheck className="w-5 h-5 text-[#00d4ff]" />
            </div>
            <span className="font-exo font-black text-white text-lg hidden sm:block">Cyber<span className="text-[#00d4ff]">Aware</span></span>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => onNavigate(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-exo font-bold transition-all ${currentPage === id || (currentPage === "lesson-detail" && id === "lessons") ? "bg-[rgba(0,212,255,0.15)] text-[#00d4ff]" : "text-[#8892b0] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 glass rounded-lg px-3 py-1.5">
              <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span className="font-mono-jet text-[#f59e0b] text-xs font-bold">{student.xp} XP</span>
            </div>
            <button onClick={() => setMobileOpen(o => !o)} className="lg:hidden p-2 text-[#8892b0] hover:text-white">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden glass-strong border-t border-[#00d4ff12] px-6 py-4">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { onNavigate(id); setMobileOpen(false) }}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-exo font-bold transition-all ${currentPage === id ? "bg-[rgba(0,212,255,0.15)] text-[#00d4ff]" : "text-[#8892b0] hover:text-white"}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <footer className="border-t border-[#00d4ff12] mt-20 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-6 h-6 text-[#00d4ff]" />
              <span className="font-exo font-black text-xl text-white">Cyber<span className="text-[#00d4ff]">Aware</span></span>
            </div>
            <p className="text-[#8892b0] text-sm max-w-xs">Empowering students with cybersecurity awareness for a safer digital future. Ethical, educational, and always defensive.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {[
              { title: "Learn", links: [{ l: "All Lessons", p: "lessons" as Page }, { l: "Practice Tools", p: "tools" as Page }, { l: "Dashboard", p: "dashboard" as Page }] },
              { title: "Platform", links: [{ l: "Cyber ID", p: "cyber-id" as Page }, { l: "Resources", p: "resources" as Page }, { l: "About", p: "about" as Page }] },
              { title: "Emergency", links: [{ l: "Report Cybercrime: 1930", p: "resources" as Page }, { l: "cybercrime.gov.in", p: "resources" as Page }] },
            ].map(({ title, links }) => (
              <div key={title}>
                <div className="font-exo font-bold text-white text-sm mb-3">{title}</div>
                <div className="space-y-2">
                  {links.map(({ l, p }) => (
                    <button key={l} onClick={() => onNavigate(p)} className="block text-[#8892b0] hover:text-[#00d4ff] text-sm transition-colors text-left">{l}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-[#ffffff08] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[#8892b0] text-sm">© 2025 CyberAware Platform. For educational purposes only.</div>
          <div className="flex items-center gap-2 text-[#8892b0] text-xs">
            <div className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
            This platform never teaches offensive security techniques.
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("auth")
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [student, setStudent] = useState<StudentData | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const topRef = useRef<HTMLDivElement>(null)

  // On app load, check if a token already exists and try to restore the session
  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken()
      if (!token) {
        setCheckingSession(false)
        return
      }
      try {
        const data = await apiFetch("/progress/me")
        // Backend returns { user, lessons } — adapt into StudentData shape
        const completedLessons = data.lessons
          .filter((l: any) => l.completed)
          .map((l: any) => l.lessonId)
        const quizScores: Record<number, number> = {}
        data.lessons.forEach((l: any) => {
          quizScores[l.lessonId] = l.bestScore
        })

        setStudent({
          name: data.user.name,
          xp: data.user.xp,
          completedLessons,
          quizScores,
          streak: data.user.streak,
          badges: data.user.badges,
          joinDate: data.user.joinDate,
        })
        setPage("home")
      } catch (err) {
        // Token invalid/expired — clear it and show login
        clearToken()
      } finally {
        setCheckingSession(false)
      }
    }
    restoreSession()
  }, [])

  const handleAuthSuccess = (user: any) => {
    setStudent({
      name: user.name,
      xp: user.xp,
      completedLessons: [],
      quizScores: {},
      streak: user.streak,
      badges: user.badges,
      joinDate: user.joinDate,
    })
    setPage("home")
  }

  const handleLogout = () => {
    clearToken()
    setStudent(null)
    setPage("auth")
  }

  const navigate = (p: Page) => {
    setPage(p)
    if (p !== "lesson-detail") setSelectedLesson(null)
    topRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const selectLesson = (id: number) => {
    setSelectedLesson(id)
    setPage("lesson-detail")
    topRef.current?.scrollIntoView({ behavior: "smooth" })
  }
   const handleLessonComplete = (lessonId: number, score: number, xpEarned: number, updatedUser: any) => {
  setStudent(prev => {
    if (!prev) return prev
    const newCompleted = score >= 75 && !prev.completedLessons.includes(lessonId)
      ? [...prev.completedLessons, lessonId]
      : prev.completedLessons
    const newScores = { ...prev.quizScores, [lessonId]: Math.max(prev.quizScores[lessonId] ?? 0, score) }
    return {
      ...prev,
      completedLessons: newCompleted,
      quizScores: newScores,
      xp: updatedUser.xp,
      badges: updatedUser.badges,
      streak: updatedUser.streak,
    }
  })
}
   

  // Still checking for an existing session — show a simple loading state
  if (checkingSession) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>
  }

  // No logged-in user — show the auth screen only
  if (!student) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      </>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
      <div ref={topRef} className="min-h-screen bg-background text-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
        <Navbar currentPage={page} onNavigate={navigate} student={student} />

        <main>
          {page === "home" && (
            <>
              <HeroSection onNavigate={navigate} />
              <WhyMattersSection />
              <RoadmapSection onNavigate={navigate} />
              <GamificationPreview student={student} />
              <section className="py-16 px-6 text-center" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.05), rgba(99,102,241,0.05))" }}>
                <div className="max-w-2xl mx-auto">
                  <h2 className="font-exo text-4xl font-black text-white mb-4">Ready to Build Your Cyber Shield?</h2>
                  <p className="text-[#8892b0] mb-8">Join students who are taking digital safety seriously. Start with any lesson — no experience needed.</p>
                  <GlowButton onClick={() => navigate("lessons")} size="lg"><Sparkles className="w-5 h-5" /> Start Learning Now</GlowButton>
                </div>
              </section>
            </>
          )}
          {page === "lessons" && <LessonsPage student={student} onSelectLesson={selectLesson} />}
          {page === "lesson-detail" && selectedLesson !== null && (
            <LessonDetail lessonId={selectedLesson} student={student} onBack={() => navigate("lessons")} onComplete={handleLessonComplete} />
          )}
          {page === "dashboard" && <DashboardPage student={student} />}
          {page === "cyber-id" && <CyberIDPage student={student} />}
          {page === "tools" && <ToolsPage />}
          {page === "resources" && <ResourcesPage />}
          {page === "about" && <AboutPage />}
        </main>

        <Footer onNavigate={navigate} />
      </div>
    </>
  )
}