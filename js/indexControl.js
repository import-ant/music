;
(function() {

    class Index {
        // 当前索引
        // 所有数据的总长度
        constructor(index, len) {
            this.index = index;
            this.len = len;
        }

        prev() {
            return this.index = this.get(-1);
        }
        next() {
            return this.index = this.get(1);
        }

        // val +1/-1
        get(val) {

            return (this.index + val + this.len) % this.len;
        }


    }
    window.player.Index = Index;
})(window.player || (window.player = {}))