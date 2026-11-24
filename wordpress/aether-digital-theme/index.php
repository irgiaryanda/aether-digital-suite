<?php
declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>
<main id="primary" style="max-width: 1200px; margin: 32px auto; padding: 0 24px;">
    <?php
    if (have_posts()) :
        while (have_posts()) :
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <h1 style="font-size: 28px; color: #1A1D20; margin-bottom: 16px;"><?php the_title(); ?></h1>
                <div class="entry-content">
                    <?php the_content(); ?>
                </div>
            </article>
            <?php
        endwhile;
    else :
        ?>
        <section>
            <h1>AetherDigital Headless WordPress Core</h1>
            <p>Custom Post Types, ACF schemas, WooCommerce HPOS loyalty hooks, and REST API endpoints are active under <code>/wp-json/aether/v1/</code>.</p>
        </section>
        <?php
    endif;
    ?>
</main>
<?php
get_footer();
