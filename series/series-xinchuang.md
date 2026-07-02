---
title: 信创专题系列
description: 信息技术应用创新（信创）全栈调查报告：总览、整机PC、操作系统、数据库、中间件、办公应用、安全、外设、标准、供应链安全
date: 2026-07-02
category: 信创
tags: [信创, 国产化, 自主可控, 系列]
recommend: false
---

# 信创专题系列

信创（信息技术应用创新）是中国 IT 产业自主可控的主线。本系列按信创全栈逐层调查——从总览到整机、操作系统、数据库、中间件、办公应用、安全、外设、标准、供应链安全，每篇为调查报告，事实联网核验，讲清各层的来历、格局与真实进度。（国产 CPU 另有专篇 [国产 CPU 详解：信创六家](/posts/国产CPU-信创六家)，不纳入本系列。）

<SeriesCardList :articles="[
  { title: '信创总览：从去 IOE 到自主可控', desc: '是什么、四大领域、发展历程、政策脉络、市场规模', link: '/posts/信创总览-从去IOE到自主可控', order: 1 },
  { title: '信创 PC 与整机', desc: '整机厂商格局、产品形态、与消费 PC 的差异、采购场景', link: '/posts/信创PC与整机', order: 2 },
  { title: 'KylinOS 调查报告', desc: '银河麒麟操作系统：来历、技术演进、版本谱系、架构', link: '/posts/KylinOS-调查报告', order: 3 },
  { title: '国产数据库详解', desc: '达梦/金仓/神通/南大通用/OceanBase/GaussDB 来历与对比', link: '/posts/国产数据库详解', order: 4 },
  { title: '信创中间件与云平台', desc: '东方通/宝兰德/普元，信创云平台', link: '/posts/信创中间件与云平台', order: 5 },
  { title: '国产办公与应用软件', desc: 'WPS/永中/福昕/中望CAD/OFD 替代进度', link: '/posts/国产办公与应用软件', order: 6 },
  { title: '信创安全：等保与可信计算', desc: '奇安信/360/深信服，等保2.0、可信计算', link: '/posts/信创安全-等保与可信计算', order: 7 },
  { title: '信创外设：打印机与其他', desc: '奔图/航天信息/得力，为何打印机是外设重点，UKey等安全外设', link: '/posts/信创外设-打印机与其他', order: 8 },
  { title: '信创国有标准', desc: '国密算法SM2/3/4/9、OFD版式标准、安全可靠测评与适配认证', link: '/posts/信创国有标准-国密OFD与测评', order: 9 },
  { title: '信创供应链安全：断供与可控', desc: '实体清单教训（海光/奔图/华为）、供应链投毒、关键节点可控', link: '/posts/信创供应链安全-断供与可控', order: 10 },
]" />
