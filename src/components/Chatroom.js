import React from 'react';
import ReactDOM from 'react-dom';
import '../css/chatroom.css';

import Message from './Message.js';
// credit to https://github.com/WigoHunter/react-chatapp
class Chatroom extends React.Component {
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

        this.submitMessage = this.submitMessage.bind(this);
    }

    componentDidMount() {
        this.scrollToBot();
    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    scrollToBot() {
        ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
    }

    submitMessage(e) {
        e.preventDefault();

        this.setState({
            chats: this.state.chats.concat([{
                userName: "Kevin Hsu",
                content: <p>{ReactDOM.findDOMNode(this.refs.msg).value}</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }])
        }, () => {
            ReactDOM.findDOMNode(this.refs.msg).value = "";
        });
    }

    render() {
        const userName = "Kevin Hsu";
        const chats = this.state.chats;
        // TODO: show create time if the two messages are 5 minutes away

        return (
            <div className="chatroom">
                <h3>Chat Room</h3>
                <ul className="chats" ref="chats">
                    {
                        chats.map((chat) =>
                            <Message chat={chat} userName={userName} />
                        )
                    }
                </ul>
                <form className="input" onSubmit={(e) => this.submitMessage(e)}>
                    <input type="text" ref="msg" />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default Chatroom;
