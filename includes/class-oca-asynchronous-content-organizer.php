<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://2aces.com.br
 * @since      0.1.0
 *
 * @package    Oca_Asynchronous_Content_Organizer
 * @subpackage Oca_Asynchronous_Content_Organizer/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      0.1.0
 * @package    Oca_Asynchronous_Content_Organizer/includes
 * @author     2Aces Conteúdo <contato@2aces.com.br>
 */
class Oca_Asynchronous_Content_Organizer {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    0.1.0
	 * @access   protected
	 * @var      Oca_Asynchronous_Content_Organizer_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    0.1.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    0.1.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    0.1.0
	 * @since    0.2.0	Added define_fetcher_hooks.
	 */
	public function __construct() {

		$this->plugin_name = 'oca-asynchronous-content-organizer';
		$this->version = '0.5.2';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
		$this->define_fetcher_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Oca_Asynchronous_Content_Organizer_Loader. Orchestrates the hooks of the plugin.
	 * - Oca_Asynchronous_Content_Organizer_i18n. Defines internationalization functionality.
	 * - Oca_Asynchronous_Content_Organizer_Admin. Defines all hooks for the admin area.
	 * - Oca_Asynchronous_Content_Organizer_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    0.1.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-oca-asynchronous-content-organizer-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-oca-asynchronous-content-organizer-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-oca-asynchronous-content-organizer-admin.php';

		/**
		 * The class responsible for defining all ajax content fetcher functionality
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-oca-asynchronous-content-organizer-content-fetcher.php';

		/**
		 * The class responsible for defining all ajax content fetcher functionality
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-oca-asynchronous-content-organizer-queue-manager.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-oca-asynchronous-content-organizer-public.php';

		$this->loader = new Oca_Asynchronous_Content_Organizer_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Oca_Asynchronous_Content_Organizer_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    0.1.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Oca_Asynchronous_Content_Organizer_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    0.1.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Oca_Asynchronous_Content_Organizer_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    0.1.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Oca_Asynchronous_Content_Organizer_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );

	}

	/**
	 * Register all of the hooks related to the ajax content fetcher functionality
	 * of the plugin.
	 *
	 * @since    0.2.0
	 * @access   private
	 */
	private function define_fetcher_hooks() {

		$plugin_fetcher = new Oca_Asynchronous_Content_Organizer_Content_Fetcher( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_ajax_nopriv_oca_fetcher', $plugin_fetcher, 'nopriv_fetcher' );
		$this->loader->add_action( 'wp_ajax_oca_fetcher', $plugin_fetcher, 'fetcher' );
		$this->loader->add_action( 'wp_ajax_is_user_logged_in', $plugin_fetcher, 'ajax_check_user_logged_in' );
		$this->loader->add_action( 'wp_ajax_nopriv_is_user_logged_in', $plugin_fetcher, 'ajax_check_user_logged_in' );

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    0.1.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     0.1.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     0.1.0
	 * @return    Oca_Asynchronous_Content_Organizer_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     0.1.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Retrieve a Queue Manager instance.
	 *
	 * @since     0.2.0
	 * @return    object    a Queue Manager instance.
	 */
	public function get_manager(){
		return new Oca_Asynchronous_Content_Organizer_Queue_Manager( $this->get_plugin_name(), $this->get_version() );
	}

}
