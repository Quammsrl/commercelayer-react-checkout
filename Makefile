dev:
	docker buildx build  --target dev-stage --platform linux/amd64 -t airness-checkout-dev:latest . ;\
	docker run -it -v .:/app -p 3000:3000 --name airness-checkout-dev --rm airness-checkout-dev:latest npm run dev:3000