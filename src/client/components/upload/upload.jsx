import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss'

class Upload extends React.Component {
    render() {
        return (
            <div>
                {
                    this.props.imageSrc === "" ? '': (
                        <div>
                            <h5>Uploaded Image:</h5>
                            <img src={ this.props.imageSrc } className={ styles.image } height="250px" alt="Image preview..."/>
                        </div>
                    )
                }
            </div>
        );
    }
}

Upload.propTypes = {
    imageSrc: PropTypes.string.isRequired
};

export default Upload;