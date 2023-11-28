// ==UserScript==
// @name         大安運動中心排版修改
// @namespace    https://github.com/BrianHuGit/Tampermonkey-scripts
// @version      1.1
// @description  改善預約場地的排版畫面，支援羽球、桌球、撞球、壁球
// @author       Brian Hu
// @match        https://www.cjcf.com.tw/CG02.aspx?module=net_booking&files=booking_place&StepFlag=2&PT=1*
// @match        https://www.cjcf.com.tw/CG02.aspx?module=net_booking&files=booking_place&StepFlag=2&PT=3*
// @match        https://www.cjcf.com.tw/CG02.aspx?module=net_booking&files=booking_place&StepFlag=2&PT=4*
// @match        https://www.cjcf.com.tw/CG02.aspx?module=net_booking&files=booking_place&StepFlag=2&PT=8*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @license      WTFPL License
// ==/UserScript==

(function () {
    'use strict';
    $(document).ready(function () {

        let style = '<style>table {border-style:solid; border-color:rgb(200, 200, 200);}\ndiv.preserve_btn {display:flex; justify-content:center; align-items:center;height:36px;font-size:14px;color:#1E5EDE;cursor:pointer;}\ndiv.preserve_btn:hover {color:#578AEF;text-decoration:underline;}</style>'
        $('head').append(style);

        var calendar = {};
        var place_name_set = new Set();
        let time;
        $('div#ContentPlaceHolder1_Panel_Step2 td.tWord tr').not(':first-child').each(function () {
            $(this).children().removeAttr('valign');
            // The first row will have 4 columns, the first column is time
            if ($(this).children().length == 4) {
                time = $(this).children('td').eq(0).text().replace(/\s/g, '');
                $(this).children('td').eq(0).remove(); // remove the time column then the next column index will be 0
            }
            let place = $(this).children('td').eq(0).text().replace(/\s/g, '');
            let price = $(this).children('td').eq(1).text().replace(/\s/g, '');
            let button = $(this).children('td').eq(2);

            if (button.children('img').attr('src') == 'img/place02.png') {
                button.empty().append('-');
            }
            else {
                let onclick = button.children('img').attr('onclick');
                let div = '<div class="preserve_btn" onclick="' + onclick + '">預約</div>';
                button.empty().append(div);
            }
            place_name_set.add(place);
            if (!(time in calendar)) calendar[time] = {};
            calendar[time][place] = { 'price': price, 'button': button };
        });

        var place_name_list = Array.from(place_name_set);
        // Remove the content of the table
        $('div#ContentPlaceHolder1_Panel_Step2 table table:last-child tbody')[1].remove()

        const table = $('div#ContentPlaceHolder1_Panel_Step2 table table:last-child')[1];
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.style.textAlign = 'center';
        th.style.verticalAlign = 'middle';
        th.innerText = '時間';
        tr.append(th);
        place_name_list.forEach(function (place_name) {
            const th = document.createElement('th');
            th.style.textAlign = 'center';
            th.style.verticalAlign = 'middle';
            th.innerText = place_name;
            tr.append(th);
        })
        thead.append(tr);
        table.append(thead);

        const tbody = document.createElement('tbody')
        for (const [time, prices] of Object.entries(calendar)) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.style.textAlign = 'center';
            td.style.verticalAlign = 'middle';
            td.innerText = time;
            tr.append(td);
            place_name_list.forEach(function (place_name) {
                const td = document.createElement('td');
                td.style.textAlign = 'center';
                td.style.verticalAlign = 'middle';
                td.innerHTML = prices[place_name]["button"].html();
                tr.append(td);
            })
            tbody.append(tr)
        }
        table.append(tbody);

    });
})();
