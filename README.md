1. Napisać funkcję któa przyjmuje
- nr bloku / hash
- Dane które zostaną podane w funkcji a funkcja ma wykorzystać geth do pobrania serializowany kod trnsakcji.
- Jak to zrobić jest w linku
- https://stackoverflow.com/questions/74829121/get-raw-transaction-from-transaction-id-using-web3js-or-something-similar-in-nod/74833181#74833181



A script was created using TypeScript and Node.js, whose purpose is to extract the raw transaction hex from a provided transaction hash (txn hash).

The function takes a parameter transactionToken, which represents the transaction hash (txn hash).
Using the getTransaction function, we retrieve an object based on the provided transaction hash.
We then assign the elements retrieved from the getTransaction function to two objects: unsignedTx and signature.
Finally, using the serializeTransaction function, we serialize the unsignedTx and signature objects into a hex string format.

0. zainincjalizowac hedera local node na podstawie genesis block 
-> stworzyć funkcję do mintowania tokenów na podstawie balance dla danego konta
-> local node hedery powinien mieć debug 



1. zaciągamy wsystkie transakcje z blocku n
2. dla każdej transakcji sprawdzamy czy istnieje takie konto
-> jeśli nie -> tworzymy konto
-> jeśli tak -> ignore
3. getRawTransactionBody from erigon
4. getRawTransaction to hedera local node
5. Obsłużyć nagrodę za blok
6. Powtórzyć dla blok + 1
