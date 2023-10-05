# Commerce Layer React Checkout
## Deploy
### prerequisti:
- Avere la chiave di root del server in ~/.ssh/ (copiare quella DIGITAL OCEAN - Digital Ocean Quamm - Sha  da 1password, metterla in un file es. airnes-web_rds e poi fare ssh-add --apple-use-keychain ~/.ssh/airness-web_rsa)
- Avere installato docker ( e il plugin buildx se si usa un mac con chip apple )
- Avere effettuato il login su dr.quammbase.it ( docker login dr.quammbase.it )
- Per fare deploy digitare: `make deploy`.