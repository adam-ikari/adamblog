---
title: "[转载] 45个 GIT 经典操作场景，专治不会合代码"
category: 转载
description: "45个 GIT 经典操作场景，专治不会合代码"
tags: git
date: 2024-06-14
recommend: true
---

# "[转载] 45个 GIT 经典操作场景，专治不会合代码"
<!--
注释的方法：
在正文需要注释的地方插入下面的代码，根据需要修改编号：
  <sup>[1](#note1)</sup>
在"注"章节插入对应编号的注释内容:
  <div id="note1"></div>
  [1] 这是注的内容
-->

## 前言

传送门：[原文地址](https://mp.weixin.qq.com/s/2p4m63JdsCjBpVku-WaZyA)

## 简介

git 对大家应该不陌生，熟练使用它已经成了程序员的基本功。工作里有 `Sourcetree` 这类客户端，合代码方便得很，但真到了面试或需要露一手的场合，命令行还是绕不过去。

下面整理了 45 个用 git 合代码时常见的操作场景，基本能覆盖日常工作的需求。



## 正文

### 提交(commit)

#### 我刚才提交了什么?

如果你用 `git commit -a` 提交了一次变化(changes)，但不确定这次到底提交了哪些内容，可以用下面的命令显示当前 `HEAD` 上最近一次的提交(commit):

```sh
(main)$ git show
```

或者

```sh
$ git log -n1 -p
```

#### 我的提交信息(commit message)写错了

如果你的提交信息(commit message)写错了，且这次提交(commit)还没推(push)，可以通过下面的方法修改:

```sh
$ git commit --amend --only
```

这会打开你的默认编辑器, 在这里你可以编辑信息. 另一方面, 你也可以用一条命令一次完成:

```sh
$ git commit --amend --only -m 'xxxxxxx'
```

如果你已经推(push)了这次提交(commit)，可以修改后再强推(force push)，但不推荐这么做。

#### 我提交(commit)里的用户名和邮箱不对

如果这只是单个提交(commit)，修改它：

```sh
$ git commit --amend --author "New Authorname <authoremail@mydomain.com>"
```

如果你需要修改所有历史, 参考 'git filter-branch’的指南页.

#### 我想从一个提交(commit)里移除一个文件

通过下面的方法，从一个提交(commit)里移除一个文件:

```sh
$ git checkout HEAD^ myfile
$ git add -A
$ git commit --amend
```

这将非常有用，当你有一个开放的补丁(open patch)，你往上面提交了一个不必要的文件，你需要强推(force push)去更新这个远程补丁。

#### 我想删除我的的最后一次提交(commit)

如果你需要删除已经推过的提交(pushed commits)，可以用下面的方法。但这会不可逆地改变你的历史，也会搞乱那些已经从该仓库拉取(pulled)了的人的历史。说句实在话，不是很有把握，千万别这么做。

```sh
$ git reset HEAD^ --hard
$ git push -f [remote] [branch]
```

如果你还没有推到远程, 把 Git 重置(reset)到你最后一次提交前的状态就可以了(同时保存暂存的变化):

```text
(my-branch*)$ git reset --soft HEAD@{1}
```

这只有在推送之前才有用。如果你已经推了，唯一安全的做法是 `git revert SHAofBadCommit`，它会创建一个新的提交(commit)来撤消前一个提交的所有变化(changes)；或者，如果你推的这个分支是 rebase-safe 的（比如其他开发者不会从这个分支拉），只需用 `git push -f`。

#### 删除任意提交(commit)

同样的警告：不到万不得已的时候不要这么做.

```sh
$ git rebase --onto SHA1_OF_BAD_COMMIT^ SHA1_OF_BAD_COMMIT
$ git push -f [remote] [branch]
```

或者做一个 [交互式 rebase](#interactive-rebase) 删除那些你想要删除的提交(commit)里所对应的行。

#### 我尝试推一个修正后的提交(amended commit)到远程，但是报错：

```sh
To https://github.com/yourusername/repo.git
! [rejected]        mybranch -> mybranch (non-fast-forward)
error: failed to push some refs to 'https://github.com/tanay1337/webmaker.org.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

注意，rebasing（见下面）和修正(amending)会用一个**新的提交(commit)代替旧的**，所以如果之前你已经往远程仓库推过一次修正前的提交(commit)，现在就必须强推(force push)（`-f`）。注意——_总是_确保你指明了分支！

```sh
(my-branch)$ git push origin mybranch -f
```

一般来说，**要避免强推**。最好是创建并推送一个新的提交(commit)，而不是强推一个修正后的提交。后者会让那些在该分支或其子分支上工作的开发者，在源历史中遇到冲突。

#### 我意外的做了一次硬重置(hard reset)，我想找回我的内容

如果你不小心执行了 `git reset --hard`，通常还能找回你的提交(commit)，因为 Git 对每件事都有日志，且会保存几天。

```sh
(main)$ git reflog
```

你会看到一个过去提交(commit)的列表，以及一个重置的提交。选择你想要回到的那个提交(commit)的 SHA，再重置一次:

```sh
(main)$ git reset --hard SHA1234
```

这样就完成了。

### 暂存(Staging)

#### 我需要把暂存的内容添加到上一次的提交(commit)

```sh
(my-branch*)$ git commit --amend
```

#### 我想要暂存一个新文件的一部分，而不是这个文件的全部

一般来说，如果你只想暂存一个文件的一部分，可以这样做:

```sh
$ git add --patch filename.x
```

`-p` 是简写。这会打开交互模式，你可以用 `s` 选项来分隔提交(commit)；但如果这个文件是新文件，就没有这个选项，添加新文件时这样做:

```sh
$ git add -N filename.x
```

然后, 你需要用 `e` 选项来手动选择需要添加的行，执行 `git diff --cached` 将会显示哪些行暂存了哪些行只是保存在本地了。

#### 我想把在一个文件里的变化(changes)加到两个提交(commit)里

`git add` 会把整个文件加入到一个提交. `git add -p` 允许交互式的选择你想要提交的部分.

#### 我想把暂存的内容变成未暂存，把未暂存的内容暂存起来

多数情况下，你应该把所有内容变为未暂存，再挑选想要的内容进行 commit。
但假定你就是想这么做，那可以创建一个临时的 commit 来保存已暂存的内容，然后暂存未暂存的内容并 stash。接着 reset 最后一个 commit，把原本暂存的内容变回未暂存，最后 stash pop 回来。

```sh
$ git commit -m "WIP"
$ git add .
$ git stash
$ git reset HEAD^
$ git stash pop --index 0
```

注意 1: 这里使用`pop`仅仅是因为想尽可能保持幂等。  
注意 2: 假如你不加上`--index`你会把暂存的文件标记为为存储。

### 未暂存(Unstaged)的内容

#### 我想把未暂存的内容移动到一个新分支

```sh
$ git checkout -b my-branch
```

#### 我想把未暂存的内容移动到另一个已存在的分支

```sh
$ git stash
$ git checkout my-branch
$ git stash pop
```

#### 我想丢弃本地未提交的变化(uncommitted changes)

如果你只是想重置源(origin)和你本地(local)之间的一些提交(commit)，你可以：

```sh
# one commit
(my-branch)$ git reset --hard HEAD^
# two commits
(my-branch)$ git reset --hard HEAD^^
# four commits
(my-branch)$ git reset --hard HEAD~4
# or
(main)$ git checkout -f
```

重置某个特殊的文件, 你可以用文件名做为参数:

```sh
$ git reset filename
```

#### 我想丢弃某些未暂存的内容

如果你想丢弃工作拷贝中的一部分内容，而不是全部，可以签出(checkout)不需要的内容，保留需要的。

```sh
$ git checkout -p
# Answer y to all of the snippets you want to drop
```

另一个办法是用 `stash`：把要保留的内容先 stash 起来，重置工作拷贝，再重新应用保留的部分。

```sh
$ git stash -p
# Select all of the snippets you want to save
$ git reset --hard
$ git stash pop
```

或者, stash 你不需要的部分, 然后 stash drop。

```sh
$ git stash -p
# Select all of the snippets you don't want to save
$ git stash drop
```

### 分支(Branches)

#### 我从错误的分支拉取了内容，或把内容拉取到了错误的分支

这是 `git reflog` 的另一种用法，找到在这次错误拉(pull)之前 HEAD 的指向。

```sh
(main)$ git reflog
ab7555f HEAD@{0}: pull origin wrong-branch: Fast-forward
c5bc55a HEAD@{1}: checkout: checkout message goes here
```

重置分支到你所需的提交(desired commit):

```sh
$ git reset --hard c5bc55a
```

完成。

#### 我想扔掉本地的提交(commit)，以便我的分支与远程的保持一致

先确认你没有推(push)你的内容到远程。

`git status` 会显示你领先(ahead)源(origin)多少个提交:

```sh
(my-branch)$ git status
# On branch my-branch
# Your branch is ahead of 'origin/my-branch' by 2 commits.
#   (use "git push" to publish your local commits)
#
```

一种方法是:

```sh
(main)$ git reset --hard origin/my-branch
```

#### 我需要提交到一个新分支，但错误的提交到了 main

在 main 下创建一个新分支，不切换到新分支,仍在 main 下:

```sh
(main)$ git branch my-branch
```

把 main 分支重置到前一个提交:

```sh
(main)$ git reset --hard HEAD^
```

`HEAD^` 是 `HEAD^1` 的简写，你可以通过指定要设置的`HEAD`来进一步重置。

或者, 如果你不想使用 `HEAD^`, 找到你想重置到的提交(commit)的 hash(`git log` 能够完成)， 然后重置到这个 hash。 使用`git push` 同步内容到远程。

例如, main 分支想重置到的提交的 hash 为`a13b85e`:

```sh
(main)$ git reset --hard a13b85e
HEAD is now at a13b85e
```

签出(checkout)刚才新建的分支继续工作:

```sh
(main)$ git checkout my-branch
```

#### 我想保留来自另外一个 ref-ish 的整个文件

假设你正在做一个原型方案(原文为 working spike (see note))，内容很多，每个都跑得不错。现在把它提交到一个分支，保存工作内容:

```sh
(solution)$ git add -A && git commit -m "Adding all changes from this spike into one big commit."
```

当你想把它放到一个分支里（可能是 `feature`，或 `develop`），而你关心的是保持整个文件完整、把一个大提交拆成几个小的时——

假设你有:

- 分支 `solution`, 拥有原型方案， 领先 `develop` 分支。
- 分支 `develop`, 在这里你应用原型方案的一些内容。

可以通过把内容拿到你的分支里来解决这个问题:

```sh
(develop)$ git checkout solution -- file1.txt
```

这会把这个文件内容从分支 `solution` 拿到分支 `develop` 里来:

```sh
# On branch develop
# Your branch is up-to-date with 'origin/develop'.
# Changes to be committed:
#  (use "git reset HEAD <file>..." to unstage)
#
#        modified:   file1.txt
```

然后, 正常提交。

Note: Spike solutions are made to analyze or solve the problem. These solutions are used for estimation and discarded once everyone gets clear visualization of the problem.

#### 我把几个提交(commit)提交到了同一个分支，而这些提交应该分布在不同的分支里

假设你有一个`main`分支， 执行`git log`, 你看到你做过两次提交:

```sh
(main)$ git log

commit e3851e817c451cc36f2e6f3049db528415e3c114
Author: Alex Lee <alexlee@example.com>
Date:   Tue Jul 22 15:39:27 2014 -0400

    Bug #21 - Added CSRF protection

commit 5ea51731d150f7ddc4a365437931cd8be3bf3131
Author: Alex Lee <alexlee@example.com>
Date:   Tue Jul 22 15:39:12 2014 -0400

    Bug #14 - Fixed spacing on title

commit a13b85e984171c6e2a1729bb061994525f626d14
Author: Aki Rose <akirose@example.com>
Date:   Tue Jul 21 01:12:48 2014 -0400

    First commit
```

让我们用提交 hash(commit hash)标记 bug (`e3851e8` for #21, `5ea5173` for #14).

首先, 我们把`main`分支重置到正确的提交(`a13b85e`):

```sh
(main)$ git reset --hard a13b85e
HEAD is now at a13b85e
```

现在, 我们对 bug #21 创建一个新的分支:

```sh
(main)$ git checkout -b 21
(21)$
```

接着, 我们用 _cherry-pick_ 把对 bug #21 的提交放入当前分支。 这意味着我们将应用(apply)这个提交(commit)，仅仅这一个提交(commit)，直接在 HEAD 上面。

```sh
(21)$ git cherry-pick e3851e8
```

这时候, 这里可能会产生冲突， 参见[交互式 rebasing 章](#interactive-rebase) [**冲突节**](#merge-conflict) 解决冲突.

再者， 我们为 bug #14 创建一个新的分支, 也基于`main`分支

```sh
(21)$ git checkout main
(main)$ git checkout -b 14
(14)$
```

最后, 为 bug #14 执行 `cherry-pick`:

```sh
(14)$ git cherry-pick 5ea5173
```

#### 我想删除上游(upstream)分支被删除了的本地分支

一旦你在 github 上合并(merge)了一个 pull request，就可以删掉 fork 里被合并的分支。如果不打算继续在这个分支上工作，删掉它的本地拷贝会更干净，免得陷入工作分支和一堆陈旧分支的混乱里。

```sh
$ git fetch -p
```

#### 我不小心删除了我的分支

如果你定期推送到远程，多数情况下应该是安全的，但有时还是会删掉还没推到远程的分支。先来创建一个分支和一个新文件:

```sh
(main)$ git checkout -b my-branch
(my-branch)$ git branch
(my-branch)$ touch foo.txt
(my-branch)$ ls
README.md foo.txt
```

添加文件并做一次提交

```sh
(my-branch)$ git add .
(my-branch)$ git commit -m 'foo.txt added'
(my-branch)$ foo.txt added
 1 files changed, 1 insertions(+)
 create mode 100644 foo.txt
(my-branch)$ git log

commit 4e3cd85a670ced7cc17a2b5d8d3d809ac88d5012
Author: siemiatj <siemiatj@example.com>
Date:   Wed Jul 30 00:34:10 2014 +0200

    foo.txt added

commit 69204cdf0acbab201619d95ad8295928e7f411d5
Author: Kate Hudson <katehudson@example.com>
Date:   Tue Jul 29 13:14:46 2014 -0400

    Fixes #6: Force pushing after amending commits
```

现在我们切回到主(main)分支，‘不小心的’删除`my-branch`分支

```sh
(my-branch)$ git checkout main
Switched to branch 'main'
Your branch is up-to-date with 'origin/main'.
(main)$ git branch -D my-branch
Deleted branch my-branch (was 4e3cd85).
(main)$ echo oh noes, deleted my branch!
oh noes, deleted my branch!
```

这时你应该想起 `reflog`，一个升级版的日志，它记录了仓库(repo)里所有动作的历史。

```text
(main)$ git reflog
69204cd HEAD@{0}: checkout: moving from my-branch to main
4e3cd85 HEAD@{1}: commit: foo.txt added
69204cd HEAD@{2}: checkout: moving from main to my-branch
```

正如你所见，我们有一个来自删除分支的提交 hash(commit hash)，接下来看看是否能恢复删除了的分支。

```sh
(main)$ git checkout -b my-branch-help
Switched to a new branch 'my-branch-help'
(my-branch-help)$ git reset --hard 4e3cd85
HEAD is now at 4e3cd85 foo.txt added
(my-branch-help)$ ls
README.md foo.txt
```

看，我们把删掉的文件找回来了。Git 的 `reflog` 在 rebasing 出错时同样管用。

#### 我想删除一个分支

删除一个远程分支:

```sh
(main)$ git push origin --delete my-branch
```

你也可以:

```sh
(main)$ git push origin :my-branch
```

删除一个本地分支:

```sh
(main)$ git branch -D my-branch
```

#### 我想从别人正在工作的远程分支签出(checkout)一个分支

首先, 从远程拉取(fetch) 所有分支:

```sh
(main)$ git fetch --all
```

假设你想要从远程的`daves`分支签出到本地的`daves`

```sh
(main)$ git checkout --track origin/daves
Branch daves set up to track remote branch daves from origin.
Switched to a new branch 'daves'
```

(`--track` 是 `git checkout -b [branch] [remotename]/[branch]` 的简写)

这样就得到了一个 `daves` 分支的本地拷贝，任何推过(pushed)的更新，远程都能看到。

### Rebasing 和合并(Merging)

#### 我想撤销 rebase/merge

你可能合并(merge)或 rebase 了一个错误的分支，也可能没能完成一次进行中的 rebase/merge。Git 在做危险操作时会把原始的 HEAD 保存在一个叫 ORIG_HEAD 的变量里，所以把分支恢复到 rebase/merge 前的状态很容易。

```sh
(my-branch)$ git reset --hard ORIG_HEAD
```

#### 我已经 rebase 过, 但是我不想强推(force push)

遗憾的是，如果你想把变化(changes)反映到远程分支，就必须强推(force push)。因为你快进(Fast forward)了提交，改变了 Git 历史，远程分支不会接受这些变化，除非强推。这也是很多人用 merge 工作流而非 rebasing 工作流的主要原因之一——开发者的强推(force push)会让大团队陷入麻烦。用的时候得当心。一种安全使用 rebase 的办法是，不把你的变化反映到远程分支，而是这样做:

```sh
(main)$ git checkout my-branch
(my-branch)$ git rebase -i main
(my-branch)$ git checkout main
(main)$ git merge --ff-only my-branch
```

#### 我需要组合(combine)几个提交(commit)

假设你的工作分支要向 `main` 发起 pull-request。一般情况下你不在意提交(commit)的时间戳，只想把**所有**提交(commit)合成一个，然后重置(reset)重新提交(recommit)。确保 main 分支是最新的、且你的变化都已经提交了，然后:

```sh
(my-branch)$ git reset --soft main
(my-branch)$ git commit -am "New awesome feature"
```

如果你想更可控、保留时间戳，就得用交互式 rebase (interactive rebase):

```sh
(my-branch)$ git rebase -i main
```

如果没有对应的其它分支，你就不得不相对自己的 `HEAD` 进行 rebase。比如想组合最近两次提交(commit)，就相对于 `HEAD~2` 进行 rebase；组合最近 3 次，就相对于 `HEAD~3`，以此类推。

```sh
(main)$ git rebase -i HEAD~2
```

执行交互式 rebase 命令(interactive rebase command)后，你会在编辑器里看到类似下面的内容:

```vim
pick a9c8a1d Some refactoring
pick 01b2fd8 New awesome feature
pick b729ad5 fixup
pick e3851e8 another fix

# Rebase 8074d12..b729ad5 onto 8074d12
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

所有以 `#` 开头的行都是注释，不影响 rebase。

接着，你可以用上面命令列表里的任意一个替换 `pick`，也可以通过删除对应的行来删掉一个提交(commit)。

比如，如果你想**单独保留最旧(first)的提交(commit)，把剩下的都并到第二个里**，就把第二个提交(commit)后面每个提交前的那几个字母改成 `f`:

```vim
pick a9c8a1d Some refactoring
pick 01b2fd8 New awesome feature
f b729ad5 fixup
f e3851e8 another fix
```

如果你想组合这些提交(commit)**并重命名这个提交(commit)**，就在第二个提交(commit)旁边加一个 `r`，或者更简单点，用 `s` 替代 `f`:

```vim
pick a9c8a1d Some refactoring
pick 01b2fd8 New awesome feature
s b729ad5 fixup
s e3851e8 another fix
```

你可以在接下来弹出的文本提示框里重命名提交(commit)。

```vim
Newer, awesomer features

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
# rebase in progress; onto 8074d12
# You are currently editing a commit while rebasing branch 'main' on '8074d12'.
#
# Changes to be committed:
#	modified:   README.md
#

```

如果成功了, 你应该看到类似下面的内容:

```sh
(main)$ Successfully rebased and updated refs/heads/main.
```

#### 安全合并(merging)策略

`--no-commit` 执行合并(merge)但不自动提交，给你在提交前检查和修改的机会。`no-ff` 则会为特性分支(feature branch)的存在留下痕迹，保持项目历史一致。

```sh
(main)$ git merge --no-ff --no-commit my-branch
```

#### 我需要将一个分支合并成一个提交(commit)

```sh
(main)$ git merge --squash my-branch
```

#### 我只想组合(combine)未推的提交(unpushed commit)

有时候，在把数据推向上游之前，你有几个正在进行的工作提交(commit)。这时不想把已经推(push)过的也并进来，因为别人可能已经有提交(commit)引用它们了。

```sh
(main)$ git rebase -i @{u}
```

这会产生一次交互式 rebase(interactive rebase)，只列出没有推(push)的提交(commit)，在这个列表里 reorder/fix/squash 都是安全的。

#### 检查是否分支上的所有提交(commit)都合并(merge)过了

要检查一个分支上的所有提交(commit)是否都已合并(merge)到了其它分支，你可以在这些分支的 head（或任意 commit）之间做一次 diff:

```sh
(main)$ git log --graph --left-right --cherry-pick --oneline HEAD...feature/120-on-scroll
```

它会告诉你哪些提交(commit)在一个分支里有、另一个分支没有，以及分支之间不共享的提交(commit)。另一个做法是:

```sh
(main)$ git log main ^feature/120-on-scroll --no-merges
```

### 交互式 rebase(interactive rebase)可能出现的问题

#### 这个 rebase 编辑屏幕出现’noop’

如果你看到的是这样:

```text
noop
```

这意味着你 rebase 的分支和当前分支在同一个提交(commit)上，或者 _领先(ahead)_ 当前分支。你可以试试:

- 检查确保主(main)分支没有问题
- rebase `HEAD~2` 或者更早

#### 有冲突的情况

如果你没能顺利完成 rebase，可能就需要解决冲突。

先执行 `git status` 找出哪些文件有冲突:

```sh
(my-branch)$ git status
On branch my-branch
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   README.md
```

在这个例子里，`README.md` 有冲突。打开这个文件，找到类似下面的内容:

```vim
   <<<<<<< HEAD
   some code
   =========
   some code
   >>>>>>> new-commit
```

你要解决新提交的代码（示例里从中间 `==` 线到 `new-commit` 的部分）与 `HEAD` 之间不一致的地方。

有时这些合并很复杂，可以借助可视化的差异编辑器(visual diff editor):

```sh
(main*)$ git mergetool -t opendiff
```

解决完所有冲突并测试过后，`git add` 变化了的(changed)文件，再用 `git rebase --continue` 继续 rebase。

```sh
(my-branch)$ git add README.md
(my-branch)$ git rebase --continue
```

如果解决完所有冲突后，结果和提交前一样，可以执行 `git rebase --skip`。

任何时候想结束整个 rebase 过程、回到 rebase 前的分支状态，可以这样做:

```sh
(my-branch)$ git rebase --abort
```

### Stash

#### 暂存所有改动

暂存你工作目录下的所有改动

```sh
$ git stash
```

你可以用 `-u` 来排除一些文件

```sh
$ git stash -u
```

#### 暂存指定文件

假设你只想暂存某一个文件

```sh
$ git stash push working-directory-path/filename.ext
```

假设你想暂存多个文件

```sh
$ git stash push working-directory-path/filename1.ext working-directory-path/filename2.ext
```

#### 暂存时记录消息

这样你可以在`list`时看到它

```sh
$ git stash save <message>
```

或

```sh
$ git stash push -m <message>
```

#### 使用某个指定暂存

首先你可以查看你的`stash`记录

```sh
$ git stash list
```

然后你可以`apply`某个`stash`

```sh
$ git stash apply "stash@{n}"
```

这里，'n' 是 `stash` 在栈中的位置，最上层的 `stash` 是 0。

也可以用时间标记（假如你记得的话）。

```sh
$ git stash apply "stash@{2.hours.ago}"
```

#### 暂存时保留未暂存的内容

你需要手动 create 一个`stash commit`， 然后使用`git stash store`。

```sh
$ git stash create
$ git stash store -m "commit-message" CREATED_SHA1
```

### 杂项(Miscellaneous Objects)

#### 克隆所有子模块

```sh
$ git clone --recursive git://github.com/foo/bar.git
```

如果已经克隆了:

```sh
$ git submodule update --init --recursive
```

#### 删除标签(tag)

```sh
$ git tag -d <tag_name>
$ git push <remote> :refs/tags/<tag_name>
```

#### 恢复已删除标签(tag)

如果你想恢复一个已删除标签(tag)，可以按下面的步骤来：先找到无法访问的标签(unreachable tag):

```sh
$ git fsck --unreachable | grep tag
```

记下这个标签(tag)的 hash，然后用 Git 的 update-ref

```sh
$ git update-ref refs/tags/<tag_name> <hash>
```

这时你的标签(tag)应该已经恢复了。

#### 已删除补丁(patch)

如果某人在 GitHub 上给你发了一个 pull request，但随后他删掉了自己的原始 fork，你就没法克隆他们的提交(commit)或使用 `git am`。这种情况下，最好手动查看他们的提交(commit)，把它们拷贝到一个本地新分支，然后提交。

提交后，再修改作者，参见[变更作者](#commit-wrong-author)。然后应用变化，发起一个新的 pull request。

#### 跟踪文件(Tracking Files)

#### 我只想改变一个文件名字的大小写，而不修改内容

```sh
(main)$ git mv --force myfile MyFile
```

#### 我想从 Git 删除一个文件，但保留该文件

```sh
(main)$ git rm --cached log.txt
```

### 配置(Configuration)

#### 我想给一些 Git 命令添加别名(alias)

在 OS X 和 Linux 下，你的 Git 配置文件存在 `~/.gitconfig`。我在 `[alias]` 部分加了一些快捷别名（还有一些我容易拼错的），如下:

```vim
[alias]
    a = add
    amend = commit --amend
    c = commit
    ca = commit --amend
    ci = commit -a
    co = checkout
    d = diff
    dc = diff --changed
    ds = diff --staged
    f = fetch
    loll = log --graph --decorate --pretty=oneline --abbrev-commit
    m = merge
    one = log --pretty=oneline
    outstanding = rebase -i @{u}
    s = status
    unpushed = log @{u}
    wc = whatchanged
    wip = rebase -i @{u}
    zap = fetch -p
```

#### 我想缓存一个仓库(repository)的用户名和密码

你可能有一个需要授权的仓库，这时可以缓存用户名和密码，而不用每次推/拉(push/pull)都输入，Credential helper 能帮你。

```sh
$ git config --global credential.helper cache
# Set git to use the credential memory cache
```

```sh
$ git config --global credential.helper 'cache --timeout=3600'
# Set the cache to timeout after 1 hour (setting is in seconds)
```

#### 我不知道我做错了些什么

你把事情搞砸了：`重置(reset)` 了某些东西，或者合并了错误的分支，又或者强推之后找不到自己的提交(commit)了。有时候其实你一直做得挺好，只是想回到以前的某个状态。

这正是 `git reflog` 的用途。`reflog` 记录对分支顶端(the tip of a branch)的任何改变，即使那个顶端没有被任何分支或标签引用。基本上，每次 HEAD 改变，就会往 `reflog` 里加一条新记录。遗憾的是，这只对本地分支起作用，且只跟踪动作（比如不会跟踪一个没被记录的文件的任何改变）。

```sh
(main)$ git reflog
0a2e358 HEAD@{0}: reset: moving to HEAD~2
0254ea7 HEAD@{1}: checkout: moving from 2.2 to main
c10f740 HEAD@{2}: checkout: moving from main to 2.2
```

上面的 reflog 展示了从 main 分支签出(checkout)到 2.2 分支、再签回的过程。这里还有一个硬重置(hard reset)到一个较旧的提交。最新的动作出现在最上面，以 `HEAD@{0}` 标识。

如果事实证明你不小心回移(move back)了提交(commit)，reflog 里会包含你不小心回移前 main 上指向的提交(0254ea7)。

```sh
$ git reset --hard 0254ea7
```

然后用 git reset 就能把 main 改回到之前的 commit，这在历史被意外更改时提供了一个安全网。

<!-- ## 注

无 -->

## 参考

[45 个 GIT 经典操作场景，专治不会合代码](https://mp.weixin.qq.com/s/2p4m63JdsCjBpVku-WaZyA)
