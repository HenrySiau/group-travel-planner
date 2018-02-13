
import React from 'react';
// TODO: props validation 
const Message = ({ chat, userName }) => (
    <li className= {`chat ${userName === chat.userName ? "right" : "left speech-bubble"}`}>
        {userName !== chat.userName
            && <React.Fragment>
                <img src={chat.img} alt={`${chat.userName}'s profile pic`} />
                <h6 className='userName'>{chat.userName}</h6>
            </React.Fragment>
        }

        {chat.content}
    </li>
);

export default Message;