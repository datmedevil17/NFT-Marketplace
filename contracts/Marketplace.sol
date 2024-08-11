// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract Marketplace{

    address payable public immutable feeAccount; //account that recieves fee
    uint public immutable feePercent; // the fee percentage on sales
    uint public itemCount;
    bool private locked;
    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    constructor (uint _feePercent){
        feeAccount = payable(msg.sender); //deploy krne wala contract hi jiske paas fee aaegi
        feePercent = _feePercent;
    }


    struct Item{
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }
    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
    event Bought(
         uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer

    );

    mapping(uint=> Item) public items;
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        itemCount++;
        _nft.transferFrom(msg.sender, address(this), _tokenId);//jo item call krega usse contract address pe

        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
    }

    function purchaseItem(uint _itemId) external payable nonReentrant{
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId>0 && _itemId<= itemCount, "item doesnt exist");
        require(msg.value >= _totalPrice, "not enough to complete purchase");
        require(!item.sold,"item sold already");
        //paying the seller
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        //update sold item
        item.sold = true;
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        emit Bought(_itemId, address(item.nft), item.tokenId, item.price, item.seller, msg.sender);
    }

    function getTotalPrice(uint _itemId) view public returns(uint) {
        return (items[_itemId].price*(100 + feePercent)/100);
    }




//0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
}