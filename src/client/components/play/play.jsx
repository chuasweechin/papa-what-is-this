import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss'

class Play extends React.Component {
    constructor() {
        super();

        this.state = {
            'audioUrl': "",
            'loading': false,
        };
    }

    async playSpeechHandler(e, str, player) {
        e.preventDefault();
        this.setState({ 'loading': true });

        const formData = new FormData();
        formData.append("content", str);

        const response = await fetch("/analyzeText", {
            'method': 'POST',
            'mode': 'cors',
            'credentials': 'same-origin',
            'Content-Type': 'application/x-www-form-urlencoded',
            'referrer': 'no-referrer',
            'body': formData
        });

        if (response.status === 200) {
            const data = await response.json();
            this.setState({ "audioUrl": data.audioUrl });
            player.play();
            this.setState({ 'loading': false });

        } else {
            alert("There is an internal server error. Please try again.");
            this.setState({ 'loading': false });
        }
    }

    render() {
        return (
            <form onSubmit={ (e) => { this.playSpeechHandler(e, this.props.webEntity.description, this.player) } }>
                <audio ref={ ref => this.player = ref } src={ this.state.audioUrl } type="audio/mpeg"/>
                {
                    this.state.loading === true ? (
                        <button className={ styles.play } type="submit" disabled>
                            <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"/>
                        </button>
                    ) : (
                        <button className={ styles.play } type="submit">Play Audio</button>
                    )
                }
            </form>
        );
    }
}

Play.propTypes = {
    webEntity: PropTypes.object.isRequired,
};

export default Play;