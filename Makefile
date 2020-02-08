.PHONY: all
all:
	echo "TODO: run all"

.PHONY: install
install:
	cd backend && pip3 install --user --requirement requirements.txt
	cd frontend && npm install -i
	echo "Installation complete!"


.PHONY: frontend
frontend:
	cd frontend && npm start

.PHONY: backend
backend:
	cd backend;\
	python3 app.py

.PHONY: vault
vault:
	./vault/vault.sh
