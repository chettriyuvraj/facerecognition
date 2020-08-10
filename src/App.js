import React, { Component } from 'react';
import 'tachyons';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './Components/Navigation/Navigation.js';
import Logo from './Components/Logo/Logo.js';
import Rank from './Components/Rank/Rank.js';
import Signin from './Components/Signin/Signin.js';
import Register from './Components/Register/Register.js';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js';

const particleParams = {
  "particles": {
    "number": {
      "value": 100,

    },
    "size": {
      "value": 3
    }
  },
  "interactivity": {
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      }
    }
  }
};




const initialState = {
  input: '',
  imageUrl: 'https://samples.clarifai.com/metro-north.jpg',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    email: '',
    name: '',
    password: '',
    entries: '',
    joined: ''
  }
}


class App extends Component {
  

  constructor()
  {

    super();
    this.state = initialState;



  }


  loadUser = (data) =>
  {
    this.setState({user:
      {
      id:data.id,
      name:data.name,
      email:data.email,
      entries: data.entries,
      joined:data.joined
    }})


  }


  
  calculateFaceLocation = (data)=>
  {

    // console.log(data.outputs[0].data.regions);
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.querySelector('#inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    
    return{
      leftCol: clarifaiFace.left_col*width,
      topRow: clarifaiFace.top_row*height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height - (clarifaiFace.bottom_row*height),

    }



  }


  displayFaceBox = (box) =>
  {
    this.setState({box:box});
    console.log(box);

  }
 

  onInputChange = (event) =>
  {
    this.setState({input:event.target.value});
  }

  onButtonSubmit = (event) =>
  {

    this.setState({imageUrl:this.state.input});

    // console.log(this.state.input);
    
    fetch('https://powerful-hollows-21698.herokuapp.com/imageUrl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input:this.state.input
      })
    })
    .then(response=>response.json())
    .then(response =>
    {

      if(response)
      { 
        fetch('https://powerful-hollows-21698.herokuapp.com/image',{
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.state.user.id
          })


        }).then(response=>response.json())
          .then(count=> this.setState(Object.assign(this.state.user,{entries:count})))  //can be done without this.setState
          .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response));})
    .catch( err=>{console.log()}); 
    

    
  }


    onRouteChange= (event) =>
    {
      if(event==='signout')
        this.setState(initialState);  
      else if(event==='home')
        this.setState({isSignedIn: true });
      this.setState({route:event});
    }



  
  render(){

    


    
  
  
    
    return (
    <div className="App">

      <Particles className='particles' params={particleParams} />
      <Navigation isSignedIn = {this.state.isSignedIn}onRouteChange={this.onRouteChange}/>
      
      
     
    {(this.state.route==='home')?
    <div>
    <Logo/> 
    <Rank name={this.state.user.name} entries={this.state.user.entries}/>
    <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
    <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
    </div>
          : (this.state.route === 'register' ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> : <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>)



    }

     
    </div>
  );
}


}
export default App;
