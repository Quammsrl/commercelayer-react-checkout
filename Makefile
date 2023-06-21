# prerequisti:
# Avere la chiave di root del server in ~/.ssh/id_rsa
# Avere installato docker e buildx
# Avere effettuato il login su dr.quammbase.it ( docker login dr.quammbase.it )

docker-build:
	docker buildx build --push --platform linux/amd64 -t dr.quammbase.it/airness-checkout:latest . ;\

deploy: docker-build
	ssh root@138.197.189.121 -C "docker stop airness-checkout || true ;docker rm airness-checkout || true;docker pull dr.quammbase.it/airness-checkout:latest"
	ssh root@138.197.189.121 -C "docker run -p 3009:3000 --name airness-checkout -d --restart unless-stopped dr.quammbase.it/airness-checkout:latest"