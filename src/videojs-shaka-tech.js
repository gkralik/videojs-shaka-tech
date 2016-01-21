/**
 * videojs-shaka-tech.js
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 *
 * @copyright 2016 Gregor Kralik
 * @author Gregor Kralik <g.kralik@gmail.com>
 */

const Html5 = videojs.getComponent('Html5');

/**
 * video.js tech using Shaka player for MPEG-DASH playback.
 *
 * The tech must be registered before using it:
 *
 * <code>
 *     // register tech
 *     videojs.registerTech('Shaka', ShakaTech);
 *
 *     // enable by prepending to the techOrder
 *     videojs.options.techOrder.unshift('Shaka');
 *     // or setting the techOrder option when creating the player
 *     let player = videojs('video', {
 *         techOrder: ["Shaka", "Html5", "Flash"]
 *     });
 * </code>
 */
class ShakaTech extends Html5 {
    /**
     * Tech constructor.
     *
     * Sets up a Shaka player instance and passes on the source.
     *
     * @param {object} options
     * @param {function} ready
     */
    constructor(options, ready) {
        // prevent the browser from playing the application/dash+xml source
        const source = options.source;
        delete options.source;

        super(options, ready);

        console.log(options);

        this.options_ = options;

        // install the polyfills needed for Shaka
        shaka.polyfill.installAll();

        let video = this.el();
        this.shakaPlayer = new shaka.player.Player(video);

        const estimator = new shaka.util.EWMABandwidthEstimator();
        const abrManager = new shaka.media.SimpleAbrManager();
        const shakaSource = new shaka.player.DashVideoSource(source.src, null, estimator, abrManager);

        this.shakaPlayer.addEventListener('error', (e) => {
            videojs(this.options_.playerId).trigger('error', e);
        });

        this.shakaPlayer.load(shakaSource);
    }

    /**
     * @returns {boolean} Returns true if the Shaka player is supported in this environment.
     */
    static isSupported() {
        return !!window.MediaSource;
    }

    /**
     * @param {object} srcObj
     * @returns {string} Returns 'maybe' if the source type is 'application/dash+xml', '' if not
     */
    static canPlaySource(srcObj) {
        return (srcObj.type === 'application/dash+xml') ? 'maybe' : '';
    }
}