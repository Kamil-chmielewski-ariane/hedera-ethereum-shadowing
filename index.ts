import { fetchAndSerializeTransaction } from './fetchAndSerializeTransaction';
import {getAllFrontierData} from './getAllFrontierData';

const txnHash = '0xd825a42771467afad0e22186840a3c64397ac8d60b78e3cf203b14b252b5f272';

fetchAndSerializeTransaction(txnHash);

getAllFrontierData();

