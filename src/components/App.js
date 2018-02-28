import React from 'react';
import Chatroom from './Chatroom.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        chats: [{
            userName: "Kevin Hsu",
            content: <p>Hello World!</p>,
            img: "http://i.imgur.com/Tj5DGiO.jpg",
        }, {
            userName: "Alice Chen",
            content: <p>Love it! :heart:</p>,
            img: "http://i.imgur.com/Tj5DGiO.jpg",
        }, {
            userName: "Kevin Hsu",
            content: <p>Check out my Github at https://github.com/WigoHunter</p>,
            img: "http://i.imgur.com/Tj5DGiO.jpg",
        }, {
            userName: "KevHs",
            content: <p>Lorem ipsum dolor sit amet, nibh ipsum. Cum class sem inceptos incidunt sed sed. Tempus wisi enim id, arcu sed lectus aliquam, nulla vitae est bibendum molestie elit risus.</p>,
            img: "http://i.imgur.com/ARbQZix.jpg",
        }, {
            userName: "Kevin Hsu",
            content: <p>So</p>,
            img: "http://i.imgur.com/Tj5DGiO.jpg",
        }, {
            userName: "Kevin Hsu",
            content: <p>Chilltime is going to be an app for you to view videos with friends</p>,
            img: "http://i.imgur.com/Tj5DGiO.jpg",
        }, {
            userName: "Kevin Hsu",
            content: <p>You can sign-up now to try out our private beta!</p>,
            img: "http://i.imgur.com/Tj5DGiO.jpg",
        }, {
            userName: "Alice Chen",
            content: <p>Definitely! Sounds great!</p>,
            img: "http://i.imgur.com/Tj5DGiO.jpg",
        }]
    };

  }
  // componentDidMount() {

  // }
  // componentWillUnmount() {
  //   // clean timers, listeners
  // }
  render() {
    return (
      <div>
        <h1> Chat Room</h1>
        <Chatroom />
        </div>
    );
  }
}

export default App;
