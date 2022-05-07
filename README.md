# Sutori JS 
A Challenge Response Sequencer for building interlinking chains of multimedia.



## Introduction

Imagine you wish to ask the user a series of questions, or you wish to present
multimedia in a specific sequence. Maybe you want to create a menu picking
system on a website, or you wish to create a visual novel or menu component for
a game, or perhaps you want to make a telephone switch board. Sutori provides the
groundwork for building these sorts of things.


For an example, check out: [https://sutori-js.kodaloid.com/](https://sutori-js.kodaloid.com/)



## How To Install

Sutori has no external dependencies. It is written in TypeScript, however the repo
includes pre-compiled and minified JavaScript to make things easier. So you can
just copy [dist/sutori.min.js](https://raw.githubusercontent.com/kodaloid/sutori-js/main/dist/sutori.min.js) (right-click and save link as...) into your project folder, then reference it with a
script tag like so:

```html
<script src="sutori-js.min.js"></script>
```



## How To Use Sutori

Here's a bare bones example of how to setup a Sutori project: 

```js
// load in an xml document.
const doc = await SutoriDocument.LoadXml("example1_data.xml");
        
// create a prompt engine.
const engine = new SutoriEngine(doc);

// handle what happens when the server challenges for a response.
engine.HandleChallenge = function(event) {
   // handler code goes here.
   console.log(event);
}

// ask the engine to start prompting for responses.
engine.Play()
```

When we call the `Play()` command. The engine fires an initial challenge event
back (asking your code to do something). This event exposes an instance of the
current moment, which can have images, text & audio that you can show.

A moment can also have options. Each option can have multimedia assigned too
(text/image/audio) and may have a target destination set.

You decide if an option has been chosen, then you respond to the engine either
by conveying the chosen target like this:

```js
engine.GotoMomentID(option.Target);
```

or by moving the cursor forward like this:

```js
engine.GotoNextMoment();
```


## Creating Data

Creating a document is quite simple. I recommend checking out the first example
found at [examples/example1_data.xml](https://raw.githubusercontent.com/kodaloid/sutori-js/main/examples/example1_data.xml) (right-click and save link as...) to demonstrate how to lay things out.

You can also create a document from pure JavaScript like this:

```js
const extraMoment = new SutoriMoment();
extraMoment.AddText(culture, "This is a bonus moment!");
doc.AddMoment(extraMoment);
```





## Building

If you wish to remix, and compile Sutori on your own. Make sure you have NodeJS
installed, then make sure you have typescript & jsmin enabled. I did this with
these commands:

```
npm install -g typescript
npm install -g jsmin
```

Then in the root of your project, run the following command:

```
npm build
```



## Conclusion

This was created originally to figure out how to add branched sequencing to the
Xentu game engine. However it turns out Sutori has a lot of uses in other situations
too.

Thanks for checking out the project, and I hope you find it useful.

Kodaloid
