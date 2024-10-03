COMPOSE_FILE_PATH = ./docker-compose.yml
PROJECT_NAME = transcendence

# Default target
all: up

# Build the docker images and the containers and start them
up:
	@docker compose -f ${COMPOSE_FILE_PATH} -p ${PROJECT_NAME} up -d --build

# Stop the containers and remove them
down:
	@docker compose -f ${COMPOSE_FILE_PATH} -p ${PROJECT_NAME} down --remove-orphans

# Clean all Docker resources and the data folder
clean: down hard_clean
	docker network prune -f
	docker system prune -f -a
	docker volume prune -f
	rm -rf data

re: clean all

re_soft: down all 

# Clean all Docker resources
# WARNING: This will remove all containers, images, volumes and networks from your system
hard_clean:
	@echo "Cleaning up Docker resources..."
	@echo "Stopping containers..."
	@docker stop $$(docker ps -qa) 2>/dev/null || true
	@echo "Removing containers..."
	@docker rm $$(docker ps -qa) 2>/dev/null || true
	@echo "Removing images..."
	@docker rmi -f $$(docker images -qa) 2>/dev/null || true
	@echo "Removing volumes..."
	@docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	@echo "Removing networks..."
	@docker network rm $$(docker network ls -q) 2>/dev/null || true
	@echo "\033[32mAll Docker resources have been cleaned.\033[0m"


.PHONY: all up down clean re re_soft hard_clean
