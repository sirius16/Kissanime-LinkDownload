var URL = window.location.origin;
var hi = [];


var episodeLinks = $j('table.listing a').map(function (i, el) {
		return $j(el).attr('href');
	});
$j("table.listing a").before(function(index) {return episodeLinks.length-index})

$j.ajaxSetup({
	async : false
});


$j.getScript("http://kissanime.com/Scripts/asp.js");
var login = "vergo777";
var api_key = "R_6a13f014b38f4f80a31cf7d80a7c18c7";
var long_url;
var startEpisode;


do {
	startEpisode = prompt("Enter episode number you want to start from", episodeLinks.length);
	if (startEpisode <= 0 || startEpisode > episodeLinks.length) {
		alert("Episode number entered must be greater than 0 and lesser than total number of eps");
	} else {
		break;
	}
} while (true);


var endEpisode;
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
		var stringStart = result.search("var wra");
		var stringEnd = result.search("document.write");
		var javascriptToExecute = result.substring(stringStart, stringEnd);
		eval(javascriptToExecute);
		$j("body").append('<div id="episode' + i + '" style="display: none;"></div>');
		$j('#episode' + i).append(wra);
		var downloadQualityOptions = $j('#episode' + i + ' a').map(function (i, el) {
				return $j(el);
			});
		hi.push($result.find("#divFileName")[0].innerText.split("\n")[2] + "\t" + downloadQualityOptions[0][0].href);
	});
}



var hello = hi.join("\n");
var obj = $j("<textarea />").text(hello);
$j("body").append(obj);
obj.select().focus();
alert(hi.length + " links ready");
