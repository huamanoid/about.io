

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch mode.
		if (browser.mobile)
			$body.addClass('is-touch');

	// Scrolly links.
		$('.scrolly').scrolly({
			speed: 2000
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			alignment: 'right',
			hideDelay: 350
		});

	// Nav.

		

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

	// Parallax.
	// Disabled on IE (choppy scrolling) and mobile platforms (poor performance).
		if (browser.name == 'ie'
		||	browser.mobile) {

			$.fn._parallax = function() {

				return $(this);

			};

		}
		else {

			$.fn._parallax = function() {

				$(this).each(function() {

					var $this = $(this),
						on, off;

					on = function() {

						$this
							.css('background-position', 'center 0px');

						$window
							.on('scroll._parallax', function() {

								var pos = parseInt($window.scrollTop()) - parseInt($this.position().top);

								$this.css('background-position', 'center ' + (pos * -0.15) + 'px');

							});

					};

					off = function() {

						$this
							.css('background-position', '');

						$window
							.off('scroll._parallax');

					};

					breakpoints.on('<=medium', off);
					breakpoints.on('>medium', on);

				});

				return $(this);

			};

			$window
				.on('load resize', function() {
					$window.trigger('scroll');
				});

		}

	// Spotlights.
		var $spotlights = $('.spotlight');

		$spotlights
			._parallax()
			.each(function() {

				var $this = $(this),
					on, off;

				on = function() {

					var top, bottom, mode;

					// Use main <img>'s src as this spotlight's background.
						$this.css('background-image', 'url("' + $this.find('.image.main > img').attr('src') + '")');

					// Side-specific scrollex tweaks.
						if ($this.hasClass('top')) {

							mode = 'top';
							top = '-20%';
							bottom = 0;

						}
						else if ($this.hasClass('bottom')) {

							mode = 'bottom-only';
							top = 0;
							bottom = '20%';

						}
						else {

							mode = 'middle';
							top = 0;
							bottom = 0;

						}

					// Add scrollex.
						$this.scrollex({
							mode:		mode,
							top:		top,
							bottom:		bottom,
							initialize:	function(t) { $this.addClass('inactive'); },
							terminate:	function(t) { $this.removeClass('inactive'); },
							enter:		function(t) { $this.removeClass('inactive'); },

							// Uncomment the line below to "rewind" when this spotlight scrolls out of view.

							//leave:	function(t) { $this.addClass('inactive'); },

						});

				};

				off = function() {

					// Clear spotlight's background.
						$this.css('background-image', '');

					// Remove scrollex.
						$this.unscrollex();

				};

				breakpoints.on('<=medium', off);
				breakpoints.on('>medium', on);

			});

	// Wrappers.
		var $wrappers = $('.wrapper');

		$wrappers
			.each(function() {

				var $this = $(this),
					on, off;

				on = function() {

					$this.scrollex({
						top:		250,
						bottom:		0,
						initialize:	function(t) { $this.addClass('inactive'); },
						terminate:	function(t) { $this.removeClass('inactive'); },
						enter:		function(t) { $this.removeClass('inactive'); },

						// Uncomment the line below to "rewind" when this wrapper scrolls out of view.

						//leave:	function(t) { $this.addClass('inactive'); },

					});

				};

				off = function() {
					$this.unscrollex();
				};

				breakpoints.on('<=medium', off);
				breakpoints.on('>medium', on);

			});

	// Banner.
		var $banner = $('#banner');

		$banner
			._parallax();

})(jQuery);



// OBJECT: 'retype' controls the deletion and creation of new words
var retype = {
	// ARRAY: 'retypePhrases' contains the words that will be switched
	//		  The tool replaces the word contained within the element with the ID of 'retype'
	//		  It works cleaner if neighboring words have different first letters.
	//		  Spaces in phrases can cause a hiccup. Best practice to keep phrases as single words.
	retypePhrases: [
		'A Programmer',
		'A Web Developer',
		'An AI freak',
		'A M A N .'
	],
	index       : -1,
	elem        : document.getElementById('retype'),
	start       : function(){
		var _this = this;
		setTimeout( function(){
			_this.deleteLetter();
		}, 3000 ); // Delay the start of a new word by 3 seconds
	},// END retype.start()
	deleteRepeat: function(){
		this.deleteLetter();
	},// END retype.deleteRepeat()
	deleteLetter: function(){
		var newWord = this.elem.innerHTML;
		if( newWord.length > 0 ){
			newWord = newWord.substring(0, newWord.length - 1);
			var _this = this;
			setTimeout( function(){
				_this.elem.innerHTML = newWord;
				_this.deleteRepeat();
			}, 75 );
		}else{
			this.newLetter();
		}// END if( newWord.length > 0 )
	},// END retype.deleteLetter()
	newRepeat   : function(){
		this.newLetter();
	},// END retype.newRepeat()
	newLetter   : function(){
		var newWord = this.elem.innerHTML;
		if( newWord.length === 0 ){
			this.index++;
			if( this.index >= this.retypePhrases.length ){
				this.index = 0;
			}
		}// END if( newWord.length === 0 )
		var newLetters = this.retypePhrases[ this.index ];
		if( newLetters.length > newWord.length ){
			newLetters = newLetters.substring(0, ( newWord.length + 1 ) );
			var _this = this;
			// Add a slight random variation in retype time to make the letter typing seem more 'human'
			var time = Math.round( Math.random() * 100 ) + 100;
			setTimeout( function(){
				_this.elem.innerHTML = newLetters;
				_this.newLetter();
			}, time );
		}else{
			this.start();
			// Yep, this makes the retype an infinite loop
		}// END if( newLetters.length > newWord.length )
	}// END retype.newLetter()
};

const box1 = document.getElementById('neobutton1');

box1.onclick = () => {
  box1.classList.add('click');
  setTimeout(() => {
    box1.classList.remove('click');
  }, 300);
};
const box2 = document.getElementById('neobutton2');

box2.onclick = () => {
  box2.classList.add('click');
  setTimeout(() => {
    box2.classList.remove('click');
  }, 300);
};

const box3 = document.getElementById('neobutton3');

box3.onclick = () => {
  box3.classList.add('click');
  setTimeout(() => {
    box3.classList.remove('click');
  }, 300);
};

const box4 = document.getElementById('neobutton4');

box4.onclick = () => {
  box4.classList.add('click');
  setTimeout(() => {
    box4.classList.remove('click');
  }, 300);
};

// technique for this demo found here 
// http://stackoverflow.com/questions/22003491/animating-canvas-to-look-like-tv-noise

const canvas = document.querySelector('canvas'),
				 ctx = canvas.getContext('2d')

canvas.width = canvas.height = 128

resize();
window.onresize = resize;

function resize() {
	canvas.width = window.innerWidth * window.devicePixelRatio / 1
	canvas.height = window.innerHeight * window.devicePixelRatio / 1
	canvas.style.width = window.innerWidth + 'px'
	canvas.style.height = window.innerHeight + 'px'
}



// window.setInterval('noise(ctx)',150);
function noise(ctx) {
    
	const w = ctx.canvas.width,
				h = ctx.canvas.height,
				iData = ctx.createImageData(w, h),
				buffer32 = new Uint32Array(iData.data.buffer),
				len = buffer32.length
	  let i = 1

	for(; i < len;i++)
		
		if (Math.random() < 0.5) buffer32[i] = 0xffffffff;

		ctx.putImageData(iData, 0, 0);
}



(function loop() {
    noise(ctx);
    requestAnimationFrame(loop);
})();

retype.start();



