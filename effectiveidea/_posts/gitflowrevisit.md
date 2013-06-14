{{{
    "title"    : "Git Flow Revisit",
    "tags"     : [ "git", "github" ],
    "category" : "git",
    "date"     : "6-11-2013"
}}}

Author: [Elad Elrom](https://twitter.com/EladElrom)

Git Flow Revisit
===============

[Git flow](http://nvie.com/posts/a-successful-git-branching-model/) have proven to be a great workflow working as a team utilizing git, however just like any other process, you want to avoid spending too much time on the process and more time coding.
The implementation of git flow, see [https://github.com/nvie/gitflow](https://github.com/nvie/gitflow) mythology is rock solid as well and the commands end up saving precious time, however it wasn't enough for me.  I found myself many times not following the git flow process or avoiding to forking projects and making commits due to the tedious process involved in getting a project up and running.

Assuming you see a repo on `github` that you would like to fork, the usual process to setting up a project for me used to be this set of commands;
<br /><br />

<pre class="prettyprint">
mkdir [folder]
git init
git remote add origin [forked repo]
git remote add upstream [original repo]
git fetch
git checkout develop
git checkout master
git flow init
git branch --set-upstream develop origin/develop
git branch --set-upstream master origin/master
</pre>

These commands set the original, upstream, get the branches I need and set git flow.  Setting the project is crucial, since setting up the project correctly can allow you pull the upstream without making a `github` pull request and using a simple command, as below:

<pre class="prettyprint">
git pull upstream develop
</pre>

This command will pull any changes from the original repo without the need to make a pull request on `github`.
As you can see this is an awful amount of commands just to get a repo up and running.  Using all these bash commands boilerplate is silly and as a developer I like to try to automate a process that kills my productivity.

Solution
--------

Last week a project caught my attention called [node-gh](https://github.com/eduardolundgren/node-gh) a `github` command line bash wrapper that was build on `nodejs` maintained by [Eduardo Lundgren](https://github.com/eduardolundgren/) and [Zeno Rocha](https://github.com/zenorocha/), it has features that add the ability to make pull requests or see issues via the `github` API using bash command line, so you can run commands to make pull requests.
I decided to contribute and add a `gh flow` command to allow streaming the tedious process I outlines above, plus to hopefully increase the automation of `git flow`.

The `gh flow` command is editing the `.git/config` file the same way that `git flow` does, so you can work with both of the tools together, which is a key as my command is not completed at the time or writing so you can use both for now.

How neat is it to give your team a command to run, when a new member join the team, instead of a document full of instructions?

Consider the following command:

<pre class="prettyprint">
gh flow --auto remote [remote-repo-URL] origin [origin-repo-URL] folder [folder-name]
</pre>

This command will create a project folder on your behalf, will set the original, upstream repo, init flow and checkout develop and master branches if exists.

You can just run `gh flow` to get the commands available

<pre class="prettyprint">
Syntax: gh [flow] [sub-command] [--flags]

List of available sub-commands:

    -i, --auto      Create folder, fetch, set remote & upstream, init flow
    -i, --init      Initialize a new git repo with support for the branching model.
    -f, --feature   Manage your feature branches.
    -r, --release   Manage your release branches. [coming soon]
    -h, --hotfix    Manage your hotfix branches.  [coming soon]
    -s, --support   Manage your support branches. [coming soon]
    -v, --version   Shows version information.

List of available flags at end of requests:

   submit   Submit a pull request to remote branch.

Try gh [flow] [sub-command] for details.
</pre>

Start a feature branch (just as in git flow)

<pre class="prettyprint">
gh flow --feature start [branch name]
</pre>

merge the branch back to the develop branch and delete branch

<pre class="prettyprint">
gh flow --feature finish [branch name]
</pre>

submit `same as above **BUT** also gives does an automatic pull request to develop

<pre class="prettyprint">
gh flow --feature finish [branch name] submit
</pre>


I am adding sub-commands as I am using the tool.  Feel free to check it out:
[https://github.com/EladElrom/node-gh](https://github.com/EladElrom/node-gh)



