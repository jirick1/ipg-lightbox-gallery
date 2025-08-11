# IPG Gallery Test Kit

This adds **PHPUnit** tests for the PHP renderer and **Jest + JSDOM** tests for the front-end JS.

## Layout (drop into your plugin root)
- composer.json, phpunit.xml.dist
- tests/php/bootstrap.php, tests/php/test-render.php
- package.json, tests/js/frontend.test.js

## Run PHP tests
```bash
composer install
composer test
```

## Run JS tests
```bash
npm install
npm test
```

Notes:
- The PHP tests include minimal WordPress function stubs so you can run them without the full WP test suite.
- For full integration/E2E, consider `@wordpress/env` + Playwright later.
