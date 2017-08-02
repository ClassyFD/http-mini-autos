import React, { Component } from 'react';
import logo from './joesAuto.svg';
import axios from 'axios';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      vehiclesToDisplay: [],
      buyersToDisplay: [],
      vehicleURL:'https://joes-autos.herokuapp.com'
    }

    this.getVehicles = this.getVehicles.bind(this);
    this.getPotentialBuyers = this.getPotentialBuyers.bind(this);
    this.onSoldButtonClick = this.onSoldButtonClick.bind(this);
    this.addCar = this.addCar.bind(this);
    this.addBuyer = this.addBuyer.bind(this);
    this.filterByColor = this.filterByColor.bind(this);
    this.filterByMake = this.filterByMake.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
  }

  getVehicles() {
    axios.get(this.state.vehicleURL + '/api/vehicles')
         .then((response)=> {
          this.setState({
            vehiclesToDisplay: response.data.vehicles
          })
         })
  }

  getPotentialBuyers() {
    axios.get(this.state.vehicleURL + '/api/buyers')
         .then((response)=> {
           this.setState({
           buyersToDisplay:response.data.buyers
           })
         })
  }

  onSoldButtonClick(id) {
    axios.delete(this.state.vehicleURL + '/api/vehicles/' + id)
         .then((response) => {
           this.setState({
             vehiclesToDisplay:response.data.vehicles
           })
         })
  }

  filterByMake() {
    let make = this.refs.selectedMake.value
    let color = this.refs.selectedColor.value
    axios.get(this.state.vehicleURL + '/api/vehicles')
         .then( (response) => {
           var filtered = response.data.vehicles.filter((e)=>{
             return e['make'].toLowerCase() === make.toLowerCase();
            }) 
            this.setState({
              vehiclesToDisplay: filtered,
            })
            if (this.refs.selectedColor.value) {
              var newFiltered = filtered.filter((e)=>{
                return e['color'].toLowerCase() === color.toLowerCase()
              })
              this.setState({
                vehiclesToDisplay: newFiltered
              })
            }
         })
  }

  filterByColor() {
    let color = this.refs.selectedColor.value;
    let make = this.refs.selectedMake.value;
    axios.get(this.state.vehicleURL + '/api/vehicles')
         .then( (response) => {
           var filteredColor = response.data.vehicles.filter((e)=> {
             return e['color'].toLowerCase() === color.toLowerCase(); 
           })
            this.setState({
              vehiclesToDisplay: filteredColor,
            })
            if (this.refs.selectedMake.value) {
              var newFiltered = filteredColor.filter((e)=>{
                return e['make'].toLowerCase() === make.toLowerCase();
              })
              this.setState({
                vehiclesToDisplay: newFiltered
              })
            }
         })
          
  }

  updatePrice(id, priceChange) {
    axios.put(this.state.vehicleURL + '/api/vehicle/' + id + '/' + priceChange)
          .then( (response) => {
            this.setState({
              vehiclesToDisplay: response.data.vehicles
            })
          })
  }

  addCar(){
  let newCar = {
    make: this.refs.make.value,
    model: this.refs.model.value,
    color: this.refs.color.value,
    year: this.refs.year.value,
    price: this.refs.price.value
  }  
  axios.post(this.state.vehicleURL+'/api/vehicles', newCar)
      .then((response)=> {
        if(response.status === 200) {
          this.setState({
            success: true,
            vehiclesToDisplay: response.data.vehicles
          })
        } else {
          this.setState({
            success:false,
          })
        }
          
    })
}

addBuyer() {
  let newBuyer ={
    name: this.refs.name.value,
    phone: this.refs.phone.value,
    address: this.refs.address.value
  }
  axios.post(this.state.vehicleURL+'/api/buyers', newBuyer)
       .then( (response) => {
         if(response.status === 200) {
           this.setState({
            success: true,
            buyersToDisplay: response.data.buyers
           })
         } else {
           this.setState({
             success: false
           })
         }
       })
}


  render() {
    const vehicles = this.state.vehiclesToDisplay.map( v => {
      return (
        <div key={ v.id }>
          <p>Make: { v.make }</p>
          <p>Model: { v.model }</p>
          <p>Year: { v.year }</p>
          <p>Color: { v.color }</p>
          <p>Price: { v.price }</p>
          <button
            onClick={ () => this.updatePrice(v.id,'up') }
            >Increase Price</button>
          <button
            onClick={ () => this.updatePrice(v.id,'down') }
            >Decrease Price</button>  
          <button 
            onClick={ () => this.onSoldButtonClick(v.id) }
            >SOLD!</button>
          <hr className='hr' />
        </div> 
      )
    })

    const buyers = this.state.buyersToDisplay.map ( person => {
      return (
        <div key={person.id}>
          <p>Name: {person.name}</p>
          <p>Phone: {person.phone}</p>
          <p>Address: {person.address}</p>
          <button>No longer interested</button>
          <hr className='hr' />
        </div> 
      )
    })

    return (
      <div className=''>
        <header className='header'>
         <img src={logo} alt=""/>
        </header>
        <div className='btn-container'>
          <button
            className='btn-sp' 
            onClick={ this.getVehicles }
            >Get All Vehicles</button>
          <select
            onChange={ this.filterByMake }
            ref='selectedMake'
            className='btn-sp'>
            <option value="" selected disabled>Filter by make</option>
            <option value="Suzuki">Suzuki</option>
            <option value="GMC">GMC</option>
            <option value="Ford">Ford</option>
            <option value="Volkswagen">Volkswagen</option>
            <option value="Chevrolet">Chevrolet</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Cadillac">Cadillac</option>
            <option value="Dodge">Dodge</option>
            <option value="Chrysler">Chrysler</option>
          </select>  
          <select 
            ref='selectedColor'
            onChange={ this.filterByColor }
            className='btn-sp'>
            <option value="" selected disabled>Filter by color</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="Purple">Purple</option>
            <option value="indigo">Indigo</option>
            <option value="violet">Violet</option>
            <option value="teal">Teal</option>
          </select>
          <button
            className='btn-sp'
            onClick={ this.getPotentialBuyers }
            >Get Potential Buyers</button>
        </div> 

        <br />

        <p className='form-wrap'>
          Add vehicle:
          <input className='btn-sp' placeholder='make' ref="make"/>
          <input className='btn-sp' placeholder='model' ref='model'/>
          <input className='btn-sp' placeholder='year' ref='year'/>
          <input className='btn-sp' placeholder='color' ref='color'/>
          <input className='btn-sp' placeholder='price' ref='price'/>
          <button className='btn-sp' onClick={this.addCar}
                  style={ {backgroundColor: this.state.success ? 'lightgreen':'pink'}}>Add</button>
        </p>
        <p className='form-wrap'>
          Add Possible buyer:
          <input className='btn-sp' placeholder='name' ref='name'/>
          <input className='btn-sp' placeholder='phone' ref='phone'/>
          <input className='btn-sp' placeholder='address' ref='address'/>
          <button 
            onClick={ this.addBuyer }
            className='btn-sp'
            style={ {backgroundColor: this.state.success? 'lightgreen' : 'pink'}} 
            >Add</button>
        </p>
        

        <main className='main-wrapper'>
          <section className='info-box'> 
            <h3>Inventory</h3>

            { vehicles }

          </section>
          <section className='info-box'>
            <h3>Potential Buyers</h3>

            { buyers }

          </section>
        </main>  


      </div> 
    );
  }
}

export default App;
