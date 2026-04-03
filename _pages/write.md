---
title: "글 작성"
permalink: /write/
layout: single
author_profile: false
sidebar_main: false
---

<noscript>이 기능은 JavaScript가 필요합니다.</noscript>

<div id="writer-app" class="writer-app" data-enabled="{{ site.writer.enabled | default: false }}">
  <p>사이트 내부 글쓰기 기능</p>

  <section id="writer-auth-section">
    <h2>관리자 인증</h2>
    <p>비밀번호를 입력하면 글 작성 기능이 활성화됩니다.</p>
    <label for="writer-password">비밀번호</label>
    <input id="writer-password" type="password" autocomplete="current-password" />
    <button id="writer-login-button" type="button">권한 얻기</button>
    <button id="writer-logout-button" type="button" style="display:none;">로그아웃</button>
  </section>

  <section id="writer-editor-section" style="display:none;">
    <h2>글 작성하기</h2>

    <label for="writer-title">제목 *</label>
    <input id="writer-title" type="text" maxlength="200" />

    <label for="writer-slug">슬러그(선택)</label>
    <input id="writer-slug" type="text" maxlength="120" placeholder="비워두면 제목 기반 자동 생성" />

    <label for="writer-category">카테고리</label>
    <input id="writer-category" type="text" value="{{ site.writer.default_category | default: 'Blog' }}" />

    <label for="writer-tags">태그(쉼표로 구분)</label>
    <input id="writer-tags" type="text" placeholder="jekyll, github-pages" />

    <label for="writer-date">게시 일시</label>
    <input id="writer-date" type="datetime-local" />

    <label for="writer-draft">
      <input id="writer-draft" type="checkbox" />
      초안(draft)
    </label>

    <label for="writer-body">본문(Markdown) *</label>
    <textarea id="writer-body" rows="18"></textarea>

    <button id="writer-publish-button" type="button">발행하기</button>
  </section>

  <section>
    <h3>상태</h3>
    <pre id="writer-status" style="white-space: pre-wrap;"></pre>
  </section>
</div>

<style>
  .writer-app {
    display: grid;
    gap: 0.75rem;
    max-width: 960px;
  }
  .writer-app input,
  .writer-app textarea,
  .writer-app button {
    width: 100%;
    margin-top: 0.25rem;
  }
  .writer-app button {
    max-width: 220px;
  }
</style>

<script src="{{ '/assets/js/writer.js' | relative_url }}"></script>
