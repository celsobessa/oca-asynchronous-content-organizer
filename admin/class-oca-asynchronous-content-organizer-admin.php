<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://2aces.com.br
 * @since      1.0.0
 *
 * @package    Oca_Asynchronous_Content_Organizer
 * @subpackage Oca_Asynchronous_Content_Organizer/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Oca_Asynchronous_Content_Organizer
 * @subpackage Oca_Asynchronous_Content_Organizer/admin
 * @author     2Aces Conteúdo <contato@2aces.com.br>
 */
class Oca_Asynchronous_Content_Organizer_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Oca_Asynchronous_Content_Organizer_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Oca_Asynchronous_Content_Organizer_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/oca-asynchronous-content-organizer-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Oca_Asynchronous_Content_Organizer_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Oca_Asynchronous_Content_Organizer_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/oca-asynchronous-content-organizer-admin.js', array( 'jquery' ), $this->version, false );

	}

	/**
	 * parse args and calls wraps WordPress the_author
	 *
	 * @since    1.0.0
	 */
	public function oca_fetcher() {
    	$function_name = stripslashes( $_POST['priv_name'] );
    	$args = stripslashes( $_POST['args'] );
    	if ( isset( $_POST['output_behavior'] ) && 'return' === $_POST['output_behavior'] ){
			echo $function_name($args);
    	}
    	else {
			$function_name($args);
    	}
		die();
	}

}