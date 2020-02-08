#!/bin/bash


if [ ! -d 'vault/py_tm_vault_client_release_0.1.0_team5' ]; then
  echo "Copy py_tm_vault_client_release_0.1.0_team5 into vault directory"
  exit 1
fi

# Give permission to the ssh key
chmod 600 vault/py_tm_vault_client_release_0.1.0_team5/data/ichack_key
pip3 install --user -r vault/py_tm_vault_client_release_0.1.0_team5/py_tm_vault_client/requirements.txt
python3 vault/py_tm_vault_client_release_0.1.0_team5/py_tm_vault_client/vault-stonks --connect vault/py_tm_vault_client_release_0.1.0_team5/data/ichack_key


