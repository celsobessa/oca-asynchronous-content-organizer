<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://2aces.com.br
 * @since      0.1.0
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
	 * @since    0.1.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    0.1.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * An array with registered functions for processing
	 *
	 * @since 		0.2.0
	 * @access 		private
	 * @var 		array			$queue   holds the queue of registered functions for OCA
	 */
	private $oca_queue;

	/**
	 * An array with registered functions for processing, in a javascript object friendly notation
	 *
	 * @since 		0.2.0
	 * @access 		private
	 * @var 		array			$queue   holds the queue of registered functions for OCA
	 */
	private $job_queue;

	/**
	 * An array of hashes of registered functions for processing
	 *
	 * @since 		0.2.0
	 * @access 		private
	 * @var 		array			$oca_hashes   holds the hashes of registered functions for OCA
	 */
	private $oca_hashes;

	/**
	 * An instance of OCA Queue Manager
	 *
	 * @since 		0.2.0
	 * @access 		public
	 * @var 		object			$oca_manager   Holds an instance of OCA Queue Manager
	 */
	public $oca_manager;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    0.2.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;
		$this->job_queue = [];

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    0.1.0
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
	 * Register the JavaScript for the public-facing side of the site and, conditionally, an ocaVars object
	 * 
	 * @since    0.1.0
	 * @since    0.2.0	conditional loading based on queue contents
	 * @since    0.2.0	enqueue ocaVars object using localize script
	 * uses $this->parse_job_queue()
	 * uses $oca_manager->get_queue()
	 * uses $oca_manager->get_hashes()
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
		global $oca_manager;
		$this->oca_queue = $oca_manager->get_queue();
		$this->oca_hashes = $oca_manager->get_hashes();
		//TODO remove this: echo 'debug enqueue scripts invoked oca_queue equals to ' ;	
		if ( !empty( $this->oca_queue ) ){
			//TODO remove this: echo 'debug enqueue';
			wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/oca-asynchronous-content-organizer-public.js', array( 'jquery' ), $this->version, TRUE );
			wp_localize_script( $this->plugin_name, 'ocaVars', array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'queue' => $this->parse_job_queue(),
			));
		}

	}
	

	/**
	 * Populate job_queue with content from oca_queue
	 *
	 * @since	0.2.0
	 * @access	private
	 * @return array $this->job_queue an array with queued functions
	 */
	private function parse_job_queue() {
		$this->oca_queue;
		if ( empty( $this->oca_queue ) ){
			return 'error job queue';
		}
		foreach ($this->oca_queue as $job){
			$this->job_queue[] = array(
				'functionName'			=> $job['function_name'],
				'functionArgs'			=> $job['function_args'],
				'functionOutput'		=> $job['function_output'],
				'noprivFunctionName'	=> $job['nopriv_function_name'],
				'noprivFunctionArgs'	=> $job['nopriv_function_args'],
				'noprivFunctionOutput'	=> $job['nopriv_function_output'],
				'container'				=> $job['container'],
				'trigger'				=> $job['trigger'],
				'timeout'				=> $job['timeout'],
				'placement'				=> $job['placement'],
			);
		}
		
		return $this->job_queue;
	}

}
