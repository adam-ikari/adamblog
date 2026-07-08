---
title: Flask 学习系列 (零)
description: Flask 后端开发学习系列开篇，介绍 Flask 框架特点、环境搭建和基础项目结构
category: 后端
date: 2023-08-13
tags:
---

# Flask 学习系列 (零)
## 前言

因为工作需要，开始啃 Flask 后端开发。于是又开了一个新系列——以前的坑还没填完，又来新坑了。

## 介绍

Flask 是用 Python 写的轻量级 Web 框架，主打简单、好上手、灵活，定位是帮你搭出能逐步扩展的 Web 应用。它的核心功能不算多，但路由、视图函数、模板、表单、数据库交互这些该有的都有。



和 Django 那种大而全的框架比，Flask 走的是另一条路：核心精简，不替你做太多决定。它没有太多约束，数据库、模板引擎、各种扩展都由你自己挑。好处是轻、上手快、不会有用不到的功能压着；代价是很多东西得自己组装。也正因如此，它搭 RESTful API 比较顺手，路由和视图函数的处理足够直接。社区这块也热闹，扩展库从数据库集成、身份验证到缓存、表单处理，基本想得到的都找得到。

简单说，需要灵活、可控，选 Flask；想要开箱即用、少折腾，Django 更合适。

![Flask 精简核心加扩展 与 Django 大而全 对照](/posts/Series-of-Learning-Flask-0/flask-vs-django-architecture.svg)

## 模板引擎

Flask 是服务器端渲染的路子，离不开模板引擎，默认用的就是 Jinja2。

## 支持的数据库

Flask 本身不带数据库支持，但通过 Python 包和扩展接上不难。常用的数据库操作插件是 Flask-SQLAlchemy。

Flask-SQLAlchemy 基于 SQLAlchemy——一个功能挺强的 Python SQL 工具包，支持 MySQL、PostgreSQL、SQLite 等多种引擎。它走的是 ORM 路线，让你拿 Python 对象去做增删改查，而不必手写 SQL。这个扩展还带数据迁移，库结构要改、要升级都方便不少。

## 生态

正因为 Flask 设计得简单轻量，需要的功能大多得靠扩展补上。

### ORM

* Flask-SQLAlchemy - 一个常用的 Flask ORM 扩展[2]，在 Flask 应用里做数据库操作很方便。

### Admin

* Flask-Admin - 简单且可扩展的管理界面框架

### Restful API

* Flask-RESTful - 让创建 Restful API 更省事的扩展。它给了一组定义 API 资源和处理请求的类与方法，继承它的 `Resource` 类就能做出独立的 API 资源，再挂上对应的请求处理函数。路由、请求校验、响应处理这些它都管。

## 知识导图

### Flask介绍与安装

- 什么是Flask
- Flask的特点和优势
- Flask的安装

### Flask基础知识

- 创建Flask应用程序
- 路由和视图函数
- 请求和响应
- 模板和渲染
- 静态文件处理
- 会话和Cookie
- 表单处理
- 错误处理
- 中间件和钩子函数

### Flask扩展

- Flask-WTF：处理表单验证
- Flask-SQLAlchemy：与数据库交互
- Flask-Login：用户认证和登录管理
- Flask-Mail：发送电子邮件
- Flask-RESTful：构建RESTful API
- Flask-Uploads：处理文件上传
- 其他常用的Flask扩展

### Flask部署与进阶

- 生产环境部署和配置
- 使用WSGI服务器
- 使用数据库扩展
- 使用Flask拓展进行性能优化
- 安全性和认证授权
- API开发和保护





