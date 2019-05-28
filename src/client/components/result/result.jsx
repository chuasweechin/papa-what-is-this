import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss'

class Result extends React.Component {
    render() {
        if (this.props.result.length !== 0) {
            const webEntitiesElements = this.props.result[0].webEntities.map( (item, index) => {
                return (
                    <tr key={ index + 1 }>
                        <td className={ item.score > 0.8 ? styles.high : '' }>
                            { item.description }
                        </td>
                        <td className={ item.score > 0.8 ? styles.high : '' }>
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
                <div>
                    <p className={ styles.desc }>Entities identified within the uploaded image.</p>
                    <table className={ styles.result + " table" }>
                        <tbody>
                            { webEntitiesElements }
                        </tbody>
                    </table>
                </div>
                <br/>

                <p className={ styles.desc }>Visually similiar images with the uploaded image.</p>
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