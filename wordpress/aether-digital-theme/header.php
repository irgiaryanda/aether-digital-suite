<?php
declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header style="border-bottom: 1px solid #E9ECEF; background: #FFFFFF; padding: 16px 24px;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
        <a href="<?php echo esc_url(home_url('/')); ?>" style="font-weight: 700; font-size: 18px; color: #1A1D20; text-decoration: none;">
            <?php bloginfo('name'); ?>
        </a>
        <nav aria-label="Primary Navigation">
            <a href="<?php echo esc_url(rest_url('aether/v1/')); ?>" style="color: #0E7490; font-size: 13px; text-decoration: none;">REST API</a>
        </nav>
    </div>
</header>
