
import React from 'react';
// TODO: props validation 
const Message = ({ chat, userName }) => (
    <li className={`chat ${userName === chat.userName ? "right" : "left"}`}>
        {userName !== chat.userName
            && <React.Fragment>
                <img src={chat.img} alt={`${chat.userName}'s profile pic`} />
                <p className='userName'>{chat.userName}</p>
            </React.Fragment>
        }

        {chat.content}
    </li>
);

export default Message;