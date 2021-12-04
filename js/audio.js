;
(function(root) {

    class audioControl {
        constructor() {
            this.audio = new Audio();
            this.status = 'pause';
        }

        // 设置当前src
        setSrc(src) {
            this.audio.src = src;
            this.audio.load();
        }

        // 设置当前时间
        setTime(time = 0) {
            this.audio.currentTime = time;
        }

        // 播放
        setPlay() {
            this.audio.play();
            this.status = 'play'
        }

        // 暂停
        setPause() {
            this.audio.pause();
            this.status = 'pause';
        }

        // 播放到
        playTo(time) {
            this.audio.currentTime = time;
        }

        // 结束后做什么
        //音乐播放完成事件
        end(fn) {
            this.audio.onended = fn;
        }

    }
    const audio = new audioControl();
    root.audio = audio;

})(window.player || {})