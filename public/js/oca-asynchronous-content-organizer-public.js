// set Event Listeners
// =================================================
'use strict';
// ocaVars:
	// ajaxUrl
	// queue
		// item: priv_name, priv_args, functionOutput, container, nopriv_name, nopriv_args, trigger, timeout, placement (append, prepend, replace)

var ocaDelayedScripts, ocaQueue;

function ocaInit(){
	if ( !ocaVars ){
		return;
	}
	ocaQueue = ocaVars.queue;
	if ( 'no queue' === ocaQueue ){
		return;
	}
	ocaProcessQueue(ocaQueue);
}

function ocaProcessQueue(queue) {
	//TODO declare all needed variables
	var ocaItem
	//TODO iterate over items (over JSON/object or transform into an array before?)
	ocaQueue.forEach(ocaProcessItem);
	
}

function ocaProcessItem(item, index, array) {
	ocaFetchContent(ocaVars.ajaxUrl, item);
}

function ocaFetchContent(ajaxUrl, item ) {

	jQuery.ajax({
		url: ajaxUrl,
		type: 'post',
		data: {
			action: 'oca_fetcher',
			function_name: item.functionName,
			function_args: item.functionArgs,
			function_output: item.functionOutput,
			nopriv_function_name: item.noprivFunctionName,
			nopriv_function_args: item.noprivFunctionArgs,
			nopriv_function_output: item.noprivFunctionOutput,
		},
		beforeSend: ocaInjectLoader(item.container, item.placement),
		success: function( html ) {
			ocaInjectContent(item.container, item.placement, item.functionName, html);
		}
	});
	
}

function ocaInjectLoader(container, placement) {
	jQuery(document).scrollTop();
	if ( 'prepend' === placement ){
		jQuery(container).prepend( '<div class="content-loader">Loading Content...</div>' );
	}
	else if ( 'replace' === placement ){
		jQuery(container).html( '<div class="content-loader">Loading Content...</div>' );
	}
	else {
		jQuery(container).append( '<div class="content-loader">Loading Content...</div>' );
	}	
}

function ocaInjectContent(container, placement, functionName, html) {
	jQuery('.content-loader').remove();
	if ( 'prepend' === placement ){
		jQuery(container).prepend( html );
	}
	else if ( 'replace' === placement ){
		jQuery(container).html( html );
	}
	else {
		jQuery(container).append( html );
	}
	
}
if ( window.addEventListener ) {
	window.addEventListener('load', ocaDelayedScripts, false);
}
else if (window.attachEvent) {
	window.attachEvent("onload", ocaDelayedScripts);
}
else {
	window.onload = ocaDelayedScripts();
};
function ocaDelayedScripts(){
	ocaInit();
};
(function( $ ) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

})( jQuery );