# sutori-js

A simple to use JavaScript dialog system for websites, apps, games and more.



## Introduction

Sutori is a dialog engine that enables you to add an easy to customise dialog
abilities to nearly anything that needs them. Here are some great examples of
use cases:

- A quiz/survey on a website.
- Custom checkout process for buying things on a web shop.
- Conversation system in computer game.
- Visual novel creation.
- Telephone switch board.

Dialog is written in XML files, with a structure that allows for multiple
languages, option branches, multimedia (images, audio, video). Dialog is
broken up into a list of moments in which the conversation can traverse.

Here is an example of a basic sutori XML document:

```xml
<?xml version="1.0" encoding="utf-8"?>
<document xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema">
   <moments>
      <moment>
         <text>Which door do you want to open?</text>
         <option target="door1">Door 1</option>
         <option target="door2">Door 2</option>
      </moment>

      <moment id="door1" clear="true" goto="end">
         <text>You picked door1</text>
      </moment>

      <moment id="door2" clear="true" goto="end">
         <text>You picked door2</text>
      </moment>

      <moment id="end">
         <text>This is the end</text>
      </moment>
   </moments>
</document>
```

Sutori closely mimics the way [CYOA (choose your own adventure)](https://en.wikipedia.org/wiki/Gamebook)
Gamebook's work, with the small difference is that at the end of each moment, the
user is asked what to do next.



## Sister Projects

- [sutori-studio](https://github.com/sutori-project/sutori-studio) - An IDE for editing Sutori XML files.
- [sutori-game](https://github.com/sutori-project/sutori-game) - A template for creating basic visual novels with sutori-js.
- [sutori-cs](https://github.com/sutori-project/sutori-cs) - The .NET Standard 2.0 version of Sutori engine.



## This Repo

This repository is the JavaScript implementation of the Sutori dialog engine.
It is written in TypeScript, and compiled into JavaScript. So it can be used
anywhere that JavaScript can run.

Here is an example of the engine in action: [https://sutori-js.kodaloid.com/](https://sutori-js.kodaloid.com/)

This repo also contains a more up to date example: [examples/index.html](https://raw.githubusercontent.com/sutori-project/sutori-js/main/examples/index.html)



## How To Install

Sutori has no external dependencies. It is written in TypeScript, and is
compiled into minified JavaScript files to make things easier. You can copy
[dist/sutori.min.js](https://raw.githubusercontent.com/sutori-project/sutori-js/main/dist/sutori.min.js) (right-click and save link as...) 
into your project folder, then reference the engine with a script tag like so:

```html
<script src="sutori-js.min.js"></script>
```



## How To Use Sutori

Here's a bare bones example of how to setup a Sutori project: 

```js
// load in an xml document.
const doc = await SutoriDocument.LoadXmlFile("example1.xml");
        
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
const textElement = new SutoriElementText();
textElement.ContentCulture = SutoriCulture.EnGB;
textElement.Text = "This is a bonus moment!";
extraMoment.AddElement(textElement);
doc.AddMoment(extraMoment);
```





## Building

If you wish to remix, and compile Sutori on your own. Make sure you have NodeJS
installed, then make sure you have typescript & jsmin enabled. I did this with
these commands:

```
npm install -g typescript jsmin
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
