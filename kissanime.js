
function chainScripts(scripts, success) {

	if (scripts.length) {
		var s = document.createElement('script');
		s.src = scripts.splice(-1)[0];
		s.onload = function () {

			chainScripts(scripts, success)
		};
		(document.head || document.documentElement).appendChild(s);
	} else
		success();
}

chainScripts((location.href.match(/kisscartoon|facebook/) ? ["http://kisscartoon.me/Scripts/aes.js", "http://kisscartoon.me/Scripts/sha256.min.js", "http://kisscartoon.me/Scripts/kissenc.min.js?v=3", "http://kisscartoon.me/Scripts/jquery17.min.js", "http://kisscartoon.me/Scripts/asp.js", "https://code.jquery.com/ui/1.11.4/jquery-ui.js"] : ["https://code.jquery.com/ui/1.11.4/jquery-ui.js"]).reverse(), callback)

var login = "sirius16";
var api_key = "R_6a13f014b38f4f80a31cf7d80a7c18c7";
var long_url;

function callback() {
	$j("head").append('<link rel="stylesheet" href="https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">')
	var URL = window.location.origin;
	var hi = [];
	var hello = [];

	var episodeLinks = $j('table.listing a').map(function (i, el) {
			return $j(el).attr('href');
		});

	$j.ajaxSetup({
		async : false
	});

	var startEpisode;
	var endEpisode;
	$("form:gt(0)").submit(function () {
		startEpisode = $("#start", epi).val();
		endEpisode = $("#end", epi).val();
		console.log(startEpisode, endEpisode)
		return false;
	});
	do {

		startEpisode = parseInt(prompt("Enter episode number you want to start from", episodeLinks.length),10);
		if (startEpisode <= 0 || startEpisode > episodeLinks.length || endEpisode <= 0 || endEpisode > episodeLinks.length || endEpisode < startEpisode) {
			alert("Episode number entered must be greater than 0 and lesser than total number of eps");
		} else {
			break;
		}
	} while (true);
	do {
		endEpisode = parseInt(prompt("Enter episode number you want to end at", episodeLinks.length),10);
		if (endEpisode <= 0 || endEpisode > episodeLinks.length || endEpisode < startEpisode) {
			alert("Episode number entered must be greater than 0 and lesser than total number of eps");
		} else {
			break;
		}
	} while (true);

	var i;
	for (i = (episodeLinks.length - startEpisode); i >= (episodeLinks.length - endEpisode); i--) {
		$j.get(URL + episodeLinks[i], {login:"amozu16"}, function (result) {
			var $result = $j("<html />").append($j.parseHTML(result));

			var wra;
			var stringStart = result.search("var wra");
			var stringEnd = result.search("document.write");
			var javascriptToExecute = result.substring(stringStart, stringEnd);
			if (result.match(/var wra.*\$kissenc.*\(.*\)/))
				eval(result.match(/var wra.*\$kissenc.*\(.*\)/)[0]);
			$j("body").append('<div id="episode' + i + '" style="display: none;"></div>');
			$j('#episode' + i).append(wra || $j("#divDownload", $result));

			var downloadQualityOptions = $j('#episode' + i + ' a').map(function (i, el) {
					return $j(el);
				});
			var episodeName = $j("#divFileName", $result).contents().filter(function () {
					return this.nodeType == 3
				}).eq(1).text().trim();
			if (!episodeName)
				return;

			long_url = downloadQualityOptions[0][0].href;
			console.log(i);
			$j("#download").text((episodeLinks.length-startEpisode-i + 1) + "/" + (endEpisode - startEpisode + 1))
			get_short_url(long_url, login, api_key);
			if (downloadQualityOptions[0][0].href.match(/onedrive/i))
				hi.push('wget -b "' + downloadQualityOptions[0][0].href + '"  --no-check-certificate');
			else
				hello.push('wget -b -O "' + episodeName + '.mp4" "' + downloadQualityOptions[0][0].href + '"  --no-check-certificate');
		});
			$j.post(URL + episodeLinks[i], {login:"amozu16"})

	}
	$("textarea").remove()
	if (hi.length)
		obj(hi.join("\n")+"\n");
	if (hello.length)
		obj(hello.join("\n")+"\n");
	$("<div />").append($("textarea")).dialog({})
	alert(eval(hello.length + hi.length) + " links ready");
};

function get_short_url(long_url, login, api_key) {
	$.getJSON(
		"https://api-ssl.bitly.com/v3/shorten?callback=?", {
		"format" : "json",
		"apiKey" : api_key,
		"login" : login,
		"longUrl" : long_url,
		async : true
	},
		function (response) {
		console.log(response.data.url);
	});
}
