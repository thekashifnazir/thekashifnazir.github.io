---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ now.Format "2006-01-02" }}
description: ""
images: ["/images/social/social-card-{{ .File.ContentBaseName }}.png"]
tags: []
categories: []
ShowToc: true
draft: false
---
