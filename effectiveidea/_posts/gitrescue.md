{{{
    "title"    : "Git rescue page",
    "tags"     : [ "git", "github" ],
    "category" : "git",
    "date"     : "6-07-2013"
}}}

Author: [Elad Elrom](https://twitter.com/EladElrom)

Git rescue page
===============

A rescue page I refer to often, it includes information that you may find useful working everyday with github.

Clone
-----

<pre class="prettyprint">
git clone [origin] [path-to-directory]
</pre>

Set remote `origin`:

<pre class="prettyprint">
git remote add remote origin [repo]
</pre>

Add the upstream to original:

<pre class="prettyprint">
git remote add upstream [branch] [repo]
</pre>

so assuming you set the origin as the branch name, run these two when you set your repo: 

<pre class="prettyprint">
git branch --set-upstream develop origin/develop
git branch --set-upstream master origin/master
</pre>

Set `remote` `origin`:

<pre class="prettyprint">
git remote add origin [repo]
</pre>

Show current `remote` URL:
<pre class="prettyprint">
git remote show origin
</pre>

Switch `remote` URL:
<pre class="prettyprint">
git remote set-url origin https://github.com/[user]/[repo]
</pre>
Rest but keep changes:

<pre class="prettyprint">
git reset --hard
</pre>

Reset and Remove changes:
<pre class="prettyprint">
git clean -f
</pre>

Git `config` file location:
<pre class="prettyprint">
cat .git/config
</pre>

Branches
--------

Delete branch locally:

<pre class="prettyprint">
git branch -D release
</pre>

Delete branch remotly:

<pre class="prettyprint">
git push origin --delete release
</pre>

Add branch locally:
<pre class="prettyprint">
git branch [name]
</pre>

Push branch remotly:

<pre class="prettyprint">
git push origin [name]
</pre>

Rename branch
-------------

Rename branch name locally;
<pre class="prettyprint">
git branch -m master master-old
</pre>

Examle: rename development to develop on remote server
<pre class="prettyprint">
git branch -m develop development-old
</pre>

delete develop
<pre class="prettyprint">
git push remote : develop
</pre>

Create `development-old` on remote
<pre class="prettyprint">
git push remote development-old
</pre>

Create a new local `development` branch
<pre class="prettyprint">
git checkout -b develop
</pre>

Create `development` branch on `remote`
<pre class="prettyprint">
git push remote develop
</pre>


Rollback
--------

Rollback one commit:

<pre class="prettyprint">
git rebase -i HEAD^^

or 

git rebase -i [commit id]
</pre>

Stash
-----

<pre class="prettyprint">
git stash 
change branch whatever
git stash apply
</pre>

.gitignore
----------

remove `.DS_Store`:

<pre class="prettyprint">
find . -name .DS_Store -print0 | xargs -0 git rm --ignore-unmatch -f
</pre>

Than add to `.gitignore` globally:

<pre class="prettyprint">
vim ~/.gitignore
.DS_Store
git config --global core.excludesfile ~/.gitignore
</pre>

Tools
=====

Git flow
--------

[URL](https://github.com/nvie/gitflow)

Creating `feature`/`release`/`hotfix`/`support` branches
To list/start/finish feature branches, use:

<pre class="prettyprint">
git flow feature
git flow feature start <name> [<base>]
git flow feature finish <name>
</pre>

To push/pull a feature branch to the remote repository, use:

<pre class="prettyprint">
git flow feature publish <name>
git flow feature pull <remote> <name>
</pre>

Git + hub
---------

[URL](https://github.com/defunkt/hub.git)

Node GH
-------

Install using NPM:
<pre class="prettyprint">
npm install -g gh
</pre>

Example; 

Pull request from fork `EladElrom` to develop branch

<pre class="prettyprint">
gh pr --submit EladElrom --title 'pull dev to master' -b develop
</pre>
