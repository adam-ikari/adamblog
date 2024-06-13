---
title: Flask 学习系列 (零)
toc: true
categories:
  - 后端
cover: covers/Series-of-Learning-Flask.png
abbrlink: 25eb9c8f
date: 2023-08-13 17:21:57
keywords:
description:
tags:
---

## 前言

因为工作需要，开始学习了 Flask 后端开发技术。所以开始了这个新的系列（以前的坑还没填完，又要开新坑了）。

## 介绍

Flask 是一个使用 Python 编写的轻量级 Web 框架，它被设计成简单、易于学习和灵活的框架，旨在帮助开发人员构建具有可扩展性的 Web 应用程序。Flask 提供了一组核心功能，使开发人员能够处理路由、视图函数、模板、表单处理以及与数据库的交互。

<!--more-->

与其他框架相比，Flask 具有以下一些特点和优势：

1. 简单易用：Flask 的设计理念是简单易用，它的核心功能相对较少，可以让开发人员快速入门并开发出简洁的应用。它没有太多的约束和限制，使得开发者能够自由地选择和扩展其他库和工具。

2. 灵活性：Flask 是一个高度灵活的框架，它允许开发人员根据需要选择所需的组件和扩展。你可以根据项目要求选择适合的数据库、模板引擎和其他扩展，从而根据具体需求进行个性化的定制。

3. 轻量级：相对于其他大型的全功能框架，如Django，Flask 是一个轻量级框架。它不包含过多的内置功能，可以避免不必要的复杂性，同时也减少了应用程序的开销。

4. RESTful 支持：Flask 对于构建 RESTful API 非常友好。它提供了简单的路由和视图函数处理，可以轻松地创建符合 REST 架构风格的 API 接口。

5. 社区支持和扩展库：Flask 拥有庞大的社区支持，有大量的扩展库可供选择。这些扩展库覆盖了从数据库集成到身份验证、缓存、表单处理等各种功能，在开发过程中提供了更多选择和便利。

与其他框架相比，Flask 的灵活性和简洁性是它的主要特点。相比之下，全功能的框架如 Django 在提供更多内置功能和自动化工具方面更为强大，适用于构建复杂和庞大的应用程序。

## 模板引擎

Flask 作为服务器渲染的框架，必不可少的需要使用模板渲染引擎。Flask 使用 Jinja2 作为默认的模板渲染引擎。

## 支持的数据库

Flask本身并没有内置数据库支持，但可以通过使用Python包和Flask扩展来与数据库进行交互。在Flask中，常用的数据库操作插件是Flask-SQLAlchemy。

Flask-SQLAlchemy是基于ORM（对象关系映射）的SQLAlchemy框架的Flask扩展。SQLAlchemy是一个功能强大的Python SQL工具包，支持多种数据库引擎，包括MySQL、PostgreSQL、SQLite等。

使用Flask-SQLAlchemy可以简化与数据库的交互，开发者可以通过Python对象进行数据库的增删改查操作，而无需直接编写SQL语句。此扩展还提供了数据迁移的支持，可以方便地对现有数据库进行升级和改动。

## 生态

因为 Flask 简单轻量的设计理念，所以需要使用各种扩展来增强框架的功能。

### ORM

* Flask-SQLAlchemy - 一个常用的 Flask ORM 扩展是 Flask-SQLAlchemy[2]。使用 Flask-SQLAlchemy，你可以方便地在 Flask 应用程序中进行数据库操作。

### Admin

* Flask-Admin - 简单且可扩展的管理界面框架

### Restful API

* Flask-RESTful - 一个常用的 Flask 扩展，使得创建 Restful API 变得更加简单。它提供了一组用于定义 API 资源和请求处理器的类和方法。通过继承 Flask-RESTful 提供的 Resource 类，可以创建独立的 API 资源，并定义与之关联的请求处理函数。使用 Flask-RESTful，可以轻松管理 API 的路由、请求验证、响应处理等。

## 知识导图

{% markmap 600px 3 %}

# Flask学习知识导图

## Flask介绍与安装
- 什么是Flask
- Flask的特点和优势
- Flask的安装

## Flask基础知识
- 创建Flask应用程序
- 路由和视图函数
- 请求和响应
- 模板和渲染
- 静态文件处理
- 会话和Cookie
- 表单处理
- 错误处理
- 中间件和钩子函数

## Flask扩展
- Flask-WTF：处理表单验证
- Flask-SQLAlchemy：与数据库交互
- Flask-Login：用户认证和登录管理
- Flask-Mail：发送电子邮件
- Flask-RESTful：构建RESTful API
- Flask-Uploads：处理文件上传
- 其他常用的Flask扩展

## Flask部署与进阶
- 生产环境部署和配置
- 使用WSGI服务器
- 使用数据库扩展
- 使用Flask拓展进行性能优化
- 安全性和认证授权
- API开发和保护

{% endmarkmap %}





