---
title: "깃허브 블로그"
layout: archive
permalink: categories/test
author_profile: true
sidebar_main: true
---

***
{% assign posts = site.categories.test %}
{% for post in posts %} {% include archive-single2.html type=page.entries_layout %} {% endfor %}