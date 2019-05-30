import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss'

class Entity extends React.Component {
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
            <React.Fragment>
                <td className={ styles.playerColumn }>
                    <form onSubmit={ (e) => { this.playSpeechHandler(e, this.props.webEntity.description, this.player) } }
                        >
                        <audio
                            ref={ ref => this.player = ref }
                            src={ this.state.audioUrl }
                            type="audio/mpeg"
                        />
                        {
                            this.state.loading === true ? (
                                <button
                                    className={ styles.player }
                                    type="submit"
                                    disabled
                                >
                                    <span
                                        className="spinner-border spinner-border-sm mr-1"
                                        role="status"
                                         aria-hidden="true"
                                    />
                                </button>
                            ) : (
                                <button
                                    className={ styles.player }
                                    type="submit"
                                >
                                    Play Audio
                                </button>
                            )
                        }
                    </form>
                </td>

                <td className={ this.props.webEntity.score > 0.8 ? styles.high : '' }>
                    { this.props.webEntity.description }
                </td>

                <td className={ this.props.webEntity.score > 0.8 ? styles.high + ' ' + styles.score : styles.scoreColumn }>
                    { this.props.webEntity.score.toFixed(2) }
                </td>
            </React.Fragment>
        );
    }
}

Entity.propTypes = {
    webEntity: PropTypes.object.isRequired,
};

export default Entity;