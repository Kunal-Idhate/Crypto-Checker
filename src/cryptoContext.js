import { createContext, useContext } from "react";

const CryptoContext = createContext();

export default CryptoContext;
export const Cryptostate = () => {
  return useContext(CryptoContext);
};
