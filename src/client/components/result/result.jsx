import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss'

class Result extends React.Component {
  render() {
    if (this.props.result.length !== 0) {
        const webEntitiesElements = this.props.result[0].webEntities.map( (item, index) => {
            return (
                <tr key={ index + 1 }>
                    <td>
                        { index + 1 }
                    </td>
                    <td>
                        { item.description }
                    </td>
                    <td>
                        { item.score.toFixed(2) }
                    </td>
                </tr>
            );
        });

        return (
          <div>
            <h5>Analyzed Results:</h5>
            <table className={ styles.result + " table table-striped table-bordered" }>
                <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Description</th>
                      <th scope="col">Confidence Score</th>
                    </tr>
                </thead>
                <tbody>
                    { webEntitiesElements }
                </tbody>
            </table>

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