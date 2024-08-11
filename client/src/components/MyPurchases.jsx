import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card } from 'react-bootstrap'


const MyPurchases = ({state,account}) => {
  const {NFT,Marketplace} = state;
  const [purchases, setPurchases] = useState([])

  const loadPurchaseditems=async()=>{
    const filter = Marketplace.filters.Bought(null,null,null,null,null,account)
    const results = await Marketplace.queryFilter(filter)
    const purchases = await Promise.all(results.map(async i=>{
      i = i.args;
      const uri = await NFT.tokenURI(i.tokenId)
      const response = await fetch(uri)
      const metadata = await response.json()
      const totalPrice = await Marketplace.getTotalPrice(i.itemId)

      let purchasedItem = {
        totalPrice,
        itemId: i.itemId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image
      }
      return purchasedItem

    }))
    setPurchases(purchases)
  }
  useEffect(()=>{
    loadPurchaseditems()
  })
  return (
    <div className="flex justify-center">
      {purchases.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>{ethers.formatEther(item.totalPrice)} ETH</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No purchases</h2>
          </main>
        )}
    </div>
  )
}

export default MyPurchases
