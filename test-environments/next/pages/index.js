import styles from "../styles/Home.module.css";
import { getPermit, FhenixClient } from "fhenixjs";
// use BrowserProvider if you need a signer
import { JsonRpcProvider } from "ethers";

import { useEffect, useState } from "react";

export default function Home() {

  const [permit, setPermit] = useState(null);
  const [provider, setProvider] = useState(null);
  const [encrypted, setEncrypted] = useState(null);

  useEffect(() => {
    //setProvider(new BrowserProvider(window.ethereum))
    setProvider(new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL));
  }, []);

  const getPermitHandle = async () => {
    const contractAddress = "0xF36B59Ce442871dCAe1DD191916622aaCf69A3cE";

    if (!provider) {
      return;
    }

    const permit = await getPermit(contractAddress, provider);

    //console.log(permit);
    setPermit(permit);
  };

  const encryptTest = async () => {
    const resp = new FhenixClient({provider});

    let x = await resp.encrypt_uint8(3);

    setEncrypted(`0x${buf2hex(x.data).slice(0, 32)}...`);
  }


  function buf2hex(buffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
  }

  return (
    <div className={styles.container}>
      <button className={"getencrypt"} onClick={encryptTest} id="getencrypt">Encrypt</button>
      {encrypted && <div className={"encrypted"}>{encrypted}</div>}
      {/*<button onClick={getPermitHandle} id={"getpermit"}>Encrypt</button>*/}
      {/*{permit && <div id={"permit"}>{permit}</div>}*/}
    </div>
  );
}
