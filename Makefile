# Makefile for IPG Lightbox Gallery
# Usage:
#   make zip              -> builds dist/ipg-lightbox-gallery-<version>.zip
#   make clean            -> removes dist/
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

# Files/folders to exclude from the package (add more as needed)
RSYNC_EXCLUDES := \
  --exclude=".git/" \
  --exclude=".gitignore" \
  --exclude=".github/" \
  --exclude="node_modules/" \
  --exclude="dist/" \
  --exclude=".DS_Store" \
  --exclude="*.zip" \
  --exclude="Makefile" \
  --exclude="README-dev.md"

# Required files check (adjust if you rename/add files)
REQUIRED := $(MAIN_PHP) block.json style.css frontend.js index.js

.PHONY: all zip clean check prepare help

all: zip

help:
	@echo "Targets:"
	@echo "  make zip              Build $(ZIP_PATH)"
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

zip: prepare
	@cd "$(DIST_DIR)" && zip -r "$(PLUGIN)-$(VERSION).zip" "$(PLUGIN)" >/dev/null
	@echo "Created: $(ZIP_PATH)"

clean:
	@rm -rf "$(DIST_DIR)"
	@echo "Cleaned dist/"
