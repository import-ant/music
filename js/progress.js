;
(function() {

    // 进度条
    class Progress {
        constructor() {
            // 开始时间，用来计算百分比
            this.startTime = 0;
            // 总时间
            this.durTime = 0;
            this.init();
            // 计时器
            this.frameId = null;
            this.presentTime = 0;


        }

        // 初始化
        init() {
            this.getDom();
        }

        // 获取元素
        getDom() {
            this.current = document.querySelector('.current');
            this.cicle = document.querySelector('.cicle');
            this.front = document.querySelector('.front');
            this.total = document.querySelector('.total');

        }

        // 渲染总时间
        renderAllTime(time) {
            this.durTime = time;
            time = this.fomatTime(time);
            this.total.innerHTML = time;
        }

        // 时间格式化
        fomatTime(time) {
            let m = Math.floor(time / 60);
            let s = time % 60;
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;
            return m + ':' + s;
        }

        fomatTime2(time) {
            const arr = time.split(':');
            return parseInt(arr[0] * 60 + arr[1]);
        }

        // 进度条移动
        // 计时器
        move(val) {
            // 计算百分比
            // 开始时间
            this.startTime = new Date().getTime();
            const This = this;
            cancelAnimationFrame(this.frameId);
            this.presentTime = val === undefined ? this.presentTime : val;

            function frame() {
                let currentTime = new Date().getTime();
                // 毫秒
                let per = This.presentTime + (currentTime - This.startTime) / (This.durTime * 1000);
                if (per < 1) {
                    This.update(per);
                } else {
                    cancelAnimationFrame(This.frameId)
                }
                This.frameId = requestAnimationFrame(frame);
            }
            frame();

        }

        // 更新元素位置  计算出的百分比
        update(per) {
            let time = Math.round(per * this.durTime);
            // 1.当前时间
            this.current.innerHTML = this.fomatTime(time);
            // 2.前面的背景，进度条
            this.front.style.width = `${per*100}%`;

            // 3.小圆圈
            // 因为小圆圈是相对于它的容器的，
            let width = this.cicle.parentNode.offsetWidth;
            this.cicle.style.transform = `translateX(${per * width}px)`
        }

        // 停止移动
        stop() {
            cancelAnimationFrame(this.frameId);
            // 记录结束的当前时间
            this.presentTime += (new Date().getTime() - this.startTime) / (this.durTime * 1000);
            // this.presentTime = (this.fomatTime2(this.current.innerHTML)) / this.durTime;
        }
    }


    // 进度条拖拽
    class Drag {
        constructor(obj) {
            // 要拖拽的元素、
            this.obj = obj;
            this.pointX = 0;
            this.left = 0;
            this.per = 0;
        }

        // 拖拽
        // 原本的位置加上拖拽的距离
        init() {

            this.obj.style.transform = 'translateX(0px)';
            this.obj.addEventListener('touchstart', (e) => {

                this.left = parseFloat(this.obj.style.transform.split('(')[1]);
                this.pointX = e.changedTouches[0].pageX;

                e.preventDefault();

            })

            this.obj.addEventListener('touchmove', (e) => {
                // console.log(this.left);
                this.distance = e.changedTouches[0].pageX - this.pointX;
                let l = this.left + this.distance;

                // console.log(this.left)
                if (l < 0) {
                    l = 0;
                } else if (l > this.obj.offsetParent.offsetWidth) {
                    l = this.obj.offsetParent.offsetWidth;
                }
                this.per = l / this.obj.offsetParent.offsetWidth;
                // console.log(l)

                this.obj.style.transform = 'translateX(' + l + 'px)';

                this.move && this.move(this.per);
                e.preventDefault();
            })

            this.obj.addEventListener('touchend', (e) => {
                // This.pointX = e.pageX;
                this.end && this.end(this.per);
                e.preventDefault();
            })

        }
    }

    function instanceProgress() {
        return new Progress();
    }

    function instanceDrag(obj) {
        return new Drag(obj);
    }
    window.player.progress = {
        po: instanceProgress,
        dr: instanceDrag,
    }

})(window.player || (window.player = {}))