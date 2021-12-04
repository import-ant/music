; //分号避免因压缩出现错误
(function(root) {
    // 渲染音乐图片
    function renderImg(src) {
        // 图片
        document.querySelector('.songImg img').src = src;
        // 背景高斯模糊
        window.player.blurImg(src);
    }
    // 渲染音乐信息
    function renderMusic(data) {
        const infos = document.querySelectorAll('.songInfo *');
        infos[0].innerHTML = data.name;
        infos[1].innerHTML = data.album;
        infos[2].innerHTML = data.singer;


    }

    // 渲染是否喜欢
    function renderLike(like) {
        document.querySelectorAll('.control li')[0].className = like ? 'like' : '';
    }

    // 暴露接口，供其他模块使用
    root.render = function(data) {
        renderImg(data.image);
        renderMusic(data);
        renderLike(data.isLike);
    }
})(window.player || {})
// 容错处理