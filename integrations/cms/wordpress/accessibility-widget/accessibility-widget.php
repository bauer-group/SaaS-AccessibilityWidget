<?php
/**
 * Plugin Name:       BFSG Accessibility Widget
 * Description:       BAUER GROUP Accessibility Widget — WCAG 2.2 AA / BFSG-konformes Hilfsmittel. Loader ~4 KB gzip.
 * Version:           1.0.0-alpha.1
 * Requires at least: 6.5
 * Requires PHP:      8.1
 * Author:            BAUER GROUP
 * Author URI:        https://www.bauer-group.com
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       accessibility-widget
 * Update URI:        https://github.com/bauer-group/SaaS-AccessibilityWidget
 */

if (!defined('ABSPATH')) {
    exit;
}

define('BFSG_WIDGET_VERSION', '1.0.0-alpha.1');
define('BFSG_WIDGET_SLUG', 'accessibility-widget');

/** Enqueue loader + CSS on every front-end page. */
function accessibility_widget_enqueue(): void {
    $base_url = plugins_url('assets/', __FILE__);
    $opts     = wp_parse_args(get_option('accessibility_widget_options', []), [
        'position'       => 'bottom-right',
        'locale'         => 'auto',
        'primary_color'  => '#0058a3',
        'core_integrity' => '',
        'css_integrity'  => '',
        'loader_integrity' => '',
    ]);

    $config = [
        'corePath'     => esc_url($base_url . 'accessibility-widget-core.min.js'),
        'cssPath'      => esc_url($base_url . 'accessibility-widget.min.css'),
        'position'     => sanitize_key($opts['position']),
        'locale'       => sanitize_key($opts['locale']),
        'primaryColor' => sanitize_hex_color($opts['primary_color']) ?: '#0058a3',
    ];
    if (!empty($opts['core_integrity'])) {
        $config['coreIntegrity'] = sanitize_text_field($opts['core_integrity']);
    }

    wp_register_script('accessibility-widget-inline-config', '', [], BFSG_WIDGET_VERSION, true);
    wp_enqueue_script('accessibility-widget-inline-config');
    wp_add_inline_script(
        'accessibility-widget-inline-config',
        'window.AccessibilityWidgetConfig = ' . wp_json_encode($config) . ';',
        'before'
    );

    wp_enqueue_script(
        'accessibility-widget-loader',
        $base_url . 'accessibility-widget-loader.min.js',
        [],
        BFSG_WIDGET_VERSION,
        ['strategy' => 'defer', 'in_footer' => true]
    );
}
add_action('wp_enqueue_scripts', 'accessibility_widget_enqueue');

/** Add integrity attributes if configured. */
function accessibility_widget_script_loader_tag(string $tag, string $handle, string $src): string {
    if ($handle !== 'accessibility-widget-loader') {
        return $tag;
    }
    $opts = get_option('accessibility_widget_options', []);
    $sri  = $opts['loader_integrity'] ?? '';
    if ($sri !== '') {
        $tag = str_replace('<script ', '<script integrity="' . esc_attr($sri) . '" crossorigin="anonymous" ', $tag);
    }
    return $tag;
}
add_filter('script_loader_tag', 'accessibility_widget_script_loader_tag', 10, 3);

/** Settings page (Settings → BFSG Widget) */
function accessibility_widget_register_settings(): void {
    register_setting(
        'accessibility_widget',
        'accessibility_widget_options',
        [
            'type' => 'array',
            'sanitize_callback' => 'accessibility_widget_sanitize',
            'default' => [],
        ]
    );
}
add_action('admin_init', 'accessibility_widget_register_settings');

function accessibility_widget_sanitize(array $input): array {
    return [
        'position'         => in_array($input['position'] ?? '', ['bottom-right', 'bottom-left', 'top-right', 'top-left'], true) ? $input['position'] : 'bottom-right',
        'locale'           => sanitize_key($input['locale'] ?? 'auto'),
        'primary_color'    => sanitize_hex_color($input['primary_color'] ?? '#0058a3') ?: '#0058a3',
        'loader_integrity' => sanitize_text_field($input['loader_integrity'] ?? ''),
        'core_integrity'   => sanitize_text_field($input['core_integrity'] ?? ''),
        'css_integrity'    => sanitize_text_field($input['css_integrity'] ?? ''),
    ];
}

function accessibility_widget_settings_page(): void {
    add_options_page('BFSG Widget', 'BFSG Widget', 'manage_options', 'accessibility-widget', 'accessibility_widget_render_settings');
}
add_action('admin_menu', 'accessibility_widget_settings_page');

function accessibility_widget_render_settings(): void {
    if (!current_user_can('manage_options')) {
        return;
    }
    $opts = wp_parse_args(get_option('accessibility_widget_options', []), [
        'position' => 'bottom-right',
        'locale' => 'auto',
        'primary_color' => '#0058a3',
    ]);
    ?>
    <div class="wrap">
      <h1>BFSG Accessibility Widget</h1>
      <p>Konfiguration des lazy-loading Widgets. Details: <a href="https://github.com/bauer-group/SaaS-AccessibilityWidget" target="_blank" rel="noopener">GitHub</a>.</p>
      <form method="post" action="options.php">
        <?php settings_fields('accessibility_widget'); ?>
        <table class="form-table" role="presentation">
          <tr>
            <th><label for="bfsg_position">Position</label></th>
            <td>
              <select name="accessibility_widget_options[position]" id="bfsg_position">
                <?php foreach (['bottom-right', 'bottom-left', 'top-right', 'top-left'] as $p): ?>
                  <option value="<?= esc_attr($p) ?>" <?= selected($opts['position'], $p, false) ?>><?= esc_html($p) ?></option>
                <?php endforeach; ?>
              </select>
            </td>
          </tr>
          <tr>
            <th><label for="bfsg_locale">Locale</label></th>
            <td>
              <select name="accessibility_widget_options[locale]" id="bfsg_locale">
                <?php foreach (['auto', 'de', 'en', 'fr', 'es', 'it', 'pl', 'tr', 'ar'] as $l): ?>
                  <option value="<?= esc_attr($l) ?>" <?= selected($opts['locale'], $l, false) ?>><?= esc_html($l) ?></option>
                <?php endforeach; ?>
              </select>
            </td>
          </tr>
          <tr>
            <th><label for="bfsg_color">Markenfarbe</label></th>
            <td>
              <input type="text" id="bfsg_color" name="accessibility_widget_options[primary_color]" value="<?= esc_attr($opts['primary_color']) ?>" class="regular-text" />
              <p class="description">Hex-Farbe des FAB-Buttons (z. B. #0058a3).</p>
            </td>
          </tr>
          <tr>
            <th><label for="bfsg_sri_loader">SRI Loader (optional)</label></th>
            <td><input type="text" id="bfsg_sri_loader" name="accessibility_widget_options[loader_integrity]" value="<?= esc_attr($opts['loader_integrity'] ?? '') ?>" class="large-text" placeholder="sha384-..." /></td>
          </tr>
        </table>
        <?php submit_button(); ?>
      </form>
    </div>
    <?php
}
