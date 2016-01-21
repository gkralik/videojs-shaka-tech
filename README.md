# videojs-shaka-tech

A [video.js](https://github.com/videojs/video.js) tech for using the [Shaka](https://github.com/google/shaka-player) 
player. This enables video.js to play MPEG-DASH streams.

## Build

```
$ git clone https://github.com/gkralik/videojs-shaka-tech.git
$ cd videojs-shaka-tech
$ npm install
$ npm run build
```

Built files are stored in the `dist/` directory.

## Usage

Include `videojs-shaka-tech.js` after the video.js and Shaka player files and register the tech.

```html
<html>
<head>
    <script src="video.js"></script>
    <script src="shaka-player.compiled.js"></script>
    <script src="dist/videojs-shaka-tech.js"></script>
</head>
<body>
    <video id="video" height="720" crossorigin="anonymous" controls class="video-js">
        <source src="path/to/manifest.mpd" type="application/dash+xml">
    </video>

    <script>
        // register tech
        videojs.registerTech('Shaka', ShakaTech);
        // enable by prepending to the techOrder
        videojs.options.techOrder.unshift('Shaka');
        // or setting the techOrder option when creating the player
        var player = videojs('video', {
            techOrder: ["Shaka", "Html5", "Flash"]
        });
        
        // ... do whatever you would do with video.js
    </script>
</body>
</html
```