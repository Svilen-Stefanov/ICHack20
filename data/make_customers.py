from py_tm_vault_client.tmvault import TMVaultClient
from py_tm_vault_client.tmvault.enums import CustomerGender, CustomerTitle
import json
client = TMVaultClient('data/vault-config.json')

def make_account(first, last, gender):
    account = client.customers.create_customer(
        first_name=first,
        last_name=last,
        gender= CustomerGender.CUSTOMER_GENDER_FEMALE if gender == 'female' else CustomerGender.CUSTOMER_GENDER_MALE
    )
    return account


with open('users.csv', 'r') as f:
    lines = f.readlines()
    accounts = []
    for l in lines:
        first, last, gender = l.split()
        account = make_account(first, last, gender)
        accounts.append(account)
    accounts_json = []
    for account in accounts:
        accounts_json.append(
                {
                    "id": account.id_,
                    "first_name": account.first_name,
                    "last_name": account.last_name,
                    "gender": "female" if account.gender == CustomerGender.CUSTOMER_GENDER_FEMALE else "male"
                }
        )
    print(json.dumps(accounts_json))

