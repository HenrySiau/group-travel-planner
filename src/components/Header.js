import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ message }) => {
  return (
    <h2 className="Header text-center">
      Message: **-{message}-**
    </h2>
  );
};

Header.propTypes = {
  message: PropTypes.string
};

export default Header;