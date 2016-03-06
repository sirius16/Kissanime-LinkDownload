var s1 = document.createElement('script');
s1.src = "https://code.jquery.com/ui/1.11.4/jquery-ui.js";
var s = document.createElement('script');
s.src = "/Scripts/asp.js";
s1.onload = function () {
	(document.head || document.documentElement).appendChild(s);
}
s.onload = function () {
	try {
		$j(this).remove();
		$j("head").append('<link rel="stylesheet" href="https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">')
		callback();
	} catch (e) {
		alert(e)
	}
}
function callback() {

	var URL = window.location.origin;
	var hi = [];
	var hello = [];

	var episodeLinks = $j('table.listing a').map(function (i, el) {
			return $j(el).attr('href');
		});

	$j.ajaxSetup({
		async : false
	});

	var login = "vergo777";
	var api_key = "R_6a13f014b38f4f80a31cf7d80a7c18c7";
	var long_url;
	var startEpisode;
	var endEpisode;
	$("form:gt(0)").submit(function () {
		startEpisode = $("#start", epi).val();
		endEpisode = $("#end", epi).val();
		console.log(startEpisode, endEpisode)
		return false;
	});
	do {

		startEpisode = prompt("Enter episode number you want to start from", episodeLinks.length);
		if (startEpisode <= 0 || startEpisode > episodeLinks.length || endEpisode <= 0 || endEpisode > episodeLinks.length || endEpisode < startEpisode) {
			alert("Episode number entered must be greater than 0 and lesser than total number of eps");
		} else {
			break;
		}
	} while (true);
	do {
		endEpisode = prompt("Enter episode number you want to end at", episodeLinks.length);
		if (endEpisode <= 0 || endEpisode > episodeLinks.length || endEpisode < startEpisode) {
			alert("Episode number entered must be greater than 0 and lesser than total number of eps");
		} else {
			break;
		}
	} while (true);

	var i;
	for (i = (episodeLinks.length - startEpisode); i >= (episodeLinks.length - endEpisode); i--) {
		$j.get(URL + episodeLinks[i], function (result) {
			var $result = $j("<html />").append($j.parseHTML(result));
			try {
				var stringStart = result.search("var wra");
				var stringEnd = result.search("document.write");
				var javascriptToExecute = result.substring(stringStart, stringEnd);
				eval(javascriptToExecute);
				$j("body").append('<div id="episode' + i + '" style="display: none;"></div>');
				$j('#episode' + i).append($j("#divDownload", $result));
			} catch (e) {}
			var downloadQualityOptions = $j('#episode' + i + ' a').map(function (i, el) {
					return $j(el);
				});
			var episodeName = $j("#divFileName", $result).contents().filter(function () {
					return this.nodeType == 3
				}).eq(1).text().trim();
			if (!episodeName)
				return;

			if (downloadQualityOptions[0][0].href.match(/googlevideo/i))
				hi.push(encodeURI(episodeName) + "\t" + downloadQualityOptions[0][0].href);
			else
				hello.push('wget -b -O "' + episodeName + '.mp4" "' + downloadQualityOptions[0][0].href + '"  --no-check-certificate');
		});
	}
	$("textarea").remove()
	if (hi.length)
		obj(hi.join("\n"));
	if (hello.length)
		obj(hello.join("\n"));
	$("<div />").append($("textarea")).dialog({})
	alert(eval(hello.length + hi.length) + " links ready");
};

(document.head || document.documentElement).appendChild(s1);
