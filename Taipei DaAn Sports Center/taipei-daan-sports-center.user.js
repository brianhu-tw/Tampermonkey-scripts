// ==UserScript==
// @name         大安運動中心排版修改
// @namespace    https://github.com/BrianHuGit/Tampermonkey-scripts
// @version      1.0
// @description  改善預約場地的排版畫面，支援羽球、桌球、撞球、壁球
// @author       Brian Hu
// @match        https://scr.cyc.org.tw/tp03.aspx?module=net_booking&files=booking_place&StepFlag=2&PT=1*
// @match        https://scr.cyc.org.tw/tp03.aspx?module=net_booking&files=booking_place&StepFlag=2&PT=3*
// @match        https://scr.cyc.org.tw/tp03.aspx?module=net_booking&files=booking_place&StepFlag=2&PT=4*
// @match        https://scr.cyc.org.tw/tp03.aspx?module=net_booking&files=booking_place&StepFlag=2&PT=8*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @license      WTFPL License
// ==/UserScript==

(function () {
    'use strict';
    $(document).ready(function () {

        let style = '<style>table {border-style: solid; border-color: rgb(200, 200, 200);}\ndiv.preserve_btn {height: 36px;display: table-cell;vertical-align: middle;font-size: 14px;color: #1E5EDE;cursor: pointer;}\ndiv.preserve_btn:hover {color: #578AEF;text-decoration: underline;}</style>'
        $('head').append(style);

        var calendar = {};
        var place_set = new Set();
        $('div#ContentPlaceHolder1_Panel_Step2 td.tWord tr').not(':first-child').each(function () {
            $(this).children().removeAttr('valign');
            let time = $(this).children('td').eq(0).text().replace(/\s/g, '');
            let place = $(this).children('td').eq(1).text().replace(/\s/g, '');
            let price = $(this).children('td').eq(2).text().replace(/\s/g, '');
            let button = $(this).children('td').eq(3);
            if (button.children('img').attr('src') == 'img/sche02.jpg') {
                button.empty().append('-');
            }
            else {
                let onclick = button.children('img').attr('onclick');
                let div = '<div class="preserve_btn" onclick="' + onclick + '">預約</div>';
                button.empty().append(div);
            }

            place_set.add(place);
            if (!(time in calendar)) calendar[time] = {};
            calendar[time][place] = { 'price': price, 'button': button };
        });

        var place_list = Array.from(place_set);
        $('div#ContentPlaceHolder1_Panel_Step2 td.tWord tr').each(function (index) {
            // handle the case if table column count is less than place count
            let column_count = $(this).children('td').not(':first-child').length;
            while (place_list.length != column_count) {
                if (place_list.length > column_count) {
                    $(this).append($(this).children('td:last-child').prop('outerHTML'));
                }
                if (place_list.length < column_count) {
                    $(this).children('td:last-child').remove();
                }
                column_count = $(this).children('td').not(':first-child').length;
            }
            $(this).css('height', '36px');

            // first row
            if ($(this).is(':first-child')) {
                $(this).children('td').each(function (index) {
                    $(this).text(place_list[index - 1]);
                    $(this).css('border', 'none');
                });
            }
            // the others row
            else {
                // remove duplicate row
                if (index % place_list.length != 1) {
                    $(this).remove();
                }
                else {
                    let time = $(this).children('td').eq(0).text();
                    $(this).children('td').each(function (index) {
                        // except the first child
                        if ($(this).is(':not(:first-child)')) {
                            let place = place_list[index - 1];
                            $(this).empty().append(calendar[time][place]['button'].html());
                        }
                        $(this).css({ 'border-style': 'solid', 'border-width': '1px 0px 0px 0px', 'border-color': 'rgb(200, 200, 200)' });
                    });
                }
            }
        });

        // remove ugly footer
        $('table').has('div#footer').remove()
    });
})();
