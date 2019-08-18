import React, { Component } from 'react';
import styled from 'styled-components/macro'

const Main = styled.main`
  margin: 0 auto;
  max-width: 600px;
`;

const GameItem = styled.li`
  display: flex;
  margin-bottom: 25px;
`;

const PlayButton = styled.button`
  margin-right: 15px;
  padding: 10px 15px;
`;

class App extends Component {
  state = {
    searchValue: '',
    roms: []
  };

  startRom = (romPath) => {
    fetch('http://localhost:3030/start-rom', {
      method: "POST",
      body: JSON.stringify({system: "Mega Drive", romPath}),
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

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

        <h4 style={{marginBottom: 0}}>Search:</h4>
        <input type="text" value={this.state.searchValue} onChange={(event) => this.setState({searchValue: event.target.value})}/>

        <ul>
          {
            filteredRoms.map(filteredRom => (
              <GameItem key={filteredRom.pathUnescaped}>
                <div>
                  <PlayButton onClick={() => this.startRom(filteredRom.pathUnescaped)}>&#9654;&nbsp;Play</PlayButton>
                </div>

                <div>
                  <strong>{filteredRom.filename}</strong>
                  <br/>
                  <small>{filteredRom.pathUnescaped}</small>
                </div>
              </GameItem>
              ))
          }
        </ul>
      </Main>
    );
  }
}

export default App;
