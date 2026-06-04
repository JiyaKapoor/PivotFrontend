import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080";

// Utility: time ago
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

// SVG Icons
const RepoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
  </svg>
);

const ForkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
  </svg>
);

const DotIcon = ({ color = "#3fb950" }) => (
  <svg width="12" height="12" viewBox="0 0 12 12">
    <circle cx="6" cy="6" r="5" fill={color} />
  </svg>
);

const PivotLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#238636" />
    <text x="7" y="23" fontSize="18" fontWeight="bold" fill="white" fontFamily="monospace">P</text>
  </svg>
);

// Language color map
const LANG_COLORS = {
  Java: "#b07219",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  Ruby: "#701516",
  Kotlin: "#A97BFF",
  default: "#8b949e",
};

// New Repo Modal
function NewRepoModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) { setError("Repository name is required."); return; }
    setLoading(true);
    setError("");
    try {
      // Adjust endpoint/body to match your backend
      const userId = localStorage.getItem("userId") || 1;
      const res = await fetch(
  `${API_BASE}/repo/initRepo?repoName=${encodeURIComponent(name.trim())}&userId=${userId}&isPrivate=${isPrivate}`,
  { method: "POST" }
);
      if (!res.ok) throw new Error("Failed to create repository.");
      onCreated();
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>Create a new repository</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={styles.modalBody}>
          <label style={styles.label}>Repository name <span style={{ color: "#f85149" }}>*</span></label>
          <input
            style={styles.input}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="my-awesome-project"
            autoFocus
          />
          <label style={{ ...styles.label, marginTop: 16 }}>Description <span style={{ color: "#8b949e", fontSize: 12 }}>(optional)</span></label>
          <input
            style={styles.input}
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Short description of your repo"
          />
          <div style={styles.radioRow}>
            <label style={styles.radioLabel}>
              <input type="radio" checked={!isPrivate} onChange={() => setIsPrivate(false)} style={{ accentColor: "#238636" }} />
              <span style={{ marginLeft: 8 }}>🔓 Public</span>
            </label>
            <label style={{ ...styles.radioLabel, marginLeft: 24 }}>
              <input type="radio" checked={isPrivate} onChange={() => setIsPrivate(true)} style={{ accentColor: "#238636" }} />
              <span style={{ marginLeft: 8 }}>🔒 Private</span>
            </label>
          </div>
          {error && <div style={styles.errorMsg}>{error}</div>}
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={styles.createBtn} onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create repository"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Repo Card
function RepoCard({ repo }) {
  const langColor = LANG_COLORS[repo.language] || LANG_COLORS.default;

  return (
    <div style={styles.repoCard}>
      <div style={styles.repoCardTop}>
        <div style={styles.repoTitleRow}>
          <RepoIcon />
          <a href={`/repo/${repo.id}`} style={styles.repoName}>{repo.name}</a>
          {repo.isPrivate && <span style={styles.badge}>Private</span>}
        </div>
        <button style={styles.starBtn}>
          <StarIcon />
          <span>Star</span>
        </button>
      </div>
      {repo.description && (
        <p style={styles.repoDesc}>{repo.description}</p>
      )}
      <div style={styles.repoMeta}>
        {repo.language && (
          <span style={styles.metaItem}>
            <DotIcon color={langColor} />
            <span style={{ marginLeft: 4 }}>{repo.language}</span>
          </span>
        )}
        {repo.stars !== undefined && (
          <span style={styles.metaItem}>
            <StarIcon />
            <span style={{ marginLeft: 4 }}>{repo.stars}</span>
          </span>
        )}
        {repo.forks !== undefined && (
          <span style={styles.metaItem}>
            <ForkIcon />
            <span style={{ marginLeft: 4 }}>{repo.forks}</span>
          </span>
        )}
        {repo.updatedAt && (
          <span style={styles.metaItem}>
            Updated {timeAgo(repo.updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
}

// Main Dashboard
export default function Dashboard() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const userId = localStorage.getItem("userId") || 1;

  const fetchRepos = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/repo/listRepos?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch repositories.");
      
      const data = await res.json();

      console.log("repos from backend:", data);
      setRepos(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRepos(); }, []);

  const filtered = repos.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      {/* Top Nav */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <PivotLogo />
          <span style={styles.navBrand}>PivotVCS</span>
        </div>
        <div style={styles.navRight}>
          <div style={styles.navSearch}>
            <SearchIcon />
            <span style={{ marginLeft: 6, color: "#8b949e", fontSize: 14 }}>Search or jump to…</span>
          </div>
          <div style={styles.avatar}>J</div>
        </div>
      </nav>

      {/* Main Layout */}
      <div style={styles.layout}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarProfile}>
            <div style={styles.avatarLarge}>J</div>
            <div>
              <div style={styles.username}>jiya</div>
              <div style={styles.handle}>@jiya · AIML Batch 2028</div>
            </div>
          </div>
          <div style={styles.sidebarStats}>
            <div style={styles.statItem}>
              <StarIcon />
              <span style={{ marginLeft: 6 }}>Stars</span>
            </div>
            <div style={styles.statItem}>
              <ForkIcon />
              <span style={{ marginLeft: 6 }}>Forks</span>
            </div>
          </div>
        </aside>

        {/* Repos Panel */}
        <main style={styles.main}>
          <div style={styles.reposHeader}>
            <div style={styles.searchBar}>
              <SearchIcon />
              <input
                style={styles.searchInput}
                placeholder="Find a repository…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button style={styles.newRepoBtn} onClick={() => setShowModal(true)}>
              <PlusIcon />
              <span>New</span>
            </button>
          </div>

          {loading && (
            <div style={styles.stateBox}>
              <div style={styles.spinner} />
              <span style={{ marginTop: 12, color: "#8b949e" }}>Loading repositories…</span>
            </div>
          )}

          {error && !loading && (
            <div style={styles.errorBox}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <span style={{ marginTop: 8 }}>{error}</span>
              <button style={styles.retryBtn} onClick={fetchRepos}>Retry</button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div style={styles.stateBox}>
              <RepoIcon />
              <span style={{ marginTop: 12, color: "#8b949e" }}>
                {search ? `No repositories match "${search}"` : "No repositories yet. Create your first one!"}
              </span>
            </div>
          )}

          {!loading && !error && filtered.map(repo => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </main>
      </div>

      {showModal && (
        <NewRepoModal
          onClose={() => setShowModal(false)}
          onCreated={fetchRepos}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Geist:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d1117; color: #e6edf3; font-family: 'Geist', -apple-system, sans-serif; }
        a { text-decoration: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0d1117", color: "#e6edf3" },

  // Nav
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 24px", background: "#161b22",
    borderBottom: "1px solid #30363d", position: "sticky", top: 0, zIndex: 100,
  },
  navLeft: { display: "flex", alignItems: "center", gap: 10 },
  navBrand: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 18, color: "#e6edf3", letterSpacing: "-0.5px" },
  navRight: { display: "flex", alignItems: "center", gap: 16 },
  navSearch: {
    display: "flex", alignItems: "center",
    background: "#0d1117", border: "1px solid #30363d",
    borderRadius: 6, padding: "5px 12px", cursor: "pointer",
    color: "#8b949e", minWidth: 220,
  },
  avatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: "linear-gradient(135deg, #238636, #1a7f37)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 14, cursor: "pointer",
  },

  // Layout
  layout: { display: "flex", maxWidth: 1280, margin: "0 auto", padding: "24px 16px", gap: 24, alignItems: "flex-start" },

  // Sidebar
  sidebar: { width: 260, flexShrink: 0, animation: "fadeIn 0.3s ease" },
  sidebarProfile: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 20 },
  avatarLarge: {
    width: 64, height: 64, borderRadius: "50%",
    background: "linear-gradient(135deg, #238636, #1a7f37)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 28,
  },
  username: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 18, textAlign: "center" },
  handle: { color: "#8b949e", fontSize: 13, textAlign: "center", marginTop: 2 },
  sidebarStats: { display: "flex", flexDirection: "column", gap: 8, padding: "12px 0", borderTop: "1px solid #21262d" },
  statItem: { display: "flex", alignItems: "center", color: "#8b949e", fontSize: 14, cursor: "pointer", padding: "4px 0" },

  // Main
  main: { flex: 1, animation: "fadeIn 0.3s ease 0.1s both" },
  reposHeader: { display: "flex", gap: 12, marginBottom: 20, alignItems: "center" },
  searchBar: {
    display: "flex", alignItems: "center", flex: 1,
    background: "#0d1117", border: "1px solid #30363d",
    borderRadius: 6, padding: "6px 12px", color: "#8b949e",
  },
  searchInput: {
    background: "transparent", border: "none", outline: "none",
    color: "#e6edf3", fontSize: 14, marginLeft: 8, flex: 1,
    fontFamily: "'Geist', sans-serif",
  },
  newRepoBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "#238636", color: "#fff", border: "1px solid #2ea043",
    borderRadius: 6, padding: "6px 14px", cursor: "pointer",
    fontSize: 14, fontWeight: 600, fontFamily: "'Geist', sans-serif",
    whiteSpace: "nowrap",
    transition: "background 0.15s",
  },

  // Repo Card
  repoCard: {
    padding: "16px 0", borderBottom: "1px solid #21262d",
    animation: "fadeIn 0.25s ease",
  },
  repoCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  repoTitleRow: { display: "flex", alignItems: "center", gap: 8, color: "#8b949e" },
  repoName: {
    fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
    fontSize: 15, color: "#388bfd",
    transition: "color 0.15s",
  },
  badge: {
    fontSize: 11, padding: "2px 8px", borderRadius: 20,
    border: "1px solid #30363d", color: "#8b949e", fontWeight: 500,
  },
  starBtn: {
    display: "flex", alignItems: "center", gap: 4,
    background: "#21262d", border: "1px solid #30363d",
    color: "#8b949e", borderRadius: 6, padding: "4px 12px",
    cursor: "pointer", fontSize: 13, fontFamily: "'Geist', sans-serif",
  },
  repoDesc: { color: "#8b949e", fontSize: 13, marginBottom: 10, lineHeight: 1.5 },
  repoMeta: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
  metaItem: { display: "flex", alignItems: "center", color: "#8b949e", fontSize: 12 },

  // States
  stateBox: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "48px 0", color: "#8b949e", gap: 8,
  },
  errorBox: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "48px 0", color: "#f85149", gap: 8,
  },
  spinner: {
    width: 28, height: 28, borderRadius: "50%",
    border: "3px solid #21262d", borderTopColor: "#238636",
    animation: "spin 0.7s linear infinite",
  },
  retryBtn: {
    marginTop: 8, background: "#21262d", border: "1px solid #30363d",
    color: "#e6edf3", borderRadius: 6, padding: "6px 16px",
    cursor: "pointer", fontSize: 13,
  },

  // Modal
  modalOverlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "#161b22", border: "1px solid #30363d",
    borderRadius: 12, width: "100%", maxWidth: 480,
    boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
    animation: "fadeIn 0.2s ease",
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 20px", borderBottom: "1px solid #21262d",
  },
  modalTitle: { fontWeight: 600, fontSize: 16 },
  closeBtn: {
    background: "none", border: "none", color: "#8b949e",
    cursor: "pointer", fontSize: 16,
  },
  modalBody: { padding: "20px" },
  label: { display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#e6edf3" },
  input: {
    width: "100%", background: "#0d1117", border: "1px solid #30363d",
    borderRadius: 6, padding: "8px 12px", color: "#e6edf3",
    fontSize: 14, outline: "none", fontFamily: "'JetBrains Mono', monospace",
  },
  radioRow: { display: "flex", alignItems: "center", marginTop: 16 },
  radioLabel: { display: "flex", alignItems: "center", color: "#e6edf3", fontSize: 14, cursor: "pointer" },
  errorMsg: { color: "#f85149", fontSize: 13, marginTop: 12 },
  modalFooter: {
    display: "flex", justifyContent: "flex-end", gap: 10,
    padding: "14px 20px", borderTop: "1px solid #21262d",
  },
  cancelBtn: {
    background: "#21262d", border: "1px solid #30363d", color: "#e6edf3",
    borderRadius: 6, padding: "6px 16px", cursor: "pointer",
    fontSize: 14, fontFamily: "'Geist', sans-serif",
  },
  createBtn: {
    background: "#238636", border: "1px solid #2ea043", color: "#fff",
    borderRadius: 6, padding: "6px 16px", cursor: "pointer",
    fontSize: 14, fontWeight: 600, fontFamily: "'Geist', sans-serif",
  },
};
