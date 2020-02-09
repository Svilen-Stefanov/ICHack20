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
	export PYTHONPATH=$(abspath vault/py_tm_vault_client_release_0.1.0_team5/py_tm_vault_client/tmvault) && \
	python3 app.py

.PHONY: vault
vault:
	./vault/vault.sh
