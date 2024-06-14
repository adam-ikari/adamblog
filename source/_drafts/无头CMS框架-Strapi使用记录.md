---
title: 无头CMS框架-Strapi使用记录
toc: false
categories:
  - 还没有分类
abbrlink: "222e2642"
date: 2024-06-13 11:15:08
keywords:
description:
tags:
cover:
---

<!--
注释的方法：
在正文需要注释的地方插入下面的代码，根据需要修改编号：
  <sup>[1](#note1)</sup>
在"注"章节插入对应编号的注释内容:
  <div id="note1"></div>
  [1] 这是注的内容
-->

## 前言

这是我使用 Strapi 的一个记录，简单分享一下使用过程。

## 简介

> The leading open-source headless CMS.
> 100% JavaScript / TypeScript and fully customizable.

Strapi 是一个灵活的开源头无 CMS 系统，旨在快速构建和管理 API。具有定制性强、支持 RESTful API 和 GraphQL API、用户认证和权限系统健全、插件丰富、管理界面友好的特点。适用于需要定制性强和现代化解决方案的项目。

Strapi 使用 Node.js 作为后端运行环境，Koa 作为 Web 框架，MongoDB、PostgreSQL、SQLite 等数据库。

<!-- more -->

## 创建工程

Strapi 框架不是一个完整的 CMS 系统，除了前端需要开发以外，管理的内容也需要自行创建内容的数据结构。所以，Strapi 采用了工程来管理创建的内容的数据结构。

**创建工程：**

```bash
npx create-strapi-app@latest my-project
```

`my-project` 替换成将要创建的项目名称。

## 启动 Strapi

**工程目录下运行：**

```bash
npm run develop
```

启动之后可以看到这样的启动信息。

![Strapi 启动信息](无头CMS框架-Strapi使用记录/image.png)

Strapi 使用 `1337` 作为默认端口。

打开链接`http://localhost:1337/admin`可以看到 Strapi 的管理页面

## 创建管理员和密码

第一次打开 Strapi 的管理页面会提示创建管理员账户，跟着提示创建即可。

![alt text](无头CMS框架-Strapi使用记录/login-page-sso.png)

## 创建内容数据结构

## Strapi 内容 API 接口

Strapi 支持 RESTful API 和 GraphQL API。

### 用户相关 API

#### 注册

注册一个新用户

**RESTful：**

请求 URL:

`/api/auth/local/register`

请求方法:

`POST`

请求体参数：

| 字段     | 类型   | 是否必须 |
| -------- | ------ | -------- |
| username | string | 是       |
| email    | string | 是       |
| password | string | 是       |

例如

```json
{
  "username": "Strapi user",
  "email": "user@strapi.io",
  "password": "strapiPassword"
}
```

返回：

| 字段 | 类型   |
| ---- | ------ |
| jwt  | string |
| user | json   |

例如

```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzE4MjUxMzM1LCJleHAiOjE3MjA4NDMzMzV9.Bz2N3aSinVeDAareKCeNb71EV5nDg5pOCEDFtElkrgA",
  "user": {
    "id": 2,
    "username": "Strapi user1",
    "email": "user1@strapi.io",
    "provider": "local",
    "confirmed": true,
    "blocked": false,
    "createdAt": "2024-06-13T04:02:15.102Z",
    "updatedAt": "2024-06-13T04:02:15.102Z"
  }
}
```

#### 用户登录

**RESTful：**

HTTP 方法:

`POST`

路径:

`/api/auth/local`

请求体：

| 字段       | 类型   |
| ---------- | ------ |
| identifier | string |
| password   | string |

例如

```json
{
  "identifier": "user@strapi.io",
  "password": "strapiPassword"
}
```

返回：

| 字段 | 类型   |
| ---- | ------ |
| jwt  | string |
| user | json   |

例如

```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzE4MjUxMzM1LCJleHAiOjE3MjA4NDMzMzV9.Bz2N3aSinVeDAareKCeNb71EV5nDg5pOCEDFtElkrgA",
  "user": {
    "id": 2,
    "username": "Strapi user1",
    "email": "user1@strapi.io",
    "provider": "local",
    "confirmed": true,
    "blocked": false,
    "createdAt": "2024-06-13T04:02:15.102Z",
    "updatedAt": "2024-06-13T04:02:15.102Z"
  }
}
```

### 内容 API

#### 创建内容

#### 删除内容

#### 修改内容

#### 查询内容

## 注

无

## 参考

无

```

```
