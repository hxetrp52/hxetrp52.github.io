(function () {
  "use strict";

  const app = document.getElementById("writer-app");
  if (!app) return;

  const enabled = String(app.dataset.enabled) === "true";
  const statusEl = document.getElementById("writer-status");

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
  const publishButton = document.getElementById("writer-publish-button");

  if (!enabled) {
    setStatus("writer.enabled가 false입니다. _config.yml에서 활성화하세요.");
    authSection.style.display = "none";
    return;
  }

  let sessionToken = window.localStorage.getItem("writerSessionToken") || "";
  let passwordHash = window.localStorage.getItem("writerPasswordHash") || "";
  let githubToken = window.localStorage.getItem("writerGithubToken") || "";

  setDefaultDate();
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

    if (!passwordHash) {
      passwordHash = window.prompt("최초 1회 설정: SHA-256 비밀번호 해시를 입력하세요.");
      if (!passwordHash) {
        setStatus("해시가 없어 인증을 진행할 수 없습니다.");
        return;
      }
      passwordHash = String(passwordHash).trim().toLowerCase();
      window.localStorage.setItem("writerPasswordHash", passwordHash);
    }

    const digest = await sha256Hex(password);
    if (digest !== passwordHash) {
      setStatus("비밀번호가 올바르지 않습니다.");
      return;
    }

    if (!githubToken) {
      githubToken = window.prompt("GitHub Personal Access Token(repo 권한)을 입력하세요.");
      if (!githubToken) {
        setStatus("토큰이 없어 발행할 수 없습니다.");
        return;
      }
      githubToken = String(githubToken).trim();
      window.localStorage.setItem("writerGithubToken", githubToken);
    }

    sessionToken = await sha256Hex(String(Date.now()) + ":" + passwordHash + ":" + Math.random());
    window.localStorage.setItem("writerSessionToken", sessionToken);
    passwordInput.value = "";
    renderAuthState();
    setStatus("인증 성공. 글 작성이 활성화되었습니다.");
  }

  function onLogout() {
    sessionToken = "";
    window.localStorage.removeItem("writerSessionToken");
    renderAuthState();
    setStatus("로그아웃되었습니다.");
  }

  async function onPublish() {
    if (!sessionToken) {
      setStatus("먼저 인증을 완료하세요.");
      return;
    }

    const title = String(titleInput.value || "").trim();
    const body = String(bodyInput.value || "").trim();
    const category = normalizeCategory(String(categoryInput.value || "").trim());
    const tags = parseTags(String(tagsInput.value || ""));
    const draft = Boolean(draftInput.checked);
    const dateValue = String(dateInput.value || "").trim();

    if (!title || !body) {
      setStatus("제목과 본문은 필수입니다.");
      return;
    }

    if (!githubToken) {
      githubToken = window.prompt("GitHub 토큰이 비어 있습니다. 다시 입력하세요.");
      if (!githubToken) {
        setStatus("토큰 입력이 취소되었습니다.");
        return;
      }
      githubToken = String(githubToken).trim();
      window.localStorage.setItem("writerGithubToken", githubToken);
    }

    const repoOwner = "{{ site.writer.github_owner }}";
    const repoName = "{{ site.writer.github_repo }}";
    const postsPath = "{{ site.writer.posts_path | default: '_posts' }}";

    const slug = makeSlug(slugInput.value || title);
    const date = toIsoDate(dateValue);
    const fileDate = date.slice(0, 10);
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
        token: githubToken
      });

      setStatus("발행 완료\n저장 경로: " + finalPath);
    } catch (error) {
      setStatus("발행 실패: " + (error && error.message ? error.message : String(error)));
    }
  }

  function renderAuthState() {
    const authed = Boolean(sessionToken);
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
    return value.replace(/\s+/g, "-").replace(/[^\w\-가-힣]/g, "").trim();
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
      .replace(/[^\w\-가-힣]/g, "")
      .replace(/\-+/g, "-")
      .replace(/^\-+|\-+$/g, "");
    return value || "untitled-post";
  }

  function toIsoDate(localDateTime) {
    if (!localDateTime) return new Date().toISOString();
    const d = new Date(localDateTime);
    return d.toISOString();
  }

  function yamlEscape(value) {
    return String(value).replace(/"/g, '\\"');
  }

  function buildMarkdown(payload) {
    const lines = [];
    lines.push("---");
    lines.push(`title: "${yamlEscape(payload.title)}"`);
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
    const { owner, repo, basePath, markdown, token } = options;
    for (let i = 0; i < 6; i++) {
      const path = i === 0 ? basePath : appendSuffix(basePath, i + 1);
      const response = await putFile(owner, repo, path, markdown, token);
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

  async function putFile(owner, repo, path, markdown, token) {
    const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`;
    const body = {
      message: `Add post: ${path}`,
      content: base64EncodeUtf8(markdown),
      branch: "main"
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
})();
