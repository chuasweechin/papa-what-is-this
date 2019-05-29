import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss'

class Result extends React.Component {
    async playSpeechHandler(e, str, player) {
        e.preventDefault();

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
            player.src = data.audioUrl;
            player.play();
        } else {
            alert("There is an internal server error. Please try again.");
        }
    }

    render() {
        if (this.props.result.length !== 0) {
            const webEntitiesElements = this.props.result[0].webEntities.map( (item, index) => {
                return (
                    <tr key={ index + 1 }>
                        <td className={ styles.play }>
                            <form onSubmit={ (e) => { this.playSpeechHandler(e, item.description, this.player) } }>
                                <audio ref={ ref => this.player = ref } type="audio/mpeg"></audio>
                                <button type="submit">Read Text</button>
                            </form>
                        </td>
                        <td className={ item.score > 0.8 ? styles.high : '' }>
                            { item.description }
                        </td>

                        <td className={ item.score > 0.8 ? styles.high + ' ' + styles.score : styles.score }>
                            { item.score.toFixed(2) }
                        </td>
                    </tr>
                );
            });

            const visuallySimilarImagesElements = this.props.result[0].visuallySimilarImages.map( (item, index) => {
                return (
                        <img key={ index + 1 } src={ item.url } height="100px" alt=" Similar image..."/>
                );
            });

            return (
              <div>
                <p className={ styles.desc }>Entities identified within the uploaded image</p>
                <table className={ styles.result + " table" }>
                    <tbody>
                        { webEntitiesElements }
                    </tbody>
                </table>

                <br/>

                <p className={ styles.desc }>Visually similiar images with the uploaded image</p>
                <div className={ styles.visuallySimilarImages }>
                    { visuallySimilarImagesElements }
                </div>
              </div>
            );
        } else {
            return (
              <div>
              </div>
            );
        }
    }
}

Result.propTypes = {
    result: PropTypes.array.isRequired
};

export default Result;