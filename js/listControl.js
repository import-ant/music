;
(function() {
    function list(wrap, dataList) {
        let list, dl, dt, close, musicList = [];
        let dd;
        // 要先生成元素结构
        function createDom() {
            list = document.createElement('div');
            list.className = 'list';
            dl = document.createElement('dl');
            dt = document.createElement('dt');
            dt.innerHTML = '播放列表';
            dl.appendChild(dt);
            close = document.createElement('close');
            close.innerHTML = '关闭'

            dataList.forEach((item, index) => {
                dd = document.createElement('dd');
                dd.innerHTML = `${item.name}`;
                musicList.push(dd);
                dl.appendChild(dd);
            })

            list.appendChild(dl);
            wrap.appendChild(list);

        }

        // 下滑
        function slideDown() {

            const disY = list.offsetHeight;
            list.style.transition = 'all .2s'
            list.style.transform = `translateY(${disY}px)`
        }

        // 上滑
        function slideUp() {

            list.style.transition = 'all .2s'
            list.style.transform = `translateY(0px)`
        }

        createDom();
        slideDown();
        // 选项卡
        function tab(index) {
            for (const music of musicList) {
                music.className = '';
            }
            musicList[index].className = 'active';


        }
        return {
            list: list,
            musicList: musicList,
            slideUp: slideUp,
            slideDown: slideDown,
            tab: tab,
        }

    }

    window.player.list = list;
})(window.player || (window.player = {}))