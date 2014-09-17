/*!
 * Widget: jQuery.SlideshowBob
 * Version: 1.0
 * Author: Chris Bartek
 * Examples and documentation: http://chrisbartek.com
 * Copyright (c) 2013 Chris Bartek
 * Dual licensed under the MIT and GPL licenses
 * Dependencies: jQuery
 */

$(document).ready(function(){
	var images = [];
	$.each(slideshow, function(key, val){
		images.push(val.image);
	});

	function preload(files, cb) {
		var len = files.length;
		$($.map(files, function(f) {
			return '<img src="'+f+'" />';
		}).join('')).load(function () {
		if(--len===0) {
			cb();
		}
		});
	}
	preload(images, function() {
		initialize();
	});

function initialize() {
	var slideCount = 0;
	var autoSlide = false;
	
	$.each(slideshow, function(key, val){
		$('#aside').append('<div id="img-'+ (key+1) +'" class="img"><img src="'+val.image+'"></div>');
		$('#article').append('<div id="desc-'+ (key+1) +'" class="desc">'+val.desc+'</div>');
		$('#navCount').append('<a href="#" id="nav-'+ (key+1) +'" class="navBtn">'+ (key+1) +'</a>');
		$('#thumbs').append('<img data-id="'+ (key+1) +'" class="thumb" src="'+val.image+'">');
		if ($('#img-'+ (key+1) + ' img').width() > $('#img-'+ (key+1) + ' img').height()) {
			$('#img-'+ (key+1) + ' img').addClass("horizontal");
		} else {
			$('#img-'+ (key+1) + ' img').addClass("vertical");
		}
		slideCount++;
	});

	$('#aside div').hide();
	$('#aside div:first').show();
	$('#article div').hide();
	$('#article div:first').show();
	$('#thumbs').append('<br><br><a href="#" class="close-thumbs">Close</a>');
	$('#loader').hide();
	$('#wrapper').css('visibility','visible');
	currentSlide = 1;
	updateSlide();
	updateWindow();

	$('#aside').height(420);

	$(document).on('click', '#aside', function(evt){
		evt.preventDefault();
		slideNext();
	});
	$(document).on('click', '.next', function(evt){
		evt.preventDefault();
		slideNext();
	});
	$(document).on('click', '.prev', function(evt){
		evt.preventDefault();
		slidePrev();
	});
	$(document).on('click', '.navBtn', function(evt){
		evt.preventDefault();
		slideTo($(this).text());
	});
	$(document).on('click', '.autoSlide', function(evt){
		evt.preventDefault();
		if(!autoSlide){
			$(this).addClass('selected');
			autoSlide = setInterval(slideNext, 6000);
		} else {
			$(this).removeClass('selected');
			clearInterval(autoSlide);
			autoSlide = false;
		}
	});
	$(document).on('click', '#wrapper-thumbs', function(evt){
		evt.preventDefault();
		$('#wrapper-thumbs').fadeOut(1000);
	});
	$(document).on('click', '.thumb', function(evt){
		evt.preventDefault();
		$('#wrapper-thumbs').fadeOut(1000);
		slideTo($(this).attr('data-id'));
	});
	$(document).on('click', '#btnThumbs', function(evt){
		evt.preventDefault();
		$('#wrapper-thumbs').fadeIn(1000);
	});
	$(document).on('click', '#btnFullscreen', function(evt){
		evt.preventDefault();
		requestFullScreen(elem);
		updateWindow();
	});
	$('.navBtn').hover(
		function () {
			$('#thumbTip').stop().fadeIn(300);
			var offset = $(this).offset();
			$('#thumbTip').html('<img src="'+ slideshow[($(this).text()-1)].image +'" alt="">');
			$('#thumbTip').css('left',offset.left-($('#thumbTip').width()/2)+15).css('top',offset.top - 100);
		},
		function () {
			$('#thumbTip').fadeOut(300);
		}
	);
	$(window).resize(function(){
		updateWindow();
	});
	$(document).keydown(function(evt){
		if (evt.keyCode == 37) { 
			slidePrev();
			return false;
		}
		if (evt.keyCode == 39) { 
			slideNext();
			return false;
		}
	});

	function slideNext(){
		currentSlide++;
		if(currentSlide > slideCount){
			currentSlide = 1;
		}
		updateSlide();
	}
	function slidePrev(){
		currentSlide--;
		if(currentSlide < 1) {
			currentSlide = slideCount;
		}
		updateSlide();
	}
	function slideTo(slide){
		currentSlide = slide;
		updateSlide();
	}
	function updateSlide(){
		$('#aside div').fadeOut(1000);
		$('#article div').hide();
		$('#img-'+currentSlide).fadeIn(1000,function(){updateWindow()});
		$('#desc-'+currentSlide).show();
		$('#pos').html(currentSlide + ' / ' + slideCount);
		$('.navBtn').removeClass('selected');
		$('#nav-'+currentSlide).addClass('selected');
	}
	function updateWindow(){
		if($(window).width() < 890) {
			$('html').addClass('compact').removeClass('full');
			if($('img:visible').height() > 0){
				hgt = $('img:visible').height();
				$('#article').css('top',(hgt+50)+'px');
				$('#nav').css('top',(hgt+110)+'px');
			}
		}
		if($(window).width() >= 890) {
			$('html').removeClass('compact').removeClass('full');
			$('#thumbTip').hide();
		}
	}
	
	function resizeImageWithAspectRatio(img) {
		var maxWidth = 600;
		var maxHeight = 400;
		var ratio = 0;
		var width = $(img).width();
		var height = $(img).height();
		// Check if the current width is larger than the max
		if(width > maxWidth){
			ratio = maxWidth / width;
			$(img).css("width", maxWidth);
			$(img).css("height", height * ratio);
			height = height * ratio;
			width = width * ratio;
		}
		// Check if current height is larger than max
		if(height > maxHeight){
			ratio = maxHeight / height;
			$(img).css("height", maxHeight);
			$(img).css("width", width * ratio);
			width = width * ratio;
		}
	}

	function requestFullScreen(element) { // Supports most browsers and their versions
	    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

	    if (requestMethod) { // Native fullscreen
	        requestMethod.call(element);
	    } else if (typeof window.ActiveXObject !== "undefined") { // Old IE
	        var wscript = new ActiveXObject("WScript.Shell");
	        if (wscript !== null) {
	            wscript.SendKeys("{F11}");
	        }
	    } else {alert("Sorry, fullscreen mode is not supported in your browser.");}
	}
	var elem = document.body; // Make the body go fullscreen
}

});
