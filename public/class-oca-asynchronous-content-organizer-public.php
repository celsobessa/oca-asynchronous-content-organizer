<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://2aces.com.br
 * @since      1.0.0
 *
 * @package    Oca_Asynchronous_Content_Organizer
 * @subpackage Oca_Asynchronous_Content_Organizer/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Oca_Asynchronous_Content_Organizer
 * @subpackage Oca_Asynchronous_Content_Organizer/public
 * @author     2Aces Conteúdo <contato@2aces.com.br>
 */
class Oca_Asynchronous_Content_Organizer_Public {

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
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
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

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/oca-asynchronous-content-organizer-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
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

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/oca-asynchronous-content-organizer-public.js', array( 'jquery' ), $this->version, false );
		wp_localize_script( $this->plugin_name, 'ocaVars', array(
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'queue' => array(
				array(
					'privName' => 'get_the_title',
					'privArgs' => 1,
					'noPrivName' => 'get_the_title',
					'noPrivArgs' => 1,
					'outputBehavior' => 'return',
					'container' => '#main',
					'trigger' => 'window.onload',
					'timeout' => 30,
					'placing' => 'append',
				),
				array(
					'privName' => 'wp_dropdown_users',
					'privArgs' => '',
					'noPrivName' => 'get_the_title',
					'noPrivArgs' => 1,
					'outputBehavior' => 'echo',
					'container' => '#main',
					'trigger' => 'window.onload',
					'timeout' => 30,
					'placing' => 'prepend',
				),
			),
		));

	}

}
