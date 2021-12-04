// 主控制模块
// 发送请求  请求数据
;
(function($, root) {
    class MusicPlayer {
        constructor(wrap) {
            this.wrap = wrap;
            // 音乐数据
            this.dataList = [];
            // 加载的当前音乐的信息索引
            // this.now = 0;
            // 索引对象
            this.index = null;
            // 图片旋转的计时器
            this.timer = null;

            // 控制音乐列表的对象
            this.list = null;

            // 进度条
            this.progress = root.progress.po();

        }

        // 初始化
        init() {
            this.getDoms();

            this.getData();

            this.controlMusic();

        }

        // 得到一些需要操作的元素
        getDoms() {
            this.songImg = document.querySelector('.songImg img');
            this.controls = document.querySelectorAll('.control *');
        }

        // 请求数据
        getData() {
            $.ajax({
                url: '../mock/data.json',
                method: 'get',
                success: (dataList) => {
                    // 请求成功，数据需要存储起来
                    this.dataList = dataList;
                    this.musicListControl();
                    this.index = new root.Index(0, this.dataList.length);
                    this.progressDrag();
                    this.loadMusic(this.index.index);

                }
            })
        }

        // 加载音乐
        loadMusic(index) {
            const This = this;

            // 1.渲染  需要知道渲染哪一个音乐信息
            root.render(this.dataList[index]);
            // 2.音乐模块
            root.audio.setSrc(this.dataList[index].audioSrc);
            // 3.渲染总时间
            this.progress.renderAllTime(this.dataList[index].duration);
            // 4.切换
            this.list.tab(index);
            // 5.绑定播放完毕事件
            root.audio.end(function() {
                This.loadMusic(This.index.next());
            })
            if (root.audio.status === 'play') {
                root.audio.setPlay();
                this.controls[2].className = 'play';
                this.imgRotate();
                this.progress.move(0);
            }


        }

        // 按钮事件注册，音乐控制
        controlMusic() {
            // 播放  // 暂停
            this.controls[2].addEventListener('touchend', (e) => {
                //    需要知道音乐现在的状态
                if (root.audio.status === 'pause') {
                    root.audio.setPlay();
                    this.controls[2].className = 'play';
                    this.imgRotate(this.songImg.dataset.rot);
                    this.progress.move();

                } else {
                    root.audio.setPause();
                    this.controls[2].className = '';
                    this.stopRote();
                    this.progress.stop();
                }
            })

            // 上一首
            this.controls[1].addEventListener('touchend', (e) => {
                root.audio.status = 'play'
                this.loadMusic(this.index.prev());
            })

            // 下一首
            this.controls[3].addEventListener('touchend', (e) => {
                root.audio.status = 'play'
                this.loadMusic(this.index.next());
            })
        }

        // 图片旋转
        // 有一个初始角度
        imgRotate(deg = 0) {
            // 先清除定时器
            // 刷新频率是每秒60次
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.songImg.style.transform = `rotate(${deg = +deg + 0.2}deg)`
                    // console.log(1)
                this.songImg.dataset.rot = deg;

            }, 1000 / 60)
        }
        stopRote() {
            // 要存储旋转的角度，方便下次存取

            clearInterval(this.timer);
        }

        //    音乐列表控制模块
        musicListControl() {
            this.list = root.list(this.wrap, this.dataList);
            // 注册点击事件
            this.controls[4].addEventListener('touchend', () => {
                this.list.slideUp();
            })

            // 为音乐每一个列表注册点击事件
            this.list.musicList.forEach((item, index) => {
                item.addEventListener('touchend', () => {
                    // 滑下去，改变tab，加载歌曲改变，当前索引等于点击索引什么也不做
                    if (index === this.index.index) {
                        return;
                    }

                    this.loadMusic(index);
                    this.index.index = index;
                    this.list.slideDown();
                })
            })


        }

        // 进度条拖拽
        progressDrag() {
            let This = this;
            this.drag = root.progress.dr(document.querySelector('.cicle'));
            this.drag.init();
            this.drag.start = function() {
                // console.log('start');
                This.progress.stop();
            }

            this.drag.move = function(per) {
                // console.log(this.moveX)
                This.progress.update(per);

            }
            this.drag.end = function(per) {
                // 改变音乐播放位置
                root.audio.playTo(per * This.dataList[This.index.index].duration);
                // 播放
                root.audio.setPlay();

                This.progress.move(per);
                This.controls[2].className = 'play';
                console.log(This.songImg.dataset.rot)
                This.imgRotate(This.songImg.dataset.rot || 0);
            }
        }
    }



    const music = new MusicPlayer(document.querySelector('#wrap'));
    music.init();
})(window.Zepto, window.player)