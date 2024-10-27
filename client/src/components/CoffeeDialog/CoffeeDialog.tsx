
import { useState } from 'react';
import ImageNotFound from '../../assets/imageNotFound.png';
import '../../styles/Modal.css';

const CoffeeDialog = () => {
    const [modal, setModal] = useState(false);
    const [name, setName] = useState("");
    const [origin, setOrigin] = useState("");
    const [roastLevel, setRoastLevel] = useState("");
    const [beanType, setBeanType] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState<string>(ImageNotFound);
    const onImageChange = (event:any) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    }
    function mint() {
        console.log('====================================');
        console.log(image);
        console.log(name);
        console.log(origin);
        console.log(roastLevel);
        console.log(beanType);
        console.log(description);
        console.log(quantity);
        console.log(price);
        console.log('====================================');
    }
    const value = modal ? "block" : "none";
    const toggleModal = () => {
        setModal(!modal);
    };
    return (
        <>
        <div style={{backgroundColor:"white",borderRadius:10,justifyContent:"center",padding:15}}>
            <h1 style={{fontSize:30,fontWeight:"bold",textAlign:"center"}}>Wanna list your coffee?</h1>
            <button onClick={toggleModal} className="btn-modal">
                List my coffee
            </button>
        </div>
        {modal && (
        <div 
            className="modal" 
            style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}
        >
            <div onClick={toggleModal} className="overlay"></div>
            <div className="modal-content">
                <div style={{width:"100%",justifyItems:"center"}}>
                    <h1 style={{fontSize:20,fontWeight:"bold"}}>Upload your coffee into an NFT ☕</h1>
                    <h1 style={{fontSize:20,fontWeight:"bold"}}>Let’s tokenise your coffee into NFTs!</h1>
                </div>
                <div style={{width:"90%",margin:"5%",height:300,justifyContent:"space-around", display:"flex"}}>
                    <div style={{}}>
                        <div style={{width:300,height:300}}>
                            <img src={image} style={{width:300,height:300}}/>
                        </div>
                        <div style={{width:"100%",display:"flex",marginTop:10, justifyContent:"center"}}>
                            <label>Upload Image: </label>
                            <input type="file" style={{marginLeft:20,width:110,borderRadius:5}} multiple={false}
                            accept="application/png" onChange={onImageChange}></input>
                        </div>
                    </div>
                    <div style={{width:"40%"}}>
                        <div style={{width:"100%",display:"flex",justifyContent:"space-between",marginTop:10,marginBottom:10}}>
                            <label style={{fontSize:20}}>Coffee Name:</label>
                            <input type="text" style={{width:250,borderRadius:5,color:"black",padding:5}} 
                            placeholder="Coffee name" onChange={e => setName(e.target.value)}></input>
                        </div>
                        <div style={{width:"100%",display:"flex",justifyContent:"space-between",marginTop:10,marginBottom:10}}>
                            <label  style={{fontSize:20}}>Coffee Origin:</label>
                            <input type="text" style={{width:250,borderRadius:5,color:"black",padding:5}} 
                            placeholder="Coffee origin" onChange={e => setOrigin(e.target.value)}></input>
                        </div>
                        <div style={{width:"100%",display:"flex",justifyContent:"space-between",marginTop:10,marginBottom:10}}>
                            <label  style={{fontSize:20}}>Roast Level:</label>
                            <input type="text" style={{width:250,borderRadius:5,color:"black",padding:5}} 
                            placeholder="Roast level" onChange={e => setRoastLevel(e.target.value)}></input>
                        </div>
                        <div style={{width:"100%",display:"flex",justifyContent:"space-between",marginTop:10,marginBottom:10}}>
                            <label  style={{fontSize:20}}>Bean Type:</label>
                            <input type="text" style={{width:250,borderRadius:5,color:"black",padding:5}} 
                            placeholder="Bean type" onChange={e => setBeanType(e.target.value)}></input>
                        </div>
                        <div style={{width:"100%",display:"flex",justifyContent:"space-between",marginTop:10,marginBottom:10}}>
                            <label  style={{fontSize:20}}>Description:</label>
                            <textarea  style={{width:250,borderRadius:5,color:"black",padding:5}} 
                            placeholder="Description"  onChange={e => setDescription(e.target.value)}></textarea>
                        </div>
                        <div style={{width:"100%",display:"flex",justifyContent:"space-between",marginTop:20,marginBottom:10}}>
                            <div style={{width:'45%',display:"flex",justifyContent:"space-between"}}>
                                <label  style={{fontSize:20}}>Quantity</label>
                                <input type="number" style={{width:50,borderRadius:5,color:"black",padding:5}} value={quantity}
                                onChange={e => setQuantity(Number.parseInt(e.target.value))}></input>
                            </div>
                            <div style={{width:'45%',display:"flex",justifyContent:"space-between"}}>
                                <label  style={{fontSize:20}}>Price (ETH)</label>
                                <input type="number" style={{width:50,borderRadius:5,color:"black",padding:5}} value={price}
                                onChange={e => setPrice(Number.parseFloat(e.target.value))}></input>
                            </div>
                        </div>
                        <div style={{width:"100%",display:"flex",justifyContent:"center",marginTop:20,marginBottom:10}}>
                            <button style={{width:150,height:60,backgroundColor:"#783E19",borderRadius:15,fontSize:20}} onClick={() => mint()}>Mint NFTs</button>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>)}
    </>
  );
}

export default CoffeeDialog;