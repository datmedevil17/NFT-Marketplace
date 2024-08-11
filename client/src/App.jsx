import React, {useState,useEffect} from 'react'
import {ethers} from 'ethers'
import Navigation from './components/Navigation'
import Home from './components/Home'
import MyListedItems from './components/MyListedItem'
import Create from './components/Create'
import MyPurchases from './components/MyPurchases'
import NFTAbi from './contract/NFT.json'
import { Spinner } from 'react-bootstrap'
import marketABI from './contract/Marketplace.json'
import './App.css'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

const App = () => {
  const [state, setState] = useState({
    provider: "",
    signer: "",
    NFT:"",
    Marketplace:"",
    address:""
  })
  const [loading, setLoading]=useState(false)
  const [account , setAccount] = useState('')
  const connectWallet = async () => {
    window.ethereum.on("chainChanged", ()=>{
      window.location.reload()
    })
    window.ethereum.on("accountsChanged", ()=>{
      window.location.reload()
    })
    const nftAddress = "0x6831d9BDD365bA547e0596Afc5347D91BEe0a682";
    const marketAddress = "0x0EA4164Daa85b379C7B745ceD47D1AEF2D1feeC1";
    const nftAbi = NFTAbi.abi;
    const marketAbi = marketABI.abi;

    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Metamask is not installed");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      if (accounts.length === 0) {
        console.log("No account found");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress()
      setAccount(address)
      const NFT = new ethers.Contract(nftAddress, nftAbi, signer);
      const Marketplace = new ethers.Contract(marketAddress, marketAbi, signer);
      // console.log(signer)

      setState({ provider, signer, NFT,Marketplace,address });
    } catch (error) {
      console.error("Error connecting to Metamask:", error);
    }
  };

  
  return (
    <BrowserRouter>
    <div className="App">
      <>
      <Navigation connectWallet={connectWallet} account={account}/>
      </>
      <div>
      {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home state={state} />
              } />
              <Route path="/create" element={
                <Create state={state} />
              } />
              <Route path="/my-listed-items" element={
                <MyListedItems state={state} account={account} />
              } />
              <Route path="/my-purchases" element={
                <MyPurchases state={state} account={account} />
              } />
            </Routes>
          )}

      </div>
    </div>
    </BrowserRouter>
  )
}

export default App
