$(document).ready(function () {
	function dlink() {
		var temp = document.URL.split('\\');
		for (i=1; i<3; i++) {
			delete temp[temp.length-i]
		}
		return $.grep(temp, function(n){ return (n); });;
	}
	function getInternetExplorerVersion()
	// Returns the version of Windows Internet Explorer or a -1
	// (indicating the use of another browser).
	{
	   var rv = -1; // Return value assumes failure.
	   if (navigator.appName == 'Microsoft Internet Explorer')
	   {
		  var ua = navigator.userAgent;
		  var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		  if (re.exec(ua) != null)
			 rv = parseFloat( RegExp.$1 );
	   }
	   return rv;
	}
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ie_ver = getInternetExplorerVersion();
	} else {
		var ie_ver = 9.0;
	}
	function isFlashEnabled()
	{
		var hasFlash = false;
		try
		{
			var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
			if(fo) hasFlash = true;
		}
		catch(e)
		{
			if(navigator.mimeTypes ["application/x-shockwave-flash"] != undefined) hasFlash = true;
		}
		return hasFlash;
	}	
	
	var hasFlash = isFlashEnabled();
	var video = document.createElement("video");
    var canPlayMP4 = (typeof video.canPlayType === "function" && video.canPlayType("video/mp4") !== "");
    var videos = new Array();
	
    i = 0;
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
            forwardText: '<span class="thumbForward"><img src="../../../_/images/video/br_next.png"/></span>',
            backText: '<span class="thumbBack"><img src="../../../_/images/video/br_prev.png"/></span>',
            onSlideBegin: function (e, slider) {
                slider.$items.fadeOut(0);
				$('#flashplayer').remove();
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
                return '<img title="<span dir=\'' + dir + '\' class=\'native_tip\'>' + thumbs[i - 1][1] + '</span><span class=\'english_tip\'>' + thumbs[i - 1][2] + '</span>" src="' + thumbs[i - 1][0] + '.jpg">';
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

            }

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
						  '<source src="../' + $(this).siblings('.postImage').attr('src').replace('_poster.jpg', '') + '.mp4" type="video/mp4" /></video>'
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
                    logoImage: "../../../_/images/video/logo.png"
                }
            });
            projekktor('#' + projId).setPlay();
        });
    } else if (hasFlash && ie_ver > 8.0) {
		$('.startb').click(function () {
		$('#flashplayer').remove();
		flashLayout = '<object id="flashplayer" type="application/x-shockwave-flash" data="../../../_/js/video/player.swf" width="640" height="385"><param name="allowfullscreen" value="true"><param name="allowscriptaccess" value="always"><param name="flashvars" value="file=../../../Video/' + document.URL.replace(/.*Video\/(.*?)\/_.*/, '$1') + '/' + $(this).siblings('.postImage').attr('src').replace('_poster.jpg', '') + '.mp4"></object>';
		$(this).siblings('.postImage').css({
                "display": "none"
            });
            $(this).css({
                "display": "none"
            }).siblings('.videoPlayer').append(flashLayout);
		});
	} else if (ie_ver <= 8.0) {
	$('.startb').click(function () {
		dtemp = $(this).siblings('.postImage').attr('src').replace('_poster.jpg', '.mp4').split('/');
		window.location.href = dlink().join('/') + '/' + dtemp[dtemp.length-1];
		});
	}else {
        $('.startb').click(function () {
            window.location.href = '../' +$(this).siblings('.postImage').attr('src').replace('_poster.jpg', '.mp4');
        });
    }
});