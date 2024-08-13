SHELL := /bin/bash


.PHONY: help
help:
	@echo "Available targets:"
	@echo "  e2e-install-browsers  : Install browsers for End-to-End tests"
	@echo "  e2e-local         : Run End-to-End tests locally (headless)"
	@echo "  e2e-start-server  : setup server for e2e tests (tears down db etc.)"


.PHONY: e2e-install-browsers
e2e-install-browsers:
	pnpm exec playwright install --with-deps chromium

.PHONY: e2e-local
e2e-local:
	./node_modules/.bin/playwright test --config=playwright-base.config.ts ${tests}

.PHONY: e2e-staging
e2e-staging:
	./node_modules/.bin/playwright test --config=playwright-stg.config.ts ${tests}
