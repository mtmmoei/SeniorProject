$(function () {
    $('#search_tab a:first').tab('show');
    $('#advanceSearch').submit(function (event) {
        $.ajax({
            url: $("#advanceSearch").attr("action"),
            data: 'searchString=' + $("#queryString").val(),
            type: "GET",
            success: function (response) {
                createTable(response);
            }
        });
        event.preventDefault();
    });

//    $('#facetedSearch').submit(function (event) {
//        console.log("submit");
//        var filter_wrapper = document.getElementById('filter_wrapper');
//        filter_wrapper.hidden = false;
//        if ($("#type").val() === "Movie") {
//            var a = document.createElement('a');
//            a.setAttribute("href", "#");
//            a.appendChild(document.createTextNode("Date"));
//            filter_wrapper.appendChild(a);
//        }
//
//        $.ajax({
//            url: $("#facetedSearch").attr("action"),
//            data: 'searchString=' + $("#keyword").val() + "&type=" + $("#type").val(),
//            type: "GET",
//            success: function (response) {
//                createTable(response);
//            }
//        });
//        event.preventDefault();
//    });

    $("#category + .dropdown-menu li a").click(function () {
        console.log("select category");
        $("#category .selection").text($(this).text());
        $.ajax({
            url: $("#category").attr("action"),
            data: 'category=' + $(this).text(),
            type: "GET",
            datatype: "json",
            success: function (response) {
                if ($("#dropdownAddProperty *") !== null) {
                    $("#dropdownAddProperty *").remove();
                }
                if ($("#property *") !== null) {
                    $("#property *").remove();
                }
                if ($("#search_result *") !== null) {
                    $("#search_result *").remove();
                }
                $("#dropdownAddProperty").append("" +
                        "<label for='addProperty' class='col-sm-4 control-label'>Add property</label>" +
                        "<div class='dropup'>" +
                        "<button class='btn btn-default dropdown-toggle' type='button' id='addProperty' action='" + ctx + "/addProperty' data-toggle='dropdown' aria-expanded='true'>" +
                        "<span class='selection'></span>" +
                        "<span class='caret'></span>" +
                        "</button>" +
                        "<ul class='dropdown-menu scrollable-menu' role='menu' aria-labelledby='addProperty'>" +
                        "</ul>" +
                        "</div>");


                for (property in response) {
                    var li = document.createElement('li');
                    li.setAttribute("role", "presentation");
                    var a = document.createElement('a');
                    a.setAttribute("role", "menuitem");
                    a.setAttribute("tabindex", "-1");
                    a.setAttribute("href", "#!");
                    a.setAttribute("onclick", "addProperty(this)");
                    a.appendChild(document.createTextNode(response[property]));
                    li.appendChild(a);
                    $("#dropdownAddProperty > div > ul").append(li);
                }
            }
        });
    });



//    $(".dropdown-menu li a").click(function () {
//        $(this).parent().parent().parent().find("button .selection").val($(this).text())
//        $(this).parent().parent().parent().find("button .selection").text($(this).text())
//        console.log($(this).parent().parent().parent().find("button .selection").val());
//    });


});
function addProperty(property) {
    console.log(property.text);
    $("#addProperty .selection").text(property.text);
    var res = property.text.split(":");

    $.ajax({
        url: $("#addProperty").attr("action"),
        data: 'category=' + $("#category .selection").text() + '&property=' + property.text,
        type: "GET",
        datatype: "json",
        success: function (response) {
            if ($("#accordion" + res[1]).length <= 0) {
                var html = "" +
                        "<div class='panel-group property' id='accordion" + res[1] + "' role='tablist' aria-multiselectable='true'>" +
                        "<div class='panel panel-default'>" +
                        "<div class='panel-heading' role='tab' id='heading" + res[1] + "'>" +
                        "<h4 class='panel-title'>" +
                        "<a data-toggle='collapse' data-parent='#accordion" + res[1] + "' href='#collapse" + res[1] + "' aria-expanded='true' aria-controls='collapse" + res[1] + "'>" +
                        res[1] +
                        "</a>" +
                        "</h4>" +
                        "</div>" +
                        "<div data-property=" + property.text + " id='collapse" + res[1] + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading" + res[1] + "'>" +
                        "<div class='panel-body'>" +
                        "<div class='list-group'>";
                for (var value in response) {
                    html += "<a href='#!' class='list-group-item' onclick='selectValue(this)'>" +
//                          "<span class='badge'>14</span>"+
                            response[value] + "</a>";

                }
                html += "</div>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</div>";
                $("#property").append(html);
            }
        }
    });
}
function selectValue(elem) {
    var old = $(elem).parent().find(".active");
//        old.siblings().remove();
    old.removeClass("active");
//        var a = document.createElement('a');
//                    a.setAttribute("href", "#");
//                    a.setAttribute("onclick", "removeValue(elem)");
//                    a.appendChild(document.createTextNode(" remove"));
//        $(elem).parent().append(a);
    $(elem).addClass("active");
    var values = {};
    var elems = $(".panel-body .list-group .list-group-item.active");
    console.log(elems.length);
//        var elems = document.getElementsByClassName("select");
    values["category"] = $("#category .selection").text();
    for (var i = 0; i < elems.length; i++) {
        values[$(elems[i]).parent().parent().parent().attr("data-property")] = $(elems[i]).text();
    }
    $.ajax({
        url: ctx + "/selectValue",
        data: {
            loadProds: 1,
            values: JSON.stringify(values)
        },
        type: "GET",
        datatype: "json",
        success: function (response) {
            console.log("showFacetedSearchResult");
            var json = JSON.parse(response);
            var html = "<div class='list-group'>";
            for (var i = 0; i < json.length; i++) {
                html += "<a href='#collapse" + i + "' onclick='selectResult(this)' class='list-group-item' data-toggle='collapse' aria-expanded='false' aria-controls='collapse" + i + "'>" +
                            "<h4 class='list-group-item-heading'>" + json[i].head + "</h4>" +
                            "<p class='list-group-item-text'>" + json[i].url + "</p>" +
                        "</a>" +
                        "<div class='collapse' id='collapse" + i + "'>" +
                            "<div class='well'>" +
                            "</div>" +
                        "</div>";
                        
            }
    html+="</div>";
            $("#search_result").html(html);
        }
    });
}

function selectResult(elem) {
    console.log("selectResult");
    var old = $("#search_result").find(".active");
    if (!old.is($(elem))) {
        old.removeClass("active");
        old.next().removeClass("collapse in");
        old.next().addClass("collapse");
        $(elem).addClass("active");
        $(elem).next().children().children().html("<dl class='dl-horizontal'>" +
                "<dt>movie:actor_actorid</dt>" +
                "<dd>1 (xsd:int)</dd>" +
                "<dt>movie:actor_name</dt>" +
                "<dd>Bernard Montgomery, 1st Viscount Montgomery of Alamein </dd>" +
                "</dl>");

//    $.ajax({
//        url: ctx + "/selectValue",
//        data: {
//            loadProds: 1,
//            values: JSON.stringify(values)
//        },
//        type: "GET",
//        datatype: "json",
//        success: function (response) {
//            showFacetedSearchResult(response);
//        }
//    });
    }
}

function createTable(result) {
    var json = JSON.parse(result);

    if (document.getElementById("result_table") !== null) {
        document.getElementById("result_table").remove();
    }

    var body = document.getElementById('search_result');
    var tbl = document.createElement('table');
    tbl.setAttribute("class", "table table-hover");
    tbl.setAttribute("id", "result_table");
    var tbdy = document.createElement('tbody');
    var tr = document.createElement('tr');

    for (var i = 0; i < json[0].length; i++) {
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(json[0][i]));
        tr.appendChild(th);
    }
    tbdy.appendChild(tr);
    for (var i = 1; i < json.length; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < json[i].length; j++) {
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(json[i][j]));
            tr.appendChild(td);
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
    //    For Jena
//    for (var i = 0; i < json.head.vars.length; i++) {
//        var th = document.createElement('th');
//        th.appendChild(document.createTextNode(json.head.vars[i]));
//        tr.appendChild(th);
//    }
//    tbdy.appendChild(tr);
//    for (var i = 0; i < json.results.bindings.length; i++) {
//        var tr = document.createElement('tr');
//        for (var b in json.results.bindings[i]) {
//            var td = document.createElement('td');
//            if(json.results.bindings[i][b].type=="uri"){
//                var link = document.createElement('a');
//                link.setAttribute("href", json.results.bindings[i][b].value);
//                link.appendChild(document.createTextNode(json.results.bindings[i][b].value));
//                td.appendChild(link)
//            }else {
//                td.appendChild(document.createTextNode(json.results.bindings[i][b].value)); 
//            }
//            tr.appendChild(td);
    //        }
    //        tbdy.appendChild(tr); //    }

}
