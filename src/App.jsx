import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "./App.css";

// ─── i18n ────────────────────────────────────────────────────────────────────

const STRINGS = {
  en: {
    eyebrow: "🎲 Board Night",
    welcome_h1_a: "Find your",
    welcome_h1_em: "perfect",
    welcome_h1_b: "game tonight",
    welcome_sub: "Connect your ratings sheet and we'll pick what to play.",
    sheet_label: "Google Sheets ID",
    sheet_placeholder: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    connect: "Connect →",
    how_title: "How it works",
    how_intro: "Your Google Sheet should have three tabs:",
    how_ratings: "User Ratings",
    how_ratings_desc: "player scores per game (columns = players)",
    how_games: "Board Games",
    how_games_desc: "min/max players, playing time, ownership",
    how_relative: "Relative Ratings",
    how_relative_desc: "optional comparative scores",
    how_note: "Make the sheet",
    how_note_bold: "publicly viewable",
    how_note_end: ", then paste its ID above.",
    err_no_id: "Please paste a Google Sheet ID",
    err_not_found: "Sheet not found — check the ID and sharing settings.",
    home_h1_a: "Who's",
    home_h1_em: "playing",
    home_h1_b: "tonight?",
    disconnect: "← Disconnect sheet",
    players_label: (n) => `Select players (${n} known)`,
    extras_label: "Extra players (guests not in sheet)",
    guests: (n) => `${n} guest${n > 1 ? "s" : ""} without ratings`,
    ready_for: "Ready for",
    player_count: (n) => `${n} player${n > 1 ? "s" : ""}`,
    find_games: "Find games →",
    err_no_players: "Select at least one player or add extras",
    loading: "Loading sheet data…",
    results_h1: (n) => `${n} games`,
    results_h1_for: (n) => `for ${n} player${n > 1 ? "s" : ""}`,
    back: "← Change players",
    search_placeholder: "Search games…",
    score_raw: "Raw",
    score_relative: "Relative",
    owned_filter: "◆ Owned",
    status: (shown, total) => `${shown} of ${total} games shown`,
    col_game: "Game",
    col_skip: "No votes",
    col_avg: "Avg",
    col_var: "Var",
    col_max: "Max",
    col_time: "Time",
    no_results: "No games match your filters",
    legend_skip: "players without a vote for this game",
    legend_avg: "average score among rated players",
    legend_var: "score variance (lower = more agreement)",
    legend_owned: "owned by someone in today's group",
    legend_time: "estimated playing time in minutes",
    time_filter_label: "Max time",
    time_any: "Any",
    time_unit: "min",
    reload: "↻ Reload data",
    reloading: "Reloading…",
  },
  es: {
    eyebrow: "🎲 Noche de Juegos",
    welcome_h1_a: "Encuentra tu",
    welcome_h1_em: "juego perfecto",
    welcome_h1_b: "esta noche",
    welcome_sub: "Conecta tu hoja de puntuaciones y encontramos qué jugar.",
    sheet_label: "ID de Google Sheets",
    sheet_placeholder: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    connect: "Conectar →",
    how_title: "Cómo funciona",
    how_intro: "Tu Google Sheet debe tener tres pestañas:",
    how_ratings: "User Ratings",
    how_ratings_desc: "puntuaciones por juego (columnas = jugadores)",
    how_games: "Board Games",
    how_games_desc: "jugadores mín/máx, tiempo de juego, propietarios",
    how_relative: "Relative Ratings",
    how_relative_desc: "puntuaciones comparativas opcionales",
    how_note: "Haz la hoja",
    how_note_bold: "pública (solo lectura)",
    how_note_end: " y pega su ID arriba.",
    err_no_id: "Pega el ID de la hoja",
    err_not_found: "Hoja no encontrada — comprueba el ID y los permisos.",
    home_h1_a: "¿Quién",
    home_h1_em: "juega",
    home_h1_b: "esta noche?",
    disconnect: "← Desconectar hoja",
    players_label: (n) => `Selecciona jugadores (${n} conocidos)`,
    extras_label: "Jugadores extra (invitados sin puntuaciones)",
    guests: (n) => `${n} invitado${n > 1 ? "s" : ""} sin puntuaciones`,
    ready_for: "Listos",
    player_count: (n) => `${n} jugador${n > 1 ? "es" : ""}`,
    find_games: "Ver juegos →",
    err_no_players: "Selecciona al menos un jugador o añade extras",
    loading: "Cargando datos de la hoja…",
    results_h1: (n) => `${n} juegos`,
    results_h1_for: (n) => `para ${n} jugador${n > 1 ? "es" : ""}`,
    back: "← Cambiar jugadores",
    search_placeholder: "Buscar juegos…",
    score_raw: "Base",
    score_relative: "Relativo",
    owned_filter: "◆ En casa",
    status: (shown, total) => `${shown} de ${total} juegos`,
    col_game: "Juego",
    col_skip: "Sin votos",
    col_avg: "Media",
    col_var: "Var",
    col_max: "Máx",
    col_time: "Tiempo",
    no_results: "Ningún juego cumple los filtros",
    legend_skip: "jugadores sin voto para este juego",
    legend_avg: "media entre jugadores con puntuación",
    legend_var: "varianza (menor = más acuerdo)",
    legend_owned: "alguien del grupo lo tiene en casa",
    legend_time: "tiempo estimado de partida en minutos",
    time_filter_label: "Tiempo máx",
    time_any: "Cualquiera",
    time_unit: "min",
    reload: "↻ Actualizar datos",
    reloading: "Actualizando…",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function scoreColor(val) {
  if (val === "-") return "dash";
  const n = parseFloat(val);
  if (n >= 7) return "high";
  if (n >= 5) return "mid";
  return "low";
}

function parseSheet(arrayBuffer) {
  const data = new Uint8Array(arrayBuffer);
  const arr = Array.from(data, (b) => String.fromCharCode(b)).join("");
  const workbook = XLSX.read(arr, { type: "binary" });

  const result = {
    allPlayers: [],
    games: [],
    baseScores: [],
    relativeScores: [],
    hasRelativeScores: false,
    maxPlayers: [],
    minPlayers: [],
    playingTime: [],
    owners: [],
  };

  workbook.SheetNames.forEach((sheetName) => {
    const rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheetName === "User Ratings") {
      const headers = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })[0];
      const players = [...headers].slice(1).sort();
      result.allPlayers = players;
      rowObject.forEach((element) => {
        if (!element.Name) return;
        result.games.push(element.Name);
        result.baseScores.push(players.map((p) => (typeof element[p] === "number" ? element[p] : -1)));
      });
    } else if (sheetName === "Relative Ratings") {
      result.hasRelativeScores = true;
      rowObject.forEach((element) => {
        if (!element.Name) return;
        result.relativeScores.push(result.allPlayers.map((p) => (typeof element[p] === "number" ? element[p] : -1)));
      });
    } else if (sheetName === "Board Games") {
      rowObject.forEach((element) => {
        if (!element.Name) return;
        result.maxPlayers.push(element["Max players"]);
        result.minPlayers.push(element["Min players"]);
        result.playingTime.push(element["Playing time"]);
        const raw = element["Owned by"];
        result.owners.push(raw ? raw.split(",").map((s) => s.trim()) : []);
      });
    }
  });

  return result;
}

function computeResults(data, selectedPlayers, totalPlayers) {
  const { allPlayers, games, baseScores, relativeScores, hasRelativeScores, maxPlayers, minPlayers, owners, playingTime } = data;
  const results = [];

  for (let i = 0; i < games.length; i++) {
    if (!maxPlayers[i] || !minPlayers[i]) continue;
    if (maxPlayers[i] < totalPlayers || minPlayers[i] > totalPlayers) continue;

    let baseAvg = 0, relAvg = 0, baseMax = -Infinity, baseMin = Infinity, ignore = 0;

    for (const player of selectedPlayers) {
      const idx = allPlayers.indexOf(player);
      if (idx === -1) { ignore++; continue; }
      const bs = baseScores[i]?.[idx] ?? -1;
      if (bs === -1) { ignore++; continue; }
      baseAvg += bs;
      if (bs > baseMax) baseMax = bs;
      if (bs < baseMin) baseMin = bs;
      if (hasRelativeScores) relAvg += (relativeScores[i]?.[idx] ?? 0);
    }

    const known = selectedPlayers.length - ignore;
    if (known > 0) { baseAvg /= known; relAvg /= known; }
    else { baseAvg = -1; relAvg = -1; }

    let variance = -1;
    if (known > 0) {
      let ss = 0;
      for (const player of selectedPlayers) {
        const idx = allPlayers.indexOf(player);
        if (idx === -1) continue;
        const bs = baseScores[i]?.[idx] ?? -1;
        if (bs === -1) continue;
        ss += (baseAvg - bs) ** 2;
      }
      variance = ss / known;
    }

    results.push({
      name: games[i],
      baseAverage: baseAvg >= 0 ? baseAvg.toFixed(2) : "-",
      relativeAverage: relAvg >= 0 ? relAvg.toFixed(2) : "-",
      baseMax: baseMax === -Infinity ? "-" : baseMax,
      baseMin: baseMin === Infinity ? "-" : baseMin,
      variance: variance >= 0 ? variance.toFixed(2) : "-",
      ignored: (ignore + (totalPlayers - selectedPlayers.length)).toString(),
      owned: owners[i]?.length > 0 && (owners[i].includes("All") || selectedPlayers.some((p) => owners[i].includes(p))),
      playingTime: playingTime[i] ?? null,
    });
  }

  return results;
}

// ─── Global Controls (theme + lang) ──────────────────────────────────────────

function GlobalControls({ theme, onThemeToggle, lang, onLangToggle }) {
  return (
    <div className="global-controls" role="toolbar" aria-label="Display settings">
      <button
        className="btn-ghost btn"
        onClick={onLangToggle}
        aria-label={lang === "en" ? "Switch to Spanish" : "Cambiar a inglés"}
        title={lang === "en" ? "Español" : "English"}
      >
        {lang === "en" ? "ES" : "EN"}
      </button>
      <button
        className="btn-ghost btn"
        onClick={onThemeToggle}
        aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        title={theme === "dark" ? "Light mode" : "Dark mode"}
      >
        {theme === "dark" ? "☀" : "☽"}
      </button>
    </div>
  );
}

// ─── Views ───────────────────────────────────────────────────────────────────

function WelcomeView({ onConnect, t }) {
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!id.trim()) { setError(t.err_no_id); return; }
    setError("");
    onConnect(id.trim());
  };

  return (
    <div className="page">
      <div className="header">
        <div className="header-eyebrow">{t.eyebrow}</div>
        <h1>
          {t.welcome_h1_a} <em>{t.welcome_h1_em}</em>
          <br />
          {t.welcome_h1_b}
        </h1>
        <p className="header-sub">{t.welcome_sub}</p>
      </div>

      <div className="card">
        <div className="card-label">{t.sheet_label}</div>
        <div className="input-wrap">
          <input
            className="input"
            placeholder={t.sheet_placeholder}
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            aria-label={t.sheet_label}
          />
          <button className="btn btn-primary" onClick={submit}>
            {t.connect}
          </button>
        </div>
        {error && <div className="error-msg" role="alert">{error}</div>}
      </div>

      <div className="card">
        <div className="card-label">{t.how_title}</div>
        <p className="how-note">{t.how_intro}</p>
        <ul className="how-list">
          <li><strong>{t.how_ratings}</strong> — {t.how_ratings_desc}</li>
          <li><strong>{t.how_games}</strong> — {t.how_games_desc}</li>
          <li><strong>{t.how_relative}</strong> — {t.how_relative_desc}</li>
        </ul>
        <p className="how-note">
          {t.how_note} <strong>{t.how_note_bold}</strong>{t.how_note_end}
        </p>
      </div>
    </div>
  );
}

function HomeView({ data, onResults, onDisconnect, onReload, reloading, t }) {
  const [selected, setSelected] = useState([]);
  const [extra, setExtra] = useState(0);
  const [error, setError] = useState("");

  const totalPlayers = selected.length + extra;

  const togglePlayer = (p) => {
    setSelected((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
    setError("");
  };

  const go = () => {
    if (totalPlayers === 0) { setError(t.err_no_players); return; }
    setError("");
    onResults(selected, totalPlayers);
  };

  return (
    <div className="page">
      <div className="header">
        <div className="header-eyebrow">{t.eyebrow}</div>
        <h1>
          {t.home_h1_a} <em>{t.home_h1_em}</em>
          <br />
          {t.home_h1_b}
        </h1>
      </div>

      <div className="home-nav">
        <button className="nav-back" onClick={onDisconnect}>
          {t.disconnect}
        </button>
        <button className="btn btn-ghost reload-btn" onClick={onReload} disabled={reloading}>
          {reloading ? t.reloading : t.reload}
        </button>
      </div>

      <div className="card">
        <div className="card-label">{t.players_label(data.allPlayers.length)}</div>
        <div className="player-grid" role="group" aria-label={t.players_label(data.allPlayers.length)}>
          {data.allPlayers.map((p) => (
            <div
              key={p}
              role="checkbox"
              aria-checked={selected.includes(p)}
              tabIndex={0}
              className={`player-chip ${selected.includes(p) ? "selected" : ""}`}
              onClick={() => togglePlayer(p)}
              onKeyDown={(e) => (e.key === " " || e.key === "Enter") && togglePlayer(p)}
            >
              <span className="dot" aria-hidden="true" />
              {p}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-label">{t.extras_label}</div>
        <div className="stepper">
          <button
            className="btn btn-icon"
            aria-label="Decrease"
            onClick={() => setExtra((e) => Math.max(0, e - 1))}
          >−</button>
          <span className="stepper-val" aria-live="polite">{extra}</span>
          <button
            className="btn btn-icon"
            aria-label="Increase"
            onClick={() => setExtra((e) => e + 1)}
          >+</button>
          {extra > 0 && <span className="stepper-note">{t.guests(extra)}</span>}
        </div>
      </div>

      {totalPlayers > 0 && (
        <div className="summary-bar" aria-live="polite">
          🎲 <span className="summary-label">{t.ready_for}</span> {t.player_count(totalPlayers)}
          {selected.length > 0 && (
            <> — <span className="summary-label">{selected.join(", ")}{extra > 0 ? ` + ${t.guests(extra)}` : ""}</span></>
          )}
        </div>
      )}

      {error && <div className="error-msg" role="alert">{error}</div>}

      <button className="btn btn-primary" style={{ width: "100%", padding: "16px" }} onClick={go}>
        {t.find_games}
      </button>
    </div>
  );
}

function ResultsView({ data, selectedPlayers, totalPlayers, onBack, t }) {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("base");
  const [sortKey, setSortKey] = useState("baseAverage");
  const [sortDir, setSortDir] = useState(-1);
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [maxTime, setMaxTime] = useState(null); // null = any

  const all = computeResults(data, selectedPlayers, totalPlayers);

  // Build sensible time presets from actual data
  const timesInData = all.map((r) => r.playingTime).filter((t) => typeof t === "number" && t > 0);
  const TIME_PRESETS = [30, 60, 90, 120].filter((p) => timesInData.some((t) => t <= p));

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => -d);
    else { setSortKey(key); setSortDir(-1); }
  };

  const avgKey = mode === "base" ? "baseAverage" : "relativeAverage";

  let rows = [...all];
  if (search) rows = rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));
  if (ownedOnly) rows = rows.filter((r) => r.owned);
  if (maxTime !== null) rows = rows.filter((r) => !r.playingTime || r.playingTime <= maxTime);
  rows.sort((a, b) => {
    const va = a[sortKey], vb = b[sortKey];
    if (va === "-" && vb === "-") return 0;
    if (va === "-") return 1;
    if (vb === "-") return -1;
    return sortDir * (parseFloat(va) - parseFloat(vb));
  });

  const Th = ({ col, label }) => {
    const isActive = sortKey === col;
    const noSort = !col;
    return (
      <div
        className={`th ${isActive ? "active" : ""} ${noSort ? "no-sort" : ""}`}
        onClick={() => col && handleSort(col)}
        role={col ? "button" : undefined}
        tabIndex={col ? 0 : undefined}
        onKeyDown={(e) => col && (e.key === "Enter" || e.key === " ") && handleSort(col)}
        aria-sort={isActive ? (sortDir === -1 ? "descending" : "ascending") : undefined}
      >
        {label}
        {isActive && <span className="th-arrow" aria-hidden="true">{sortDir === -1 ? "↓" : "↑"}</span>}
      </div>
    );
  };

  return (
    <div className="page">
      <div className="header" style={{ paddingBottom: 20 }}>
        <div className="header-eyebrow">{t.eyebrow}</div>
        <h1>
          <em>{t.results_h1(all.length)}</em>
          <br />
          {t.results_h1_for(totalPlayers)}
        </h1>
        {selectedPlayers.length > 0 && (
          <p className="header-sub">{selectedPlayers.join(" · ")}</p>
        )}
      </div>

      <button className="nav-back" onClick={onBack}>{t.back}</button>

      {/* Search + score mode + owned */}
      <div className="toolbar">
        <input
          className="input"
          placeholder={t.search_placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label={t.search_placeholder}
        />
        {(data.hasRelativeScores || true) && (
          <div className="toolbar-toggles">
            {data.hasRelativeScores && (
              <div className="toggle-group" role="group" aria-label="Score type">
                <button
                  className={`toggle-btn ${mode === "base" ? "active" : ""}`}
                  onClick={() => { setMode("base"); setSortKey("baseAverage"); }}
                  aria-pressed={mode === "base"}
                >{t.score_raw}</button>
                <button
                  className={`toggle-btn ${mode === "relative" ? "active" : ""}`}
                  onClick={() => { setMode("relative"); setSortKey("relativeAverage"); }}
                  aria-pressed={mode === "relative"}
                >{t.score_relative}</button>
              </div>
            )}
            <button
              className={`toggle-standalone ${ownedOnly ? "active" : ""}`}
              onClick={() => setOwnedOnly((v) => !v)}
              aria-pressed={ownedOnly}
            >{t.owned_filter}</button>
          </div>
        )}
      </div>

      {/* Time filter */}
      {TIME_PRESETS.length > 0 && (
        <div className="time-filter" role="group" aria-label={t.time_filter_label}>
          <span className="time-filter-label">{t.time_filter_label}</span>
          <div className="time-presets">
            <button
              className={`toggle-btn ${maxTime === null ? "active" : ""}`}
              onClick={() => setMaxTime(null)}
              aria-pressed={maxTime === null}
            >{t.time_any}</button>
            {TIME_PRESETS.map((p) => (
              <button
                key={p}
                className={`toggle-btn ${maxTime === p ? "active" : ""}`}
                onClick={() => setMaxTime(maxTime === p ? null : p)}
                aria-pressed={maxTime === p}
              >≤ {p} {t.time_unit}</button>
            ))}
          </div>
        </div>
      )}

      <div className="status-strip" aria-live="polite">{t.status(rows.length, all.length)}</div>

      <div className="results-table" role="table" aria-label="Game results">
        <div className="table-head" role="row">
          <Th col={null} label={t.col_game} />
          <Th col="ignored" label={t.col_skip} />
          <Th col={avgKey} label={t.col_avg} />
          <Th col="variance" label={t.col_var} />
          <Th col="playingTime" label={t.col_time} />
        </div>
        <div className="table-body">
          {rows.length === 0 ? (
            <div className="no-results">{t.no_results}</div>
          ) : (
            rows.map((row, i) => (
              <div
                key={row.name}
                className="table-row"
                role="row"
                style={{ animationDelay: `${Math.min(i, 20) * 20}ms` }}
              >
                <div className="row-name" role="cell">
                  {row.owned && <span className="owned-dot" title={t.legend_owned} aria-label={t.legend_owned} />}
                  <span className="row-name-text">{row.name}</span>
                </div>
                <div className="row-val muted" role="cell">{row.ignored}</div>
                <div className="row-val" role="cell">
                  <span className={`score-pill ${scoreColor(mode === "base" ? row.baseAverage : row.relativeAverage)}`}>
                    {mode === "base" ? row.baseAverage : row.relativeAverage}
                  </span>
                </div>
                <div className="row-val muted" role="cell">{row.variance}</div>
                <div className="row-val muted" role="cell">
                  {row.playingTime ? (
                    <span className="time-badge">⏱ {row.playingTime}</span>
                  ) : "—"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="legend" aria-label="Column legend">
        <strong>{t.col_skip}</strong> = {t.legend_skip}<br />
        <strong>{t.col_avg}</strong> = {t.legend_avg}<br />
        <strong>{t.col_var}</strong> = {t.legend_var}<br />
        <strong>{t.col_time}</strong> = {t.legend_time}<br />
        <strong>◆</strong> = {t.legend_owned}
      </div>
    </div>
  );
}

// ─── App Shell ───────────────────────────────────────────────────────────────

const LS_ID    = "boardnight_sheet_id";
const LS_THEME = "boardnight_theme";
const LS_LANG  = "boardnight_lang";

export default function App() {
  const [view, setView] = useState("welcome");
  const [sheetData, setSheetData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [players, setPlayers] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [reloading, setReloading] = useState(false);

  const [theme, setTheme] = useState(() => localStorage.getItem(LS_THEME) || "dark");
  const [lang, setLang]   = useState(() => localStorage.getItem(LS_LANG)  || "es");

  const t = STRINGS[lang];

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(LS_THEME, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LS_LANG, lang);
  }, [lang]);

  // Auto-connect on mount if ID saved
  useEffect(() => {
    const saved = localStorage.getItem(LS_ID);
    if (saved) loadSheet(saved);
  }, []);

  const loadSheet = (id) => {
    localStorage.setItem(LS_ID, id);
    setView("loading");
    setLoadError("");

    const url = `https://docs.google.com/spreadsheets/d/${id}/export?format=xlsx&id=${id}`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(t.err_not_found);
        return r.arrayBuffer();
      })
      .then((buf) => {
        setSheetData(parseSheet(buf));
        setView("home");
      })
      .catch((e) => {
        localStorage.removeItem(LS_ID);
        setLoadError(e.message);
        setView("welcome");
      });
  };

  const reloadSheet = () => {
    const id = localStorage.getItem(LS_ID);
    if (!id) return;
    setReloading(true);
    const url = `https://docs.google.com/spreadsheets/d/${id}/export?format=xlsx&id=${id}`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(t.err_not_found);
        return r.arrayBuffer();
      })
      .then((buf) => {
        setSheetData(parseSheet(buf));
      })
      .catch(() => {})
      .finally(() => setReloading(false));
  };

  const disconnect = () => {
    localStorage.removeItem(LS_ID);
    setSheetData(null);
    setView("welcome");
  };

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleLang  = () => setLang((l)  => (l  === "en"   ? "es"    : "en"));

  return (
    <div className="app">
      <GlobalControls
        theme={theme}
        onThemeToggle={toggleTheme}
        lang={lang}
        onLangToggle={toggleLang}
      />

      {view === "welcome" && (
        <>
          <WelcomeView onConnect={loadSheet} t={t} />
          {loadError && (
            <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 100 }}>
              <div className="error-msg" role="alert" style={{ whiteSpace: "nowrap" }}>⚠ {loadError}</div>
            </div>
          )}
        </>
      )}

      {view === "loading" && (
        <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
          <div className="loading-wrap" aria-live="polite" aria-busy="true">
            <div className="spinner" aria-hidden="true" />
            <p>{t.loading}</p>
          </div>
        </div>
      )}

      {view === "home" && sheetData && (
        <HomeView
          data={sheetData}
          onDisconnect={disconnect}
          onReload={reloadSheet}
          reloading={reloading}
          t={t}
          onResults={(p, total) => {
            setPlayers(p);
            setTotalPlayers(total);
            setView("results");
          }}
        />
      )}

      {view === "results" && sheetData && (
        <ResultsView
          data={sheetData}
          selectedPlayers={players}
          totalPlayers={totalPlayers}
          onBack={() => setView("home")}
          t={t}
        />
      )}
    </div>
  );
}