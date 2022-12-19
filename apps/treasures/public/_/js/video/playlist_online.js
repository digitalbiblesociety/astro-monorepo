$(document).ready(function () {
    var video = document.createElement("video");
    var canPlayMP4 = (typeof video.canPlayType === "function" && video.canPlayType("video/mp4") !== "");
    var videos = new Array();
    i = 0;

if (online == true) {

    while (i <= thumbs.length - 1) {
        videos.push('<li><div class="videoContainer"><div class="playerHolder"><div class="videoPlayer"></div>'+
'<iframe src="https://player.vimeo.com/video/'+ thumbs[i][0]+'" width="640" height="385" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'+
            '</div></div></li>');
        i++;
    }

function vimeoLoadingThumb(id){    
    var url = "http://vimeo.com/api/v2/video/" + id + ".json?callback=showThumb";

    var id_img = "#vimeo-" + id;

    var script = document.createElement( 'script' );
    script.type = 'text/javascript';
    script.src = url;

    $(id_img).before(script);
}

function showThumb(data){
    var id_img = "#vimeo-" + data[0].id;
    $(id_img).attr('src',data[0].thumbnail_medium);
}

    $('#slider').append(videos.join(''));
    i = 0;
    $(function () {
        var fadeDelay = 0,
            timer, hideControls = function (slider) {
                clearTimeout(timer);
                setTimeout(function () {
                    slider.$controls.hover(function () {
                        $(this).stop(true, false).fadeTo(500, 1.0);
                    }, function () {
                        $(this).stop(true, false).fadeTo(1750, 0.1);
                    });
                }, fadeDelay);
            };

        $('#slider').anythingSlider({
            toggleControls: false,
            navigationSize: 8,
            buildArrows: false,
            buildStartStop: false,
            forwardText: '<img class="thumbForward" src="../../../_/images/video/br_next.png"/>',
            backText: '<img class="thumbBack" src="../../../_/images/video/br_prev.png"/>',
            onSlideBegin: function (e, slider) {
                slider.$items.fadeOut(0);
                projekktor('*').each(function () {
                    this.setStop();
                });
            },
            onSlideComplete: function (slider) {
                slider.$items.fadeIn(500, "swing");
                $(function () {
                    var current = $('#slider').data('AnythingSlider').currentPage;
                    $("#input1").val(current);
                });
            },
            navigationFormatter: function (i, panel) {
                console.log(thumbs[i - 1][1]);
                var url = '';
                return '<img title="<span class=\'native_tip\'>' + thumbs[i - 1][2] + '</span><br /><span class=\'english_tip\'>' + thumbs[i - 1][3] + '</span>" src="' + url + thumbs[i - 1][1] + '.jpg">';
            },

            // Callback when the plugin finished initializing
            onInitialized: function (e, slider) {
                var time = 1000, // allow movement if < 1000 ms (1 sec)
                    range = 50, // swipe movement of 50 pixels triggers the slider
                    x = 0,
                    t = 0,
                    touch = "ontouchend" in document,
                    st = (touch) ? 'touchstart' : 'mousedown',
                    mv = (touch) ? 'touchmove' : 'mousemove',
                    en = (touch) ? 'touchend' : 'mouseup';

                slider.$window.add(slider.$controls)
                    .bind(st, function (e) {
                    // prevent image drag (Firefox)

                    t = (new Date()).getTime();
                    x = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
                })
                    .bind(en, function (e) {
                    t = 0;
                    x = 0;
                })
                    .bind(mv, function (e) {
                    e.preventDefault();
                    var newx = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX,
                        r = (x === 0) ? 0 : Math.abs(newx - x),
                        // allow if movement < 1 sec
                        ct = (new Date()).getTime();
                    if (t !== 0 && ct - t < time && r > range) {
                        if (newx < x) {
                            if ($(this).hasClass('anythingControls')) {
                                slider.$controls.find('.next').trigger('click');
                            } else {
                                slider.goForward();
                            }
                            return false;
                        }
                        if (newx > x) {
                            if ($(this).hasClass('anythingControls')) {
                                slider.$controls.find('.prev').trigger('click');
                            } else {
                                slider.goBack();
                            }
                        }
                        t = 0;
                        x = 0;
                        return false;
                    }
                });
                hideControls(slider);
                slider.$wrapper.hover(function () {
                    clearTimeout(timer);
                    slider.$controls.fadeIn(500);
                }, function () {
                    hideControls(slider);
                });

                slider.$controls.find('img').tooltip();

            },

        });
    });

} else {

    while (i <= thumbs.length - 1) {
        videos.push('<li><div class="videoContainer"><div class="playerHolder"><div class="videoPlayer"></div><div class="startb"><img src="../../../_/images/video/start.png"/></div><img class="postImage" src="' + thumbs[i][0].replace('67x100', 'poster') + '.jpg" title="" width="640" height="385" /></div></div></li>');
        i++;
    }
    $('#slider').append(videos.join(''));
    i = 0;
    $(function () {
        var fadeDelay = 0,
            timer, hideControls = function (slider) {
                clearTimeout(timer);
                setTimeout(function () {
                    slider.$controls.hover(function () {
                        $(this).stop(true, false).fadeTo(500, 1.0);
                    }, function () {
                        $(this).stop(true, false).fadeTo(1750, 0.1);
                    });
                }, fadeDelay);
            };

        $('#slider').anythingSlider({
            toggleControls: false,
            navigationSize: 8,
            buildArrows: false,
            buildStartStop: false,
            forwardText: '<img class="thumbForward" src="../../../_/images/video/br_next.png"/>',
            backText: '<img class="thumbBack" src="../../../_/images/video/br_prev.png"/>',
            onSlideBegin: function (e, slider) {
                slider.$items.fadeOut(0);
                projekktor('*').each(function () {
                    this.setStop();
                });
            },
            onSlideComplete: function (slider) {
                slider.$items.fadeIn(500, "swing");
                $(function () {
                    var current = $('#slider').data('AnythingSlider').currentPage;
                    $("#input1").val(current);
                });
            },
            navigationFormatter: function (i, panel) {
                var url = '';
                return '<img title="<span class=\'native_tip\'>' + thumbs[i - 1][1] + '</span><br /><span class=\'english_tip\'>' + thumbs[i - 1][2] + '</span>" src="' + url + thumbs[i - 1][0] + '.jpg">';
            },

            // Callback when the plugin finished initializing
            onInitialized: function (e, slider) {
                var time = 1000, // allow movement if < 1000 ms (1 sec)
                    range = 50, // swipe movement of 50 pixels triggers the slider
                    x = 0,
                    t = 0,
                    touch = "ontouchend" in document,
                    st = (touch) ? 'touchstart' : 'mousedown',
                    mv = (touch) ? 'touchmove' : 'mousemove',
                    en = (touch) ? 'touchend' : 'mouseup';

                slider.$window.add(slider.$controls)
                    .bind(st, function (e) {
                    // prevent image drag (Firefox)

                    t = (new Date()).getTime();
                    x = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
                })
                    .bind(en, function (e) {
                    t = 0;
                    x = 0;
                })
                    .bind(mv, function (e) {
                    e.preventDefault();
                    var newx = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX,
                        r = (x === 0) ? 0 : Math.abs(newx - x),
                        // allow if movement < 1 sec
                        ct = (new Date()).getTime();
                    if (t !== 0 && ct - t < time && r > range) {
                        if (newx < x) {
                            if ($(this).hasClass('anythingControls')) {
                                slider.$controls.find('.next').trigger('click');
                            } else {
                                slider.goForward();
                            }
                            return false;
                        }
                        if (newx > x) {
                            if ($(this).hasClass('anythingControls')) {
                                slider.$controls.find('.prev').trigger('click');
                            } else {
                                slider.goBack();
                            }
                        }
                        t = 0;
                        x = 0;
                        return false;
                    }
                });
                hideControls(slider);
                slider.$wrapper.hover(function () {
                    clearTimeout(timer);
                    slider.$controls.fadeIn(500);
                }, function () {
                    hideControls(slider);
                });

				slider.$controls.find('img').tooltip();

            },

        });
    });

    $('#iform').submit(function (e) {
        $('#slider').anythingSlider($("#input1").val());
        e.preventDefault();
    });

    $(function () {
        totalSlides = $('#slider').data('AnythingSlider').pages;
        document.getElementById("totalVid").innerHTML = totalSlides;
    });

    if (canPlayMP4) {
        $('.startb').click(function () {
            function randomString(length) {
                var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

                if (!length) {
                    length = Math.floor(Math.random() * chars.length);
                }

                var str = '';
                for (var i = 0; i < length; i++) {
                    str += chars[Math.floor(Math.random() * chars.length)];
                }
                return str;
            }
            var projId = randomString(8);

            videoLayout = '<video id="' + projId + '" class="projekktor" poster="' + $(this).siblings('.postImage').attr('src').replace('_poster.jpg', '') + '_poster.jpg" title="" width="640" height="385" controls>' +
						  '<source src="../' + $(this).siblings('.postImage').attr('src').replace('_poster.jpg', '') + '.mp4" type="video/mp4" />' +
						  '<!--<source src="../' + $(this).siblings('.postImage').attr('src').replace('_poster.jpg', '') + '.webm" type="video/webm" />-->' +
						  '</video>'
            $(this).siblings('.postImage').css({
                "display": "none"
            });

            $(this).css({
                "display": "none"
            }).siblings('.videoPlayer').append(videoLayout);
            var myPlayer = projekktor('video', {
                controls: true,
                debug: false,
                loop: false,
                autoplay: false,
                plugins: ['Display', 'Controlbar'],
                plugin_display: {
                    logoImage: "../../../_/images/video/logo.png",
                }
            });
            projekktor('#' + projId).setPlay();
        });
    } else {
        $('.startb').click(function () {
            window.location.href = '../' + $(this).siblings('.postImage').attr('src').replace('_poster.jpg', '.mp4');
        });
    }
}

});