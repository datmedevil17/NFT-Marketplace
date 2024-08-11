import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Row, Col, Card, Button } from 'react-bootstrap';

const Home = ({ state, account }) => {
  const { Marketplace, NFT } = state;
  const [items, setItems] = useState([]);

  const loadMarketplaceItems = async () => {
    const itemCount = await Marketplace.itemCount();
    let items = [];

    for (let i = 3; i <= itemCount; i++) {
      const item = await Marketplace.items(i);
      const uri = await NFT.tokenURI(item.tokenId);
      console.log(uri);
      const response = await fetch(uri);
      const metadata = await response.json();
      const totalPrice = await Marketplace.getTotalPrice(item.itemId);

      let object = {
        totalPrice,
        price: item.price,
        itemId: item.itemId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
      };

      items.push(object);
    }

    setItems(items);
  };

  const buyMarketItem = async (item) => {
    const tx = await Marketplace.purchaseItem(item.itemId, { value: item.totalPrice });
    await tx.wait();
    console.log(tx);
    loadMarketplaceItems();
  };

  useEffect(() => {
    loadMarketplaceItems();
  }, []);

  return (
    <div className="flex justify-center">
      {items.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className="d-grid">
                      <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        Buy for {ethers.formatEther(item.totalPrice)} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: '1rem 0' }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
};

export default Home;
