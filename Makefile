# Makefile for IPG Lightbox Gallery
# Usage:
#   make test            -> run PHP + JS tests
#   make test-php        -> run PHPUnit only
#   make test-js         -> run Jest only
#   make zip             -> build dist/ipg-lightbox-gallery-<version>.zip (runs tests first)
#   make zip SKIP_TESTS=1  -> build zip without tests
#   make clean           -> remove dist/
#   make zip VERSION=1.0.4  (override version manually)

PLUGIN := ipg-lightbox-gallery
MAIN_PHP := $(PLUGIN).php

# Parse version from plugin header (falls back to 'dev')
VERSION ?= $(shell sed -nE 's/^[[:space:]]*\*+[[:space:]]*Version:[[:space:]]*([0-9.]+).*/\1/p' $(MAIN_PHP) | head -n1)
ifeq ($(strip $(VERSION)),)
  VERSION := dev
endif

DIST_DIR := dist
BUILD_DIR := $(DIST_DIR)/$(PLUGIN)
ZIP_PATH := $(DIST_DIR)/$(PLUGIN)-$(VERSION).zip

COMPOSER := $(shell command -v composer 2>/dev/null)
NPM := $(shell command -v npm 2>/dev/null)
PHPUNIT := vendor/bin/phpunit
JEST := node_modules/.bin/jest

# Files/folders to exclude from the package (add more as needed)
RSYNC_EXCLUDES := \
  --exclude=".git/" \
  --exclude=".github/" \
  --exclude=".vscode/" \
  --exclude=".idea/" \
  --exclude="node_modules/" \
  --exclude="dist/" \
  --exclude=".DS_Store" \
  --exclude="*.zip" \
  --exclude="Makefile" \
  --exclude="README-TESTS.md" \
	--exclude="README.md" \
  --exclude="phpunit.xml" \
  --exclude="phpunit.xml.dist" \
  --exclude="composer.lock" \
  --exclude="composer.json" \
  --exclude="package-lock.json" \
  --exclude="package.json" \
  --exclude="jest.config.*" \
  --exclude="coverage/" \
  --exclude=".nyc_output/" \
  --exclude="__tests__/" \
  --exclude="tests/" \
  --exclude="**/*.test.js" \
  --exclude="**/*.spec.js" \
	--exclude="vendor" \
	--exclude=".gitignore" \
	--exclude="scripts"

# Required files check (adjust if you rename/add files)
REQUIRED := $(MAIN_PHP) block.json style.css frontend.js index.js

.PHONY: all help zip clean check prepare test test-php test-js

all: zip

help:
	@echo "Targets:"
	@echo "  make test             Run PHP + JS tests"
	@echo "  make test-php         Run PHPUnit tests"
	@echo "  make test-js          Run Jest tests"
	@echo "  make zip              Build $(ZIP_PATH) (runs tests first)"
	@echo "  make zip SKIP_TESTS=1 Build zip without tests"
	@echo "  make clean            Remove dist/"
	@echo "  make zip VERSION=X.Y.Z  Build with explicit version"
	@echo ""
	@echo "Detected version: $(VERSION)"

check:
	@missing=0; \
	for f in $(REQUIRED); do \
	  if [ ! -f $$f ]; then echo "Missing: $$f"; missing=1; fi; \
	done; \
	if [ $$missing -ne 0 ]; then \
	  echo "Error: required files missing. Adjust REQUIRED in Makefile if needed."; \
	  exit 1; \
	fi

prepare: clean check
	@mkdir -p "$(BUILD_DIR)"
	@rsync -a $(RSYNC_EXCLUDES) ./ "$(BUILD_DIR)"/
	@echo "Prepared build directory: $(BUILD_DIR)"
	@# Prefer minified assets in the package
	@cd "$(BUILD_DIR)" && [ -f index.min.js ] && rm -f index.js || true
	@cd "$(BUILD_DIR)" && [ -f frontend.min.js ] && rm -f frontend.js || true
	@cd "$(BUILD_DIR)" && [ -f style.min.css ] && rm -f style.css || true


test: test-php test-js
	@echo "✅ All tests passed"

test-php:
	@if [ -z "$(COMPOSER)" ]; then echo "❌ composer not found. Install Composer to run PHP tests."; exit 1; fi
	@$(COMPOSER) install --no-interaction --no-progress --prefer-dist
	@if [ ! -x "$(PHPUNIT)" ]; then echo "❌ phpunit not found after composer install."; exit 1; fi
	@$(PHPUNIT) --colors=always

test-js:
	@if [ -z "$(NPM)" ]; then echo "❌ npm not found. Install Node.js/npm to run JS tests."; exit 1; fi
	@if [ -f package-lock.json ]; then $(NPM) ci --no-fund --no-audit; else $(NPM) install --no-fund --no-audit; fi
	@$(NPM) test --silent -- --color

# ---- Build zip (tests run by default) ----
ifeq ($(SKIP_TESTS),1)
zip: prepare
else
zip: test prepare
endif
	@cd "$(DIST_DIR)" && zip -r "$(PLUGIN)-$(VERSION).zip" "$(PLUGIN)" >/dev/null
	@echo "Created: $(ZIP_PATH)"

clean:
	@rm -rf "$(DIST_DIR)"
	@echo "Cleaned dist/"
