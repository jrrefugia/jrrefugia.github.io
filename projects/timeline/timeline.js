$(document).ready(function() {
	var timelineMonthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
	if (!$(".timelineSegment").size()) {
		$(".timeline").each(function() {
			$(this).css("width", $(this).parent().width() - 23 + "px").css("left", "5px");
			var timelineEvents = timeline[$(this).attr("id")];
			var maxYear = 0;
			var minYear = 99999;
			var yearList = {};
			for (index in timelineEvents) {
				var event = timelineEvents[index];
				var year = Number(event.date.substr(0, 4));
				if (typeof yearList[year] == "undefined") {
					yearList[year] = [];
				}
				yearList[year].push(event);
				if (year > maxYear) {
					maxYear = year;
				}
				if (year < minYear) {
					minYear = year;
				}
			}
			var segmentInterval = 5;
			var segmentPerYear = 1;
			var showMonths = false;
			var monthlySegmentationThreshold = 4;
			var distanceBetweenPoints = 15;
			var distanceFromTimeline = 8;
			var spanInYearCounterMax = 0;
			var timelineSegmentWidthMax = 13;
			
			var timelineConfig = timeline[$(this).attr("id") + "-config"];
			if (timelineConfig) {
				monthlySegmentationThreshold = timelineConfig.monthlySegmentation ? (maxYear - minYear + 1) : monthlySegmentationThreshold;
			}
			if (maxYear - minYear < monthlySegmentationThreshold) {
				segmentInterval = 12;
				segmentPerYear = 12;
				maxYear = maxYear + 1;
				if (maxYear - minYear < 2) {
					showMonths = true;
				}
			} else {
				maxYear = Math.ceil(maxYear / segmentInterval) * segmentInterval;
				minYear = Math.floor(minYear / segmentInterval) * segmentInterval;
			}

			var timelineRange = (maxYear - minYear) * segmentPerYear;
			for (var i = 0; i <= timelineRange; i++) {
				var dataSpanString = "";
				var spanInYearCounter = 0;
				var thisYear = yearList[Math.floor(minYear + (i / segmentPerYear))];
				if (typeof thisYear != "undefined") {
					for (index in thisYear) {
						var event = thisYear[index];
						currentYear = Number(event.date.substr(0, 4));
						currentMonth = Number(event.date.substr(4, 2));
						var timeMatch = false;
						if (segmentPerYear == 12) {
							if (Math.floor(minYear + (i / segmentPerYear)) == currentYear && (i % segmentPerYear) + 1 == currentMonth) {
								timeMatch = true;
							}
						} else {
							if (Math.floor(minYear + (i / segmentPerYear)) == currentYear) {
								timeMatch = true;
							}
						}
						if (timeMatch) {
							spanInYearCounter++;
							dataSpanString += '<span class="data" style="top:' + (-distanceFromTimeline - (distanceBetweenPoints * spanInYearCounter)) + 'px" title="' + event.heading + '" rel="' + event.text + '"></span>';
						}
					}
				}
				spanInYearCounterMax = spanInYearCounter > spanInYearCounterMax ? spanInYearCounter : spanInYearCounterMax;
				$(this).append('<div class="timelineSegment"><span class="label"></span>' + dataSpanString + '</div>');
				var lastSegment = $(this).find(".timelineSegment:last");
				if (i % segmentInterval == 0) {
					lastSegment.addClass("major").find("span.label").html("<span>" + timelineMonthNames[i % segmentPerYear] + "<br /></span>" + (Number(minYear) + i / segmentPerYear));
					lastSegment.find("span.data").css("right", -(lastSegment.find("span.data").width() / 2) - 1 + "px");
					lastSegment.prepend('<span class="filler"></span>');
				} else {
					lastSegment.addClass("minor").find("span.label").html(timelineMonthNames[i % segmentPerYear]);
					lastSegment.find("span.data").css("right", -(lastSegment.find("span.data").width() / 2) - 1 + "px");
				}
				if (i == 0) {
					lastSegment.addClass("first").find("span.label").css("right", -(lastSegment.find("span.label").innerWidth()) + 1 + "px");
				} else if (i == timelineRange) {
					lastSegment.addClass("last").find("span.label").css("right", "-1px");
				} else {
					lastSegment.addClass("middle").find("span.label").css("right", -(lastSegment.find("span.label").innerWidth() / 2) + "px");
				}
			}
			var timelineSegmentWidth = ($(this).width()) / (timelineRange) - 1;
			timelineSegmentWidth = timelineSegmentWidth < timelineSegmentWidthMax ? timelineSegmentWidthMax : timelineSegmentWidth; /*limit resize of segments*/
			$(this).find(".timelineSegment").not(".first").css("width", timelineSegmentWidth + "px").find("span.filler").css("width", timelineSegmentWidth + "px");
			$(this).css("top", (spanInYearCounterMax * distanceBetweenPoints) + distanceFromTimeline + "px").css("marginBottom", (spanInYearCounterMax * distanceBetweenPoints) + distanceFromTimeline + "px");
			if (showMonths) {
				showMonths = " showMonths";
			} else {
				showMonths = "";
			}
			$(this).wrap('<div class="timelineContainer' + showMonths + '"></div>');
		});
	}
	if ($(".timeline").size()) {
		/*timeline tooltip*/
		$(".timelineSegment span.data[title]").each(function() {
			$(this).attr("alt", $(this).attr("title"));
		});
		$(".timelineSegment span.data[title]").tooltip({
			tipClass: "timelineTooltip",
			onBeforeShow: function() {
				this.getTip().html("<h4>" + this.getTrigger().attr("alt") + "</h4><p>" + this.getTrigger().attr("rel") + "</p>");
			},
			offset: [-10, 0],
			position: "top center"
		});
		$(".timelineSegment span.data").mousemove(function(e) {
			var containerOffset = ($(this).parent().position().left)
			if (containerOffset > ($(this).parents(".timelineContainer").width() - 25 - $(".timelineTooltip").width())) {
				containerOffset = $(this).parents(".timelineContainer").width() - 25 - $(".timelineTooltip").width();
			} else if (containerOffset > $(".timelineTooltip").width() / 2) {
				containerOffset = e.pageX - $(this).parents(".timelineContainer").offset().left - 110;
			}
			$(".timelineTooltip").css("left", $(this).parents(".timelineContainer").offset().left + containerOffset + "px").css("position", "absolute");
		});
		$(".timelineSegment span.data").mouseleave(function(e) {
			$(".timelineTooltip").css("display", "none");
		});
	}
});