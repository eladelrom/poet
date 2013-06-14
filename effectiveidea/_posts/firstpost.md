{{{
    "title"    : "Live realtime communication and collaboration service",
    "tags"     : [ "nodejs", "development" ],
    "category" : "nodejs",
    "date"     : "5-31-2013"
}}}

Author: [Elad Elrom](https://twitter.com/EladElrom)

Seamless Real Time Communication
================================

To create a real time experience years ago, you usually needed a proprietary communication server such as Window LCS, Adobe AMS.  *Yes*, you could have done it open source with servers such as [APE](http://www.ape-project.org/APE), however, it involved a learning curve and a large team. In today’s ambiguous web and mobile fragmented paradigm, where it’s unclear and unwise to commit to a particular technology, more and more developers and companies are finding appeal in *JavaScript*.
Companies such as Paypal are going to be entirely based on Node.js in just a few months and (what this interseting video from [Bill Scott from Fluent 2013](http://www.youtube.com/watch?v=tZWGb0HU2QM&feature=share), Condé Nast are rolling prototypes and many other companies.

Javascript is emerging is the winner and can be used for everything; from front-end development using frameworks such as [Emberjs](http://emberjs.com/), [AngularJS](http://angularjs.org/), [backbonejs](http://backbonejs.org/) and template engines such as [Jadejs](http://jade-lang.com/) to back-end using [Express](http://expressjs.com/) for web server and [SocketIO](http://socket.io/) for websocket, and testing using JS libraries such as [Mocha](http://visionmedia.github.io/mocha/) or [Should](https://github.com/visionmedia/should.js/) to tasks using [Grunt](http://gruntjs.com/), using Javascript it an easy choice, since it’s evident that rendering HTML pages will always work on all devices.

Mainstream
----------

What used to be difficult to build years ago is becoming more and more accessible to the mainstream market and the masses.  When I think about the future of a social experience, it’s more about collaboration in real time and trying to create a real life experience on the web than hitting the *“like”* button to share content on Facebook.

I believe that every site and company can benefit from using real time communication to create a “live” experience that makes applications seems more engaged and happening than a passive environment.

There are already solutions out there that enable you to build "live" content via WebSocket such as [Derby](http://derbyjs.com/) or [Meteor](http://meteor.com/).  However, these technologies fit new projects rather than integrating with an existing technology’s stack.

Is there a solution than?
-------------------------

Implementing a solution is not that easy, since most projects are not greenfield, and you need to take into account existing technologies to make sure new solutions are flexible enough for whatever comes next, as well as being lightweight and scalable. I believe technological solutions must not only improve and enhance, but also be made adaptable to pre-existing technology stacks.

Take a blog as an example.  Even a simple blog like this one can benefit from a live experience.  For instance, how neat would it be to show

* The number of visitors on each page.
* Integrate live webcams so people can leave video messages or talk about the content as they read it.
* Even enable viewers to watch content creation live as it happens.
* Draft evolves into a blog post?

Some may find the real time experience intrusive, but I believe that in today’s world, where our attention span is limited to only few minutes, users would not hold the transparency against us. On the contrary, our solution would feel more like a real and human experience.

This blog as a case study
-------------------------

Although the technology is new and you can’t compare it with [WordPress](http://wordpress.org/), which has many modules and integration. This blog was created using [Poet](http://jsantell.github.io/poet/), and as the first contribution I used a *node_module* developed called [RoomsJS](https://npmjs.org/package/roomsjs).  I could have easily able to create a room, register a user and show the number of visitors on each page.  Each user also has the option to broadcast a webcam feed and share comments in real time, and their presence is displayed to other viewers through their “pod” that tracks each viewer’s mouse. You can also update the number of users on the page in real time, so feel free to test this feature by opening a new window tab with the same URL you’re using now and enable the box on the top right corner.


RoomsJS
-------

About a month ago, I started working on a solution that enable using `nodejs` and `socketio` to create a realtime communication, while enabling using your current technology stack.  The idea is to build a solution that enable you to implement and add your specific use case and be able to scale and use your exiting team rather than throw it all out and start fresh.