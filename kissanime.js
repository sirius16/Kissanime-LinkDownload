function* range(begin, end, interval = 1) {
	for (let i = begin; i < end; i += interval) {
		yield i;
	}
}


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

		startEpisode = parseInt(prompt("Enter episode number you want to start from", episodeLinks.length), 10);
		if (startEpisode <= 0 || startEpisode > episodeLinks.length || endEpisode <= 0 || endEpisode > episodeLinks.length || endEpisode < startEpisode) {
			alert("Episode number entered must be greater than 0 and lesser than total number of eps");
		} else {
			break;
		}
	} while (true);
	do {
		endEpisode = parseInt(prompt("Enter episode number you want to end at", episodeLinks.length), 10);
		if (endEpisode <= 0 || endEpisode > episodeLinks.length || endEpisode < startEpisode) {
			alert("Episode number entered must be greater than 0 and lesser than total number of eps");
		} else {
			break;
		}
	} while (true);

	var eps = [...range((episodeLinks.length - endEpisode), (episodeLinks.length - startEpisode + 1))].reverse();
	console.log(eps);
	function getEps(eps) {
		var ep = eps();
		var i = ep.next();
		download();
		function download() {
			if (i.done) {
				dispatchEvent(new Event("done"));
				return;
			}
			new Promise(j => {
					setTimeout(() => j(i.value), eps.length - 1 ?( (i % 6) ? 20000 : 100000 ): 0)
				}).then(k => {
					$j.get(URL + episodeLinks[k], {
						login : "amozu16"
					}, function (result) {
						var $result = $j("<html />").append($j.parseHTML(result));

						var wra;
						var stringStart = result.search("var wra");
						var stringEnd = result.search("document.write");
						
						var javascriptToExecute = result.substring(stringStart, stringEnd);
						if (result.match(/var wra.*\$kissenc.*\(.*\)/))
							$kissenc.decrypt(result.match(/var wra.*\$kissenc.*\(.*\)/)[0].slice(18,-2));
						$j("body").append('<div id="episode' + k + '" style="display: none;"></div>');
						$j('#episode' + k).append(wra || $j("#divDownload", $result));

						var downloadQualityOptions = $j('#episode' + k + ' a').map(function (k, el) {
								return $j(el);
							});
						var episodeName = $j("#divFileName", $result).contents().filter(function () {
								return this.nodeType == 3
							}).eq(1).text().trim();
						if (!episodeName)
							return;

						long_url = downloadQualityOptions[0][0].href;
						console.log(k);
						$j("#download").val((episodeLinks.length - startEpisode - k + 1) + "/" + (endEpisode - startEpisode + 1))
						// get_short_url(long_url, login, api_key);
						if (downloadQualityOptions[0][0].href.match(/onedrive/i))
							hi.push('wget -b "' + downloadQualityOptions[0][0].href + '"  --no-check-certificate');
						else
							hello.push('wget -b -O "' + episodeName + '.mp4" "' + downloadQualityOptions[0][0].href + '"  --no-check-certificate');
					});
					$j.post(URL + episodeLinks[k], {
						login : "amozu16"
					})
					console.log(hi, hello,k)
					i = ep.next();
					download();
				})
		}
	}
	getEps(function* () {
		yield* eps
	});
	window.addEventListener('done', function () {
		$("textarea").remove()
		if (hi.length)
			obj(hi.join("\n") + "\n");
		if (hello.length)
			obj(hello.join("\n") + "\n");
		$("<div />").append($("textarea")).dialog({})
		alert(eval(hello.length + hi.length) + " links ready");
	});
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

callback();
