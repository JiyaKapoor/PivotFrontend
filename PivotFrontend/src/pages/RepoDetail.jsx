import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


const API_BASE = "http://localhost:8080";

const timeAgo = (isoString) => {
  if (!isoString) return "";
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const shortSha = (sha) => (sha ? sha.slice(0, 7) : "");

const Icon = {
  Repo: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
    </svg>
  ),
  Branch: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"/>
    </svg>
  ),
  Commit: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z"/>
    </svg>
  ),
  File: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 00.25-.25V6h-2.75A1.75 1.75 0 018 4.25V1.5H3.75zm5 0v2.75c0 .138.112.25.25.25h2.75L8.75 1.5z"/>
    </svg>
  ),
  Folder: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5a.25.25 0 01-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75z"/>
    </svg>
  ),
  Lock: () => (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 4a4 4 0 018 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0112.25 15h-8.5A1.75 1.75 0 012 13.25v-5.5C2 6.784 2.784 6 3.75 6H4V4zm4-2.5A2.5 2.5 0 005.5 4v2h5V4A2.5 2.5 0 008 1.5z"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"/>
    </svg>
  ),
};

// ── BranchSelector ────────────────────────────────────────────────────────────

function BranchSelector({ branches, current, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#21262d", border: "1px solid #30363d",
          color: "#c9d1d9", borderRadius: 6, padding: "5px 12px",
          fontSize: 13, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        <Icon.Branch />
        <span style={{ fontWeight: 600 }}>{current}</span>
        <Icon.ChevronDown />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "110%", left: 0, zIndex: 50,
          background: "#161b22", border: "1px solid #30363d",
          borderRadius: 6, minWidth: 200, boxShadow: "0 8px 24px #010409",
        }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid #21262d", fontSize: 12, color: "#8b949e" }}>
            Switch branches
          </div>
          {branches.map((b) => (
            <div
              key={b}
              onClick={() => { onSelect(b); setOpen(false); }}
              style={{
                padding: "8px 16px", fontSize: 13, cursor: "pointer",
                color: b === current ? "#58a6ff" : "#c9d1d9",
                background: b === current ? "#1f2937" : "transparent",
                display: "flex", alignItems: "center", gap: 8,
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#21262d"}
              onMouseLeave={e => e.currentTarget.style.background = b === current ? "#1f2937" : "transparent"}
            >
              {b === current && <span style={{ color: "#58a6ff" }}>✓</span>}
              {b}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── FileTree ──────────────────────────────────────────────────────────────────

function FileTree({ files, onFileOpen }) {
  const [expanded, setExpanded] = useState({});

  const toggle = (path) => setExpanded(p => ({ ...p, [path]: !p[path] }));

  const buildTree = (paths) => {
    const root = {};
    for (const p of paths) {
      const parts = p.split("/");
      let node = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!node[part]) node[part] = i === parts.length - 1 ? null : {};
        if (i < parts.length - 1) node = node[part];
      }
    }
    return root;
  };

  const renderNode = (node, path = "", depth = 0) => {
    return Object.entries(node).map(([name, children]) => {
      const fullPath = path ? `${path}/${name}` : name;
      const isDir = children !== null;
      const isOpen = expanded[fullPath];
      return (
        <div key={fullPath}>
          <div
            onClick={() => isDir ? toggle(fullPath) : onFileOpen(fullPath)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 12px", paddingLeft: 12 + depth * 16,
              fontSize: 13, color: "#c9d1d9", cursor: "pointer",
              borderBottom: "1px solid #21262d",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#161b22"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ color: isDir ? "#58a6ff" : "#8b949e" }}>
              {isDir ? <Icon.Folder /> : <Icon.File />}
            </span>
            <span style={{ color: isDir ? "#58a6ff" : "#c9d1d9" }}>{name}</span>
          </div>
          {isDir && isOpen && renderNode(children, fullPath, depth + 1)}
        </div>
      );
    });
  };

  const tree = buildTree(files);
  return (
    <div style={{ border: "1px solid #30363d", borderRadius: 6, overflow: "hidden" }}>
      <div style={{
        background: "#161b22", padding: "8px 12px",
        fontSize: 13, color: "#8b949e", borderBottom: "1px solid #30363d",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <Icon.File /> Files
      </div>
      {renderNode(tree)}
    </div>
  );
}

function CommitHistory({ commits, selectedCommit, onCommitClick }) {
  return (
    <div style={{ border: "1px solid #30363d", borderRadius: 6, overflow: "hidden" }}>
      <div style={{
        background: "#161b22", padding: "8px 12px", borderBottom: "1px solid #30363d",
        fontSize: 13, color: "#8b949e", display: "flex", alignItems: "center", gap: 6,
      }}>
        <Icon.Commit /> Commits
      </div>
      {commits.map((c, i) => {
        const isSelected = selectedCommit === c.sha;
        return (
          <div key={c.sha || i}
            onClick={() => onCommitClick(c.sha)}
            style={{
              padding: "10px 14px",
              borderBottom: i < commits.length - 1 ? "1px solid #21262d" : "none",
              display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
              cursor: "pointer",
              background: isSelected ? "#1f2937" : "transparent",
              borderLeft: isSelected ? "2px solid #58a6ff" : "2px solid transparent",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#161b22"}
            onMouseLeave={e => e.currentTarget.style.background = isSelected ? "#1f2937" : "transparent"}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, color: "#c9d1d9", marginBottom: 3, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {c.message || "No commit message"}
              </div>
              <div style={{ fontSize: 12, color: "#8b949e" }}>
                {c.author?.username} · {timeAgo(c.timestamp || c.createdAt)}
              </div>
            </div>
            <span style={{
              fontFamily: "monospace", fontSize: 12, color: "#58a6ff",
              background: "#1f2937", padding: "2px 8px", borderRadius: 6,
              border: "1px solid #30363d", whiteSpace: "nowrap",
            }}>
              {shortSha(c.sha)}
            </span>
          </div>
        );
      })}
      {commits.length === 0 && (
        <div style={{ padding: 24, color: "#8b949e", fontSize: 13, textAlign: "center" }}>No commits yet</div>
      )}
    </div>
  );
}

// ── FileViewer ────────────────────────────────────────────────────────────────

function FileViewer({ file, loading, onClose }) {
  if (!loading && !file) return null;
  return (
    <div style={{ marginTop: 20, border: "1px solid #30363d", borderRadius: 6, overflow: "hidden" }}>
      <div style={{
        background: "#161b22", padding: "8px 14px", borderBottom: "1px solid #30363d",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#c9d1d9" }}>
          <Icon.File />
          <span>{file?.name}</span>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none", color: "#8b949e",
          cursor: "pointer", fontSize: 16, lineHeight: 1,
        }}>✕</button>
      </div>
      <div style={{ background: "#0d1117", padding: 16, overflowX: "auto" }}>
        {loading ? (
          <div style={{ color: "#8b949e", fontSize: 13 }}>Loading…</div>
        ) : (
          <pre style={{
            margin: 0, fontSize: 13, lineHeight: 1.6,
            color: "#c9d1d9", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-wrap",
          }}>
            {file?.content}
          </pre>
        )}
      </div>
    </div>
  );
}

// ── RepoDetail (main) ─────────────────────────────────────────────────────────

export default function RepoDetail() {
  const { repoId } = useParams();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFile, setOpenFile] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [selectedCommit, setSelectedCommit] = useState(null);   // ← move here
  const [commitFiles, setCommitFiles] = useState(null); 

  const fetchDetail = async (branchName) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ repoId, userId });
      if (branchName) params.append("branchName", branchName);
      const res = await fetch(`${API_BASE}/repo/repo-detail?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setBranch(json.currentBranch);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCommitClick = async (sha) => {
  setSelectedCommit(sha);
  setOpenFile(null);
  try {
    const res = await fetch(
      `${API_BASE}/repo/${repoId}/commits/${sha}/files`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const files = await res.json();
    setCommitFiles(files);
  } catch (e) {
    console.error("Failed to load files at commit", e);
  }
};

  const handleFileOpen = async (filename) => {
  const commitSha = selectedCommit ?? data?.commits?.[0]?.sha;
  if (!commitSha) return;
  setFileLoading(true);
  setOpenFile(null);
  try {
    const res = await fetch(
      `${API_BASE}/repo/${repoId}/commits/${commitSha}/files/${encodeURIComponent(filename)}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const content = await res.text();
    setOpenFile({ name: filename, content });
  } catch (e) {
    setOpenFile({ name: filename, content: `Error loading file: ${e.message}` });
  } finally {
    setFileLoading(false);
  }
};

  useEffect(() => {
    if (repoId && userId) {
      fetchDetail(null);
    } else {
      setError("Missing repoId or userId. Make sure you're logged in.");
      setLoading(false);
    }
  }, [repoId, userId]);

  const styles = {
    root: { minHeight: "100vh", background: "#0d1117", color: "#c9d1d9", fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" },
    navbar: { background: "#161b22", borderBottom: "1px solid #30363d", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 100 },
    logo: { background: "#238636", color: "#fff", borderRadius: 6, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 },
    logoText: { fontWeight: 700, fontSize: 16, color: "#c9d1d9", letterSpacing: "-0.3px" },
    container: { maxWidth: 1100, margin: "0 auto", padding: "24px 16px" },
    breadcrumb: { display: "flex", alignItems: "center", gap: 6, marginBottom: 10, fontSize: 20, fontWeight: 600 },
    badge: { fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20, border: "1px solid #30363d", color: "#8b949e", background: "transparent", display: "flex", alignItems: "center", gap: 4 },
    toolbar: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #21262d" },
    grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 },
  };

  const Navbar = () => (
    <nav style={styles.navbar}>
      <div style={styles.logo}>P</div>
      <span style={styles.logoText}>PivotVCS</span>
      <div style={{ flex: 1 }} />
      <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 6, padding: "5px 14px", fontSize: 12, color: "#8b949e", minWidth: 220, display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="#8b949e">
          <path d="M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06L10.68 11.74z"/>
        </svg>
        Search or jump to…
      </div>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#238636", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff" }}>J</div>
    </nav>
  );

  if (loading) return (
    <div style={styles.root}>
      <Navbar />
      <div style={{ ...styles.container, paddingTop: 80, textAlign: "center", color: "#8b949e", fontSize: 13 }}>Loading repository…</div>
    </div>
  );

  if (error) return (
    <div style={styles.root}>
      <Navbar />
      <div style={styles.container}>
        <div style={{ color: "#f85149", background: "#1c1c1c", border: "1px solid #f85149", borderRadius: 6, padding: 16, fontSize: 13, marginTop: 60 }}>
          {error}
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.root}>
      <Navbar />
      <div style={styles.container}>
        <div style={{ marginBottom: 20 }}>
          <div style={styles.breadcrumb}>
            <span style={{ color: "#58a6ff", cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
              {data?.repoName?.split("/")[0] || "jiya"}
            </span>
            <span style={{ color: "#8b949e" }}>/</span>
            <span style={{ color: "#58a6ff" }}>
              <Icon.Repo />&nbsp;{data?.repoName}
            </span>
            <span style={styles.badge}>
              {data?.isPrivate ? <><Icon.Lock /> Private</> : "Public"}
            </span>
          </div>
        </div>

        <div style={styles.toolbar}>
          <BranchSelector
            branches={data?.branches || []}
            current={branch || data?.currentBranch}
            onSelect={(b) => { setBranch(b); fetchDetail(b); }}
          />
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: "#8b949e" }}>{data?.commits?.length || 0} commits</span>
          <span style={{ fontSize: 12, color: "#8b949e" }}>·</span>
          <span style={{ fontSize: 12, color: "#8b949e" }}>{data?.fileTree?.length || 0} files</span>
        </div>

        <div style={styles.grid}>
        <FileTree
            files={commitFiles ?? data?.fileTree ?? []}
            onFileOpen={handleFileOpen}
        />
        <CommitHistory
            commits={data?.commits || []}
            selectedCommit={selectedCommit}
            onCommitClick={handleCommitClick}
        />
        </div>

        <FileViewer
          file={openFile}
          loading={fileLoading}
          onClose={() => setOpenFile(null)}
        />
      </div>
    </div>
  );
}
