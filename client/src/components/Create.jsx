import { useState } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";
import axios from "axios"

const Create = ({ state }) => {
  const { Marketplace,NFT } = state;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const uploadToIPFS = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const formData = new FormData();
        formData.append("file", file);
        // console.log(formData)
        const res = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `35cb1bf7be19d2a8fa0d`,
            pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res);
        const resData = await res.data;
        setImage(`https://ipfs.io/ipfs/${resData.IpfsHash}`);
      } catch (e) {
        console.log(e);
      }
    }
  };
  const createNFT = async () => {
    try {
      const data = JSON.stringify({image,name,description,price})
      console.log(data)
      const res = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `35cb1bf7be19d2a8fa0d`,
          pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
          "Content-Type": "application/json",
        },
      });
      const resData = await res.data;
    console.log(resData)
    
    const tx = await NFT.mint(`https://ipfs.io/ipfs/${resData.IpfsHash}`)
    await tx.wait()
    console.log(tx)

    const id = await NFT.tokenCount();
    console.log(Marketplace.target)
     NFT.setApprovalForAll(Marketplace.target, true).then(async (res)=>{
      const listingPrice = ethers.parseEther(price.toString())
      console.log(id)
      console.log(listingPrice)
      console.log(NFT.target)
      await(await Marketplace.makeItem(NFT.target,id,listingPrice)).wait()
   }).catch((e) => console.log(e))
   
         
    } catch (error) {
      console.error(error)
      
    }
   
  };
  // console.log(Marketplace.target)



  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 mx-auto"
          style={{ maxWidth: "1000px" }}
        >
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Name"
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                required
                as="textarea"
                placeholder="Description"
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Price in ETH"
              />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Create;
