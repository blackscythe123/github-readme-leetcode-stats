"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/handler.ts
var handler_exports = {};
__export(handler_exports, {
  default: () => handler
});
module.exports = __toCommonJS(handler_exports);

// src/types.ts
var ALL_SECTIONS = [
  "profile",
  "solved",
  "streak",
  "skills",
  "heatmap"
];
var RenderableError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "RenderableError";
  }
  code;
};

// src/params.ts
function first(v) {
  return Array.isArray(v) ? v[0] : v;
}
var CANONICAL_SECTION_ORDER = [
  "profile",
  "solved",
  "streak",
  "skills",
  "languages",
  "heatmap"
];
var VALID_SECTIONS = new Set(CANONICAL_SECTION_ORDER);
function parseSections(raw) {
  if (raw === void 0 || raw.trim() === "") {
    return [...ALL_SECTIONS];
  }
  const picked = /* @__PURE__ */ new Set();
  for (const token of raw.split(",")) {
    const cleaned = token.trim().toLowerCase();
    if (VALID_SECTIONS.has(cleaned)) {
      picked.add(cleaned);
    }
  }
  if (picked.size === 0) {
    return [...ALL_SECTIONS];
  }
  return CANONICAL_SECTION_ORDER.filter((s) => picked.has(s));
}
function normalizeThemeName(raw) {
  if (raw === void 0 || raw.trim() === "") return "default";
  return raw.trim().toLowerCase().replace(/_/g, "-");
}
function parseBoolFlag(raw) {
  return raw === "true";
}
var DEFAULT_BORDER_RADIUS = 4.5;
var MIN_BORDER_RADIUS = 0;
var MAX_BORDER_RADIUS = 60;
function parseBorderRadius(raw) {
  if (raw === void 0) return DEFAULT_BORDER_RADIUS;
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return DEFAULT_BORDER_RADIUS;
  return Math.min(MAX_BORDER_RADIUS, Math.max(MIN_BORDER_RADIUS, n));
}
var DEFAULT_TOP_N = 12;
var MIN_TOP_N = 1;
var MAX_TOP_N = 12;
function parseTopN(raw) {
  if (raw === void 0) return DEFAULT_TOP_N;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n)) return DEFAULT_TOP_N;
  return Math.min(MAX_TOP_N, Math.max(MIN_TOP_N, n));
}
var COLOR_KEYS = [
  "background",
  "border",
  "stroke",
  "ring",
  "fire",
  "currStreakNum",
  "sideNums",
  "currStreakLabel",
  "sideLabels",
  "dates",
  "excludeDaysLabel"
];
var HEX_RE = /^([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
var GRADIENT_RE = /^-?\d{1,3}(,[0-9a-fA-F]{3,8}){2,}$/;
var NAMED_CSS_COLORS = /* @__PURE__ */ new Set([
  "aliceblue",
  "antiquewhite",
  "aqua",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blanchedalmond",
  "blue",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgray",
  "darkgreen",
  "darkgrey",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkslategrey",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
  "dimgray",
  "dimgrey",
  "dodgerblue",
  "firebrick",
  "floralwhite",
  "forestgreen",
  "fuchsia",
  "gainsboro",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "grey",
  "green",
  "greenyellow",
  "honeydew",
  "hotpink",
  "indianred",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavenderblush",
  "lawngreen",
  "lemonchiffon",
  "lightblue",
  "lightcoral",
  "lightcyan",
  "lightgoldenrodyellow",
  "lightgray",
  "lightgreen",
  "lightgrey",
  "lightpink",
  "lightsalmon",
  "lightseagreen",
  "lightskyblue",
  "lightslategray",
  "lightslategrey",
  "lightsteelblue",
  "lightyellow",
  "lime",
  "limegreen",
  "linen",
  "magenta",
  "maroon",
  "mediumaquamarine",
  "mediumblue",
  "mediumorchid",
  "mediumpurple",
  "mediumseagreen",
  "mediumslateblue",
  "mediumspringgreen",
  "mediumturquoise",
  "mediumvioletred",
  "midnightblue",
  "mintcream",
  "mistyrose",
  "moccasin",
  "navajowhite",
  "navy",
  "oldlace",
  "olive",
  "olivedrab",
  "orange",
  "orangered",
  "orchid",
  "palegoldenrod",
  "palegreen",
  "paleturquoise",
  "palevioletred",
  "papayawhip",
  "peachpuff",
  "peru",
  "pink",
  "plum",
  "powderblue",
  "purple",
  "rebeccapurple",
  "red",
  "rosybrown",
  "royalblue",
  "saddlebrown",
  "salmon",
  "sandybrown",
  "seagreen",
  "seashell",
  "sienna",
  "silver",
  "skyblue",
  "slateblue",
  "slategray",
  "slategrey",
  "snow",
  "springgreen",
  "steelblue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "wheat",
  "white",
  "whitesmoke",
  "yellow",
  "yellowgreen"
]);
function validateColorValue(raw, allowGradient) {
  const value = raw.trim();
  if (value === "") return void 0;
  const hexCandidate = value.startsWith("#") ? value.slice(1) : value;
  if (HEX_RE.test(hexCandidate)) {
    return "#" + hexCandidate;
  }
  if (allowGradient && GRADIENT_RE.test(value)) {
    return value;
  }
  const lower = value.toLowerCase();
  if (NAMED_CSS_COLORS.has(lower)) {
    return lower;
  }
  return void 0;
}
function parseColorOverrides(query) {
  const overrides = {};
  for (const key of COLOR_KEYS) {
    const raw = first(query[key]);
    if (raw === void 0) continue;
    const validated = validateColorValue(raw, key === "background");
    if (validated !== void 0) {
      overrides[key] = validated;
    }
  }
  return overrides;
}
function parseParams(query) {
  const sections = parseSections(first(query.sections));
  const theme = normalizeThemeName(first(query.theme));
  const hideBorder = parseBoolFlag(first(query.hide_border));
  const transparent = parseBoolFlag(first(query.transparent));
  const disableAnimations = parseBoolFlag(first(query.disable_animations));
  const shortNumbers = parseBoolFlag(first(query.short_numbers));
  const borderRadius = parseBorderRadius(first(query.border_radius));
  const topSkills = parseTopN(first(query.top_skills));
  const topLangs = parseTopN(first(query.top_langs));
  const colorOverrides = parseColorOverrides(query);
  if (transparent) {
    colorOverrides.background = "#0000";
  }
  const output = first(query.type) === "json" ? "json" : "svg";
  return {
    sections,
    theme,
    hideBorder,
    transparent,
    borderRadius,
    colorOverrides,
    disableAnimations,
    shortNumbers,
    topSkills,
    topLangs,
    output
  };
}

// src/leetcode.ts
var GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";
var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
var REQUEST_HEADERS = {
  "Content-Type": "application/json",
  Referer: "https://leetcode.com",
  Origin: "https://leetcode.com",
  "User-Agent": USER_AGENT
};
var BLOCKED_MESSAGE = "LeetCode is currently blocking requests. Try again soon.";
var MAX_AVATAR_BYTES = 60 * 1024;
var QUERY = `query userProfile($username: String!) {
  allQuestionsCount {
    difficulty
    count
  }
  matchedUser(username: $username) {
    profile {
      ranking
      userAvatar
      realName
    }
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
      totalSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    tagProblemCounts {
      advanced {
        tagName
        problemsSolved
      }
      intermediate {
        tagName
        problemsSolved
      }
      fundamental {
        tagName
        problemsSolved
      }
    }
    languageProblemCount {
      languageName
      problemsSolved
    }
    userCalendar {
      activeYears
      streak
      totalActiveDays
      submissionCalendar
    }
  }
}`;
var CALENDAR_QUERY = `query userCalendarForYear($username: String!, $year: Int) {
  matchedUser(username: $username) {
    userCalendar(year: $year) {
      submissionCalendar
    }
  }
}`;
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function retryJitterMs() {
  return 300 + Math.random() * 500;
}
function blockedError() {
  return new RenderableError(BLOCKED_MESSAGE, 502);
}
function isGraphQLEnvelope(value) {
  return typeof value === "object" && value !== null;
}
async function postGraphQL(query, variables) {
  const maxAttempts = 2;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let response;
    try {
      response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: REQUEST_HEADERS,
        body: JSON.stringify({ query, variables })
      });
    } catch {
      if (attempt < maxAttempts) {
        await sleep(retryJitterMs());
        continue;
      }
      throw blockedError();
    }
    if (response.status >= 500) {
      if (attempt < maxAttempts) {
        await sleep(retryJitterMs());
        continue;
      }
      throw blockedError();
    }
    if (response.status === 403 || response.status === 429) {
      throw blockedError();
    }
    if (!response.ok) {
      throw blockedError();
    }
    let body;
    try {
      body = await response.json();
    } catch {
      throw blockedError();
    }
    if (!isGraphQLEnvelope(body) || body.data === void 0) {
      throw blockedError();
    }
    return body.data;
  }
  throw blockedError();
}
function pickDifficultyCount(rows, difficulty) {
  const row = rows?.find((r) => r.difficulty === difficulty);
  return typeof row?.count === "number" && Number.isFinite(row.count) ? row.count : 0;
}
function pickTotalSubmissions(rows) {
  const row = rows?.find((r) => r.difficulty === "All");
  return typeof row?.submissions === "number" && Number.isFinite(row.submissions) ? row.submissions : 0;
}
function buildSolved(allQuestionsCount, submitStatsGlobal) {
  const ac = submitStatsGlobal?.acSubmissionNum;
  const totals = allQuestionsCount;
  const easy = {
    solved: pickDifficultyCount(ac, "Easy"),
    total: pickDifficultyCount(totals, "Easy")
  };
  const medium = {
    solved: pickDifficultyCount(ac, "Medium"),
    total: pickDifficultyCount(totals, "Medium")
  };
  const hard = {
    solved: pickDifficultyCount(ac, "Hard"),
    total: pickDifficultyCount(totals, "Hard")
  };
  return {
    easy,
    medium,
    hard,
    total: pickDifficultyCount(ac, "All"),
    totalQuestions: pickDifficultyCount(totals, "All")
  };
}
function toNamedCounts(rows, limit) {
  const sorted = rows.filter((r) => typeof r.name === "string" && Number.isFinite(r.count)).sort((a, b) => b.count - a.count);
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}
function buildSkills(tagProblemCounts) {
  const rows = [
    ...tagProblemCounts?.advanced ?? [],
    ...tagProblemCounts?.intermediate ?? [],
    ...tagProblemCounts?.fundamental ?? []
  ].map((t) => ({ name: t.tagName, count: t.problemsSolved }));
  return toNamedCounts(rows, 12);
}
function buildLanguages(rows) {
  const mapped = (rows ?? []).map((r) => ({
    name: r.languageName,
    count: r.problemsSolved
  }));
  return toNamedCounts(mapped);
}
function parseCalendarString(raw) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
  }
  return {};
}
function mergeCalendarInto(target, raw) {
  const parsed = parseCalendarString(raw);
  for (const [key, value] of Object.entries(parsed)) {
    const tsSeconds = Number(key);
    const count = Number(value);
    if (!Number.isFinite(tsSeconds) || !Number.isFinite(count)) continue;
    const epochDay = Math.floor(tsSeconds / 86400);
    target[epochDay] = count;
  }
}
async function buildFullCalendar(username, userCalendar) {
  const merged = {};
  mergeCalendarInto(merged, userCalendar?.submissionCalendar);
  const activeYears = Array.isArray(userCalendar?.activeYears) ? userCalendar.activeYears : [];
  const years = [...new Set(activeYears.filter((y) => Number.isInteger(y)))];
  if (years.length > 0) {
    const perYearResults = await Promise.all(
      years.map(async (year) => {
        try {
          const data = await postGraphQL(CALENDAR_QUERY, {
            username,
            year
          });
          return data.matchedUser?.userCalendar?.submissionCalendar;
        } catch {
          return void 0;
        }
      })
    );
    for (const raw of perYearResults) {
      mergeCalendarInto(merged, raw);
    }
  }
  return merged;
}
var avatarCache = /* @__PURE__ */ new Map();
async function fetchAvatarDataUri(avatarUrl) {
  if (!avatarUrl || !/^https:\/\//i.test(avatarUrl)) return null;
  const cached = avatarCache.get(avatarUrl);
  if (cached !== void 0) return cached;
  try {
    const response = await fetch(avatarUrl, {
      headers: { "User-Agent": USER_AGENT }
    });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("image/")) return null;
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength <= 0 || buffer.byteLength > MAX_AVATAR_BYTES) return null;
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUri = `data:${contentType};base64,${base64}`;
    avatarCache.set(avatarUrl, dataUri);
    return dataUri;
  } catch {
    return null;
  }
}
async function fetchRawData(username) {
  const mainData = await postGraphQL(QUERY, { username });
  const matchedUser = mainData.matchedUser;
  if (!matchedUser) {
    throw new RenderableError("Could not find that LeetCode user.", 404);
  }
  const [calendar, avatarDataUri] = await Promise.all([
    buildFullCalendar(username, matchedUser.userCalendar),
    fetchAvatarDataUri(matchedUser.profile?.userAvatar ?? null)
  ]);
  return {
    username,
    realName: matchedUser.profile?.realName ?? null,
    rank: typeof matchedUser.profile?.ranking === "number" && Number.isFinite(matchedUser.profile.ranking) ? matchedUser.profile.ranking : 0,
    avatarDataUri,
    solved: buildSolved(mainData.allQuestionsCount, matchedUser.submitStatsGlobal),
    totalSubmissions: pickTotalSubmissions(matchedUser.submitStatsGlobal?.totalSubmissionNum),
    skills: buildSkills(matchedUser.tagProblemCounts),
    languages: buildLanguages(matchedUser.languageProblemCount),
    calendar,
    reportedStreak: typeof matchedUser.userCalendar?.streak === "number" && Number.isFinite(matchedUser.userCalendar.streak) ? matchedUser.userCalendar.streak : 0,
    reportedActiveDays: typeof matchedUser.userCalendar?.totalActiveDays === "number" && Number.isFinite(matchedUser.userCalendar.totalActiveDays) ? matchedUser.userCalendar.totalActiveDays : 0
  };
}

// src/format.ts
function escapeXml(value) {
  const s = String(value);
  let out = "";
  for (const ch of s) {
    switch (ch) {
      case "&":
        out += "&amp;";
        break;
      case "<":
        out += "&lt;";
        break;
      case ">":
        out += "&gt;";
        break;
      case '"':
        out += "&quot;";
        break;
      case "'":
        out += "&apos;";
        break;
      default:
        out += ch;
    }
  }
  return out;
}
function fillAttrs(color, attr, decorativeOpacity = 1) {
  const raw = typeof color === "string" ? color.trim() : "";
  const factor = Number.isFinite(decorativeOpacity) ? Math.min(1, Math.max(0, decorativeOpacity)) : 1;
  if (raw.toLowerCase() === "transparent") {
    return `${attr}="#000000" ${attr}-opacity="0.00"`;
  }
  if (!raw.startsWith("#")) {
    return factor < 1 ? `${attr}="${raw}" ${attr}-opacity="${factor.toFixed(2)}"` : `${attr}="${raw}"`;
  }
  let hex = raw.slice(1);
  if (hex.length === 3 || hex.length === 4) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  if (hex.length === 8) {
    const rgb = hex.slice(0, 6);
    const alphaByte = parseInt(hex.slice(6, 8), 16);
    const colorAlpha = Number.isFinite(alphaByte) ? alphaByte / 255 : 1;
    const combined = (colorAlpha * factor).toFixed(2);
    return `${attr}="#${rgb}" ${attr}-opacity="${combined}"`;
  }
  return factor < 1 ? `${attr}="#${hex}" ${attr}-opacity="${factor.toFixed(2)}"` : `${attr}="#${hex}"`;
}
var SHORT_SUFFIXES = ["", "K", "M", "B", "T"];
function formatNumber(n, short) {
  const num = Number.isFinite(n) ? n : 0;
  if (!short) {
    return new Intl.NumberFormat("en-US").format(num);
  }
  const sign = num < 0 ? "-" : "";
  let abs = Math.abs(num);
  let idx = 0;
  while (abs >= 1e3 && idx < SHORT_SUFFIXES.length - 1) {
    abs /= 1e3;
    idx++;
  }
  if (idx === 0) {
    return sign + new Intl.NumberFormat("en-US").format(abs);
  }
  let str = abs.toFixed(1);
  if (str.endsWith(".0")) {
    str = str.slice(0, -2);
  }
  return sign + str + SHORT_SUFFIXES[idx];
}
function isoFromEpochDay(day) {
  const ms = day * 86400 * 1e3;
  return new Date(ms).toISOString().slice(0, 10);
}
var MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
function displayDate(iso, todayIso) {
  const [y, m, d] = iso.split("-").map((part) => parseInt(part, 10));
  const [ty] = todayIso.split("-").map((part) => parseInt(part, 10));
  const date = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1));
  const monthName = MONTH_NAMES[date.getUTCMonth()];
  const dayOfMonth = date.getUTCDate();
  if (y === ty) {
    return `${monthName} ${dayOfMonth}`;
  }
  return `${monthName} ${dayOfMonth}, ${y}`;
}

// src/stats.ts
function epochDayNow() {
  return Math.floor(Date.now() / 864e5);
}
var EMPTY_RESULT = {
  currentStreak: 0,
  currentStreakStart: null,
  currentStreakEnd: null,
  highestStreak: 0,
  highestStreakStart: null,
  highestStreakEnd: null,
  totalActiveDays: 0,
  firstActiveDay: null
};
function computeStreaks(calendar, todayEpochDay) {
  const activeSet = /* @__PURE__ */ new Set();
  for (const [key, count] of Object.entries(calendar)) {
    const day = Number(key);
    if (!Number.isInteger(day)) continue;
    if (typeof count !== "number" || !(count > 0)) continue;
    if (day > todayEpochDay + 1) continue;
    activeSet.add(day);
  }
  if (activeSet.size === 0) return { ...EMPTY_RESULT };
  let firstActive = Infinity;
  for (const day of activeSet) if (day < firstActive) firstActive = day;
  const lastDay = activeSet.has(todayEpochDay + 1) ? todayEpochDay + 1 : todayEpochDay;
  let curLen = 0;
  let curStart = 0;
  let curEnd = 0;
  let hiLen = 0;
  let hiStart = 0;
  let hiEnd = 0;
  let totalActiveDays = 0;
  for (let day = firstActive; day <= lastDay; day++) {
    if (activeSet.has(day)) {
      totalActiveDays++;
      if (curLen === 0) curStart = day;
      curLen++;
      curEnd = day;
      if (curLen > hiLen) {
        hiLen = curLen;
        hiStart = curStart;
        hiEnd = curEnd;
      }
    } else if (day !== todayEpochDay || lastDay > todayEpochDay) {
      curLen = 0;
    }
  }
  return {
    currentStreak: curLen,
    currentStreakStart: curLen > 0 ? isoFromEpochDay(curStart) : null,
    currentStreakEnd: curLen > 0 ? isoFromEpochDay(curEnd) : null,
    highestStreak: hiLen,
    highestStreakStart: hiLen > 0 ? isoFromEpochDay(hiStart) : null,
    highestStreakEnd: hiLen > 0 ? isoFromEpochDay(hiEnd) : null,
    totalActiveDays,
    firstActiveDay: isoFromEpochDay(firstActive)
  };
}

// src/themes.json
var themes_default = {
  "ads-juicy-fresh": {
    background: "#0D0C15",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#81FF00",
    fire: "#81FF00",
    currStreakNum: "#FFF",
    sideNums: "#FFF",
    currStreakLabel: "#FF5700",
    sideLabels: "#FFF",
    dates: "#6562AF",
    excludeDaysLabel: "#6562AF"
  },
  algolia: {
    background: "#050F2C",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#00AEFF",
    fire: "#00AEFF",
    currStreakNum: "#2DDE98",
    sideNums: "#00AEFF",
    currStreakLabel: "#2DDE98",
    sideLabels: "#00AEFF",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  "ambient-gradient": {
    background: "35,4158D0,C850C0,FFCC70",
    border: "#AE58A1",
    stroke: "#FFFFFF",
    ring: "#FFFFFF",
    fire: "#FFFFFF",
    currStreakNum: "#FFFFFF",
    sideNums: "#FFFFFF",
    currStreakLabel: "#FFFFFF",
    sideLabels: "#FFFFFF",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  "android-dark": {
    background: "#000000",
    border: "#3DDC84",
    stroke: "#3DDC84",
    ring: "#3DDC84",
    fire: "#3DDC84",
    currStreakNum: "#3DDC84",
    sideNums: "#3DDC84",
    currStreakLabel: "#3DDC84",
    sideLabels: "#3DDC84",
    dates: "#3DDC84",
    excludeDaysLabel: "#3DDC84"
  },
  apprentice: {
    background: "#262626",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FFFFFF",
    fire: "#FFFFFF",
    currStreakNum: "#FFFFAF",
    sideNums: "#FFFFFF",
    currStreakLabel: "#FFFFAF",
    sideLabels: "#FFFFFF",
    dates: "#BCBCBC",
    excludeDaysLabel: "#BCBCBC"
  },
  aura: {
    background: "#15141B",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#A277FF",
    fire: "#A277FF",
    currStreakNum: "#FFCA85",
    sideNums: "#A277FF",
    currStreakLabel: "#FFCA85",
    sideLabels: "#A277FF",
    dates: "#61FFCA",
    excludeDaysLabel: "#61FFCA"
  },
  "aura-dark": {
    background: "#252334",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FF7372",
    fire: "#FF7372",
    currStreakNum: "#6CFFD0",
    sideNums: "#FF7372",
    currStreakLabel: "#6CFFD0",
    sideLabels: "#FF7372",
    dates: "#DBDBDB",
    excludeDaysLabel: "#DBDBDB"
  },
  "ayu-light": {
    background: "#FAFAFA",
    border: "#F0F0F0",
    stroke: "#BAE67E",
    ring: "#FF9940",
    currStreakNum: "#F07171",
    fire: "#FF9940",
    sideNums: "#55B4D4",
    currStreakLabel: "#F07171",
    sideLabels: "#55B4D4",
    dates: "#575F66",
    excludeDaysLabel: "#575F66"
  },
  "ayu-mirage": {
    background: "#1F2430",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#F4CD7C",
    fire: "#F4CD7C",
    currStreakNum: "#73D0FF",
    sideNums: "#F4CD7C",
    currStreakLabel: "#73D0FF",
    sideLabels: "#F4CD7C",
    dates: "#C7C8C2",
    excludeDaysLabel: "#C7C8C2"
  },
  bear: {
    background: "#1F2023",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#E03C8A",
    fire: "#E03C8A",
    currStreakNum: "#00AEFF",
    sideNums: "#E03C8A",
    currStreakLabel: "#00AEFF",
    sideLabels: "#E03C8A",
    dates: "#BCB28D",
    excludeDaysLabel: "#BCB28D"
  },
  "black-ice": {
    background: "#151515",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#00E7FF",
    fire: "#00E7FF",
    currStreakNum: "#FFF",
    sideNums: "#FFF",
    currStreakLabel: "#00E7FF",
    sideLabels: "#FFF",
    dates: "#9F9F9F",
    excludeDaysLabel: "#9F9F9F"
  },
  blood: {
    background: "#FFF",
    border: "#A8A8A8",
    stroke: "#A8A8A8",
    ring: "#FF5F5F",
    fire: "#357291",
    currStreakNum: "#FF5F5F",
    sideNums: "#FF5F5F",
    currStreakLabel: "#FF5F5F",
    sideLabels: "#FF5F5F",
    dates: "#273849",
    excludeDaysLabel: "#273849"
  },
  "blood-dark": {
    background: "#142B37",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FF5F5F",
    fire: "#357291",
    currStreakNum: "#FF5F5F",
    sideNums: "#FF5F5F",
    currStreakLabel: "#FF5F5F",
    sideLabels: "#FF5F5F",
    dates: "#FFF",
    excludeDaysLabel: "#FFF"
  },
  "blue-green": {
    background: "#040F0F",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#2F97C1",
    fire: "#2F97C1",
    currStreakNum: "#F5B700",
    sideNums: "#2F97C1",
    currStreakLabel: "#F5B700",
    sideLabels: "#2F97C1",
    dates: "#0CF574",
    excludeDaysLabel: "#0CF574"
  },
  "blue-navy": {
    background: "#000000",
    border: "#FFFFFF",
    stroke: "#82AAFF",
    ring: "#82AAFF",
    currStreakNum: "#82AAFF",
    fire: "#82AAFF",
    sideNums: "#82AAFF",
    currStreakLabel: "#82AAFF",
    sideLabels: "#82AAFF",
    dates: "#82AAFF",
    excludeDaysLabel: "#82AAFF"
  },
  blueberry: {
    background: "#242938",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#82AAFF",
    fire: "#82AAFF",
    currStreakNum: "#89DDFF",
    sideNums: "#82AAFF",
    currStreakLabel: "#89DDFF",
    sideLabels: "#82AAFF",
    dates: "#27E8A7",
    excludeDaysLabel: "#27E8A7"
  },
  "blueberry-duo": {
    background: "#0000",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#82AAFF",
    fire: "#82AAFF",
    currStreakNum: "#89DDFF",
    sideNums: "#82AAFF",
    currStreakLabel: "#89DDFF",
    sideLabels: "#82AAFF",
    dates: "#27E8A7",
    excludeDaysLabel: "#27E8A7"
  },
  blux: {
    background: "#263D46",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#018596",
    fire: "#28ECFA",
    currStreakNum: "#28ECFA",
    sideNums: "#28ECFA",
    currStreakLabel: "#28ECFA",
    sideLabels: "#0F80AA",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  buefy: {
    background: "#FFFFFF",
    border: "#A8A8A8",
    stroke: "#A8A8A8",
    ring: "#7957D5",
    fire: "#7957D5",
    currStreakNum: "#FF3860",
    sideNums: "#7957D5",
    currStreakLabel: "#FF3860",
    sideLabels: "#7957D5",
    dates: "#363636",
    excludeDaysLabel: "#363636"
  },
  "buefy-dark": {
    background: "#1A1B27",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#7957D5",
    fire: "#7957D5",
    currStreakNum: "#FF3860",
    sideNums: "#7957D5",
    currStreakLabel: "#FF3860",
    sideLabels: "#7957D5",
    dates: "#ABABAB",
    excludeDaysLabel: "#ABABAB"
  },
  "burnt-neon": {
    background: "#0D1117",
    border: "#98989A",
    stroke: "#98989A",
    ring: "#FE25B1",
    fire: "#622B53",
    currStreakNum: "#FF6906",
    sideNums: "#01FED1",
    currStreakLabel: "#01FED1",
    sideLabels: "#FF6906",
    dates: "#C6AB07",
    excludeDaysLabel: "#A5BC0B"
  },
  calm: {
    background: "#373F51",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#E07A5F",
    fire: "#E07A5F",
    currStreakNum: "#EDAE49",
    sideNums: "#E07A5F",
    currStreakLabel: "#EDAE49",
    sideLabels: "#E07A5F",
    dates: "#EBCFB2",
    excludeDaysLabel: "#EBCFB2"
  },
  "calm-pink": {
    background: "#2B2D40",
    border: "#E1BC29",
    stroke: "#E07A5F",
    ring: "#E07A5F",
    currStreakNum: "#EBCFB2",
    fire: "#E07A5F",
    sideNums: "#EBCFB2",
    currStreakLabel: "#E07A5F",
    sideLabels: "#E07A5F",
    dates: "#E1BC29",
    excludeDaysLabel: "#EBCFB2"
  },
  carbonfox: {
    background: "#161616",
    border: "#282828",
    stroke: "#EE5396",
    ring: "#25BE6AC8",
    fire: "#25BE6A",
    currStreakNum: "#78A9FF",
    sideNums: "#33B1FF",
    currStreakLabel: "#DFDFE0",
    sideLabels: "#DFDFE0",
    dates: "#08BDBA",
    excludeDaysLabel: "#EE5396"
  },
  "catppuccin-frappe": {
    background: "#303446",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#81C8BE",
    fire: "#81C8BE",
    currStreakNum: "#CA9EE6",
    sideNums: "#C6D0F5",
    currStreakLabel: "#CA9EE6",
    sideLabels: "#C6D0F5",
    dates: "#B5BFE2",
    excludeDaysLabel: "#B5BFE2"
  },
  "catppuccin-latte": {
    background: "#EFF1F5",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#179299",
    fire: "#179299",
    currStreakNum: "#8839EF",
    sideNums: "#4C4F69",
    currStreakLabel: "#8839EF",
    sideLabels: "#4C4F69",
    dates: "#5C5F77",
    excludeDaysLabel: "#5C5F77"
  },
  "catppuccin-macchiato": {
    background: "#24273A",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#8BD5CA",
    fire: "#8BD5CA",
    currStreakNum: "#C6A0F6",
    sideNums: "#CAD3F5",
    currStreakLabel: "#C6A0F6",
    sideLabels: "#CAD3F5",
    dates: "#B8C0E0",
    excludeDaysLabel: "#B8C0E0"
  },
  "catppuccin-mocha": {
    background: "#1E1E2E",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#94E2D5",
    fire: "#94E2D5",
    currStreakNum: "#CBA6F7",
    sideNums: "#CDD6F4",
    currStreakLabel: "#CBA6F7",
    sideLabels: "#CDD6F4",
    dates: "#BAC2DE",
    excludeDaysLabel: "#BAC2DE"
  },
  "chartreuse-dark": {
    background: "#000",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#7FFF00",
    fire: "#7FFF00",
    currStreakNum: "#00AEFF",
    sideNums: "#7FFF00",
    currStreakLabel: "#00AEFF",
    sideLabels: "#7FFF00",
    dates: "#FFF",
    excludeDaysLabel: "#FFF"
  },
  "city-lights": {
    background: "#1D252C",
    border: "#1D252C",
    currStreakLabel: "#5D8CB3",
    currStreakNum: "#5D8CB3",
    dates: "#5D8CB3",
    excludeDaysLabel: "#5D8CB3",
    fire: "#718CA1",
    ring: "#718CA1",
    sideLabels: "#5D8CB3",
    sideNums: "#61788A",
    stroke: "#536676"
  },
  cobalt: {
    background: "#0000",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#E683D9",
    fire: "#E683D9",
    currStreakNum: "#0480EF",
    sideNums: "#E683D9",
    currStreakLabel: "#0480EF",
    sideLabels: "#E683D9",
    dates: "#75EEB2",
    excludeDaysLabel: "#75EEB2"
  },
  cobalt2: {
    background: "#193549",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FFC600",
    fire: "#FFC600",
    currStreakNum: "#FFFFFF",
    sideNums: "#FFC600",
    currStreakLabel: "#FFFFFF",
    sideLabels: "#FFC600",
    dates: "#0088FF",
    excludeDaysLabel: "#0088FF"
  },
  codestackr: {
    background: "#09131B",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FF652F",
    fire: "#FF652F",
    currStreakNum: "#FFE400",
    sideNums: "#FF652F",
    currStreakLabel: "#FFE400",
    sideLabels: "#FF652F",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  "cyber-streakglow": {
    background: "42,E20FEB,0D00EB",
    border: "#00EBE1",
    stroke: "#0FEB00",
    ring: "#5AEB59",
    fire: "#DDEB00",
    currStreakNum: "#EBEBEB",
    sideNums: "#D6EBC0",
    currStreakLabel: "#46EB00",
    sideLabels: "#64E8EB",
    dates: "#EBEBEB",
    excludeDaysLabel: "#A7EB3F"
  },
  darcula: {
    background: "#242424",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#BA5F17",
    fire: "#BA5F17",
    currStreakNum: "#84628F",
    sideNums: "#BA5F17",
    currStreakLabel: "#84628F",
    sideLabels: "#BA5F17",
    dates: "#BEBEBE",
    excludeDaysLabel: "#BEBEBE"
  },
  dark: {
    background: "#151515",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FB8C00",
    fire: "#FB8C00",
    currStreakNum: "#FEFEFE",
    sideNums: "#FEFEFE",
    currStreakLabel: "#FB8C00",
    sideLabels: "#FEFEFE",
    dates: "#9E9E9E",
    excludeDaysLabel: "#9E9E9E"
  },
  "dark-aura": {
    background: "#760A11",
    border: "#310C69C5",
    stroke: "#FF1D5E",
    ring: "#C1184E",
    fire: "#EB4511",
    currStreakNum: "#EB5454",
    sideNums: "#EB5454",
    currStreakLabel: "#FF8F62",
    sideLabels: "#FF8F62",
    dates: "#EB5454",
    excludeDaysLabel: "#758575DD"
  },
  "dark-minimalist": {
    background: "#211F27",
    border: "#B9B9C0",
    stroke: "#B9B9C0",
    ring: "#D484F4",
    fire: "#D484F4",
    currStreakNum: "#89B4FA",
    sideNums: "#E5E5E5",
    currStreakLabel: "#89B4FA",
    sideLabels: "#E5E5E5",
    dates: "#D0D1D3",
    excludeDaysLabel: "#D0D1D3"
  },
  "dark-smoky": {
    background: "#0B0C10",
    border: "#C5C6C7",
    stroke: "#C5C6C7",
    ring: "#EDF5E1",
    fire: "#EDF5E1",
    currStreakNum: "#66FCF1",
    currStreakLabel: "#66FCF1",
    sideNums: "#EDF5E1",
    sideLabels: "#EDF5E1",
    dates: "#45A29E",
    excludeDaysLabel: "#45A29E"
  },
  "date-night": {
    background: "#170F0C",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#DA7885",
    fire: "#DA7885",
    currStreakNum: "#BB8470",
    sideNums: "#DA7885",
    currStreakLabel: "#BB8470",
    sideLabels: "#DA7885",
    dates: "#E1B2A2",
    excludeDaysLabel: "#E1B2A2"
  },
  dawnfox: {
    background: "#FAF4ED",
    border: "#E5E9F0",
    stroke: "#B4637A",
    ring: "#618774C8",
    fire: "#618774",
    currStreakNum: "#286983",
    sideNums: "#56949F",
    currStreakLabel: "#575279",
    sideLabels: "#575279",
    dates: "#EA9D34",
    excludeDaysLabel: "#B4637A"
  },
  dayfox: {
    background: "#F6F2EE",
    border: "#F2E9E1",
    stroke: "#A5222F",
    ring: "#396847C8",
    fire: "#396847",
    currStreakNum: "#2848A9",
    sideNums: "#287980",
    currStreakLabel: "#352C24",
    sideLabels: "#352C24",
    dates: "#AC5402",
    excludeDaysLabel: "#A5222F"
  },
  deepblue: {
    background: "#165795",
    border: "#BA9D6F",
    stroke: "#38DD69",
    ring: "#37DD57",
    fire: "#1CD577",
    currStreakNum: "#639E29",
    sideNums: "#131662",
    currStreakLabel: "#0FDD21",
    sideLabels: "#1ADD40",
    dates: "#11E2E7",
    excludeDaysLabel: "#11E2E7"
  },
  default: {
    background: "#FFFEFE",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FB8C00",
    fire: "#FB8C00",
    currStreakNum: "#151515",
    sideNums: "#151515",
    currStreakLabel: "#FB8C00",
    sideLabels: "#151515",
    dates: "#464646",
    excludeDaysLabel: "#464646"
  },
  "deuteranopia-friendly-theme": {
    background: "#000000",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#E69F00",
    fire: "#E69F00",
    currStreakNum: "#56B4E9",
    sideNums: "#F0E442",
    currStreakLabel: "#0072B2",
    sideLabels: "#CC79A7",
    dates: "#009E73",
    excludeDaysLabel: "#009E73"
  },
  "discord-old-blurple": {
    background: "#2C2F33",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#7289DA",
    fire: "#7289DA",
    currStreakNum: "#7289DA",
    sideNums: "#7289DA",
    currStreakLabel: "#7289DA",
    sideLabels: "#7289DA",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  dracula: {
    background: "#282A36",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FF6E96",
    fire: "#FF6E96",
    currStreakNum: "#79DAFA",
    sideNums: "#FF6E96",
    currStreakLabel: "#79DAFA",
    sideLabels: "#FF6E96",
    dates: "#F8F8F2",
    excludeDaysLabel: "#F8F8F2"
  },
  duskfox: {
    background: "#232136",
    border: "#393552",
    stroke: "#EB6F92",
    ring: "#A3BE8CC8",
    fire: "#A3BE8C",
    currStreakNum: "#569FBA",
    sideNums: "#9CCFD8",
    currStreakLabel: "#E0DEF4",
    sideLabels: "#E0DEF4",
    dates: "#F6C177",
    excludeDaysLabel: "#EB6F92"
  },
  earth: {
    background: "#1E1615",
    border: "#BA9D6F",
    stroke: "#BA9D6F",
    ring: "#C48519",
    fire: "#C48519",
    currStreakNum: "#639E29",
    sideNums: "#639E29",
    currStreakLabel: "#C48519",
    sideLabels: "#C48519",
    dates: "#BA9D6F",
    excludeDaysLabel: "#BA9D6F"
  },
  elegant: {
    background: "#03071E",
    border: "#ABCDEF",
    stroke: "#ABCDEF",
    ring: "#CA6702",
    currStreakNum: "#ABCDEF",
    fire: "#E85D04",
    sideNums: "#ABDCFE",
    currStreakLabel: "#ABCDEF",
    sideLabels: "#FEDCBA",
    dates: "#FF7B00",
    excludeDaysLabel: "#FF7B00"
  },
  "everforest-dark": {
    background: "#2D353B",
    border: "#4F585E",
    stroke: "#4F585E",
    ring: "#A7C080",
    fire: "#A7C080",
    currStreakNum: "#D3C6AA",
    sideNums: "#A7C080",
    currStreakLabel: "#D3C6AA",
    sideLabels: "#A7C080",
    dates: "#9DA9A0",
    excludeDaysLabel: "#9DA9A0"
  },
  "everforest-light": {
    background: "#F2F4EF",
    border: "#C7CCC2",
    stroke: "#C7CCC2",
    ring: "#7F9C6F",
    fire: "#7F9C6F",
    currStreakNum: "#55674E",
    sideNums: "#7F9C6F",
    currStreakLabel: "#55674E",
    sideLabels: "#7F9C6F",
    dates: "#8B9286",
    excludeDaysLabel: "#8B9286"
  },
  "flag-india": {
    background: "#FFFFFF",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FF8F1C",
    fire: "#FF8F1C",
    currStreakNum: "#250E62",
    sideNums: "#FF8F1C",
    currStreakLabel: "#250E62",
    sideLabels: "#FF8F1C",
    dates: "#509E2F",
    excludeDaysLabel: "#509E2F"
  },
  garden: {
    background: "#094A4A",
    border: "#000000",
    stroke: "#DDD4A8",
    ring: "#D2DD3B",
    fire: "#D2DD3B",
    currStreakNum: "#D2DD3B",
    sideNums: "#D2DD3B",
    currStreakLabel: "#6FDD6C",
    sideLabels: "#6FDD6C",
    dates: "#6FDD6C",
    excludeDaysLabel: "#6FDD6C"
  },
  "git-dark": {
    background: "#000000",
    border: "#F05033",
    stroke: "#F05033",
    ring: "#F05033",
    fire: "#F05033",
    currStreakNum: "#F05033",
    sideNums: "#F05033",
    currStreakLabel: "#F05033",
    sideLabels: "#F05033",
    dates: "#F05033",
    excludeDaysLabel: "#F05033"
  },
  "github-dark": {
    background: "#0D1117",
    border: "#39D353",
    stroke: "#39D353",
    ring: "#39D353",
    currStreakNum: "#FFFFFF",
    fire: "#1F6FEB",
    sideNums: "#FFFFFF",
    currStreakLabel: "#FFFFFF",
    sideLabels: "#FFFFFF",
    dates: "#39D353",
    excludeDaysLabel: "#39D353"
  },
  "github-dark-blue": {
    background: "#0D1117",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#1F6FEB",
    fire: "#58A6FF",
    currStreakNum: "#FEFEFE",
    sideNums: "#58A6FF",
    currStreakLabel: "#FEFEFE",
    sideLabels: "#FEFEFE",
    dates: "#9E9E9E",
    excludeDaysLabel: "#9E9E9E"
  },
  "github-dark-dimmed": {
    background: "#24292F",
    border: "#373E47",
    stroke: "#539BF5",
    ring: "#539BF5",
    currStreakNum: "#ADBAC7",
    fire: "#539BF5",
    sideNums: "#ADBAC7",
    currStreakLabel: "#539BF5",
    sideLabels: "#539BF5",
    dates: "#ADBAC7",
    excludeDaysLabel: "#78818A"
  },
  "github-green-purple": {
    background: "#000",
    border: "#000",
    stroke: "#E4E2E2",
    ring: "#7FFF00",
    fire: "#7FFF00",
    currStreakNum: "#800080",
    sideNums: "#7FFF00",
    currStreakLabel: "#800080",
    sideLabels: "#7FFF00",
    dates: "#FFF",
    excludeDaysLabel: "#FFF"
  },
  "github-light": {
    background: "#FFFFFF",
    border: "#39D353",
    stroke: "#39D353",
    ring: "#39D353",
    currStreakNum: "#39D353",
    fire: "#39D353",
    sideNums: "#39D353",
    currStreakLabel: "#24292F",
    sideLabels: "#24292F",
    dates: "#1F6FEB",
    excludeDaysLabel: "#1F6FEB"
  },
  gotham: {
    background: "#0C1014",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#2AA889",
    fire: "#2AA889",
    currStreakNum: "#599CAB",
    sideNums: "#2AA889",
    currStreakLabel: "#599CAB",
    sideLabels: "#2AA889",
    dates: "#99D1CE",
    excludeDaysLabel: "#99D1CE"
  },
  graywhite: {
    background: "#FFFFFF",
    border: "#ABABAB",
    stroke: "#ABABAB",
    ring: "#24292E",
    fire: "#24292E",
    currStreakNum: "#24292E",
    sideNums: "#24292E",
    currStreakLabel: "#24292E",
    sideLabels: "#24292E",
    dates: "#24292E",
    excludeDaysLabel: "#24292E"
  },
  "great-gatsby": {
    background: "#000",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FFA726",
    fire: "#FFA726",
    currStreakNum: "#FFB74D",
    sideNums: "#FFA726",
    currStreakLabel: "#FFB74D",
    sideLabels: "#FFA726",
    dates: "#FFD95B",
    excludeDaysLabel: "#FFD95B"
  },
  "green-nur": {
    background: "#0A1E17",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#5AFFC8",
    fire: "#5AFFC8",
    currStreakNum: "#5AFFC8",
    sideNums: "#5AFFC8",
    currStreakLabel: "#5AFFC8",
    sideLabels: "#5AFFC8",
    dates: "#FFF",
    excludeDaysLabel: "#FFF"
  },
  gruvbox: {
    background: "#282828",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FABD2F",
    fire: "#FABD2F",
    currStreakNum: "#FE8019",
    sideNums: "#FABD2F",
    currStreakLabel: "#FE8019",
    sideLabels: "#FABD2F",
    dates: "#8EC07C",
    excludeDaysLabel: "#8EC07C"
  },
  "gruvbox-duo": {
    background: "#0000",
    border: "#A8A8A8",
    stroke: "#A8A8A8",
    ring: "#FABD2F",
    fire: "#FABD2F",
    currStreakNum: "#FE8019",
    sideNums: "#FABD2F",
    currStreakLabel: "#FE8019",
    sideLabels: "#FABD2F",
    dates: "#8EC07C",
    excludeDaysLabel: "#8EC07C"
  },
  "gruvbox-light": {
    background: "#FBF1C7",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#B57614",
    fire: "#B57614",
    currStreakNum: "#AF3A03",
    sideNums: "#B57614",
    currStreakLabel: "#AF3A03",
    sideLabels: "#B57614",
    dates: "#427B58",
    excludeDaysLabel: "#427B58"
  },
  hacker: {
    background: "#000000",
    border: "#20C20E",
    stroke: "#20C20E",
    ring: "#20C20E",
    fire: "#20C20E",
    currStreakNum: "#20C20E",
    sideNums: "#20C20E",
    currStreakLabel: "#20C20E",
    sideLabels: "#20C20E",
    dates: "#20C20E",
    excludeDaysLabel: "#20C20E"
  },
  "hacker-inverted": {
    background: "#20C20E",
    border: "#000000",
    stroke: "#000000",
    ring: "#000000",
    fire: "#000000",
    currStreakNum: "#000000",
    sideNums: "#000000",
    currStreakLabel: "#000000",
    sideLabels: "#000000",
    dates: "#000000",
    excludeDaysLabel: "#000000"
  },
  halloween: {
    background: "#1C1A2B",
    border: "#FFC400",
    stroke: "#FFC400",
    ring: "#FDEF49",
    fire: "#FDEF49",
    currStreakNum: "#FFC400",
    sideNums: "#FFC400",
    currStreakLabel: "#FB9600",
    sideLabels: "#FB9600",
    dates: "#FFC400",
    excludeDaysLabel: "#FFC400"
  },
  highcontrast: {
    background: "#000000",
    border: "#BEBEBE",
    stroke: "#BEBEBE",
    ring: "#FB8C00",
    fire: "#FB8C00",
    currStreakNum: "#FFFFFF",
    sideNums: "#FFFFFF",
    currStreakLabel: "#FB8C00",
    sideLabels: "#FFFFFF",
    dates: "#C5C5C5",
    excludeDaysLabel: "#C5C5C5"
  },
  "holi-theme": {
    background: "#030314",
    border: "#85A4C0",
    stroke: "#2A4555",
    ring: "#D6E7FF",
    currStreakNum: "#5FABEE",
    fire: "#D6E7FF",
    sideNums: "#5FABEE",
    currStreakLabel: "#D6E7FF",
    sideLabels: "#D6E7FF",
    dates: "#85A4C0",
    excludeDaysLabel: "#85A4C0"
  },
  horizon: {
    background: "#1C1E26",
    border: "#1C1E26",
    stroke: "#FAB795",
    ring: "#E95678",
    fire: "#E95678",
    currStreakNum: "#59E1E3",
    sideNums: "#59E1E3",
    currStreakLabel: "#23BD87",
    sideLabels: "#23BD87",
    dates: "#FAB795",
    excludeDaysLabel: "#FAB795"
  },
  humoris: {
    background: "#DFAF77",
    border: "#E8E6E4",
    stroke: "#191919",
    ring: "#683C2C",
    fire: "#191419",
    currStreakNum: "#191419",
    sideNums: "#191419",
    currStreakLabel: "#393C3C",
    sideLabels: "#393C3C",
    dates: "#444444",
    excludeDaysLabel: "#444444"
  },
  iceberg: {
    background: "#1E2132",
    border: "#33374C",
    stroke: "#33374C",
    ring: "#84A0C6",
    fire: "#84A0C6",
    currStreakNum: "#D2D4DE",
    sideNums: "#327698",
    currStreakLabel: "#D2D4DE",
    sideLabels: "#D2D4DE",
    dates: "#327698",
    excludeDaysLabel: "#84A0C6"
  },
  icegray: {
    background: "#FFFFFF",
    border: "#515151",
    stroke: "#515151",
    ring: "#686868",
    fire: "#969696",
    currStreakNum: "#3C3C3C",
    sideNums: "#535353",
    currStreakLabel: "#515151",
    sideLabels: "#515151",
    dates: "#636363",
    excludeDaysLabel: "#636363"
  },
  "java-dark": {
    background: "#000000",
    border: "#F89820",
    stroke: "#F89820",
    ring: "#F89820",
    fire: "#F89820",
    currStreakNum: "#5382A1",
    sideNums: "#5382A1",
    currStreakLabel: "#F89820",
    sideLabels: "#F89820",
    dates: "#5382A1",
    excludeDaysLabel: "#5382A1"
  },
  javascript: {
    background: "#F7DF1E",
    border: "#000000",
    stroke: "#000000",
    ring: "#000000",
    currStreakNum: "#000000",
    fire: "#000000",
    sideNums: "#000000",
    currStreakLabel: "#000000",
    sideLabels: "#000000",
    dates: "#000000",
    excludeDaysLabel: "#000000"
  },
  "javascript-dark": {
    background: "#000000",
    border: "#F7DF1E",
    stroke: "#F7DF1E",
    ring: "#F7DF1E",
    currStreakNum: "#FFFFFF",
    fire: "#F7DF1E",
    sideNums: "#FFFFFF",
    currStreakLabel: "#F7DF1E",
    sideLabels: "#F7DF1E",
    dates: "#F7DF1E",
    excludeDaysLabel: "#F7DF1E"
  },
  jolly: {
    background: "#291B3E",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FF64DA",
    fire: "#FF64DA",
    currStreakNum: "#A960FF",
    sideNums: "#FF64DA",
    currStreakLabel: "#A960FF",
    sideLabels: "#FF64DA",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  "kacho-ga": {
    background: "#402B23",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#BF4A3F",
    fire: "#BF4A3F",
    currStreakNum: "#A64833",
    sideNums: "#BF4A3F",
    currStreakLabel: "#A64833",
    sideLabels: "#BF4A3F",
    dates: "#D9C8A9",
    excludeDaysLabel: "#D9C8A9"
  },
  "kanagawa-paper": {
    background: "#1F1F28",
    border: "#54546D",
    stroke: "#727169",
    ring: "#7FB4CA",
    fire: "#E46876",
    currStreakNum: "#98BB6C",
    sideNums: "#7E9CD8",
    currStreakLabel: "#E6C384",
    sideLabels: "#7AA89F",
    dates: "#C4B28A",
    excludeDaysLabel: "#C8C093"
  },
  leafy: {
    background: "#081C15",
    border: "#ABCDEF",
    stroke: "#081C15",
    ring: "#ABCDEF",
    currStreakNum: "#FF5400",
    fire: "#ABCDEF",
    sideNums: "#FF5400",
    currStreakLabel: "#FF5400",
    sideLabels: "#ABCABC",
    dates: "#FECFEC",
    excludeDaysLabel: "#FECFEC"
  },
  maroongold: {
    background: "#260000",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#F7EF8A",
    fire: "#F7EF8A",
    currStreakNum: "#F7EF8A",
    sideNums: "#F7EF8A",
    currStreakLabel: "#F7EF8A",
    sideLabels: "#F7EF8A",
    dates: "#E0AA3E",
    excludeDaysLabel: "#E0AA3E"
  },
  material: {
    background: "#263238",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#80CBC4",
    fire: "#80CBC4",
    currStreakNum: "#FFAB91",
    sideNums: "#80CBC4",
    currStreakLabel: "#FFAB91",
    sideLabels: "#80CBC4",
    dates: "#B0BEC5",
    excludeDaysLabel: "#B0BEC5"
  },
  "material-palenight": {
    background: "#292D3E",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#C792EA",
    fire: "#C792EA",
    currStreakNum: "#89DDFF",
    sideNums: "#C792EA",
    currStreakLabel: "#89DDFF",
    sideLabels: "#C792EA",
    dates: "#A6ACCD",
    excludeDaysLabel: "#A6ACCD"
  },
  merko: {
    background: "#0A0F0B",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#ABD200",
    fire: "#ABD200",
    currStreakNum: "#B7D364",
    sideNums: "#ABD200",
    currStreakLabel: "#B7D364",
    sideLabels: "#ABD200",
    dates: "#68B587",
    excludeDaysLabel: "#68B587"
  },
  "meta-dark": {
    background: "#1C2B33",
    border: "#FFFFFF",
    stroke: "#FFFFFF",
    ring: "#0081FB",
    fire: "#006EE9",
    currStreakNum: "#FFFFFF",
    sideNums: "#FFFFFF",
    currStreakLabel: "#FFFFFF",
    sideLabels: "#FFFFFF",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  "meta-light": {
    background: "#FFFFFF",
    border: "#1C2B33",
    stroke: "#1C2B33",
    ring: "#0081FB",
    fire: "#006EE9",
    currStreakNum: "#1C2B33",
    sideNums: "#1C2B33",
    currStreakLabel: "#1C2B33",
    sideLabels: "#1C2B33",
    dates: "#1C2B33",
    excludeDaysLabel: "#1C2B33"
  },
  microsoft: {
    background: "#FFFFFF",
    border: "#737373",
    stroke: "#737373",
    ring: "#7FBA00",
    fire: "#F25022",
    currStreakNum: "#00A4EF",
    sideNums: "#FFB900",
    currStreakLabel: "#00A4EF",
    sideLabels: "#FFB900",
    dates: "#7FBA00",
    excludeDaysLabel: "#7FBA00"
  },
  "microsoft-dark": {
    background: "#000000",
    border: "#737373",
    stroke: "#737373",
    ring: "#7FBA00",
    fire: "#F25022",
    currStreakNum: "#00A4EF",
    sideNums: "#FFB900",
    currStreakLabel: "#00A4EF",
    sideLabels: "#FFB900",
    dates: "#7FBA00",
    excludeDaysLabel: "#7FBA00"
  },
  "midnight-purple": {
    background: "#000000",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#9745F5",
    fire: "#9745F5",
    currStreakNum: "#9F4BFF",
    sideNums: "#9745F5",
    currStreakLabel: "#9F4BFF",
    sideLabels: "#9745F5",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  "modern-lilac": {
    background: "#0A0E12",
    border: "#1C1E26",
    stroke: "#1C1E26",
    ring: "#5D417A",
    fire: "#5D417A",
    currStreakNum: "#FAB795",
    sideNums: "#C770F0",
    currStreakLabel: "#FAB795",
    sideLabels: "#C770F0",
    dates: "#FAB795",
    excludeDaysLabel: "#FAB795"
  },
  "modern-lilac2": {
    background: "#0A0E12",
    border: "#1C1E26",
    stroke: "#1C1E26",
    ring: "#5D417A",
    fire: "#5D417A",
    currStreakNum: "#FFFFFF",
    sideNums: "#C770F0",
    currStreakLabel: "#FFFFFF",
    sideLabels: "#C770F0",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  moltack: {
    background: "#F5E1C0",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#86092C",
    fire: "#86092C",
    currStreakNum: "#86092C",
    sideNums: "#86092C",
    currStreakLabel: "#86092C",
    sideLabels: "#86092C",
    dates: "#574038",
    excludeDaysLabel: "#574038"
  },
  monokai: {
    background: "#272822",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#EB1F6A",
    fire: "#EB1F6A",
    currStreakNum: "#E28905",
    sideNums: "#EB1F6A",
    currStreakLabel: "#E28905",
    sideLabels: "#EB1F6A",
    dates: "#F1F1EB",
    excludeDaysLabel: "#F1F1EB"
  },
  "monokai-metallian": {
    background: "#1F222E",
    border: "#FFFFFF",
    currStreakLabel: "#F85D7F",
    currStreakNum: "#F8D866",
    dates: "#9CA2B8",
    excludeDaysLabel: "#9CA2B8",
    fire: "#FC9867",
    ring: "#FC9867",
    sideLabels: "#F85D7F",
    sideNums: "#F8D866",
    stroke: "#4A4F64"
  },
  "navy-gear": {
    background: "#000021",
    border: "#FFFFFF",
    stroke: "#FFFFFF",
    ring: "#1FA0DD",
    fire: "#1FA0DD",
    currStreakNum: "#C3DD00",
    sideNums: "#C3DD00",
    currStreakLabel: "#C3DD00",
    sideLabels: "#C3DD00",
    dates: "#1FA0DD",
    excludeDaysLabel: "#1FA0DD"
  },
  neon: {
    background: "#000000",
    border: "#FFFFFF",
    stroke: "#FFFFFF",
    ring: "#00EAD3",
    fire: "#00EAD3",
    currStreakNum: "#FF449F",
    sideNums: "#00EAD3",
    currStreakLabel: "#FF449F",
    sideLabels: "#00EAD3",
    dates: "#FFF5B7",
    excludeDaysLabel: "#FFF5B7"
  },
  "neon-blurange": {
    background: "#030D6B",
    border: "#C7CCFF",
    stroke: "#C7CCFF",
    ring: "#FB750B",
    fire: "#FB750B",
    currStreakNum: "#25FB88",
    sideNums: "#FB750B",
    currStreakLabel: "#25FB88",
    sideLabels: "#25FB88",
    dates: "#C7CCFF",
    excludeDaysLabel: "#C7CCFF"
  },
  "neon-dark": {
    background: "#020200",
    border: "#A8A8A8",
    stroke: "#A8A8A8",
    ring: "#E41D44",
    fire: "#E41D44",
    currStreakNum: "#F9DD3C",
    currStreakLabel: "#F9DD3C",
    sideNums: "#5CADC0",
    sideLabels: "#5CADC0",
    dates: "#ED7B25",
    excludeDaysLabel: "#ED7B25"
  },
  "neon-palenight": {
    background: "#212237",
    border: "#A8A8A8",
    stroke: "#A8A8A8",
    ring: "#E41D44",
    fire: "#E41D44",
    currStreakNum: "#F9DD3C",
    currStreakLabel: "#F9DD3C",
    sideNums: "#5CADC0",
    sideLabels: "#5CADC0",
    dates: "#ED7B25",
    excludeDaysLabel: "#ED7B25"
  },
  nightfox: {
    background: "#192330",
    border: "#393B44",
    stroke: "#C94F6D",
    ring: "#6C9581C8",
    fire: "#81B29A",
    currStreakNum: "#719CD6",
    sideNums: "#63CDCF",
    currStreakLabel: "#DFDFE0",
    sideLabels: "#DFDFE0",
    dates: "#DBC074",
    excludeDaysLabel: "#C94F6D"
  },
  nightowl: {
    background: "#011627",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#C792EA",
    fire: "#C792EA",
    currStreakNum: "#FFEB95",
    sideNums: "#C792EA",
    currStreakLabel: "#FFEB95",
    sideLabels: "#C792EA",
    dates: "#7FDBCA",
    excludeDaysLabel: "#7FDBCA"
  },
  "noctis-minimus": {
    background: "#1B2932",
    border: "#F0F0F0",
    stroke: "#C5CDD3",
    ring: "#D3B692",
    currStreakNum: "#72B7C0",
    fire: "#D3B692",
    sideNums: "#72B7C0",
    currStreakLabel: "#72B7C0",
    sideLabels: "#D3B692",
    dates: "#C5CDD3",
    excludeDaysLabel: "#C5CDD3"
  },
  nord: {
    background: "#2E3440",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#81A1C1",
    fire: "#81A1C1",
    currStreakNum: "#88C0D0",
    sideNums: "#81A1C1",
    currStreakLabel: "#88C0D0",
    sideLabels: "#81A1C1",
    dates: "#D8DEE9",
    excludeDaysLabel: "#D8DEE9"
  },
  "nord-aurora": {
    background: "#4C566A",
    border: "#8FBCBB",
    stroke: "#D8DEE9",
    ring: "#A3BE8C",
    fire: "#BF616A",
    currStreakNum: "#A3BE8C",
    sideNums: "#B48EAD",
    currStreakLabel: "#EBCB8B",
    sideLabels: "#D08770",
    dates: "#88C0D0",
    excludeDaysLabel: "#81A1C1"
  },
  nordfox: {
    background: "#2E3440",
    border: "#3B4252",
    stroke: "#BF616A",
    ring: "#A3BE8CC8",
    fire: "#A3BE8C",
    currStreakNum: "#81A1C1",
    sideNums: "#88C0D0",
    currStreakLabel: "#E5E9F0",
    sideLabels: "#E5E9F0",
    dates: "#EBCB8B",
    excludeDaysLabel: "#BF616A"
  },
  "ocean-dark": {
    background: "#151A28",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#8957B2",
    fire: "#8957B2",
    currStreakNum: "#FFFFFF",
    sideNums: "#8957B2",
    currStreakLabel: "#FFFFFF",
    sideLabels: "#8957B2",
    dates: "#92D534",
    excludeDaysLabel: "#92D534"
  },
  "ocean-gradient": {
    background: "90,0093EA,80D0C8,80D0C8",
    border: "#000155",
    stroke: "#FFFFFF",
    ring: "#FFFFFF",
    fire: "#FFFFFF",
    currStreakNum: "#FFFFFF",
    sideNums: "#FFFFFF",
    currStreakLabel: "#FFFFFF",
    sideLabels: "#FFFFFF",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  "oceanic-next": {
    background: "#1B2B34",
    border: "#343D46",
    stroke: "#4F5B66",
    ring: "#6699CC",
    fire: "#EC5F67",
    currStreakNum: "#99C794",
    sideNums: "#6699CC",
    currStreakLabel: "#FAC863",
    sideLabels: "#5FB3B3",
    dates: "#A7ADBA",
    excludeDaysLabel: "#A7ADBA"
  },
  omni: {
    background: "#191622",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FF79C6",
    fire: "#FF79C6",
    currStreakNum: "#E7DE79",
    sideNums: "#FF79C6",
    currStreakLabel: "#E7DE79",
    sideLabels: "#FF79C6",
    dates: "#E1E1E6",
    excludeDaysLabel: "#E1E1E6"
  },
  "one-dark-pro": {
    background: "#23272E",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#61AFEF",
    fire: "#61AFEF",
    currStreakNum: "#C678DD",
    sideNums: "#61AFEF",
    currStreakLabel: "#C678DD",
    sideLabels: "#61AFEF",
    dates: "#E5C06E",
    excludeDaysLabel: "#E5C06E"
  },
  onedark: {
    background: "#282C34",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#E4BF7A",
    fire: "#E4BF7A",
    currStreakNum: "#8EB573",
    sideNums: "#E4BF7A",
    currStreakLabel: "#8EB573",
    sideLabels: "#E4BF7A",
    dates: "#DF6D74",
    excludeDaysLabel: "#DF6D74"
  },
  "onedark-duo": {
    background: "#0000",
    border: "#A8A8A8",
    stroke: "#A8A8A8",
    ring: "#E4BF7A",
    fire: "#E4BF7A",
    currStreakNum: "#8EB573",
    sideNums: "#E4BF7A",
    currStreakLabel: "#8EB573",
    sideLabels: "#E4BF7A",
    dates: "#DF6D74",
    excludeDaysLabel: "#DF6D74"
  },
  outrun: {
    background: "#141439",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FFCC00",
    fire: "#FFCC00",
    currStreakNum: "#FF1AFF",
    sideNums: "#FFCC00",
    currStreakLabel: "#FF1AFF",
    sideLabels: "#FFCC00",
    dates: "#8080FF",
    excludeDaysLabel: "#8080FF"
  },
  panda: {
    background: "#31353A",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#19F9D899",
    fire: "#19F9D899",
    currStreakNum: "#19F9D899",
    sideNums: "#19F9D899",
    currStreakLabel: "#19F9D899",
    sideLabels: "#19F9D899",
    dates: "#FF75B5",
    excludeDaysLabel: "#FF75B5"
  },
  prussian: {
    background: "#172F45",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#BDDFFF",
    fire: "#BDDFFF",
    currStreakNum: "#38A0FF",
    sideNums: "#BDDFFF",
    currStreakLabel: "#38A0FF",
    sideLabels: "#BDDFFF",
    dates: "#6E93B5",
    excludeDaysLabel: "#6E93B5"
  },
  "python-dark": {
    background: "#000000",
    border: "#4B8BBE",
    stroke: "#4B8BBE",
    ring: "#FFD43B",
    fire: "#FFD43B",
    currStreakNum: "#4B8BBE",
    sideNums: "#4B8BBE",
    currStreakLabel: "#FFD43B",
    sideLabels: "#FFD43B",
    dates: "#FFD43B",
    excludeDaysLabel: "#FFD43B"
  },
  radical: {
    background: "#141321",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FE428E",
    fire: "#FE428E",
    currStreakNum: "#F8D847",
    sideNums: "#FE428E",
    currStreakLabel: "#F8D847",
    sideLabels: "#FE428E",
    dates: "#A9FEF7",
    excludeDaysLabel: "#A9FEF7"
  },
  react: {
    background: "#20232A",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#61DAFB",
    fire: "#61DAFB",
    currStreakNum: "#61DAFB",
    sideNums: "#61DAFB",
    currStreakLabel: "#61DAFB",
    sideLabels: "#61DAFB",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  "rising-sun": {
    background: "#0C1116",
    border: "#E4E3E3",
    stroke: "#E4E3E3",
    ring: "#F6882B",
    currStreakNum: "#FFFFFF",
    fire: "#F6882B",
    sideNums: "#FFFFFF",
    currStreakLabel: "#FFF7ED",
    sideLabels: "#FFF7ED",
    dates: "#F6882B",
    excludeDaysLabel: "#F6882B"
  },
  rose: {
    background: "#E9D8D4",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#8D192B",
    fire: "#8D192B",
    currStreakNum: "#B71F36",
    sideNums: "#8D192B",
    currStreakLabel: "#B71F36",
    sideLabels: "#8D192B",
    dates: "#862931",
    excludeDaysLabel: "#862931"
  },
  "rose-pine": {
    background: "#191724",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#9CCFD8",
    fire: "#9CCFD8",
    currStreakNum: "#EBBCBA",
    sideNums: "#9CCFD8",
    currStreakLabel: "#EBBCBA",
    sideLabels: "#9CCFD8",
    dates: "#E0DEF4",
    excludeDaysLabel: "#E0DEF4"
  },
  "rust-ferris-dark": {
    background: "#000000",
    border: "#FFFFFF",
    stroke: "#F66200",
    ring: "#F49600",
    fire: "#F66200",
    currStreakNum: "#F49600",
    sideNums: "#CC3A00",
    currStreakLabel: "#F49600",
    sideLabels: "#CC3A00",
    dates: "#F66200",
    excludeDaysLabel: "#F66200"
  },
  "rust-ferris-light": {
    background: "#FFFFFF",
    border: "#000000",
    stroke: "#F66200",
    ring: "#F49600",
    fire: "#F66200",
    currStreakNum: "#F49600",
    sideNums: "#CC3A00",
    currStreakLabel: "#F49600",
    sideLabels: "#CC3A00",
    dates: "#F66200",
    excludeDaysLabel: "#F66200"
  },
  "sakura-x": {
    background: "#1A1B26",
    border: "#9D4EDD",
    stroke: "#FFFFFF",
    ring: "#9D4EDD",
    fire: "#E5C07B",
    currStreakNum: "#FFFFFF",
    sideNums: "#9D4EDD",
    currStreakLabel: "#E5C07B",
    sideLabels: "#E5C07B",
    dates: "#C0CAF5",
    excludeDaysLabel: "#C0CAF5"
  },
  sea: {
    background: "#1565C0",
    border: "#FFFFFF",
    stroke: "#FFFFFF",
    ring: "#FFFFFF",
    fire: "#FFFFFF",
    currStreakNum: "#FFFFFF",
    sideNums: "#FFFFFF",
    currStreakLabel: "#FFFFFF",
    sideLabels: "#FFFFFF",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  "sea-dark": {
    background: "#00C0FF",
    border: "#000000",
    stroke: "#00546F",
    ring: "#000000",
    fire: "#000000",
    currStreakNum: "#000000",
    sideNums: "#000000",
    currStreakLabel: "#000000",
    sideLabels: "#000000",
    dates: "#000000",
    excludeDaysLabel: "#000000"
  },
  "shades-of-purple": {
    background: "#2D2B55",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FAD000",
    fire: "#FAD000",
    currStreakNum: "#B362FF",
    sideNums: "#FAD000",
    currStreakLabel: "#B362FF",
    sideLabels: "#FAD000",
    dates: "#A599E9",
    excludeDaysLabel: "#A599E9"
  },
  "shadow-blue": {
    background: "#FFFFFF00",
    border: "#004490",
    stroke: "#004450",
    ring: "#004450",
    fire: "#00779A",
    currStreakNum: "#3E6BFF",
    sideNums: "#747474",
    currStreakLabel: "#00779A",
    sideLabels: "#00779A",
    dates: "#747474",
    excludeDaysLabel: "#3E6BFF"
  },
  "shadow-brown": {
    background: "#FFFFFF00",
    border: "#31312D",
    stroke: "#31312D",
    ring: "#31312D",
    fire: "#7D6642",
    currStreakNum: "#BB9863",
    sideNums: "#747474",
    currStreakLabel: "#7D6642",
    sideLabels: "#7D6642",
    dates: "#747474",
    excludeDaysLabel: "#BB9863"
  },
  "shadow-green": {
    background: "#FFFFFF00",
    border: "#003D00",
    stroke: "#003D00",
    ring: "#003D00",
    fire: "#007A00",
    currStreakNum: "#4DB942",
    sideNums: "#747474",
    currStreakLabel: "#007A00",
    sideLabels: "#007A00",
    dates: "#747474",
    excludeDaysLabel: "#4DB942"
  },
  "shadow-orange": {
    background: "#FFFFFF00",
    border: "#834400",
    stroke: "#834400",
    ring: "#834400",
    fire: "#BB5502",
    currStreakNum: "#EC861A",
    sideNums: "#747474",
    currStreakLabel: "#BB5502",
    sideLabels: "#BB5502",
    dates: "#747474",
    excludeDaysLabel: "#EC861A"
  },
  "shadow-purple": {
    background: "#FFFFFF00",
    border: "#570182",
    stroke: "#570182",
    ring: "#570182",
    fire: "#6F42C1",
    currStreakNum: "#CA59FF",
    sideNums: "#747474",
    currStreakLabel: "#6F42C1",
    sideLabels: "#6F42C1",
    dates: "#747474",
    excludeDaysLabel: "#CA59FF"
  },
  "shadow-red": {
    background: "#FFFFFF00",
    border: "#4F0000",
    stroke: "#4F0000",
    ring: "#4F0000",
    fire: "#9A0000",
    currStreakNum: "#B94242",
    sideNums: "#747474",
    currStreakLabel: "#9A0000",
    sideLabels: "#9A0000",
    dates: "#747474",
    excludeDaysLabel: "#B94242"
  },
  slateorange: {
    background: "#36393F",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FAA627",
    fire: "#FAA627",
    currStreakNum: "#FAA627",
    sideNums: "#FAA627",
    currStreakLabel: "#FAA627",
    sideLabels: "#FAA627",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  "soft-green": {
    background: "#222428",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#00DC4D",
    fire: "#00DC4D",
    currStreakNum: "#00DC4D",
    sideNums: "#3DDC77",
    currStreakLabel: "#00DC4D",
    sideLabels: "#3DDC77",
    dates: "#CECECE",
    excludeDaysLabel: "#CECECE"
  },
  "solarized-dark": {
    background: "#002B36",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#268BD2",
    fire: "#268BD2",
    currStreakNum: "#B58900",
    sideNums: "#268BD2",
    currStreakLabel: "#B58900",
    sideLabels: "#268BD2",
    dates: "#859900",
    excludeDaysLabel: "#859900"
  },
  "solarized-light": {
    background: "#FDF6E3",
    border: "#ABABAB",
    stroke: "#ABABAB",
    ring: "#268BD2",
    fire: "#268BD2",
    currStreakNum: "#B58900",
    sideNums: "#268BD2",
    currStreakLabel: "#B58900",
    sideLabels: "#268BD2",
    dates: "#859900",
    excludeDaysLabel: "#859900"
  },
  "submarine-flowers": {
    background: "#013E4E",
    border: "#013E4E",
    stroke: "#48FF50",
    ring: "#FF8888",
    fire: "#FF8888",
    currStreakNum: "#FFF000",
    sideNums: "#FFF000",
    currStreakLabel: "#FFF000",
    sideLabels: "#FF8888",
    dates: "#FF8650",
    excludeDaysLabel: "#FF8650"
  },
  "sunset-gradient": {
    background: "45,8A2386,E94056,F27120",
    border: "#850000",
    stroke: "#FFFFFF",
    ring: "#FB8C00",
    fire: "#FB8C00",
    currStreakNum: "#FFFFFF",
    sideNums: "#FFFFFF",
    currStreakLabel: "#FFFFFF",
    sideLabels: "#FFFFFF",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  swift: {
    background: "#F7F7F7",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#000000",
    fire: "#000000",
    currStreakNum: "#F05237",
    sideNums: "#000000",
    currStreakLabel: "#F05237",
    sideLabels: "#000000",
    dates: "#000000",
    excludeDaysLabel: "#000000"
  },
  synthwave: {
    background: "#2B213A",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#E2E9EC",
    fire: "#E2E9EC",
    currStreakNum: "#EF8539",
    sideNums: "#E2E9EC",
    currStreakLabel: "#EF8539",
    sideLabels: "#E2E9EC",
    dates: "#E5289E",
    excludeDaysLabel: "#E5289E"
  },
  taiga: {
    background: "#031B1B",
    border: "#062E2F",
    stroke: "#062E2F",
    ring: "#1F8F92",
    fire: "#1FBABE",
    currStreakNum: "#1FBABE",
    sideNums: "#1F8F92",
    currStreakLabel: "#1F8F92",
    sideLabels: "#1FBABE",
    dates: "#1F8F92",
    excludeDaysLabel: "#1F8F92"
  },
  telegram: {
    background: "#FFFFFF",
    border: "#333333",
    stroke: "#333333",
    ring: "#0088CC",
    fire: "#179CDE",
    currStreakNum: "#179CDE",
    sideNums: "#0088CC",
    currStreakLabel: "#179CDE",
    sideLabels: "#0088CC",
    dates: "#0088CC",
    excludeDaysLabel: "#0088CC"
  },
  "telegram-gradient": {
    background: "45,0088CC,179CDE",
    border: "#FFFFFF",
    stroke: "#FFFFFF",
    ring: "#FFFFFF",
    fire: "#FFFFFF",
    currStreakNum: "#FFFFFF",
    sideNums: "#FFFFFF",
    currStreakLabel: "#FFFFFF",
    sideLabels: "#FFFFFF",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  terafox: {
    background: "#152528",
    border: "#2F3239",
    stroke: "#E85C51",
    ring: "#7AA4A1C8",
    fire: "#7AA4A1",
    currStreakNum: "#5A93AA",
    sideNums: "#A1CDD8",
    currStreakLabel: "#EBEBEB",
    sideLabels: "#EBEBEB",
    dates: "#FDA47F",
    excludeDaysLabel: "#E85C51"
  },
  tokyonight: {
    background: "#1A1B27",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#70A5FD",
    fire: "#70A5FD",
    currStreakNum: "#BF91F3",
    sideNums: "#70A5FD",
    currStreakLabel: "#BF91F3",
    sideLabels: "#70A5FD",
    dates: "#38BDAE",
    excludeDaysLabel: "#38BDAE"
  },
  "tokyonight-duo": {
    background: "#0000",
    border: "#A8A8A8",
    stroke: "#A8A8A8",
    ring: "#70A5FD",
    fire: "#70A5FD",
    currStreakNum: "#BF91F3",
    sideNums: "#70A5FD",
    currStreakLabel: "#BF91F3",
    sideLabels: "#70A5FD",
    dates: "#38BDAE",
    excludeDaysLabel: "#38BDAE"
  },
  transparent: {
    background: "#0000",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#006AFF",
    fire: "#006AFF",
    currStreakNum: "#0579C3",
    sideNums: "#006AFF",
    currStreakLabel: "#0579C3",
    sideLabels: "#006AFF",
    dates: "#417E87",
    excludeDaysLabel: "#417E87"
  },
  "travelers-theme": {
    background: "#150E1F",
    border: "#E4E2E2",
    stroke: "#F28157",
    ring: "#F28157",
    fire: "#F28157",
    currStreakNum: "#F2F2F2",
    sideNums: "#F28157",
    currStreakLabel: "#F2F2F2",
    sideLabels: "#F2F2F2",
    dates: "#F2F2F2",
    excludeDaysLabel: "#464646"
  },
  "violet-dark": {
    background: "#000000",
    border: "#FF0089",
    stroke: "#FF0089",
    ring: "#FF0089",
    fire: "#FF0089",
    currStreakNum: "#FF0089",
    sideNums: "#FF0089",
    currStreakLabel: "#FF0089",
    sideLabels: "#FF0089",
    dates: "#FF0089",
    excludeDaysLabel: "#FF0089"
  },
  "violet-punch": {
    background: "#000000",
    border: "#E4E2E2",
    stroke: "#B170FC",
    ring: "#3934DD",
    fire: "#D0DDAD",
    currStreakNum: "#CB0B45",
    sideNums: "#7B43FF",
    currStreakLabel: "#AFB5DD",
    sideLabels: "#AFB5DD",
    dates: "#DDDDDD",
    excludeDaysLabel: "#DDDDDD"
  },
  "vision-friendly-dark": {
    background: "#000000",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FFB000",
    fire: "#FFB000",
    currStreakNum: "#785EF0",
    sideNums: "#FFB000",
    currStreakLabel: "#785EF0",
    sideLabels: "#FFB000",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  vitesse: {
    background: "#000000",
    border: "#4D9375",
    stroke: "#5D99A9",
    ring: "#4D9375",
    fire: "#CB7676",
    currStreakNum: "#B8A965",
    sideNums: "#4D9375",
    currStreakLabel: "#80A665",
    sideLabels: "#80A665",
    dates: "#BD976A",
    excludeDaysLabel: "#758575DD"
  },
  vue: {
    background: "#FFFEFE",
    border: "#A8A8A8",
    stroke: "#A8A8A8",
    ring: "#41B883",
    fire: "#41B883",
    currStreakNum: "#41B883",
    sideNums: "#41B883",
    currStreakLabel: "#41B883",
    sideLabels: "#41B883",
    dates: "#273849",
    excludeDaysLabel: "#273849"
  },
  "vue-dark": {
    background: "#273849",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#41B883",
    fire: "#41B883",
    currStreakNum: "#41B883",
    sideNums: "#41B883",
    currStreakLabel: "#41B883",
    sideLabels: "#41B883",
    dates: "#FFFEFE",
    excludeDaysLabel: "#FFFEFE"
  },
  "whatsapp-dark": {
    background: "#121B22",
    border: "#1B2832",
    stroke: "#273741",
    ring: "#273741",
    fire: "#E3E7EA",
    currStreakNum: "#00A884",
    sideNums: "#00A884",
    currStreakLabel: "#E3E7EA",
    sideLabels: "#E3E7EA",
    dates: "#888D90",
    excludeDaysLabel: "#888D90"
  },
  "whatsapp-dark2": {
    background: "#0B141B",
    border: "#103629",
    stroke: "#103629",
    ring: "#858A8D",
    fire: "#858A8D",
    currStreakNum: "#21C063",
    sideNums: "#21C063",
    currStreakLabel: "#F7F8FA",
    sideLabels: "#F7F8FA",
    dates: "#858A8D",
    excludeDaysLabel: "#FFD179"
  },
  "whatsapp-light": {
    background: "#FFFFFF",
    border: "#E4E2E2",
    stroke: "#008069",
    ring: "#008069",
    fire: "#121B22",
    currStreakNum: "#16D351",
    sideNums: "#16D351",
    currStreakLabel: "#121B22",
    sideLabels: "#121B22",
    dates: "#73828A",
    excludeDaysLabel: "#73828A"
  },
  "whatsapp-light2": {
    background: "#FFFFFF",
    border: "#D8FDD2",
    stroke: "#D8FDD2",
    ring: "#767B7D",
    fire: "#767B7D",
    currStreakNum: "#1DAB61",
    sideNums: "#1DAB61",
    currStreakLabel: "#131A20",
    sideLabels: "#131A20",
    dates: "#767B7D",
    excludeDaysLabel: "#E5A732"
  },
  "windows-dark": {
    background: "#000000",
    border: "#00A4EF",
    stroke: "#00A4EF",
    ring: "#00A4EF",
    fire: "#00A4EF",
    currStreakNum: "#00A4EF",
    sideNums: "#00A4EF",
    currStreakLabel: "#00A4EF",
    sideLabels: "#00A4EF",
    dates: "#00A4EF",
    excludeDaysLabel: "#00A4EF"
  },
  yeblu: {
    background: "#002046",
    border: "#E4E2E2",
    stroke: "#E4E2E2",
    ring: "#FFFF00",
    fire: "#FFFF00",
    currStreakNum: "#FFFF00",
    sideNums: "#FFFF00",
    currStreakLabel: "#FFFF00",
    sideLabels: "#FFFF00",
    dates: "#FFFFFF",
    excludeDaysLabel: "#FFFFFF"
  },
  yellowdark: {
    background: "#000000",
    border: "#000000",
    stroke: "#A5A5A5",
    ring: "#FFEF00",
    fire: "#FF8000",
    currStreakNum: "#FFEF00",
    sideNums: "#FFEF00",
    currStreakLabel: "#FFEF00",
    sideLabels: "#FFEF00",
    dates: "#A5A5A5",
    excludeDaysLabel: "#A5A5A5"
  },
  "youtube-dark": {
    background: "#0F0F0F",
    border: "#272727",
    stroke: "#272727",
    ring: "#FFFFFF",
    fire: "#FFFFFF",
    currStreakNum: "#FF0000",
    sideNums: "#FF0000",
    currStreakLabel: "#FFFFFF",
    sideLabels: "#FFFFFF",
    dates: "#BCBCBC",
    excludeDaysLabel: "#FFFFFF"
  }
};

// src/theme.ts
var themes = themes_default;
function normalizeThemeName2(name) {
  return (name ?? "").trim().toLowerCase().replace(/_/g, "-");
}
function resolveTheme(name, overrides, hideBorder) {
  const normalized = normalizeThemeName2(name);
  const base = Object.prototype.hasOwnProperty.call(themes, normalized) ? themes[normalized] : themes["default"];
  if (!base) {
    throw new Error(
      "theme.ts: themes.json is missing a 'default' theme entry \u2014 cannot resolve any theme."
    );
  }
  const resolved = { ...base, ...overrides };
  if (hideBorder) {
    resolved.border = "#0000";
  }
  return resolved;
}

// src/layout.ts
var CANONICAL_ORDER = [
  "profile",
  "solved",
  "streak",
  "skills",
  "languages",
  "heatmap"
];
function sortCanonical(sections) {
  const set = new Set(sections);
  return CANONICAL_ORDER.filter((s) => set.has(s));
}
function vline(x, y1, y2) {
  return { kind: "v", a: x, b1: y1, b2: y2 };
}
function hline(y, x1, x2) {
  return { kind: "h", a: y, b1: x1, b2: x2 };
}
function middleRowLayout(sections) {
  return {
    width: 840,
    height: 198,
    placements: [
      { section: sections[0], x: 24, y: 22, w: 792 },
      { section: sections[1], x: 24, y: 100, w: 792 }
    ],
    dividers: []
  };
}
function fullDashboard(middle) {
  return {
    width: 840,
    height: 440,
    placements: [
      { section: "profile", x: 24, y: 22, w: 306 },
      { section: "solved", x: 24, y: 78, w: 306 },
      { section: "streak", x: 340, y: 30, w: 470 },
      { section: middle, x: 350, y: 162, w: 460 },
      { section: "heatmap", x: 24, y: 256, w: 792 }
    ],
    dividers: [vline(330, 24, 196), hline(148, 350, 816), hline(240, 24, 816)]
  };
}
var EXPLICIT = {
  "profile,solved,streak,skills,heatmap": fullDashboard("skills"),
  "profile,solved,streak,languages,heatmap": fullDashboard("languages"),
  "profile,solved": {
    width: 340,
    height: 200,
    placements: [
      { section: "profile", x: 24, y: 22, w: 306 },
      { section: "solved", x: 12, y: 78, w: 316 }
    ],
    dividers: []
  },
  solved: {
    width: 340,
    height: 140,
    placements: [{ section: "solved", x: 12, y: 22, w: 316 }],
    dividers: []
  },
  streak: {
    width: 500,
    height: 128,
    placements: [{ section: "streak", x: 15, y: 22, w: 470 }],
    dividers: []
  },
  heatmap: {
    width: 840,
    height: 200,
    placements: [{ section: "heatmap", x: 24, y: 20, w: 792 }],
    dividers: []
  },
  "profile,solved,streak": {
    width: 840,
    height: 220,
    placements: [
      { section: "profile", x: 24, y: 22, w: 306 },
      { section: "solved", x: 24, y: 78, w: 306 },
      { section: "streak", x: 340, y: 60, w: 470 }
    ],
    dividers: [vline(330, 24, 196)]
  },
  profile: {
    width: 340,
    height: 80,
    placements: [{ section: "profile", x: 24, y: 22, w: 306 }],
    dividers: []
  },
  skills: {
    width: 840,
    height: 120,
    placements: [{ section: "skills", x: 24, y: 22, w: 792 }],
    dividers: []
  },
  languages: {
    width: 840,
    height: 120,
    placements: [{ section: "languages", x: 24, y: 22, w: 792 }],
    dividers: []
  },
  "skills,languages": middleRowLayout(["skills", "languages"])
};
var MARGIN = 24;
var CARD_W = 840;
var LEFT_W = 306;
var RIGHT_X = 340;
var RIGHT_W = 470;
var DIVIDER_X = 330;
var PROFILE_H = 56;
var SOLVED_ALONE_H = 116;
var SOLVED_AFTER_PROFILE_H = 118;
var STREAK_CONTENT_H = 98;
var ROW_GAP = 24;
var SKILLS_ROW_H = 78;
var HEATMAP_H = 180;
function genericLayout(secs) {
  const leftSecs = secs.filter((s) => s === "profile" || s === "solved");
  const hasStreak = secs.includes("streak");
  const middleSecs = secs.filter((s) => s === "skills" || s === "languages");
  const hasHeatmap = secs.includes("heatmap");
  const placements = [];
  const dividers = [];
  let y = MARGIN;
  let lastKind = "none";
  if (leftSecs.length > 0 || hasStreak) {
    const hasP = leftSecs.includes("profile");
    const hasS = leftSecs.includes("solved");
    let leftBottom = y;
    if (leftSecs.length > 0) {
      const profileY = y - 2;
      if (hasP) placements.push({ section: "profile", x: MARGIN, y: profileY, w: LEFT_W });
      const solvedY = hasP ? profileY + 56 : profileY;
      if (hasS) placements.push({ section: "solved", x: MARGIN, y: solvedY, w: LEFT_W });
      leftBottom = hasS ? solvedY + (hasP ? SOLVED_AFTER_PROFILE_H : SOLVED_ALONE_H) : profileY + PROFILE_H;
    }
    let rightBottom = y;
    if (hasStreak) {
      const streakY = leftSecs.length > 0 ? y + Math.max(6, (leftBottom - y - STREAK_CONTENT_H) / 2) : y + 6;
      placements.push({ section: "streak", x: RIGHT_X, y: Math.round(streakY), w: RIGHT_W });
      rightBottom = streakY + STREAK_CONTENT_H;
    }
    const rowBottom = Math.max(leftBottom, rightBottom, y + PROFILE_H);
    if (leftSecs.length > 0 && hasStreak) {
      dividers.push(vline(DIVIDER_X, y, Math.round(rowBottom)));
    }
    y = Math.round(rowBottom) + ROW_GAP;
    lastKind = "top";
  }
  for (const sec of middleSecs) {
    if (lastKind !== "none") dividers.push(hline(y - 12, MARGIN, CARD_W - MARGIN));
    placements.push({ section: sec, x: MARGIN, y, w: CARD_W - MARGIN * 2 });
    y += SKILLS_ROW_H;
    lastKind = "middle";
  }
  if (hasHeatmap) {
    if (lastKind !== "none") dividers.push(hline(y - 12, MARGIN, CARD_W - MARGIN));
    placements.push({ section: "heatmap", x: MARGIN, y, w: CARD_W - MARGIN * 2 });
    y += HEATMAP_H;
    lastKind = "heatmap";
  }
  const height = lastKind === "heatmap" ? y : y + 20;
  return { width: CARD_W, height, placements, dividers };
}
function layout(sections) {
  const secs = sortCanonical(sections);
  if (secs.length === 0) {
    return { width: 340, height: 80, placements: [], dividers: [] };
  }
  const key = secs.join(",");
  const explicit = EXPLICIT[key];
  if (explicit) return explicit;
  return genericLayout(secs);
}

// src/logo.ts
var LOGO_ON_LIGHT = "data:image/png;base64,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";
var LOGO_ON_DARK = "data:image/png;base64,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";

// src/sections/profile.ts
var FONT = "'Segoe UI', Ubuntu, sans-serif";
var GRADIENT_STOP_RE = /^[0-9a-fA-F]{3,8}$/;
function hex6Luminance(rgb) {
  const r = parseInt(rgb.slice(0, 2), 16);
  const g = parseInt(rgb.slice(2, 4), 16);
  const b = parseInt(rgb.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function expandShorthandHex(hex) {
  return hex.length === 3 || hex.length === 4 ? hex.split("").map((c) => c + c).join("") : hex;
}
function colorLuminance(value) {
  const raw = typeof value === "string" ? value.trim() : "";
  const parts = raw.split(",");
  if (parts.length >= 3) {
    const stopLums = [];
    for (const stopRaw of parts.slice(1)) {
      const stop = stopRaw.trim();
      if (!GRADIENT_STOP_RE.test(stop)) continue;
      const hex2 = expandShorthandHex(stop);
      const rgb = hex2.length === 8 ? hex2.slice(0, 6) : hex2;
      if (rgb.length === 6) stopLums.push(hex6Luminance(rgb));
    }
    if (stopLums.length === 0) return null;
    return stopLums.reduce((a, b) => a + b, 0) / stopLums.length;
  }
  if (!raw.startsWith("#")) return null;
  let hex = expandShorthandHex(raw.slice(1));
  if (hex.length === 8) {
    const alphaByte = parseInt(hex.slice(6, 8), 16);
    const alpha = Number.isFinite(alphaByte) ? alphaByte / 255 : 1;
    if (alpha < 0.25) return null;
    hex = hex.slice(0, 6);
  }
  if (hex.length === 6 && /^[0-9a-fA-F]{6}$/.test(hex)) return hex6Luminance(hex);
  return null;
}
function pickLogo(theme) {
  let bgLum = colorLuminance(theme.background);
  if (bgLum === null) {
    const sideLum = colorLuminance(theme.sideNums);
    bgLum = 1 - (sideLum === null ? 0.5 : sideLum);
  }
  return bgLum < 0.5 ? LOGO_ON_DARK : LOGO_ON_LIGHT;
}
function text(x, y, size, weight, fill, s, anchor = "middle", extra = "") {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" ${fillAttrs(fill, "fill")} font-family="${FONT}" font-weight="${weight}" font-size="${size}px" ${extra}>${escapeXml(String(s))}</text>`;
}
function fadeIn(opts, delay) {
  return opts.animate ? ` style="opacity:0;animation:pf_fade_${opts.uid} .5s ease-out ${delay}s both"` : "";
}
function render(theme, data, x, y, w, opts) {
  const cx = x + Math.max(34, w) - 34;
  const cy = y + 13;
  const username = data.username || "?";
  const initial = username.slice(0, 1).toUpperCase();
  const avatar = data.avatarDataUri ? `<clipPath id="av_${opts.uid}"><circle cx="${cx}" cy="${cy}" r="16"/></clipPath>
      <circle cx="${cx}" cy="${cy}" r="17" fill="none" ${fillAttrs(theme.ring, "stroke")} stroke-width="1.5"${fadeIn(opts, 0.5)}/>
      <image href="${escapeXml(data.avatarDataUri)}" x="${cx - 16}" y="${cy - 16}" width="32" height="32" clip-path="url(#av_${opts.uid})"${fadeIn(opts, 0.55)}/>` : `<circle cx="${cx}" cy="${cy}" r="16" ${fillAttrs(theme.ring, "fill", 0.2)}${fadeIn(opts, 0.5)}/>
      ${text(cx, cy + 5, 14, 700, theme.sideNums, initial)}`;
  const style = opts.animate ? `<style>@media (prefers-reduced-motion: no-preference){@keyframes pf_fade_${opts.uid}{from{opacity:0}to{opacity:1}}}</style>` : "";
  return `${style}
    <image href="${pickLogo(theme)}" x="${x}" y="${y}" width="26" height="26"${fadeIn(opts, 0.4)}/>
    ${text(x + 34, y + 14, 16, 700, theme.sideNums, username, "start", fadeIn(opts, 0.4))}
    ${text(x + 34, y + 30, 11, 400, theme.dates, `Rank ${formatNumber(data.rank, false)}`, "start", fadeIn(opts, 0.45))}
    ${avatar}`;
}

// src/sections/solved.ts
var FONT2 = "'Segoe UI', Ubuntu, sans-serif";
var DIFF_COLORS = {
  easy: "#00B8A3",
  medium: "#FFC01E",
  hard: "#FF375F"
};
var DIFFS = ["easy", "medium", "hard"];
function text2(x, y, size, weight, fill, s, anchor = "middle", extra = "") {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" ${fillAttrs(fill, "fill")} font-family="${FONT2}" font-weight="${weight}" font-size="${size}px" ${extra}>${escapeXml(String(s))}</text>`;
}
function fadeIn2(opts, delay) {
  return opts.animate ? ` style="opacity:0;animation:sv_fade_${opts.uid} .5s ease-out ${delay}s both"` : "";
}
function render2(theme, data, x, y, _w, opts) {
  const cx = x + 52;
  const cy = y + 48;
  const r = 33;
  const circumference = 2 * Math.PI * r;
  const totalQ = data.solved.totalQuestions > 0 ? data.solved.totalQuestions : 1;
  const pct = Math.min(1, Math.max(0, data.solved.total / totalQ));
  const dash = (pct * circumference).toFixed(1);
  const ringStyle = opts.animate ? ` style="stroke-dashoffset:${circumference.toFixed(1)};animation:sv_ring_${opts.uid} 1s ease-out .5s both"` : ` style="stroke-dashoffset:0"`;
  const rows = DIFFS.map((d, i) => {
    const stat = data.solved[d];
    const ry = y + 12 + i * 31;
    const barW = 108;
    const tot = stat.total > 0 ? stat.total : 1;
    const bw = Math.max(2, barW * (stat.solved / tot));
    const label = d.charAt(0).toUpperCase() + d.slice(1);
    const barX = x + 172;
    const barY = ry + 2;
    const barStyle = opts.animate ? ` style="transform-origin:${barX}px ${(barY + 3.5).toFixed(1)}px;animation:sv_bar_${opts.uid} .6s ease-out ${(0.6 + i * 0.12).toFixed(2)}s both"` : "";
    return `
      ${text2(x + 118, ry + 9, 11, 600, theme.sideLabels, label, "start", fadeIn2(opts, 0.55 + i * 0.05))}
      ${text2(x + 288, ry + 9, 11, 400, theme.dates, `${formatNumber(stat.solved, opts.short)}/${formatNumber(stat.total, opts.short)}`, "end", fadeIn2(opts, 0.55 + i * 0.05))}
      <rect x="${barX}" y="${barY}" width="${barW}" height="7" rx="3.5" fill="${DIFF_COLORS[d]}" fill-opacity="0.18"/>
      <g${barStyle}><rect x="${barX}" y="${barY}" width="${bw.toFixed(1)}" height="7" rx="3.5" fill="${DIFF_COLORS[d]}"/></g>`;
  }).join("");
  const style = opts.animate ? `<style>@media (prefers-reduced-motion: no-preference){
        @keyframes sv_fade_${opts.uid}{from{opacity:0}to{opacity:1}}
        @keyframes sv_ring_${opts.uid}{from{stroke-dashoffset:${circumference.toFixed(1)}}to{stroke-dashoffset:0}}
        @keyframes sv_bar_${opts.uid}{from{transform:scaleX(0)}to{transform:scaleX(1)}}
      }</style>` : "";
  return `${style}
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" ${fillAttrs(theme.ring, "stroke", 0.18)} stroke-width="6"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" ${fillAttrs(theme.ring, "stroke")} stroke-width="6" stroke-linecap="round" stroke-dasharray="${dash} ${circumference.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"${ringStyle}/>
    ${text2(cx, cy - 2, 22, 700, theme.sideNums, formatNumber(data.solved.total, opts.short), "middle", fadeIn2(opts, 0.4))}
    ${text2(cx, cy + 14, 9, 400, theme.dates, "Solved", "middle", fadeIn2(opts, 0.45))}
    ${rows}`;
}

// src/sections/streak.ts
var FONT3 = "'Segoe UI', Ubuntu, sans-serif";
var FIRE_PATH = "M 1.5 0.67 C 1.5 0.67 2.24 3.32 2.24 5.47 C 2.24 7.53 0.89 9.2 -1.17 9.2 C -3.23 9.2 -4.79 7.53 -4.79 5.47 L -4.76 5.11 C -6.78 7.51 -8 10.62 -8 13.99 C -8 18.41 -4.42 22 0 22 C 4.42 22 8 18.41 8 13.99 C 8 8.6 5.41 3.79 1.5 0.67 Z M -0.29 19 C -2.07 19 -3.51 17.6 -3.51 15.86 C -3.51 14.24 -2.46 13.1 -0.7 12.74 C 1.07 12.38 2.9 11.53 3.92 10.16 C 4.31 11.45 4.51 12.81 4.51 14.2 C 4.51 16.85 2.36 19 -0.29 19 Z";
function text3(x, y, size, weight, fill, s, anchor = "middle", extra = "") {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" ${fillAttrs(fill, "fill")} font-family="${FONT3}" font-weight="${weight}" font-size="${size}px" ${extra}>${escapeXml(String(s))}</text>`;
}
function fadeIn3(opts, delay) {
  return opts.animate ? ` style="opacity:0;animation:st_fade_${opts.uid} .5s ease-out ${delay}s both"` : "";
}
function render3(theme, data, x, y, w, opts) {
  const cols = [w / 6, w / 2, 5 * w / 6].map((v) => x + v);
  const cy = y + 44;
  const [col0, col1, col2] = cols;
  const popStyle = opts.animate ? ` style="animation:st_pop_${opts.uid} .7s cubic-bezier(.34,1.56,.64,1) .9s both"` : "";
  const glow = opts.animate ? `<filter id="glow_ring_${opts.uid}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>
      <g filter="url(#glow_ring_${opts.uid})" opacity="0.5" style="animation:st_glow_${opts.uid} 2.5s ease-in-out infinite alternate">
        <circle cx="${col1}" cy="${cy}" r="28" fill="none" ${fillAttrs(theme.ring, "stroke")} stroke-width="4"/>
        <path d="${FIRE_PATH}" transform="translate(${col1}, ${cy - 36}) scale(0.62)" ${fillAttrs(theme.fire, "fill")}/>
      </g>` : "";
  const style = opts.animate ? `<style>@media (prefers-reduced-motion: no-preference){
        @keyframes st_fade_${opts.uid}{from{opacity:0}to{opacity:1}}
        @keyframes st_pop_${opts.uid}{0%{font-size:0px;opacity:0}70%{font-size:27px}100%{font-size:24px;opacity:1}}
        @keyframes st_glow_${opts.uid}{from{opacity:0.35}to{opacity:0.75}}
      }</style>` : "";
  return `${style}
    ${text3(col0, cy + 8, 24, 700, theme.sideNums, formatNumber(data.totalSubmissions, opts.short), "middle", fadeIn3(opts, 0.4))}
    ${text3(col0, cy + 32, 11, 400, theme.sideLabels, "Total Submissions", "middle", fadeIn3(opts, 0.5))}
    <mask id="rm_${opts.uid}"><rect x="${x}" y="${y - 20}" width="${w}" height="120" fill="white"/><ellipse cx="${col1}" cy="${cy - 28}" rx="9" ry="12" fill="black"/></mask>
    <g mask="url(#rm_${opts.uid})">
      <circle cx="${col1}" cy="${cy}" r="28" fill="none" ${fillAttrs(theme.ring, "stroke")} stroke-width="4"${fadeIn3(opts, 0.4)}/>
    </g>
    ${glow}
    <g transform="translate(${col1}, ${cy - 36}) scale(0.62)"${fadeIn3(opts, 0.6)}>
      <path d="${FIRE_PATH}" ${fillAttrs(theme.fire, "fill")}/>
    </g>
    ${text3(col1, cy + 8, 24, 700, theme.currStreakNum, formatNumber(data.currentStreak, opts.short), "middle", popStyle)}
    ${text3(col1, cy + 46, 11, 700, theme.currStreakLabel, "Current Streak", "middle", fadeIn3(opts, 0.7))}
    ${text3(col2, cy + 8, 24, 700, theme.sideNums, formatNumber(data.highestStreak, opts.short), "middle", fadeIn3(opts, 0.45))}
    ${text3(col2, cy + 32, 11, 400, theme.sideLabels, "Highest Streak", "middle", fadeIn3(opts, 0.55))}`;
}

// src/sections/skills.ts
var FONT4 = "'Segoe UI', Ubuntu, sans-serif";
function text4(x, y, size, weight, fill, s, anchor = "middle", extra = "") {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" ${fillAttrs(fill, "fill")} font-family="${FONT4}" font-weight="${weight}" font-size="${size}px" ${extra}>${escapeXml(String(s))}</text>`;
}
function fadeIn4(opts, kind, delay) {
  return opts.animate ? ` style="opacity:0;animation:${kind}_fade_${opts.uid} .4s ease-out ${Math.min(delay, 1.4).toFixed(2)}s both"` : "";
}
function renderChips(theme, items, x, y, w, header, kind, opts, cap) {
  const totalItems = items.length;
  const cappedItems = items.slice(0, cap);
  let cx = x;
  let cy = y + 22;
  let shown = 0;
  const chips = [];
  for (const item of cappedItems) {
    const label = `${item.name} \xD7${item.count}`;
    const cw = label.length * 6.2 + 18;
    if (cx + cw > x + w) {
      cx = x;
      cy += 26;
      if (cy > y + 52) break;
    }
    const delay = 0.85 + shown * 0.05;
    chips.push(
      `<g${fadeIn4(opts, kind, delay)}>
        <rect x="${cx}" y="${cy}" width="${cw.toFixed(1)}" height="20" rx="10" ${fillAttrs(theme.ring, "fill", 0.14)}/>
        <rect x="${cx}" y="${cy}" width="${cw.toFixed(1)}" height="20" rx="10" fill="none" ${fillAttrs(theme.ring, "stroke", 0.35)}/>
        ${text4(cx + cw / 2, cy + 14, 10.5, 600, theme.sideNums, label)}
      </g>`
    );
    cx += cw + 8;
    shown++;
  }
  let html = text4(x, y + 10, 12, 700, theme.sideLabels, header, "start", fadeIn4(opts, kind, 0.8));
  html += chips.join("");
  if (shown < totalItems) {
    html += text4(
      cx + 4,
      cy + 14,
      10.5,
      400,
      theme.dates,
      `+${totalItems - shown} more`,
      "start",
      fadeIn4(opts, kind, 0.85 + shown * 0.05)
    );
  }
  const style = opts.animate ? `<style>@media (prefers-reduced-motion: no-preference){@keyframes ${kind}_fade_${opts.uid}{from{opacity:0}to{opacity:1}}}</style>` : "";
  return `${style}${html}`;
}
function renderSkills(theme, data, x, y, w, opts) {
  return renderChips(theme, data.skills, x, y, w, "Skills", "sk", opts, opts.topSkills);
}
function renderLanguages(theme, data, x, y, w, opts) {
  return renderChips(theme, data.languages, x, y, w, "Languages", "lg", opts, opts.topLangs);
}

// src/sections/heatmap.ts
var FONT5 = "'Segoe UI', Ubuntu, sans-serif";
var MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
function text5(x, y, size, weight, fill, s, anchor = "middle", extra = "") {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" ${fillAttrs(fill, "fill")} font-family="${FONT5}" font-weight="${weight}" font-size="${size}px" ${extra}>${escapeXml(String(s))}</text>`;
}
function fadeIn5(opts, delay) {
  return opts.animate ? ` style="opacity:0;animation:hm_fade_${opts.uid} .5s ease-out ${delay}s both"` : "";
}
function intensity(n) {
  if (n <= 0) return 0.1;
  if (n <= 2) return 0.3;
  if (n <= 5) return 0.55;
  if (n <= 9) return 0.8;
  return 1;
}
function render4(theme, data, x, y, w, opts) {
  const pitch = 14;
  const cell = 11;
  const weeks = Math.min(52, Math.max(1, Math.floor((w - 30) / pitch)));
  const today = Number.isFinite(opts.today) ? Math.floor(opts.today) : 0;
  const todayDow = new Date(today * 864e5).getUTCDay();
  const gridStart = today - todayDow - (weeks - 1) * 7;
  const todayIso = isoFromEpochDay(today);
  let cells = "";
  let monthLabels = "";
  let lastMonth = -1;
  for (let wk = 0; wk < weeks; wk++) {
    const colDay = gridStart + wk * 7;
    const month = new Date(colDay * 864e5).getUTCMonth();
    if (month !== lastMonth) {
      lastMonth = month;
      monthLabels += text5(
        x + 30 + wk * pitch,
        y + 24,
        9,
        400,
        theme.dates,
        MONTHS[month] ?? "",
        "start"
      );
    }
    for (let d = 0; d < 7; d++) {
      const day = colDay + d;
      if (day > today) break;
      const n = Math.max(0, Math.floor(data.calendar[day] ?? 0));
      const op = intensity(n);
      const title = n > 0 ? `<title>${escapeXml(`${n} submission${n === 1 ? "" : "s"} \xB7 ${displayDate(isoFromEpochDay(day), todayIso)}`)}</title>` : "";
      cells += `<rect x="${x + 30 + wk * pitch}" y="${y + 32 + d * pitch}" width="${cell}" height="${cell}" rx="2" ${fillAttrs(theme.ring, "fill", op)}>${title}</rect>`;
    }
  }
  const legendOps = [0.1, 0.3, 0.55, 0.8, 1];
  const legend = legendOps.map(
    (op, i) => `<rect x="${x + w - 108 + i * 14}" y="${y + 136}" width="11" height="11" rx="2" ${fillAttrs(theme.ring, "fill", op)}/>`
  ).join("");
  const style = opts.animate ? `<style>@media (prefers-reduced-motion: no-preference){@keyframes hm_fade_${opts.uid}{from{opacity:0}to{opacity:1}}}</style>` : "";
  return `${style}
    ${text5(x, y + 10, 12, 700, theme.sideLabels, "Submission Heatmap", "start", fadeIn5(opts, 1))}
    ${monthLabels}
    ${cells}
    ${text5(x + w - 118, y + 145, 9, 400, theme.dates, "Less", "end", fadeIn5(opts, 1.3))}
    ${legend}
    ${text5(x + w - 30, y + 145, 9, 400, theme.dates, "More", "start", fadeIn5(opts, 1.3))}`;
}

// src/card.ts
var RENDERERS = {
  profile: render,
  solved: render2,
  streak: render3,
  skills: renderSkills,
  languages: renderLanguages,
  heatmap: render4
};
var uidCounter = 0;
function nextUid() {
  uidCounter = (uidCounter + 1) % 1e6;
  const rand = Math.random().toString(36).slice(2, 8);
  return `lc${uidCounter}${rand}`;
}
var HEX_STOP_RE = /^[0-9a-fA-F]{3,8}$/;
function buildBackground(background, uid) {
  const safeBackground = typeof background === "string" ? background : "#000000";
  const parts = safeBackground.split(",");
  if (parts.length >= 3) {
    const rotationRaw = Number(parts[0]);
    const rotation = Number.isFinite(rotationRaw) ? rotationRaw : 0;
    const stops = parts.slice(1);
    const stopEls = stops.map((c, i) => {
      const offset = stops.length > 1 ? (i * 100 / (stops.length - 1)).toFixed(1) : "0";
      const hex = HEX_STOP_RE.test(c) ? c : "000000";
      return `<stop offset="${offset}%" stop-color="#${hex}"/>`;
    }).join("");
    return {
      defs: `<linearGradient id="bg_${uid}" gradientTransform="rotate(${rotation})" gradientUnits="userSpaceOnUse">${stopEls}</linearGradient>`,
      fillAttr: `fill="url(#bg_${uid})"`
    };
  }
  return { defs: "", fillAttr: fillAttrs(safeBackground, "fill") };
}
function renderCard(data, params, theme) {
  const cardLayout = layout(params.sections);
  const { width, height, placements, dividers } = cardLayout;
  const uid = nextUid();
  const animate = !params.disableAnimations;
  const today = epochDayNow();
  const radius = Math.max(0, Math.min(params.borderRadius, width / 2, height / 2));
  const { defs: gradientDefs, fillAttr: bgFill } = buildBackground(theme.background, uid);
  const opts = {
    animate,
    uid,
    today,
    short: params.shortNumbers,
    topSkills: params.topSkills,
    topLangs: params.topLangs
  };
  const sectionsMarkup = placements.map((p) => RENDERERS[p.section](theme, data, p.x, p.y, p.w, opts)).join("\n");
  const dividerMarkup = dividers.map(
    (d) => d.kind === "v" ? `<line x1="${d.a}" y1="${d.b1}" x2="${d.a}" y2="${d.b2}" stroke-width="1" ${fillAttrs(theme.stroke, "stroke", 0.6)}/>` : `<line x1="${d.b1}" y1="${d.a}" x2="${d.b2}" y2="${d.a}" stroke-width="1" ${fillAttrs(theme.stroke, "stroke", 0.6)}/>`
  ).join("\n");
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation: isolate">
  <defs>
    ${gradientDefs}
    <clipPath id="clip_${uid}"><rect width="${width}" height="${height}" rx="${radius}"/></clipPath>
  </defs>
  <g clip-path="url(#clip_${uid})">
    <rect ${fillAttrs(theme.border, "stroke")} ${bgFill} rx="${radius}" x="0.5" y="0.5" width="${width - 1}" height="${height - 1}"/>
    ${dividerMarkup}
    ${sectionsMarkup}
  </g>
</svg>`;
}
var SAD_FACE_PATHS = [
  "M0,35.8c-25.2,0-45.7,20.5-45.7,45.7s20.5,45.8,45.7,45.8s45.7-20.5,45.7-45.7S25.2,35.8,0,35.8z M0,122.3c-11.2,0-21.4-4.5-28.8-11.9c-2.9-2.9-5.4-6.3-7.4-10c-3-5.7-4.6-12.1-4.6-18.9c0-22.5,18.3-40.8,40.8-40.8 c10.7,0,20.4,4.1,27.7,10.9c3.8,3.5,6.9,7.7,9.1,12.4c2.6,5.3,4,11.3,4,17.6C40.8,104.1,22.5,122.3,0,122.3z",
  "M4.8,93.8c5.4,1.1,10.3,4.2,13.7,8.6l3.9-3c-4.1-5.3-10-9-16.6-10.4c-10.6-2.2-21.7,1.9-28.3,10.4l3.9,3 C-13.1,95.3-3.9,91.9,4.8,93.8z"
];
function renderErrorCard(message, theme, borderRadius = 4.5) {
  const width = 495;
  const height = 195;
  const uid = nextUid();
  const radius = Math.max(0, Math.min(Number.isFinite(borderRadius) ? borderRadius : 4.5, width / 2, height / 2));
  const cx = width / 2;
  const labelY = height / 2 + 10.5;
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation: isolate">
  <defs>
    <clipPath id="err_clip_${uid}"><rect width="${width}" height="${height}" rx="${radius}"/></clipPath>
  </defs>
  <g clip-path="url(#err_clip_${uid})">
    <rect ${fillAttrs(theme.border, "stroke")} ${fillAttrs(theme.background, "fill")} rx="${radius}" x="0.5" y="0.5" width="${width - 1}" height="${height - 1}"/>
    <g transform="translate(${cx}, 0)">
      <path ${fillAttrs(theme.fire, "fill")} d="${SAD_FACE_PATHS[0]}"/>
      <path ${fillAttrs(theme.fire, "fill")} d="${SAD_FACE_PATHS[1]}"/>
      <circle ${fillAttrs(theme.fire, "fill")} cx="-15" cy="71" r="4.9"/>
      <circle ${fillAttrs(theme.fire, "fill")} cx="15" cy="71" r="4.9"/>
    </g>
    <g transform="translate(${cx}, ${labelY})">
      <text x="0" y="50" dy="0.25em" text-anchor="middle" ${fillAttrs(theme.sideLabels, "fill")} font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="400" font-size="14px">${escapeXml(message)}</text>
    </g>
  </g>
</svg>`;
}

// src/output.ts
function convertHexColor(hexDigits) {
  let hex = hexDigits;
  if (hex.length === 4) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  if (hex.length === 6) {
    return { color: `#${hex}`, opacity: "1.00" };
  }
  const alphaByte = parseInt(hex.slice(6, 8), 16);
  const alpha = Number.isFinite(alphaByte) ? alphaByte / 255 : 1;
  return { color: `#${hex.slice(0, 6)}`, opacity: alpha.toFixed(2) };
}
function convertHexColors(svg) {
  let out = svg.replace(/(fill|stroke)=(['"])transparent\2/gi, '$1="#0000"');
  out = out.replace(
    /(fill|stroke|stop-color)=(['"])#([0-9a-fA-F]{4}|[0-9a-fA-F]{8})\2/g,
    (_match, attr, _quote, hexDigits) => {
      const opacityAttr = attr === "stop-color" ? "stop-opacity" : `${attr}-opacity`;
      const { color, opacity } = convertHexColor(hexDigits);
      return `${attr}="${color}" ${opacityAttr}="${opacity}"`;
    }
  );
  return out;
}
function removeAnimations(svg) {
  let out = svg.replace(/<style>[\s\S]*?<\/style>/g, "");
  out = out.replace(/opacity:\s*0;?/g, "opacity: 1;");
  out = out.replace(/animation(-[a-z]+)?:\s*[^;"']+;?/g, "");
  out = out.replace(/transform-origin:\s*[^;"']+;?/g, "");
  return out;
}
function generateOutput(data, params) {
  const isError = data instanceof RenderableError;
  if (params.output === "json") {
    const body = isError ? JSON.stringify({ error: data.message, code: data.code }) : JSON.stringify(data);
    return { body, contentType: "application/json; charset=utf-8" };
  }
  const theme = resolveTheme(params.theme, params.colorOverrides, params.hideBorder);
  let svg = isError ? renderErrorCard(data.message, theme, params.borderRadius) : renderCard(data, params, theme);
  svg = convertHexColors(svg);
  if (params.disableAnimations) {
    svg = removeAnimations(svg);
  }
  return { body: svg, contentType: "image/svg+xml; charset=utf-8" };
}

// src/handler.ts
var SUCCESS_CACHE_CONTROL = "public, max-age=1800, s-maxage=21600, stale-while-revalidate=86400";
var ERROR_CACHE_CONTROL = "public, s-maxage=300";
async function handler(req, res) {
  const params = parseParams(
    req.query ?? {}
  );
  try {
    const username = process.env.LEETCODE_USERNAME;
    if (!username) {
      throw new RenderableError(
        "Set the LEETCODE_USERNAME environment variable on this deployment.",
        500
      );
    }
    const raw = await fetchRawData(username);
    const streaks = computeStreaks(raw.calendar, epochDayNow());
    const data = { ...raw, ...streaks };
    const { body, contentType } = generateOutput(data, params);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", SUCCESS_CACHE_CONTROL);
    res.status(200).send(body);
  } catch (err) {
    const renderable = err instanceof RenderableError ? err : new RenderableError("Something went wrong rendering this card.", 500);
    const { body, contentType } = generateOutput(renderable, params);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", ERROR_CACHE_CONTROL);
    res.status(200).send(body);
  }
}
