<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'BFSG Accessibility Widget',
    'description' => 'Lazy-loading Accessibility-Widget (BFSG/WCAG 2.2 AA) von BAUER GROUP.',
    'category' => 'fe',
    'author' => 'BAUER GROUP',
    'author_email' => 'info@de.bauer-group.com',
    'state' => 'alpha',
    'uploadfolder' => false,
    'createDirs' => '',
    'clearCacheOnLoad' => true,
    'version' => '1.0.0',
    'constraints' => [
        'depends' => [
            'typo3' => '13.0.0-13.99.99',
            'php' => '8.2.0-8.99.99',
        ],
    ],
];
