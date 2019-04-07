import React, { Component } from 'react';
import styled from 'styled-components/macro'

const Main = styled.main`
  margin: 0 auto;
  max-width: 600px;
`;

class App extends Component {
  state = {
    searchValue: '',
    roms: []
  };

  componentDidMount() {
    fetch('http://localhost:3030/roms/megadrive').then(response => response.json()).then(jsonResponse => {
      this.setState({roms: jsonResponse})
    })
  }

  render() {
    const filteredRoms = this.state.roms.filter(rom => rom.filename.toLowerCase().includes(this.state.searchValue.toLowerCase()));

    return (
      <Main>
        <h1>ROM list</h1>

        <input type="text" value={this.state.searchValue} onChange={(event) => this.setState({searchValue: event.target.value})}/>

        <ul>
          {
            filteredRoms.map(filteredRom => (
              <li key={filteredRom.pathUnescaped}>
                <strong>{filteredRom.filename}</strong>
                <br/>
                <small>{filteredRom.pathUnescaped}</small>
                <br/>
              </li>
              ))
          }
        </ul>
      </Main>
    );
  }
}

export default App;
