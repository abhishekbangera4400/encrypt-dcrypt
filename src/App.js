import logo from "./logo.svg";
import React,{useState} from 'react'
import "./App.css";
import CryptoJS from "crypto-js";
import { JSEncrypt } from "jsencrypt";



function App() {
  const [data, setData] = useState("")
  let latestTransaction = {};
  let transactionIDs = [];
  let publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAvkLF8m9jtUTWqt/0/7nWFQq+zwp7m5OsBxgAFQtxeGpTJ2BGr60cpaHpznjxBhlPaY/7TPckf55+Rx88zF8w7VXYlhO0ukJIwQWAbooGO+8cx50r88hh9CWju5A4oN6/7ZPHerQXU+XfDdjwO2McxogVTSW27MtI6QlchVfHdITlFylsjxOYul5sTwJRI2IneVx96I12IzhGt78uAa9nrSyKSd94Q2F0bO3NYdpAVuU6FdJh6wOGvCjyb1IXgZGZOGN0Pq6ZUrv/uS8viuF89e4WYI9JDQuw/XSDnbD7tZwEKIL8PZHiYzGBBN/21g3OiqXZ8WYK/c6Sfb66u50VsB016wMy2TdMp4wQlTnDNOW3wfKZoWY7l/h/mQeKSVh0O/bmYRKhXwS7oS4/v26TDEtw4dwQC8UmGwSqYRgWR/bEveNFecE1Wdw0b+vzUktWePF58dKAGzDa5PKqU68P5SYc4BZQRUNzoNv89owekWbiVlVi3FqWpwXzmgLR4/nV6IyOWSXe7zxQaQPctfp+n5WSmHEmENLHdV/2LeNT3Jr1qfWDtzRO5V1DIhZyVqOM92sFZ+GGs8RF7Hvrk9TGYnvNYKILnfdBHRqR/U1ZqVW9Z+HODdB4pk2ar7geG4/KRYCjQMoCRD7bDfE1YJKG1lrpDaFjnFS6shO7oXzbu+cCAwEAAQ=="
  const [id, setID] = useState(0);
  const [transitmessage, settransitmessage] = useState("")

  const generate = (length) => {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  };
  
  const crypt = {
    encrypt: function(text, secret, publicKey) {
      let e = new JSEncrypt();
      let public_key = "-----BEGIN PUBLIC KEY-----";
      public_key += publicKey;
      public_key += "-----END PUBLIC KEY-----";
      e.setPublicKey(public_key);
      let s = e.encrypt(secret);
      let salt = CryptoJS.lib.WordArray.random(128 / 8);
      let iv = CryptoJS.lib.WordArray.random(128 / 8);
      let encrypted = CryptoJS.AES.encrypt(
        text,
        CryptoJS.PBKDF2(secret, salt, {
          keySize: 256 / 32,
          iterations: 100,
        }) /* key */,
        { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC }
      );
      let transitmessage = {
        part1: salt.toString() + iv.toString() + encrypted.toString(),
        part2: s,
      };
      settransitmessage(transitmessage)
      return transitmessage;
    },
    decrypt: function(text, secret) {
      var key = CryptoJS.PBKDF2(
        secret,
        CryptoJS.enc.Hex.parse(text.substr(0, 32)) /* Salt */,
        { keySize: 256 / 32, iterations: 100 }
      );
      var decrypted = CryptoJS.AES.decrypt(
        text.substring(64) /* encrypted */,
        key,
        {
          iv: CryptoJS.enc.Hex.parse(text.substr(32, 32)) /* iv */,
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC,
        }
      );
      return decrypted.toString(CryptoJS.enc.Utf8);
    },
  };

  const CryptoEncrypt = {
    encrypt: (payload, key, publicKey) => {
      return crypt.encrypt(JSON.stringify(payload), key, publicKey);
    },
    decrypt: (payload, key) => {
      return JSON.parse(crypt.decrypt(payload, key));
    },
  };

  const encrypt = () => {

  }

  const setTransData = () => {
    var length = Math.floor(Math.random() * 10) + 3;
    var salt = Math.floor(Math.random() * 10) + 4;
    var transactionId =
      Math.random()
        .toString(36)
        .substring(2, length) +
      Math.random()
        .toString(36)
        .substring(2, salt) +
      id;
    var tempSecret =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);

    var secretNew = tempSecret + generate(transactionId.length);
    return {
      transactionId: transactionId,
      secret: secretNew,
      tempSecret: tempSecret,
    };
  };

  const setTransValue = () => {
    if (latestTransaction) {
      if (transactionIDs.length) {
        let temp = [];
        Object.assign(temp, transactionIDs);
        temp.push(latestTransaction);
        transactionIDs = temp;
      } else if (latestTransaction.transactionId) {
        let a = [];
        a.push(latestTransaction);
        transactionIDs = a;
      }
      console.log("useefferct on counter", transactionIDs);
    }
  };

  const changeTransactionId = (txnId) => {
    console.log("changeTransactionId ===>", txnId, transactionIDs);
    var secret = "";
    var latest = transactionIDs.filter(function(val) {
      if (val.transactionId == txnId) {
        secret = val.secret.substring(
          0,
          val.secret.length - val.transactionId.length
        );
        return false;
      }
      return true;
    });
    latestTransaction = latest;
    console.log("changeTransactionId ===>", latest, secret);
    // setTransactionIDs(latest);
    return secret;
  };
  return (
    <div className="App">
      <div className="flexbox-container" style={{padding:"20px",display:"flex",flexDirection:"column"}}>
      <textarea onChange={(e)=>{
     setData(JSON.parse(e.currentTarget.value))
      }} id="w3review" name="w3review" rows="25" cols="100"></textarea>
      <button onClick={()=>{
        latestTransaction = setTransData();
        setTransValue();
        setID(id + 1);
    CryptoEncrypt.encrypt(
      JSON.stringify(data),
     latestTransaction.tempSecret,
          publicKey
        )
      }}>submit</button>
      <textarea id="w3review" value={JSON.stringify(transitmessage)} name="w3review" rows="25" cols="100"></textarea>
      </div>
    </div>
  );
}

export default App;
