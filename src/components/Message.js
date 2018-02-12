
import React from 'react';
// TODO: props validation 
const Message = ({ chat, userName }) => (
    <li className={`chat ${userName === chat.userName ? "right" : "left"}`}>
        {userName !== chat.userName
            && <img src={chat.img} alt={`${chat.userName}'s profile pic`} />
        }
        {chat.content}
    </li>
);

export default Message;