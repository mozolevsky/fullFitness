/* here is scripts for video in fitness 1 site written using java script */
;(function() {
    var videoContainer = document.querySelector(".video-container") || '';
        if ( videoContainer ) {
           var video = videoContainer.querySelector(".video") || '',
                player = video.querySelector("video") || '',
                scrollOffset, SCROLL_COLLAPSE_THRESHOLD = 150,
                LG_VIEWPORT_WIDTH = 375,
                TRANSITION_DURATION = 400,
                hasAutoplayed = !1;


            window.addEventListener("resize", function() {
                updateVideoForViewportSize()
            });

            player.addEventListener("play", function() {
                videoContainer.classList.remove("show-play");
                console.log("Play");
            });

            player.addEventListener("pause", function() {
                videoContainer.classList.add("show-play");
                console.log("Pause");
            });

            var autoplayVideo = function() {
                !hasAutoplayed && video.getBoundingClientRect().top < window.innerHeight - 100 && (hasAutoplayed = !0, player.play())
            };

            var updateVideoForViewportSize = function() {
                isLargeViewport() ? (isCollapsed() && hideControls(), player.volume = 0) : (video.style.transform = "", collapseVideo(), showControls())
            };

            window.addEventListener("scroll", function() {
                autoplayVideo(), Math.abs(window.scrollY - scrollOffset) > SCROLL_COLLAPSE_THRESHOLD && collapseVideo()
            }), autoplayVideo();

            var setVolume = function(e, t) {
                    var n = function(e, t, n, r) {
                            return r === 0 ? 0 : n * e / r + t
                        },
                        r, i = player.volume,
                        s = function(o) {
                            r = r || o;
                            var u = o - r,
                                a = n(u, i, e - i, t);
                            player.volume = Math.min(a, 1), u < t ? requestAnimationFrame(s) : player.volume = e
                        };
                    requestAnimationFrame(s)
                },
                showControls = function() {
                    player.setAttribute("controls", "true")
                },
                hideControls = function() {
                    player.removeAttribute("controls")
                },
                isLargeViewport = function() {
                    return window.innerWidth >= LG_VIEWPORT_WIDTH
                },
                isCollapsed = function() {
                    return videoContainer.classList.contains("collapsed")
                },
                updateFullsizeVideoBounds = function() {
                   /* var e = videoContainer.getBoundingClientRect().top,
                        t = (window.innerHeight - video.offsetHeight) / 2 - e;
                    video.style.transform = "translateY(" + t + "px)"*/
                },
                expandVideo = function() {
                    isCollapsed() && (setVolume(1, 1500), player.play(), showControls(), video.classList.add("animated"), updateFullsizeVideoBounds(), scrollOffset = window.scrollY, videoContainer.classList.remove("collapsed"), setTimeout(function() {
                        video.classList.remove("animated")
                    }, TRANSITION_DURATION), window.siteAnalytics && window.siteAnalytics.trackVideoExpand && window.siteAnalytics.trackVideoExpand(player))
                },
                collapseVideo = function() {
                    isCollapsed() || (setVolume(0, 0), player.pause(), hideControls(), video.classList.add("animated"), videoContainer.classList.add("collapsed"), setTimeout(function() {
                        video.classList.remove("animated")
                    }, TRANSITION_DURATION))
                };


            document.addEventListener("click", function(e) {
                !isCollapsed() && e.target != video && window.innerWidth >= LG_VIEWPORT_WIDTH && collapseVideo()
            });

            video.addEventListener("click", function(e) {
                isLargeViewport() && (e.stopPropagation(), isCollapsed() && expandVideo())
            });

            updateVideoForViewportSize();
        }
})();

