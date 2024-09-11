A script was created using TypeScript and Node.js, whose purpose is to extract the raw transaction hex from a provided transaction hash (txn hash).

The function takes a parameter transactionToken, which represents the transaction hash (txn hash).
Using the getTransaction function, we retrieve an object based on the provided transaction hash.
We then assign the elements retrieved from the getTransaction function to two objects: unsignedTx and signature.
Finally, using the serializeTransaction function, we serialize the unsignedTx and signature objects into a hex string format.

1. zainincjalizowac hedera local node na podstawie genesis block
   -> stworzyć funkcję do mintowania tokenów na podstawie balance dla danego konta
   -> local node hedery powinien mieć debug

2. Zaciąganie wszystkich transakcji z bloku n
3. Dla każdej transakcji występującej w bloku sprawdzamy czy istnieje konto z którego została wykonana transakcja
   - Nie - tworzymy konto
   - Tak - ignore
4. getRawTransactionBody from erigon
5. getRawTransaction to hedera local node
6. Obsłużyć nagrodę za blok
7. Powtórzyć dla blok + 1

- Sprawdzić jak zwiększyć gaz price w local node -> Priorytet, bez tego nie ruszymy dalej.
- Zobaczyć czy występują problemy z transakcjami po zwiększeniu gazu.
- Obsłużyc zwrot podatku po wykonaniu transakcji.
- Obsłużyć wysyłkę nagrody po utworzeniu kolejnego bloku.
- Znaleźć w rpc metodę sprawdzające czy dane konto istnieje
