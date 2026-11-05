<?php

declare(strict_types=1);

namespace AetherDigital\WP\PostTypes;

if (!defined('ABSPATH')) {
    // Stub
}

class CustomPostTypes
{
    public static function register(): void
    {
        if (!function_exists('register_post_type')) {
            return;
        }

        // 1. AuraBuild Architectural Quotes
        register_post_type('aura_quote', [
            'labels' => [
                'name'               => 'Architectural Quotes',
                'singular_name'      => 'Architectural Quote',
                'add_new'            => 'Add New Quote',
                'add_new_item'       => 'Add New Architectural Quote',
                'edit_item'          => 'Edit Quote',
                'new_item'           => 'New Quote',
                'view_item'          => 'View Quote',
                'search_items'       => 'Search Quotes',
                'not_found'          => 'No quotes found',
                'not_found_in_trash' => 'No quotes in trash',
            ],
            'public'       => false,
            'show_ui'      => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'rest_base'    => 'aura-quotes',
            'menu_icon'    => 'dashicons-hammer',
            'supports'     => ['title', 'custom-fields'],
            'capabilities' => [
                'edit_post'          => 'edit_post',
                'read_post'          => 'read_post',
                'delete_post'        => 'delete_post',
                'edit_posts'         => 'edit_posts',
                'edit_others_posts'  => 'edit_others_posts',
                'publish_posts'      => 'publish_posts',
                'read_private_posts' => 'read_private_posts',
            ],
        ]);

        // 2. VoltSwitch Trade Reward Catalog Items
        register_post_type('volt_reward_item', [
            'labels' => [
                'name'               => 'Trade Rewards',
                'singular_name'      => 'Trade Reward Item',
                'add_new'            => 'Add New Reward',
                'add_new_item'       => 'Add New Trade Reward Item',
                'edit_item'          => 'Edit Reward',
                'new_item'           => 'New Reward',
                'view_item'          => 'View Reward',
                'search_items'       => 'Search Rewards',
                'not_found'          => 'No rewards found',
                'not_found_in_trash' => 'No rewards in trash',
            ],
            'public'       => true,
            'show_ui'      => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'rest_base'    => 'volt-rewards',
            'menu_icon'    => 'dashicons-awards',
            'supports'     => ['title', 'editor', 'thumbnail', 'custom-fields'],
        ]);

        // 3. ChronosFlow Agency Client Projects
        register_post_type('chronos_project', [
            'labels' => [
                'name'               => 'Agency Projects',
                'singular_name'      => 'Agency Project',
                'add_new'            => 'Add New Project',
                'add_new_item'       => 'Add New Agency Project',
                'edit_item'          => 'Edit Project',
                'new_item'           => 'New Project',
                'view_item'          => 'View Project',
                'search_items'       => 'Search Projects',
                'not_found'          => 'No projects found',
                'not_found_in_trash' => 'No projects in trash',
            ],
            'public'       => false,
            'show_ui'      => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'rest_base'    => 'chronos-projects',
            'menu_icon'    => 'dashicons-clock',
            'supports'     => ['title', 'editor', 'custom-fields'],
            'map_meta_cap' => true,
            'capabilities' => [
                'edit_posts'   => 'agency_pm',
                'publish_posts'=> 'agency_pm',
            ],
        ]);
    }
}
