$(document).ready(function(){


	$('#getStories').on('click', function() {
		$.getJSON('req/get-stories', function(data){
			console.log('nothing  happened');
		});
	});
});
