{{{
    "title"    : "nglue",
    "tags"     : [ "nglue", "javascript", "angularjs", "angular" ],
    "category" : "nodejs",
    "date"     : "7-17-2013"
}}}

Author: [Elad Elrom](https://twitter.com/EladElrom)

# nglue a lightweight architectural micro-framework for AngularJS

![nglue logo](https://raw.github.com/EladElrom/poet/ei-pages/effectiveidea/public/images/nglue-logo.jpg)

See it on github:
[https://github.com/eladelrom/generator-nglue](https://github.com/eladelrom/generator-nglue)

Angularjs original intention was all about creating re-usable modules and utilizing declarative templates with data-binding, using design patterns (MVW / MVVM / MVC), utilizing dependency injection architecture to help simplify building complex modules.  Angular have all that you need to build modules and scale, however the angular framework didn't standardize how to glue these modules together to form an app and scale, it's up to every developer to figure out how to scale a project.
Figuring out how to architect a large scale Angular project is not a simple task as one would think and many developers are facing with the same challenge on how to scale.

I have seen few projects and articles that attempted to solve the problem such as generator-angular, ng-boilerplate as well as few blog posts that addressing scaling large Angular project.

1. (generator-angular)[https://github.com/yeoman/generator-angular] - is a generator to give you scaffolding for creating angular modules.
2. ng-boilerplate - as the name suggest it's a boilerplate code for creating an angular project.

Although the information is relevant and helpful on certain project, it doesn't fit all projects, since sometimes you are not looking to build a website and don't want and/or need a whole boilerplate overhead.  Using generator-angular helps creating an agular module but it falls short on glue few modules together.

## Architecture challenge

Architecting your project is not an easy task, since you need to take into account many things such as the size of the project, business requirement, team size and much more.  Than thinking about optimization adds another layer to the challenge, since adding any boilerplate code can increase the size of your project significantly and can result in large memory footprint, at the same time many times the project you’re working on will be handled by more than one developer.

The angularjs framework is a library that provides architecture to an application. The framework library is built upon sets of components.  The component sets encapsulated the functionality that you can use and implement.
Unknowingly you set architecture in your application just by using the component sets. These component sets are making explicit calls through their interfaces, which creates the functionality. This type of architecture is common and I am sure you heard the term before, inversion of control (IoC) and Dependency Injection (DI).

### Scaling Angularjs projects

Angularjs includes an architecture, however it doesn't provide structure needed for us to use when building large applications.
There are cases where you need structure to ensure your application can be scaled in term of resource as well as size.  From my personal experience working on many projects and with many teams I believe it’s the responsibility of us, the developers, to assess a project and assign architecture that will best fit the project long term and accommodate changes in the project and not just today’s needs. The reason I believe it’s our responsibility is that the business is usually not as technically savvy and need a guidance from the hands-on team that can take into account personal experience, current trend and other factors.

## Introducing nglue

nglue is nothing more than `Yeoman` generator with `grunt` tasks.  It's built to give you structure and tools for gluing re-usable angularjs modules into an app and help you deploy the app.

In nglue an App is at least two modules glued together. Using nglue you can easily glue few modules together and have them communicate to each other.  An app can be anything; a page on a website, a mobile app or just combining two modules that needs to communicate and form a composition.

nglue holds the basics and meant to be simplify so you can suite the project to your exact needs. Additionally, it helps create structure to your large project so member of the team can dive in quickly and start working on the project as well as deploy quickly.
Deployment scripts helps take these modules from stand alone to glued app and than deployment.

The benefit of loose coupling is that your code is changeable since the code isn’t dependent on one another. At the same time the tradeoff is that loosely coupled code increases complexity, and it's not immediately apparent what the code does when it's loosely coupled.
The Inversion of Control (IoC) and Dependency Injection.

## Why do you need the `nglue` Micro-architecture framework for Angular?

`nglue` is nothing more than lightweight architectural micro-framework, it stands for the internal architecture of the processor.  It provides the skeleton, around the exact needs/features of your application.  In other words, nglue framework provides the starting point for you application’s architecture.

Ideally programming is all about re-using your code, and in an ideal workflow you would ensure that any effort in creating modules is set in a way where you can re-use that code, update it easily or even share so other people can help contribute.
Additionally, creating re-usable module, glue them together and distribute can help grow the team and outsource work without fear of integration.

nglue was built to solve all these problems.

## Workflow

The best way to explain the workflow is to walk you through building a simply project.

### Getting started
- Create your project and cd: `mkdir myproject && cd $_`
- Make sure you have [yo](https://github.com/yeoman/yo) installed:
    `npm install -g yo`
- Install the generator: `npm install -g generator-nglue`
- Run: `yo nglue`

Once you run `yo nglue` the welcome window will ask for your project name.  The project name will be used for many of the applications templates generation, so it's recommended to use the same name you used to create your project 'myproject'.

![nglue init](https://raw.github.com/EladElrom/poet/ei-pages/effectiveidea/public/images/nglue1.png)

This will create the project scaffolding, install bower components & install grunt.

Let's talk a quick walk through what was created for us.

![nglue structure](https://raw.github.com/EladElrom/poet/ei-pages/effectiveidea/public/images/nglue2.png)

At the root directory we have two folder: `code_base` and `dist`.

1. `code_base` - the folder the holds your code base with all the re-usable modules and apps as well as configuration files and deployment scripts.
2. `dist` - holds an empty folder shell, where you can implement your own specific code to move from local build to deploy your scripts on a server (if needed).

### Overall Directory Structure

At a high level, the structure looks roughly like this:

<pre>
myproject/
  |- code_base/
  |  |  |- apps
  |  |  |   |- myApp
  |  |  |   |   |- assets
  |  |  |   |   |- bower_components
  |  |  |   |   |- components
  |  |  |   |   |- images
  |  |  |   |   |- styles
  |  |  |   |   |   |- myApp-app-latest.css
  |  |  |   |   |- views
  |  |  |   |   |   |-myApp.html
  |  |  |   |   |- index.html
  |  |  |   |   |- nglue.json
  |  |  |   |   |- scripts
  |  |  |   |   |   |- app.js
  |  |  |   |   |   |- controllers
  |  |  |   |   |   |   |- myApp.js
  |  |  |   |   |   |- directives
  |  |  |   |   |   |- filters
  |  |  |   |   |   |- services
  |  |  |- assets/
  |  |  |   |- bower_components
  |  |  |   |- components
  |  |  |   |- fonts
  |  |  |   |- images
  |  |  |   |- styles
  |  |  |   |- nglue.json
  |  |  |- dist
  |  |  |- modules
  |  |  |   |- myModule
  |  |  |   |   |- assets/
  |  |  |   |   |   |- bower_components
  |  |  |   |   |   |- components
  |  |  |   |   |   |- images
  |  |  |   |   |   |- styles
  |  |  |   |   |   |- views
  |  |  |   |   |- heroModuleInterface.js
  |  |  |   |   |- index.html
  |  |  |   |   |- nglue.json
  |  |  |   |   |- scripts/
  |  |  |   |   |   |- app.js
  |  |  |   |   |   |- controllers
  |  |  |   |   |   |- directives
  |  |  |   |   |   |- filters
  |  |  |   |   |   |- services
  |  |- assets/
  |- dist/
  |  |  |- <server deployment specific scripts>
  |-.bowerrc
  |-.editorconfig
  |-.gitignore
  |-.jshintrc
  |-bower.json
  |-Gruntfile.js
  |-node_modules
  |-package.json
  |-README.md

</pre>

## Demonstration

[![Demo](https://raw.github.com/EladElrom/poet/ei-pages/effectiveidea/public/images/nglue-asciiio.jpg)](http://ascii.io/a/4165/)

The first step is creating a re-usable modules, the idea is that you try and extract each piece of functionality as it's own entity
and once each module works on it's own than you `glue` them together to form an app.  Than you deploy and finally you integrate into a site or as an application.

## Sub-commands

Create a module and add templates;

> yo nglue:module [module name]

Create an app and add templates;

> yo nglue:apps [app name]

## Deployment

### Concatenating minifies global js files

Grunt command to combines and minifies all the global js files for usage by modules and apps.  Here you can add all the js components you install using bower or added manually.  By default the generator installs; `angular` and `angular-mocks`.
The magic happens in the `nglue.json` file, you can add all the files you need to be usage by your project globally.  Globally, means that every single module used would need these libraries.

In addition to global js files you can also add your global less files and have them compile into one css file.  By default we add `base.less` file, but feel free to add other files as needed, just ensure you add them to this config file to build.

Here's the default initial file you are given when you initialize the generator;

<pre>
{
  "version": "0.0.0",
  "name": "your-project-name-global-components",
  "dependencies": {
    "angular": "bower_components/angular/angular.js"
  },
  "devDependencies": {
    "angular-mocks": "bower_components/angular-mocks/angular-mocks.js"
  },
  "less": {
    "base" : "../styles/base.less"
  },
  "copy": {
    "src": "assets/images"
  }
}
</pre>

### Grunt tasks:

>grunt

Once you run `grunt` the compiled js and css files will be published to `code_base/dist/`.  Assets files will be copied, less files will be compiled.
It uses the `config.js > name` and `version` to generate the names as follow;

<pre>
// global style
styles/your-project-name-global-components-0.0.0.css
styles/your-project-name-global-components-latest.css

// global components
js/your-project-name-global-components-0.0.0.min.js
js/your-project-name-global-components-latest.min.js

// global dev-dependencies components
js/your-project-name-global-components-dev-dependencies-0.0.0.min.js
js/your-project-name-global-components-dev-dependencies-latest.min.js
</pre>

To build a min module component file for an app do the following;

> grunt app --src=detail-page-app

This grunt task will fetch the `nglue.config` file from the app and will glue together all the modules bower and none bower components as well as a less files.
The `nglue.config` file of an app includes all modules you are adding together and than it go to work and pick each `nglue.confoig` from each module to create the component
library and less files.  When you created the app using `yo nglue:apps detail-page` it will create the scaffolding and template as well as basic `nglue.config` file.

Here's an example of an app `nglue.config` file;

<pre>
{
  "version": "0.0.1",
  "name": "detail-page-app",
  "dependencies": {
  },
  "nglue-dependencies": {
    "map": "map",
    "dropdown": "dropdown",
    "infinite-scroll": "infinite-scroll",
    "menu": "menu",
    "sorting": "sorting"
}
</pre>

<br><br>
In the next blog posts I will show you how to create an angular module using nglue and than an app.  I am also going to review how to deploy the code from local build to the server.
