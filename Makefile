.DEFAULT_GOAL := help

# ---- Config ---------------------------------------------------------------
BACKEND_DIR   := backend
FRONTEND_DIR  := frontend
BACKEND_PORT  ?= 8000
FRONTEND_PORT ?= 3000

RUN_DIR       := .run
BACKEND_PID   := $(RUN_DIR)/backend.pid
FRONTEND_PID  := $(RUN_DIR)/frontend.pid
BACKEND_LOG   := $(RUN_DIR)/backend.log
FRONTEND_LOG  := $(RUN_DIR)/frontend.log

API_BASE      := http://127.0.0.1:$(BACKEND_PORT)
FRONTEND_URL  := http://127.0.0.1:$(FRONTEND_PORT)

SHAPES        := tenshi aria nova sage echo orion zara

.PHONY: help install install-backend install-frontend \
        start start-backend start-frontend \
        stop stop-backend stop-frontend \
        restart status logs health \
        test test-backend test-frontend \
        build typecheck seed clean

help:
	@printf "ShapeStats — common tasks\n\n"
	@printf "  make install         install backend (venv) + frontend (npm) deps\n"
	@printf "  make start           start backend (uvicorn) + frontend (next dev) in background\n"
	@printf "  make stop            stop both servers\n"
	@printf "  make restart         stop then start\n"
	@printf "  make status          show whether each server is running\n"
	@printf "  make logs            tail backend + frontend logs (Ctrl-C to exit)\n"
	@printf "  make health          check liveness of both servers and /api/rooms shape\n"
	@printf "  make test            run pytest + vitest suites\n"
	@printf "  make build           production build of the frontend\n"
	@printf "  make typecheck       tsc --noEmit\n"
	@printf "  make seed            refresh cached shape profiles from shapes.inc\n"
	@printf "  make clean           remove caches, build artifacts, pidfiles\n\n"
	@printf "Override ports: make start BACKEND_PORT=8080 FRONTEND_PORT=3001\n"

# ---- Install --------------------------------------------------------------
install: install-backend install-frontend

install-backend:
	@if [ ! -d $(BACKEND_DIR)/.venv ]; then \
		echo "creating venv at $(BACKEND_DIR)/.venv"; \
		python3 -m venv $(BACKEND_DIR)/.venv; \
	fi
	@$(BACKEND_DIR)/.venv/bin/pip install -q -r $(BACKEND_DIR)/requirements.txt
	@echo "backend deps installed"

install-frontend:
	@cd $(FRONTEND_DIR) && npm install --silent --no-audit --no-fund
	@echo "frontend deps installed"

# ---- Lifecycle ------------------------------------------------------------
$(RUN_DIR):
	@mkdir -p $(RUN_DIR)

start: start-backend start-frontend
	@echo ""
	@echo "  backend  → $(API_BASE)"
	@echo "  frontend → $(FRONTEND_URL)"
	@echo "  logs     → make logs    |    stop → make stop"

start-backend: $(RUN_DIR)
	@if [ -f $(BACKEND_PID) ] && kill -0 $$(cat $(BACKEND_PID)) 2>/dev/null; then \
		echo "backend already running (pid $$(cat $(BACKEND_PID)))"; \
	elif [ ! -x $(BACKEND_DIR)/.venv/bin/uvicorn ]; then \
		echo "backend venv missing — run: make install-backend"; exit 1; \
	else \
		echo "starting backend on :$(BACKEND_PORT)..."; \
		( cd $(BACKEND_DIR) && exec .venv/bin/uvicorn app.main:app \
			--host 127.0.0.1 --port $(BACKEND_PORT) --log-level info ) \
			> $(BACKEND_LOG) 2>&1 & \
		echo $$! > $(BACKEND_PID); \
		echo "  pid $$(cat $(BACKEND_PID))    log: $(BACKEND_LOG)"; \
	fi

start-frontend: $(RUN_DIR)
	@if [ -f $(FRONTEND_PID) ] && kill -0 $$(cat $(FRONTEND_PID)) 2>/dev/null; then \
		echo "frontend already running (pid $$(cat $(FRONTEND_PID)))"; \
	elif [ ! -x $(FRONTEND_DIR)/node_modules/.bin/next ]; then \
		echo "frontend node_modules missing — run: make install-frontend"; exit 1; \
	else \
		echo "starting frontend on :$(FRONTEND_PORT)..."; \
		( cd $(FRONTEND_DIR) && NEXT_PUBLIC_API_BASE_URL=$(API_BASE) \
			exec ./node_modules/.bin/next dev -p $(FRONTEND_PORT) ) \
			> $(FRONTEND_LOG) 2>&1 & \
		echo $$! > $(FRONTEND_PID); \
		echo "  pid $$(cat $(FRONTEND_PID))    log: $(FRONTEND_LOG)"; \
	fi

stop: stop-frontend stop-backend

stop-backend:
	@if [ -f $(BACKEND_PID) ]; then \
		pid=$$(cat $(BACKEND_PID)); \
		if kill -0 $$pid 2>/dev/null; then kill $$pid 2>/dev/null && echo "backend stopped (pid $$pid)"; \
		else echo "backend pidfile stale, cleaning up"; fi; \
		rm -f $(BACKEND_PID); \
	else echo "backend not running"; fi
	@pkill -f "uvicorn app.main:app --host 127.0.0.1 --port $(BACKEND_PORT)" 2>/dev/null || true

stop-frontend:
	@if [ -f $(FRONTEND_PID) ]; then \
		pid=$$(cat $(FRONTEND_PID)); \
		if kill -0 $$pid 2>/dev/null; then kill $$pid 2>/dev/null && echo "frontend stopped (pid $$pid)"; \
		else echo "frontend pidfile stale, cleaning up"; fi; \
		rm -f $(FRONTEND_PID); \
	else echo "frontend not running"; fi
	@pkill -f "next dev -p $(FRONTEND_PORT)" 2>/dev/null || true

restart: stop start

status:
	@if [ -f $(BACKEND_PID) ] && kill -0 $$(cat $(BACKEND_PID)) 2>/dev/null; then \
		echo "backend  UP   (pid $$(cat $(BACKEND_PID)))   $(API_BASE)"; \
	else echo "backend  DOWN"; fi
	@if [ -f $(FRONTEND_PID) ] && kill -0 $$(cat $(FRONTEND_PID)) 2>/dev/null; then \
		echo "frontend UP   (pid $$(cat $(FRONTEND_PID)))   $(FRONTEND_URL)"; \
	else echo "frontend DOWN"; fi

logs:
	@mkdir -p $(RUN_DIR)
	@touch $(BACKEND_LOG) $(FRONTEND_LOG)
	@tail -n 40 -f $(BACKEND_LOG) $(FRONTEND_LOG)

# ---- Health ---------------------------------------------------------------
health:
	@ok=1; \
	printf "%-12s %-44s ... " "backend" "$(API_BASE)/api/health"; \
	if curl -sf -m 3 $(API_BASE)/api/health > /dev/null; then echo "OK"; else echo "DOWN"; ok=0; fi; \
	printf "%-12s %-44s ... " "frontend" "$(FRONTEND_URL)/"; \
	if curl -sf -m 5 $(FRONTEND_URL)/ > /dev/null; then echo "OK"; else echo "DOWN"; ok=0; fi; \
	printf "%-12s %-44s ... " "rooms" "$(API_BASE)/api/rooms"; \
	count=$$(curl -sf -m 3 $(API_BASE)/api/rooms 2>/dev/null | \
		python3 -c "import sys, json; print(len(json.load(sys.stdin).get('rooms', [])))" 2>/dev/null); \
	if [ -n "$$count" ] && [ "$$count" -gt 0 ]; then echo "$$count rooms"; else echo "FAIL"; ok=0; fi; \
	exit $$(( 1 - ok ))

# ---- Tests / build --------------------------------------------------------
test: test-backend test-frontend

test-backend:
	@cd $(BACKEND_DIR) && .venv/bin/pytest -q

test-frontend:
	@cd $(FRONTEND_DIR) && ./node_modules/.bin/vitest run

build:
	@cd $(FRONTEND_DIR) && ./node_modules/.bin/next build

typecheck:
	@cd $(FRONTEND_DIR) && ./node_modules/.bin/tsc --noEmit

# ---- Data refresh ---------------------------------------------------------
seed:
	@mkdir -p $(BACKEND_DIR)/data/seed_shapes
	@for name in $(SHAPES); do \
		printf "  %-10s " "$$name"; \
		if curl -sf -m 8 "https://api.shapes.inc/shapes/public/$$name" \
			-o $(BACKEND_DIR)/data/seed_shapes/$$name.json; then \
			echo "OK"; \
		else echo "FAILED"; fi; \
	done

# ---- Cleanup --------------------------------------------------------------
clean:
	@rm -rf $(FRONTEND_DIR)/.next $(FRONTEND_DIR)/tsconfig.tsbuildinfo
	@find $(BACKEND_DIR) -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	@find $(BACKEND_DIR) -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	@rm -rf $(RUN_DIR)
	@echo "cleaned"
