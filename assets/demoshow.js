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


    var opts = {};
    gitbook.events.bind("page.change", function (a, b) {
        var icon = $('.js-toolbar-action[aria-label=qrcode').filter('.pull-left');
        $('#demoshow-qrcode').remove();
        var ele = $('<div id="demoshow-qrcode" style="display:none"></div>');
        ele.insertAfter(icon);
        ele.css({
            left: icon.position().left,
            top: icon.height()
        });
        ele.qrcode({
            render: "canvas", // table方式
            width: 200, // 宽度
            height: 200, // 高度
            text: location.href // 任意内容
        });

        icon.hover(
            function () {
                ele.show();
            },
            function () {
                ele.hide();
            }
        )
    });

    gitbook.events.bind('start', function(e, config) {
        opts = config.demoshow || {};
        opts = Object.assign({}, opts, {
            qrcode: true
        });

        if (opts.qrcode) {
            gitbook.toolbar.createButton({
                icon: "fa fa-qrcode",
                label: "qrcode",
                position: 'left',
                text: "二维码",
                onClick: function(e) {
                    e.preventDefault();
                }
            });
        }
    });
});
