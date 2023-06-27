# prerequisti:
# Avere la chiave di root del server in ~/.ssh/
# Avere installato docker ( e il plugin buildx se si usa un mac con chip apple )
# Avere effettuato il login su dr.quammbase.it ( docker login dr.quammbase.it )

docker-build-europe:
	docker buildx build --push --platform linux/amd64 --no-cache -t dr.quammbase.it/airness-checkout:latest . ;\

docker-build-france:
	docker buildx build --push --platform linux/amd64 --no-cache -f Dockerfile.france -t dr.quammbase.it/airness-checkout-france:latest . ;\

deploy-europe: docker-build-europe
	ssh root@138.197.189.121 -C "docker stop airness-checkout || true ;docker rm airness-checkout || true;docker pull dr.quammbase.it/airness-checkout:latest" ;\
	ssh root@138.197.189.121 -C "docker run -p 3009:3000 --name airness-checkout -d --restart unless-stopped dr.quammbase.it/airness-checkout:latest"

deploy-france: docker-build-france
	ssh root@138.197.189.121 -C "docker stop airness-checkout-france || true ;docker rm airness-checkout-france || true;docker pull dr.quammbase.it/airness-checkout-france:latest";\
	ssh root@138.197.189.121 -C "docker run -p 3010:3000 --name airness-checkout-france -d --restart unless-stopped dr.quammbase.it/airness-checkout-france:latest"

deploy: deploy-europe deploy-france

dev:
	docker buildx build  --target dev-stage --platform linux/amd64 -t airness-checkout-dev:latest . ;\
	docker run -it -v .:/app -p 3000:3000 --name airness-checkout-dev --rm airness-checkout-dev:latest npm run dev:3000