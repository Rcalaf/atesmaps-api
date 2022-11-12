.ONESHELL:
SHELL:=/bin/bash
DOCKER_IMAGE:=atesmaps-api
CURRENT_RELEASE:=$(shell git describe --tags `git rev-list --tags --max-count=1`)
RELEASE_FIX_NUMBER:=$(shell echo ${CURRENT_RELEASE} | cut -d "." -f3)
RELEASE_MINOR_NUMBER:=$(shell echo ${CURRENT_RELEASE} | cut -d "." -f2)
RELEASE_MAJOR_NUMBER:=$(shell echo ${CURRENT_RELEASE} | cut -d "." -f1)
NEW_RELEASE_FIX_NUMBER:=$(shell expr $(RELEASE_FIX_NUMBER) + 1)
NEW_RELEASE:=$(RELEASE_MAJOR_NUMBER).$(RELEASE_MINOR_NUMBER).$(NEW_RELEASE_FIX_NUMBER)


.PHONY: run-app
run-app:
	@ echo "Starting Atesmaps API..."
	@ echo "Version deployed: ${CURRENT_RELEASE}"
	docker run -d --restart=on-failure -p 9500:3500 --name atesmaps-api ${DOCKER_IMAGE}:${CURRENT_RELEASE}

.PHONY: build
build:
	$(shell git pull)
	@ echo "Building new release for Atesmaps API..."
	@ echo "Previous release: ${CURRENT_RELEASE}"
	@ echo "New release number is: ${NEW_RELEASE}"
	docker build --tag ${DOCKER_IMAGE}:${NEW_RELEASE} --file etc/docker/Dockerfile .
	$(shell git tag ${NEW_RELEASE})
	$(shell git push origin ${NEW_RELEASE})
