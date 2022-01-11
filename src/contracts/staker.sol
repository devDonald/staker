// SPDX-License-Identifier: MIT  

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Staker{
    using SafeMath for uint;
    struct Stake{
        address payable owner;
        uint percentage;
        uint price;
        bool canVote;
        bool isBought;
    }

    address internal adminAddress = msg.sender;


    mapping (uint => Stake) internal stakes;
    uint stakeLength = 0;
    
    modifier isAdmin(){
        require(msg.sender == adminAddress,"Only the admin can access this");
        _;
    }

    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

// function to add stake
    function addStake(
        uint _percentage,
        uint _price
    
    )public isAdmin(){
        stakes[stakeLength] = Stake(
            payable(msg.sender),
            _percentage,
            _price,
            false,
            false
        );
        
        stakeLength++;
        
    }
// function to edit a stake
    function editStake(uint _percentage, uint _price, uint _index)public isAdmin(){
        Stake storage stake = stakes[_index];
        stake.percentage = _percentage;
        stake.price = _price;
    }
// function to get stake
    function getStake(uint _index)public view returns(
        address payable,
        uint,
        uint,
        bool,
        bool
    ){
        Stake storage stake = stakes[_index];
        return(
            stake.owner,
            stake.percentage,
            stake.price,
            stake.canVote,
            stake.isBought
        );
    }
// function to check if user is admin
    function isUserAdmin(address _address) public view returns (bool){
        if(_address == adminAddress){
            return true;
        }else{
          return false;  
        }
        
    }

// function to buy stake
    function buyStake(uint _index)public payable{
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                stakes[_index].owner,
                stakes[_index].price
            ),
            "Transaction could not be performed"
        );

        stakes[_index].owner = payable(msg.sender);
        stakes[_index].isBought = true;
    }
// function to sell stake
    function sellStake(uint _index)public payable{
        stakes[_index].isBought = false;
    }

// function to get length of stake
    function getStakeLength() public view returns (uint) {
        return (stakeLength);
    }

}