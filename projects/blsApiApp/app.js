$(document).ready(function() {
	// helper function to get state abbreviation based on state name string
    var stateAbbr = function(state) {
        var abbr;
        switch (state) {case "Alabama":abbr = "AL";break;case "Alaska":abbr = "AK";break;case "Arizona":abbr = "AZ";break;case "Arkansas":abbr = "AR";break;case "California":abbr = "CA";break;case "Colorado":abbr = "CO";break;case "Connecticut":abbr = "CT";break;case "Delaware":abbr = "DE";break;case "Florida":abbr = "FL";break;case "Georgia":abbr = "GA";break;case "Hawaii":abbr = "HI";break;case "Idaho":abbr = "ID";break;case "Illinois":abbr = "IL";break;case "Indiana":abbr = "IN";break;case "Iowa":abbr = "IA";break;case "Kansas":abbr = "KS";break;case "Kentucky":abbr = "KY";break;case "Louisiana":abbr = "LA";break;case "Maine":abbr = "ME";break;case "Maryland":abbr = "MD";break;case "Massachusetts":abbr = "MA";break;case "Michigan":abbr = "MI";break;case "Minnesota":abbr = "MN";break;case "Mississippi":abbr = "MS";break;case "Missouri":abbr = "MO";break;case "Montana":abbr = "MT";break;case "Nebraska":abbr = "NE";break;case "Nevada":abbr = "NV";break;case "New Hampshire":abbr = "NH";break;case "New Jersey":abbr = "NJ";break;case "New Mexico":abbr = "NM";break;case "New York":abbr = "NY";break;case "North Carolina":abbr = "NC";break;case "North Dakota":abbr = "ND";break;case "Ohio":abbr = "OH";break;case "Oklahoma":abbr = "OK";break;case "Oregon":abbr = "OR";break;case "Pennsylvania":abbr = "PA";break;case "Puerto Rico":abbr = "PR";break;case "Rhode Island":abbr = "RI";break;case "South Carolina":abbr = "SC";break;case "South Dakota":abbr = "SD";break;case "Tennessee":abbr = "TN";break;case "Texas":abbr = "TX";break;case "Utah":abbr = "UT";break;case "Vermont":abbr = "VT";break;case "Virginia":abbr = "VA";break;case "Washington":abbr = "WA";break;case "West Virginia":abbr = "WV";break;case "Wisconsin":abbr = "WI";break;case "Wyoming":abbr = "WY";break;case "District of Columbia":abbr = "DC";break;default:abbr = null;}
        return abbr;
    }

	// init some global vars (bad. i know.)
    var seriesIDs = {};
    var seriesIDTemplate = "";
    var stateCodes = {};
    var stateSubCodes = {};
    var nationalAverageTemplate = "OEUN0000000000000|03";
    var maxSeriesPerRequest = 50; //based on API v2
	var year = '2022';
	var registrationKey = '7b6179aec7a3451fbbc6633c24233a8e';
	
    // build area object. pulling local copy of http://download.bls.gov/pub/time.series/oe/oe.area 
    // ideally should pull from bls site to get most recent copy.
    $.get("oe.area.txt", function(data) {
        stateCodes = JSON.parse(data.replace(/^.*/, '{').replace(/^.*?\t(.*?)\t(.*?)\t(.*?)\t.*/gim, '$2"$1":"$3",').replace(/^(N|M).*$/gim, "").replace(/^S/gim, "").replace(/[\r\n]/gi, "").replace(/,$/im, "}"));
        stateSubCodes = JSON.parse(data.replace(/^.*/, '[').replace(/^(.*?)\t(.*?)\t(.*?)\t(.*?)\t.*/gim, '{"stateCode":"$1","areaCode":"$2","areaType":"$3","areaName":"$4"},').replace(/[\r\n]/gi, "").replace(/,$/im, "]"));
        var tempObj = {};
        for (index in stateSubCodes) {
            tempkey = stateSubCodes[index].stateCode;
            if (!tempObj.hasOwnProperty(tempkey)) {
                tempObj[tempkey] = {
                    state: "",
                    areas: []
                };
            }
            if (stateSubCodes[index].areaType == "S") {
                tempObj[tempkey].state = stateSubCodes[index].areaName;
            }
            if (stateSubCodes[index].areaType == "M") {
                tempObj[tempkey].areas.push({
                    name: stateSubCodes[index].areaName,
                    code: stateSubCodes[index].areaCode
                });
            }
        }
        stateSubCodes = {};
        for (index in tempObj) {
            if (tempObj[index].state != "") {
                stateSubCodes[tempObj[index].state] = tempObj[index].areas;
            }
        }
    });

    // build occupation select options. pulling local copy of http://download.bls.gov/pub/time.series/oe/oe.occupation
    // ideally should pull from bls site to get most recent copy.
    $.get("oe.occupation.txt", function(data) {
		temp = data.replace(/^.*/, '').replace(/^(.*?)\t(.*?)\t(.*?)\t.*/gim, '<option value="$1" data-class="level$3">$2</option>');
		temp = temp.replace(/pla<\/option>/gim,"Plastic</option>").replace(/ te<\/option>/gim," Tenders</option>"); //fixing truncated names
        $('#seriesBuilder *[name="occupationCode"]').html(temp);

        $('#occupationCode').prepend('<option value="" selected="selected">Please Type or Select an Occupation</option>');
        $('#occupationCode').selectize({
            create: false,
            onInitialize: function() {
                var s = this;
                this.revertSettings.$children.each(function() {
                    $.extend(s.options[this.value], $(this).data());
                });
            },
            render: {
                option: function(item, escape) {
                    return '<div class="option" data-class="' + item.class + '">' + item.text + '</div>';
                }
            }
        });
        $("#occupationCode").val("");
        $("#occupationCode")[0].selectize.on('type', function() {
            checkSelectInput();
        });
        $("#occupationCode")[0].selectize.on('change', function() {
            checkSelectInput();
        });
        var checkSelectInput = function() {
            if ($(".selectize-input input").val().length == 0) {
                $(".selectize-dropdown-content div[data-class]").removeClass("level0");
            } else {
                $(".selectize-dropdown-content div[data-class]").attr("class", "level0");
            }
        }
    });


    //when user clicks on select box show the talking cat and hide stuff
    $("#occupationCode").change(function() {
        temp = $('.selectize-dropdown-content div[data-value="' + $(this).val() + '"]').attr("data-class");
        $(".datamaps-hoverover").remove();
        $("#outputTable").fadeOut("slow", function() {
            $(this).hide();
            $("#outputTable tbody").remove();
        });
        $("svg").fadeOut("slow", function() {
            $(this).remove();
        });
        $(".datamaps-legend").fadeOut("slow", function() {
            $(this).remove();
        });
        if ($(this).val() && temp != "level1" && temp != "level2") {
            $("#seriesBuilder").submit(); //if everything looks good submit the form.
            $("#loading div").html("Querying BLS Data API...").fadeOut(100).fadeIn(100);
            if ($("#loading").attr("class") != "init") {
                $(".selectize-control").css("top", "0px");
            } else {
                $(".selectize-control").animate({
                    top: "0px",
                    width: "100%"
                }, 500, function() {});
				$("#loading").animate({
                    top: "10px"
                }, 500, function() {});
				
				$(".selectize-dropdown-content").css("maxHeight", "500px");
                $("#loading").removeClass("init");
            }
        } else if ($(this).val()) {
            $("#loading div").html("Sorry. I can't find any data for this occupation.<br />Please try another!");
            $("#loading div, #loading > span").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        } else {
            $("#loading div").html("Meow! I'm hungry..."); // i don't know
        }
    });

    $("#seriesBuilder").submit(function() {
        //building mapping of series ID and contextual information
        seriesIDs = {};
        var fieldArray = ["prefix", "seasonalAdjustmentCode", "areaTypeCode", "areaCode", "industryCode", "occupationCode", "dataTypeCode"];
        var seriesId = "";
        for (var i in fieldArray) {
            seriesId += $(this).find('*[name="' + fieldArray[i] + '"]').val();
        }
        seriesIDTemplate = seriesId;
		
		// for each state in the list create a new object in the seriesIDs object
        for (key in stateCodes) {
            //looking for annual wages (04 based on http://www.bls.gov/help/hlpforma.htm)
            seriesIDs[seriesId.replace(/\|/, key)] = {
                    state: stateCodes[key],
                    description: "Average Annual Wage of " + $('#seriesBuilder *[name="occupationCode"] option:selected').html() + " in " + stateCodes[key],
                    value: "-"
                }
                //looking for hourly wages (03 based on http://www.bls.gov/help/hlpforma.htm)
            seriesIDs[seriesId.replace(/04$/gi, "03").replace(/\|/, key)] = {
                state: stateCodes[key],
                description: "Average Hourly Wage of " + $('#seriesBuilder *[name="occupationCode"] option:selected').html() + " in " + stateCodes[key],
                value: "-"
            }
        }

		//adding national average for selected occupation (hourly and annually)
        seriesIDs[nationalAverageTemplate.replace("|", $("#occupationCode").val())] = {
            state: "*National*",
            description: "Average Hourly Wage of " + $('#seriesBuilder *[name="occupationCode"] option:selected').html() + " nationally",
            value: "-"
        }
        seriesIDs[nationalAverageTemplate.replace(/03$/gi, "04").replace("|", $("#occupationCode").val())] = {
            state: "*National*",
            description: "Average Annual Wage of " + $('#seriesBuilder *[name="occupationCode"] option:selected').html() + " nationally",
            value: "-"
        }

        //preparing array of series ID's to be sent to bls api
        var seriesStringArray = []; //contains list of series, split into arrays with maxSeriesPerRequest as the size
        var tempString = "";
        var counter = 0;
        var counter2 = 0;

        for (key in seriesIDs) {
            counter++;
            tempString += key + ",";
            if (counter == maxSeriesPerRequest || counter2 + 1 == Object.keys(seriesIDs).length) {
                seriesStringArray.push(tempString.replace(/,$/, ""));
                tempString = "";
                counter = 0;
            }
            counter2++;
        }

        //ajax requests
        counter = 0; //counter for successful AJAX calls

		//for each list created with [maxSeriesPerRequest] items, make an ajax call. call display results when all requests are successful.
        for (key in seriesStringArray) {
            $.ajax({
                type: "POST",
                url: "https://api.bls.gov/publicAPI/v2/timeseries/data/",
                data: {
                    seriesid: seriesStringArray[key],
					registrationKey: registrationKey,
					startyear: year,
					endyear: year,
                },
                success: function(data) {
                    for (var i in data.Results.series) {
                        if (data.Results.series[i].data.length > 0) {
                            seriesIDs[data.Results.series[i].seriesID].value = data.Results.series[i].data[0].value;
                            seriesIDs[data.Results.series[i].seriesID].description += ", " + data.Results.series[i].data[0].year;
                        }
                    }
                    counter++;
                    if (counter == seriesStringArray.length) {
                        $(".selectize-control").show();
                        displayResults();
                    }
                },
                dataType: "json"
            });
        }
        return false;
    });

	//this is basically the MAIN function.
    var displayResults = function() {
        //$("#result").html(JSON.stringify(seriesIDs));
        var resultsBySeries = {};
        for (key in seriesIDs) {
            tempkey = key.replace(/..$/, "");
            if (!resultsBySeries.hasOwnProperty(tempkey)) {
                resultsBySeries[tempkey] = {
                    state: seriesIDs[key].state,
                    annual: "",
                    hourly: ""
                };
            }
            if (key.replace(/.*.(.)$/, "$1") == "4") {
                resultsBySeries[tempkey].annual = seriesIDs[key].value == "-" ? "n/a" : seriesIDs[key].value;
            }
            if (key.replace(/.*.(.)$/, "$1") == "3") {
                resultsBySeries[tempkey].hourly = seriesIDs[key].value == "-" ? "n/a" : seriesIDs[key].value;
            }
        }
        //build table...so complicated :(
        buildTableFromJSON(resultsBySeries);
        $("#outputTable").show();
        redrawMap(resultsBySeries);
    };

	// helper function to help formatting
	var formatWageString = function(string,type){
		output = "$" + Number(string).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		if(type == "annual"){
			output = output.replace(".00", "");
		}
		return output;
	};

    var buildTableFromJSON = function(resultsBySeries) {	
        var tempArray = $.map(resultsBySeries, function(el) {return el;}); // convert to array then sort
        tempArray = tempArray.sort(function(a, b) {
            if (a.state < b.state) return -1;
            if (a.state > b.state) return 1;
            return 0;
        });
        var oldTable = document.getElementById('outputTable'),
            newTable = oldTable.cloneNode(true);
        var tbody = document.createElement('tbody');
        for (var i = 0; i < tempArray.length; i++) {
            seriesIDarray = $.map(tempArray[i], function(el) {
                return el
            });
            var tr = document.createElement('tr');
            for (var j = 0; j < seriesIDarray.length; j++) {
                if (seriesIDarray[j] == "*National*") {
                    //break; //enable if you don't want to show national data
                }
                var td = document.createElement('td');
                if (!isNaN(Number(seriesIDarray[j]))) {
                    if (seriesIDarray[j].match(/.*?\..*/)) {
                        td.appendChild(document.createTextNode(formatWageString(seriesIDarray[j],"hourly")));
                    } else {
                        td.appendChild(document.createTextNode(formatWageString(seriesIDarray[j],"annual")));
                    }
                } else {
                    td.appendChild(document.createTextNode(seriesIDarray[j]));
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        newTable.appendChild(tbody);
        oldTable.parentNode.replaceChild(newTable, oldTable);

		//once table is ready. initialize tablesorter
        $(".tablesorter").tablesorter({
            textExtraction: {
                1: function(node, table, cellIndex) {
                    return $(node).text().replace("n/a", "");
                },
                2: function(node, table, cellIndex) {
                    return $(node).text().replace("n/a", "");
                },
            }
        }).bind('sortEnd', function(e) {
            $(".subArea").hide();
            $(".expanded").removeClass("expanded");
        });

        //once table is ready, fix the links to create new ajax requests for subAreas. aka metropolitan areas.
        $("#outputTable tr td:nth-child(1)").each(function() {
            $(this).html('<a href="#" class="expandSubArea" id="' + stateAbbr($(this).html()) + '" >' + $(this).html() + '</a>');
            $(this).find("a").on("click", function(e) {
                e.stopPropagation();
                $(this).unbind("click");
                $(this).parent().addClass("loading");
                var newCodeString = "";
                var selectedState = $(this).html();
                for (index in stateSubCodes[selectedState]) {
                    var newCode = seriesIDTemplate.replace("S\|", "M" + stateSubCodes[selectedState][index].code);
                    newCodeString += newCode + ",";
                    newCodeString += newCode.replace(/..$/, "03") + ",";
                }
                newCodeString = newCodeString.replace(/,$/, "");
                if (newCodeString != "") {
                    var subSeriesStringArray = [newCodeString];
                    for (key in subSeriesStringArray) {
                        $.ajax({
                            type: "POST",
							url: "https://api.bls.gov/publicAPI/v2/timeseries/data/",
							data: {
								seriesid: subSeriesStringArray[key],
								registrationKey: registrationKey,
								startyear: year,
								endyear: year,
							},							
                            success: function(data) {
                                for (var i in data.Results.series) {
                                    var subAreaCode = data.Results.series[i].seriesID.replace(/.{4}(.{7}).*/gi, "$1");
                                    var subAreaDataCode = data.Results.series[i].seriesID.replace(/.*(.)$/gi, "$1");
                                    if (data.Results.series[i].data.length > 0) {
                                        for (var j in stateSubCodes[selectedState]) {
                                            if (stateSubCodes[selectedState][j].code == subAreaCode) {
                                                if (subAreaDataCode == "3") {
													if(data.Results.series[i].data[0].value != "-"){
														stateSubCodes[selectedState][j].hourly = data.Results.series[i].data[0].value;
													}
												} else if (subAreaDataCode == "4") {
													if(data.Results.series[i].data[0].value != "-"){
														stateSubCodes[selectedState][j].annual = data.Results.series[i].data[0].value;
													}
												}
                                            }
                                        }
                                    }
                                }
                                var tempArray = $.map(stateSubCodes[selectedState], function(el) {return el;});
                                tempArray = tempArray.sort(function(a, b) {
                                    if (a.name < b.name) return 1;
                                    if (a.name > b.name) return -1;
                                    return 0;
                                });
                                stateSubCodes[selectedState] = tempArray;
                                var stateID = "#" + stateAbbr(selectedState);
                                for (key in stateSubCodes[selectedState]) {
                                    if (stateSubCodes[selectedState][key].hasOwnProperty("hourly")) {
                                            temp = stateSubCodes[selectedState][key].annual == "n/a" ? "n/a" : formatWageString(stateSubCodes[selectedState][key].annual,"annual");
                                            $(stateID).parent().parent().after('<tr class="subArea" data-parent-state="' + selectedState + '"><td>' + stateSubCodes[selectedState][key].name + "</td><td>" + temp + "</td><td>" + formatWageString(stateSubCodes[selectedState][key].hourly,"hourly" + "</td></tr>"));
                                    } else {
                                        $(stateID).parent().parent().after('<tr class="subArea" data-parent-state="' + selectedState + '"><td>' + stateSubCodes[selectedState][key].name + "</td><td>n/a</td><td>n/a</td></tr>");
                                    }
                                }
                                $(stateID).parent().parent().addClass("expanded");
                                $(stateID).parent().removeClass("loading");
                            },
                            dataType: "json"
                        });
                    }
                } else {
					//if not msa's for selected state just act as if it was processed anyway.
                    $(this).parent().parent().addClass("expanded");
                    $(this).parent().removeClass("loading");
                }
                return false;
            });
        });
		// when we click on a state link in the table show msa's related to it below it. 
		// this gets messed up when someone sorts the table. this function ensures everything is put back in order.
        $("table").on("click", "a", function() {
            parentTR = $(this).parent().parent();
            if (parentTR.attr("class") == "expanded") {
                $('tr[data-parent-state="' + $(this).html() + '"]').each(function() {
                    $(this).hide();
                });
                parentTR.removeClass("expanded");
            } else {
                $($('tr[data-parent-state="' + $(this).html() + '"]').get().reverse()).each(function() {
                    $("#" + stateAbbr(parentTR.find(".expandSubArea").html())).parent().parent().after($('<div>').append($(this).clone()).html());
                    $(this).remove();
                    $('tr[data-parent-state="' + parentTR.find(".expandSubArea").html() + '"]').show();
                });
                parentTR.addClass("expanded");
            }
            return false;
        });
    };

    var redrawMap = function(resultsBySeries) {
		//determine which field to use. from the data i have seen, they at least have hourly data. some occupations
		//like actors do not have annual data, so we'll use hourly data by default and determine if it has annual data so we can use that instead.
		var fieldToUse = "hourly";
        for (key in resultsBySeries) {
            if (resultsBySeries[key].annual != "n/a" && !key.match(/^OEUN/)) {
                fieldToUse = "annual";
                break;
            }
        }
		//national average for selected occupation is already stored here.
        var mean = Number(resultsBySeries["OEUN0000000000000" + $("#occupationCode").val()][fieldToUse]);
		
        var resultsByState = {};
        for (key in resultsBySeries) {
            if (stateAbbr(resultsBySeries[key].state)) {
                resultsByState[stateAbbr(resultsBySeries[key].state)] = {
                    "state": resultsBySeries[key].state,
                    "annual": resultsBySeries[key].annual,
                    "hourly": resultsBySeries[key].hourly,
                    "percentDifference": (function() {
                        var tempValue = resultsBySeries[key][fieldToUse] == "n/a" ? "-" : resultsBySeries[key][fieldToUse];
                        tempValue = !isNaN(tempValue) ? Math.round((((tempValue / mean) * 100) - 100) * 100) / 100 + "%" : "No Data.";
                        return tempValue;
                    })(),
                    "fillKey": (function() {
                        var fillKey;
                        var tempValue = resultsBySeries[key][fieldToUse] == "n/a" ? "-" : resultsBySeries[key][fieldToUse];
                        var percentBetterWorse = ((tempValue / mean) * 100) - 100;
                        if (isNaN(percentBetterWorse)) {
                            fillKey = "UNKNOWN";
                        } else {
                            if (percentBetterWorse >= 20) {
                                fillKey = "HIGH";
                            } else if (percentBetterWorse >= 7) {
                                fillKey = "MEDIUMHIGH";
                            } else if (percentBetterWorse < 7 && percentBetterWorse > -7) {
                                fillKey = "MEDIUM";
                            } else if (percentBetterWorse <= -7) {
                                fillKey = "MEDIUMLOW";
                            } else if (percentBetterWorse <= -20) {
                                fillKey = "LOW";
                            }
                        }
                        return fillKey;
                    })()
                }
            }
        }
        var map = new Datamap({
            element: document.getElementById('chart'),
            scope: 'usa',
            fills: {
				UNKNOWN: '#DFDCE3',
                LOW: "#A38CFF",
                MEDIUMLOW: '#51B5EB',
				MEDIUM: '#4EF6A9',
                MEDIUMHIGH: '#F6F282',
				HIGH: '#F65D77'
            },
            data: resultsByState,
            geographyConfig: {
                borderWidth: 1,
                borderOpacity: 1,
                borderColor: '#333',
                popupTemplate: function(geo, data) {
                    formattedHourly = !isNaN(Number(data.hourly)) ? formatWageString(data.hourly,"hourly") : "No Data.";
                    formattedAnnually = !isNaN(Number(data.annual)) ? formatWageString(data.annual,"annual") : "No Data.";
                    return '<div class="hoverinfo"><p><strong>Average wages in ' + geo.properties.name + ':</strong></p><p>Hourly: ' + formattedHourly + '</p><p>Annual: ' + formattedAnnually + '</p><p>Percent Difference: ' + data.percentDifference + '</p></div>';
                },
                highlightFillColor: '#FF7D00',
                highlightBorderColor: '#000',
                highlightBorderWidth: 1,
                highlightBorderOpacity: 1
            }
        });
        map.legend({
            legendTitle: "Percent difference of average state wages and the average national wage of <em>" + $("#occupationCode").text() + "</em>",
            defaultFillName: "No data",
            labels: {
				UNKNOWN: "No Data",
                HIGH: "Greater than 20%",
                MEDIUMHIGH: "7% to 19%",
                MEDIUM: "-6% to 6%",
                MEDIUMLOW: "-19% to -7%",
                LOW: "Less than -20%"
            },
        });
		
		// clicking on a state will bring you to the state in the table and show the list of msa's.
        map.svg.selectAll('.datamaps-subunit').on('click', function(obj) {
            var scrollToID = "#" + obj.id;
            $('html, body').animate({
                scrollTop: $(scrollToID).offset().top - 20
            }, 500);
            $(scrollToID).click();

        });

		//fixing layout issues on charts
        $(".datamaps-legend dl dd:last").addClass("last");
        $(".datamaps-legend dl dd:last").after('<div style="clear:both";></div>');
        $("#legendFix").remove();
        $("#chartContainer").append('<div id="legendFix" style="height:' + $(".datamaps-legend").css("height") + '; margin-bottom:70px;"></div>');

		//back to top button functionality
        $("#backToTop").click(function() {
            $("html, body").animate({
                scrollTop: "0px"
            },500);
        });
        $(window).scroll(function() {
            if ($(window).scrollTop() > 30) {
                $("#backToTop").fadeIn(100);	
            }else {
                $("#backToTop").fadeOut(100);
            }
        });
    };
});
