import Truck from '../assets/truck.png';
import Shield from '../assets/shield.png';
import Headset from '../assets/headset.png';
function CustomerService() {
  return (
    <div style={{width:"80%",marginLeft:"10%",marginRight:"10%",paddingTop:50,paddingBottom:50,display:"flex",justifyContent:"space-around"}}>
        <div style={{width:"auto",justifyItems:"center"}}>
            <img src={Truck} style={{width:100,marginTop:25,marginBottom:25}} />
            <h1 className="text-2xl font-bold" style={{textAlign:"center"}}>FREE AND FAST DELIVERY</h1>
            <h4 style={{textAlign:"center"}}>Free delivery for all orders over $140</h4>
        </div>
        <div style={{width:"auto",justifyItems:"center"}}>
            <img src={Headset} style={{width:100,marginTop:25,marginBottom:25}} />
            <h1 className="text-2xl font-bold" style={{textAlign:"center"}}>24/7 CUSTOMER SERVICE</h1>
            <h4 style={{textAlign:"center"}}>Friendly 24/7 customer support</h4>
        </div>
        <div style={{width:"auto",justifyItems:"center"}}>
            <img src={Shield} style={{width:100,marginTop:25,marginBottom:25}} />
            <h1 className="text-2xl font-bold" style={{textAlign:"center"}}>MONEY BACK GUARANTEE</h1>
            <h4 style={{textAlign:"center"}}>We return money within 30 days</h4>
        </div>
       
    </div>
  );
}

export default CustomerService;