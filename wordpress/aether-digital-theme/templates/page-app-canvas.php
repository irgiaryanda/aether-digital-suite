<?php
/**
 * Template Name: Aether Full-Bleed App Canvas
 *
 * @package AetherDigitalTheme
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>
<main id="aether-canvas" style="width: 100%; min-height: calc(100vh - 130px); padding: 0; margin: 0;">
    <?php
    while (have_posts()) :
        the_post();
        the_content();
    endwhile;
    ?>
</main>
<?php
get_footer();
