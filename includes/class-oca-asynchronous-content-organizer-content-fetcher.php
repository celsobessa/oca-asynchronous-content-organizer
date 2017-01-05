<?php

/**
 * The content fetcher functionality of the plugin.
 *
 * @link 		http://slushman.com
 * @since 		1.0.0
 *
 * @package 	Oca_Asynchronous_Content_Organizer/includes
 */

/**
 * The content fetcher functionality of the plugin.
 *
 * @package 	Oca_Asynchronous_Content_Organizer/includes
 * @author     2Aces Conteúdo <contato@2aces.com.br>
 */
class Oca_Asynchronous_Content_Organizer_Content_Fetcher {

	/**
	 * The name of function to request
	 *
	 * @since 		1.0.0
	 * @access 		private
	 * @var 		string 			$function_name    The name of the function to request content from.
	 */
	private $function_name;

	/**
	 * The arguments to the function
	 *
	 * @since 		1.0.0
	 * @access 		private
	 * @var 		string 			$function_name    The arguments to be used with the requesting function
	 */
	private $function_args;

	/**
	 * The function output behavior
	 *
	 * @since 		1.0.0
	 * @access 		private
	 * @var 		string 			$function_output    Indicates the function output behavior: echo or return
	 */
	private $function_output;

	/**
	 * The cache behavior for the content.
	 * 
	 * Indicates if the content returned by the function should be cached. The default is false (default).
	 *
	 * @since 		1.0.0
	 * @access 		private
	 * @var 		bool 			$use_cache;    The cache behavior for the content: true or false (default)
	 */
	
	private $has_priveleges;

	/**
	 * The cache behavior for the content.
	 * 
	 * Indicates if the content returned by the function should be cached. The default is false (default).
	 *
	 * @since 		1.0.0
	 * @access 		private
	 * @var 		bool 			$use_cache;    The cache behavior for the content: true or false (default)
	 */
	private $use_cache;
	
	public $response_status;
	public $response_content;
	
	public function check_privileges() {
		
	}
	
	public function request_content() {
		
	}
	
	public function create_cache_key() {
		
	}
	
	public function check_if_in_cache() {
		
	}
	
	public function add_to_cache() {
		
	}
	
	public function remove_from_cache() {
		
	}
	
	public function sanitize_response() {
		
	}
	
	public function error_management() {
		
	}
	
	public function return_content() {
		
	}

}
