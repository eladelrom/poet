{{{
    "title"    : "nglue",
    "tags"     : [ "nglue", "javascript", "angularjs", "angular" ],
    "category" : "nodejs",
    "date"     : "6-17-2013"
}}}

Author: [Elad Elrom](https://twitter.com/EladElrom)

# nglue a lightweight architectural micro-framework for AngularJS

`Angularjs` is all about creating re-usable modules and utilizing declarative templates with data-binding, MVW / MVVM / MVC, dependency injection architecture to help simplify building complex modules.  Angular have all that we need to build modules and scale, however the angular framework is not there to standardize how to glue these modules together to form an app and scale, so although the out of the box components can be scaled it's up to every developer to figure out how.
Angular comes vanilla flavor so you can create your own implementation, however figuring out how to architecting a large scale Angular project is not as simple and many developers are facing with the same challenge.

## Architecture challenge

Architecting your project is not an easy task since you need to take into account many things such as the size of the project, business requirement, team members and much more.  Than thinking about optimization adds another layer to the challenge, since adding any boilerplate code can increase the size of your project significantly and can result in large memory footprint, at the same time many times the project you’re working on will be handled by more than one developer.

The angularjs framework is a library that provides architecture to an application. The framework library is built upon sets of components.  The component sets encapsulated the functionality that you can use and implement.
Unknowingly you set architecture in your application just by using the component sets. These component sets are making explicit calls through their interfaces, which creates the functionality. This type of architecture is common and I am sure you heard the term before, inversion of control (IoC) and Dependency Injection (DI).

### Scaling Angularjs projects

Angularjs includes an architecture, however it doesn't provide structure needed for us to use when building large applications.
There are cases where you need structure to ensure your application can be scaled in term of resource as well as size.  From my personal experience working on many projects and with many teams I believe it’s the responsibility of us, the developers, to assess a project and assign architecture that will best fit the project long term and accommodate changes in the project and not just today’s needs. The reason I believe it’s our responsibility is that the business is usually not as technically savvy and need a guidance from the hands-on team that can take into account personal experience, current trend and other factors.

## Introducing nglue

nglue is nothing more than `Yeoman` generator with `grunt` tasks.  It's built to give you structure and tools for gluing re-usable angularjs modules into an app and help you deploy the app.

An App includes few modules attached together and talking to each other.  An `app` can be anything; a page on a website, a mobile app or just combining two modules.  `nglue` holds the basics and meant to be simplify so you can suite the project to your exact needs. Additionally, it helps create structure to your large project so member of the team can dive in and start working and deploy quickly.
Deployment scripts helps take these modules from stand alone to glued app and than deployment.

The benefit of loose coupling is that your code is changeable since the code isn’t dependent on one another. At the same time the tradeoff is that loosely coupled code increases complexity, and it's not immediately apparent what the code does when it's loosely coupled.
The Inversion of Control (IoC) and Dependency Injection.

## Why do you need the `nglue` Micro-architecture framework for Angular?

`nglue` is lightweight architectural micro-framework it stands for the internal architecture of the processor.  It provides the skeleton, around the exact needs/features of your application.  In other words, nglue framework provides the starting point for you application’s architecture.

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

1. `code_base` - the folder the holds your code base with all the re-usable modules and apps, it includes the



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

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)


