import {useState,useEffect} from 'react'
import {ethers} from "ethers"
import {Row,Col,Card} from "react-bootstrap"


function renderSoldItems(items){
  return(
    <div>
      <h2>Sold</h2>
      <Row xs={1} md={2} lg={4} className="g-4 py-3">
        {items.map((item, idx) => (
          <Col key={idx} className="overflow-hidden">
            <Card>
              <Card.Img variant="top" src={item.image} />
              <Card.Footer>
                For {ethers.formatEther(item.totalPrice)} ETH - Recieved {ethers.formatEther(item.price)} ETH
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

    </div>
  )
}

const MyListedItem = ({state,account}) => {
  const {Marketplace, NFT} = state
  const [listedItems,setListedItems] = useState([])
  const [soldItems,setSoldItems] = useState([])

  const loadListedItems = async() =>{
    let listedItems = []
    let soldItems = []
    const itemCount = await Marketplace.itemCount()
    for(let i = 3; i<=itemCount; i++){
      const item = await Marketplace.items(i)
      
      if(item.seller== account){
        const uri = await NFT.tokenURI(item.tokenId)
      
        const response = await fetch(uri)
        
        const metadata = await response.json()
        
        const totalPrice = await Marketplace.getTotalPrice(item.itemId)

        let object = {
          totalPrice,
          price: item.price,
          itemId: item.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        }
        listedItems.push(object)
        if(item.sold) soldItems.push(object)

      }
      setListedItems(listedItems)
      setSoldItems(soldItems)
    }

  }
  

  useEffect(()=>{
    loadListedItems()
    
  })
  return (
    <div className="flex justify-center">
      {listedItems.length > 0 ?
        <div className="px-5 py-3 container">
            <h2>Listed</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {listedItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>{ethers.formatEther(item.totalPrice)} ETH</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
            {soldItems.length > 0 && renderSoldItems(soldItems)}
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  )
}

export default MyListedItem
