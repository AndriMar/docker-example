ifndef IMAGE_TAG_DEV
	IMAGE_TAG_DEV := andrimar/docker-chat.dev-builder:$(shell git rev-parse --short HEAD)
endif
ifndef IMAGE_TAG_MAIN
	IMAGE_TAG_MAIN := andrimar/docker-chat.main:$(shell git rev-parse --short HEAD)
endif

run-dev-client:
	npm run hot-dev-server
test:
	npm run test
test-once:
	npm run test-once
test-docker:
	docker run -it -v "${PWD}:/code" \
	-v "/code/node_modules" \
	${IMAGE_TAG_DEV} make test-once
#Database container
stop-db-docker:
	@docker stop chatdb
rm-db-docker:
	@docker rm chatdb
start-db-docker:
	@docker run --name chatdb -p "8081:8080" -p "28015:28015" -v "${PWD}/dbdata:/data" -d rethinkdb
#Start server
start-server-dev:
	NODE_ENV=development PORT=8082 supervisor -w server server
start-server-prod:
	NODE_ENV=production PORT=8080 npm run server-prod
#docker builder
build-dev-docker:
	docker build -t ${IMAGE_TAG_DEV} -f Dockerfile.dev .
push-dev-docker:
	docker push ${IMAGE_TAG_DEV}
build-client:
	npm run build-clients
docker-build-prod-code:
	docker run -d -v "${PWD}:/code" \
	-v "/code/node_modules" \
	${IMAGE_TAG_DEV} make build-client
	sudo chown -R ${USER}:${USER} .
docker-build-prod-image:
	docker build -t ${IMAGE_TAG_MAIN} .
docker-push-prod-image:
	docker push ${IMAGE_TAG_MAIN}
start-server-dev-docker:
	docker run -d -v "${PWD}:/code" \
	-v "/code/node_modules" \
	-p "8080:8080" ${IMAGE_TAG_DEV} \
	make run-dev-client
start-builder-docker:
	docker run -v "${PWD}:/code" \
	-v "/code/node_modules" \
	-p "8080:8080" ${IMAGE_TAG_DEV} \
	make run-dev-client
depricated-run-server:
	docker run --name "web" -e "DBHOST=chatdb" -p "8080:8080" --link chatdb  -d ${IMAGE_TAG_MAIN}
