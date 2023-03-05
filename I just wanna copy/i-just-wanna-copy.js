// ==UserScript==
// @name         I just wanna copy
// @namespace    https://github.com/BrianHuGit/Tampermonkey-scripts
// @version      1.0
// @description  as the script name
// @author       Brian Hu
// @grant        none
// @license      WTFPL License
// ==/UserScript==

(function () {
    "use strict";
    $(document).ready(function () {
        document.onselectstart = null;
        var styleTags = document.getElementsByTagName("style");
        for (var i = 0; i < styleTags.length; i++) {
            var style = styleTags[i];
            if (style.innerHTML.indexOf("-moz-user-select") !== -1) {
                style.innerHTML = style.innerHTML.replace(/-moz-user-select:\s*[^;]+;/g, "");
            }
            if (style.innerHTML.indexOf("-webkit-user-select") !== -1) {
                style.innerHTML = style.innerHTML.replace(/-webkit-user-select:\s*[^;]+;/g, "");
            }
        }
    });
})();
