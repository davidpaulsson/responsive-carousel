/*
 * responsive-carousel touch drag transition
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($) {

	var pluginName = "carousel",
		initSelector = "." + pluginName,
		activeClass = pluginName + "-active",
		inactiveClass = pluginName + "-item-inactive",
		prevClass = pluginName + "-item-prev",
		nextClass = pluginName + "-item-next",
		itemClass = pluginName + "-item",
		dragThreshold = function( deltaX ){
			return Math.abs( deltaX ) > 4;
		},
		getActiveSlides = function( $carousel, deltaX ){
			var $from = $carousel.find( "." + pluginName + "-active" ),
				activeNum = $from.prevAll().length + 1,
				forward = deltaX < 0,
				nextNum = activeNum + (forward ? 1 : -1),
				$to = $carousel.find( "." + itemClass ).eq( nextNum - 1 );

			if( !$to.length ){
				$to = $carousel.find( "." + itemClass )[ forward ? "first" : "last" ]();
			}

			return [ $from, $to, nextNum-1 ];
		};

	// Touch handling
	$( document )
		.on( pluginName + ".dragmove", initSelector, function( e, data ){
			if( !dragThreshold( data.deltaX ) ){
				return;
			}
			var activeSlides = getActiveSlides( $( this ), data.deltaX );

			activeSlides[ 0 ].css( "left", data.deltaX + "px" );
			activeSlides[ 1 ].css( "left", data.deltaX < 0 ? data.w + data.deltaX + "px" : -data.w + data.deltaX + "px" );
		} )
		.on( pluginName + ".dragend", initSelector, function( e, data ){
			if( !dragThreshold( data.deltaX ) ){
				return;
			}
			var activeSlides = getActiveSlides( $( this ), data.deltaX ),
				newSlide = Math.abs( data.deltaX ) > 45;

			$( this ).one( navigator.userAgent.indexOf( "AppleWebKit" ) ? "webkitTransitionEnd" : "transitionEnd", function(){
				activeSlides[ 0 ].add( activeSlides[ 1 ] ).css( "left", "" );
				$( this ).trigger( "goto." + pluginName, [ activeSlides[ 1 ], activeSlides[ 2 ] ] );
			});

			if( newSlide ){
				var $items = $( this ).find( "." + itemClass );

				$items.removeClass( prevClass + " " + nextClass ).addClass( inactiveClass );

				activeSlides[ 0 ].removeClass( activeClass ).css( "left", data.deltaX > 0 ? data.w  + "px" : -data.w  + "px" );
				activeSlides[ 1 ]
					.addClass( activeClass )
					.removeClass( inactiveClass )
					.css( "left", 0 )
					.prev()
						.removeClass( inactiveClass )
						.addClass( prevClass )
					.end()
					.next()
						.removeClass( inactiveClass )
						.addClass( nextClass );

				$( this ).trigger( "goto." + pluginName, activeSlides[ 1 ]);
			}
			else {
				activeSlides[ 0 ].css( "left", 0);
				activeSlides[ 1 ].css( "left", data.deltaX > 0 ? -data.w  + "px" : data.w  + "px" );
			}
		} );

}(jQuery));
