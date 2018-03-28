<?php

/**
 * The content fetcher functionality of the plugin.
 *
 * @link 		http://slushman.com
 * @since 		0.2.0
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
	 * The ID of this plugin.
	 *
	 * @since    0.2.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    0.2.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * The name of function to request
	 *
	 * @since 		0.2.0
	 * @access 		private
	 * @var 		string 			$function_name    The name of the function to request content from.
	 */
	private $function_name;

	/**
	 * The arguments to the function
	 *
	 * @since 		0.2.0
	 * @access 		private
	 * @var 		string 			$function_name    The arguments to be used with the requesting function
	 */
	private $function_args;

	/**
	 * The function output behavior
	 *
	 * @since 		0.2.0
	 * @access 		private
	 * @var 		string 			$function_output    Indicates the function output behavior: echo or return
	 */
	private $function_output;

	/**
	 * The cache behavior for the content in backend.
	 *
	 * Indicates if the content returned by the function should be cached in backend. The default is true.
	 *
	 * @since 		0.4.0
	 * @access 		private
	 * @var 		bool 			$backend_cache;    The cache behavior for the content: true (default) or false.
	 */
	private $backend_cache;

	/**
	 * TODO Deprecate
	 * The cache behavior for the content in frontend.
	 *
	 * Indicates if the content returned by the function should be cached in frontend. The default is true.
	 *
	 * @since 		0.4.0
	 * @access 		private
	 * @var 		bool 			$frontend_cache;    The cache behavior for the content: true (default) or false.
	 */
	private $frontend_cache;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    0.2.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/*
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

	public function response_management() {

	}*/

	/**
	 * Wrapper for functions called by ajax for privileged users
	 *
	 * @since    0.2.0
	 * @since    0.2.6 added bypass support
	 */
	public function fetcher() {
		error_log( 'oca Fetcher init' );
    	$function_name = $_POST['function_name'];
		error_log( 'oca Fetcher $function_name' );
		error_log( print_r( $function_name, true) );
		$this->function_args = $_POST['function_args'];
    	if ( 'bypass' === $function_name ){
    		$response = 'bypass';
    		echo $response;
			die();
    	}
    	if ( isset( $_POST['function_output'] ) && 'return' === $_POST['function_output'] ){
			$response = call_user_func_array( $function_name, $this->function_args );
    	}
    	else {
	    	ob_start();
			call_user_func_array( $function_name, $this->function_args );
			$response = ob_get_clean();
    	}
		echo $response;
		die();
	}

	/**
	 * Wrapper for functions called by ajax for non-privileged users
	 *
	 * @since    0.2.0
	 * @since    0.2.6 added bypass support
	 */
	public function nopriv_fetcher() {
		//error_log( 'oca nopriv_fetcher init' );
		$function_name = $_POST['nopriv_function_name'];
		//error_log( 'oca nopriv_fetcher function_name' );
		//error_log( print_r( $function_name, true) );
    	$this->function_args = $_POST['nopriv_function_args'];
    	if ( 'bypass' === $function_name ){
	    	echo 'bypass';
			die();
    	}
    	if ( isset( $_POST['nopriv_function_output'] ) && 'return' === $_POST['nopriv_function_output'] ){
			echo call_user_func_array( $function_name, $this->function_args );
    	}
    	else {
			call_user_func_array( $function_name, $this->function_args );
    	}
		die();
	}

	public function ajax_check_user_logged_in() {
		$user_status = is_user_logged_in() ? 'priv' : 'nopriv' ;
		$user_data = apply_filters( 'Oca/Fetcher/User/Data', '');
		$user_info = array(
			'userStatus'	=> $user_status,
			'userData'		=> $user_data
		);
		wp_send_json_success( $user_info );
		//echo $user_info;
		//die();
	}

}
