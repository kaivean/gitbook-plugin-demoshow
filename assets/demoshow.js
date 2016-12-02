require(["gitbook"], function(gitbook) {

    function initDemoshow(a, b) {
        var blocks = $('.demoshow-block');
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks.eq(i);

            block.on('click', '.demoshow-block-code-header li', function (e) {
                var idx = $(this).index();
                $(this).addClass('active').siblings().removeClass('active');
                block.find('.demoshow-block-code-content').eq(idx).show().siblings().hide();
            });

            block.on('click', '.demoshow-block-show-control', function (e) {
                // 当前正显示代码，那么需要隐藏
                if ($(this).hasClass('show')) {
                    $(this).removeClass('show');
                    block.find('.demoshow-block-code').hide();
                    $(this).find('span').text('显示代码');
                }
                else {
                    $(this).addClass('show');
                    block.find('.demoshow-block-code').show();
                    $(this).find('span').text('隐藏代码');
                }
            });
            // var settings = JSON.parse(block.dataset.settings);
            //
            // var editor = ace.edit(settings.id);
            // editor.setTheme('ace/theme/' + settings.theme);
            // editor.getSession().setMode('ace/mode/' + settings.mode);
            // editor.setReadOnly(settings.readOnly);
            // editor.setOption('maxLines', settings.maxLines)
        }
    }

    gitbook.events.bind("page.change", initDemoshow);
});
