(function () {
  "use strict";

  const app = document.getElementById("writer-app");
  if (!app) return;
  const SAFE_SEGMENT_PATTERN = /^[A-Za-z0-9가-힣_-]+$/;
  const STRIP_UNSAFE_PATTERN = /[^\w\-가-힣]/g;

  const enabled = String(app.dataset.enabled) === "true";
  const repoOwner = String(app.dataset.githubOwner || "").trim();
  const repoName = String(app.dataset.githubRepo || "").trim();
  const defaultBranch = String(app.dataset.defaultBranch || "main").trim();
  const postsPath = String(app.dataset.postsPath || "_posts").trim();
  const configPasswordHash = String(app.dataset.passwordSha256 || "").trim().toLowerCase();
  const defaultCategory = String(app.dataset.defaultCategory || "Blog").trim();
  const statusEl = document.getElementById("writer-status");
  const MAX_DUPLICATE_RETRIES = 6;

  const authSection = document.getElementById("writer-auth-section");
  const editorSection = document.getElementById("writer-editor-section");

  const passwordInput = document.getElementById("writer-password");
  const loginButton = document.getElementById("writer-login-button");
  const logoutButton = document.getElementById("writer-logout-button");

  const titleInput = document.getElementById("writer-title");
  const slugInput = document.getElementById("writer-slug");
  const categoryInput = document.getElementById("writer-category");
  const tagsInput = document.getElementById("writer-tags");
  const dateInput = document.getElementById("writer-date");
  const draftInput = document.getElementById("writer-draft");
  const bodyInput = document.getElementById("writer-body");
  const githubTokenInput = document.getElementById("writer-github-token");
  const publishButton = document.getElementById("writer-publish-button");

  if (!enabled) {
    setStatus("writer.enabled가 false입니다. _config.yml에서 활성화하세요.");
    authSection.style.display = "none";
    return;
  }

  let unlocked = window.sessionStorage.getItem("writerUnlocked") === "1";
  let passwordHash = configPasswordHash;
  if (!passwordHash) {
    setStatus("_config.yml의 writer.password_sha256 설정이 비어 있습니다.");
    authSection.style.display = "none";
    return;
  }
  if (!repoOwner || !repoName) {
    setStatus("_config.yml의 writer.github_owner / writer.github_repo 설정이 필요합니다.");
    authSection.style.display = "none";
    return;
  }

  setDefaultDate();
  categoryInput.value = defaultCategory;
  renderAuthState();
  setStatus("초기화 완료. 비밀번호를 입력해 권한을 얻으세요.");

  loginButton.addEventListener("click", onLogin);
  logoutButton.addEventListener("click", onLogout);
  publishButton.addEventListener("click", onPublish);

  async function onLogin() {
    const password = String(passwordInput.value || "").trim();
    if (!password) {
      setStatus("비밀번호를 입력하세요.");
      return;
    }

    const digest = await sha256Hex(password);
    if (digest !== passwordHash) {
      setStatus("비밀번호가 올바르지 않습니다.");
      return;
    }

    unlocked = true;
    window.sessionStorage.setItem("writerUnlocked", "1");
    passwordInput.value = "";
    renderAuthState();
    setStatus("인증 성공. 글 작성이 활성화되었습니다.");
  }

  function onLogout() {
    unlocked = false;
    window.sessionStorage.removeItem("writerUnlocked");
    renderAuthState();
    setStatus("로그아웃되었습니다.");
  }

  async function onPublish() {
    if (!unlocked) {
      setStatus("먼저 인증을 완료하세요.");
      return;
    }

    const title = String(titleInput.value || "").trim();
    const body = String(bodyInput.value || "").trim();
    const normalizedCategory = normalizeCategory(String(categoryInput.value || ""));
    const fallbackCategory = normalizeCategory(defaultCategory);
    const category = normalizedCategory || fallbackCategory || "";
    const tags = parseTags(String(tagsInput.value || ""));
    const draft = Boolean(draftInput.checked);
    const dateValue = String(dateInput.value || "").trim();

    if (!title || !body) {
      setStatus("제목과 본문은 필수입니다.");
      return;
    }

    const githubToken = String(githubTokenInput.value || "").trim();
    if (!githubToken) {
      setStatus("GitHub 토큰을 입력하세요.");
      return;
    }

    const slug = makeSlug(slugInput.value || title);
    const date = toIsoDate(dateValue);
    const fileDate = date.slice(0, 10);
    if (!isSafeSlug(slug)) {
      setStatus("슬러그 형식이 올바르지 않습니다.");
      return;
    }
    if (!isSafeFileDate(fileDate)) {
      setStatus("게시 일시 형식이 올바르지 않습니다.");
      return;
    }
    if (category && !isSafeCategory(category)) {
      setStatus("카테고리 형식이 올바르지 않습니다.");
      return;
    }
    const categoryFolder = category ? "/" + category : "";
    const basePath = `${postsPath}${categoryFolder}/${fileDate}-${slug}.md`;

    const markdown = buildMarkdown({
      title,
      category,
      tags,
      draft,
      date,
      body
    });

    setStatus("발행 중입니다...");

    try {
      const finalPath = await createPostWithRetry({
        owner: repoOwner,
        repo: repoName,
        basePath,
        markdown,
        token: githubToken,
        branch: defaultBranch
      });

      setStatus("발행 완료\n저장 경로: " + finalPath);
    } catch (error) {
      setStatus("발행 실패: " + (error && error.message ? error.message : String(error)));
    }
  }

  function renderAuthState() {
    const authed = Boolean(unlocked);
    editorSection.style.display = authed ? "block" : "none";
    logoutButton.style.display = authed ? "inline-block" : "none";
  }

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function setDefaultDate() {
    if (dateInput.value) return;
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60000;
    const localIso = new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
    dateInput.value = localIso;
  }

  function normalizeCategory(value) {
    return value.trim().replace(/\s+/g, "-").replace(STRIP_UNSAFE_PATTERN, "");
  }

  function parseTags(value) {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .slice(0, 20);
  }

  function makeSlug(raw) {
    const value = String(raw || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(STRIP_UNSAFE_PATTERN, "")
      .replace(/\-+/g, "-")
      .replace(/^\-+|\-+$/g, "");
    return value || "untitled-post";
  }

  function toIsoDate(localDateTime) {
    if (!localDateTime) return new Date().toISOString();
    const d = new Date(localDateTime);
    return d.toISOString();
  }

  function yamlSingleQuoteEscape(value) {
    return String(value).replace(/'/g, "''");
  }

  function buildMarkdown(payload) {
    const lines = [];
    lines.push("---");
    lines.push(`title: '${yamlSingleQuoteEscape(payload.title)}'`);
    lines.push("layout: single");
    lines.push(`date: "${payload.date}"`);
    if (payload.category) {
      lines.push("categories:");
      lines.push(`  - ${payload.category}`);
    }
    if (payload.tags.length) {
      lines.push("tags:");
      payload.tags.forEach((tag) => lines.push(`  - ${tag}`));
    }
    if (payload.draft) {
      lines.push("draft: true");
    }
    lines.push("---");
    lines.push("");
    lines.push(payload.body);
    lines.push("");
    return lines.join("\n");
  }

  async function createPostWithRetry(options) {
    const { owner, repo, basePath, markdown, token, branch } = options;
    for (let i = 0; i < MAX_DUPLICATE_RETRIES; i++) {
      const path = i === 0 ? basePath : appendSuffix(basePath, i + 1);
      const response = await putFile(owner, repo, path, markdown, token, branch);
      if (response.ok) {
        return path;
      }
      if (response.status !== 422) {
        const body = await safeJson(response);
        throw new Error(body && body.message ? body.message : "GitHub API 오류");
      }
    }
    throw new Error("동일한 파일명이 반복되어 저장에 실패했습니다.");
  }

  function appendSuffix(path, n) {
    return path.replace(/\.md$/, "-" + n + ".md");
  }

  async function putFile(owner, repo, path, markdown, token, branch) {
    if (!isSafePostPath(path)) {
      throw new Error("허용되지 않은 파일 경로입니다.");
    }
    const encodedPath = path
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodedPath}`;
    const body = {
      message: `Add post: ${path}`,
      content: base64EncodeUtf8(markdown),
      branch: branch || "main"
    };
    return window.fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
  }

  async function safeJson(response) {
    try {
      return await response.json();
    } catch (e) {
      return null;
    }
  }

  function base64EncodeUtf8(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    return window.btoa(binary);
  }

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function isSafePostPath(path) {
    return /^_posts(?:\/[A-Za-z0-9가-힣_-]+)?\/\d{4}-\d{2}-\d{2}-[A-Za-z0-9가-힣_-]+(?:-\d+)?\.md$/.test(path);
  }

  function isSafeCategory(value) {
    return SAFE_SEGMENT_PATTERN.test(value);
  }

  function isSafeSlug(value) {
    return SAFE_SEGMENT_PATTERN.test(value);
  }

  function isSafeFileDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  }
})();
