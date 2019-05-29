import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss'

class Search extends React.Component {
    render() {

        const valid = this.props.valid === true ? `${ styles.upload } custom-file-input` : `${ styles.upload } custom-file-input is-invalid`;

        const errorMsg = this.props.valid === true ? '' : (<div className="invalid-feedback">Please upload an image.</div>);
        const imageFileName = this.props.imageFileName === "" ? 'Choose an image to upload' : (this.props.imageFileName);

        return (
            <div className={ styles.form }>
                {
                    this.props.loading === false ? (
                        <form onSubmit={ (e) => { this.props.searchHandler(e) } }>
                            <h5>Upload an image to check out what is it!</h5>
                            <div className="input-group mb-3">
                                <div className="custom-file">
                                    <input
                                        onChange={ (e) => { this.props.uploadImageHandler(e) } }
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className={ valid }
                                        id="inputGroupFile01"
                                        aria-describedby="inputGroupFileAddon01"
                                    />
                                    <label className={ styles.upload + " custom-file-label" } htmlFor="inputGroupFile01">{ imageFileName }</label>
                                    { errorMsg }
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Analyze image</button>
                        </form>
                    ) : (
                        <form onSubmit={ (e) => { this.props.searchHandler(e) } }>
                            <h5>Upload an image to check out what is it!</h5>
                             <div className="input-group mb-3">
                                <div className="custom-file">
                                    <input
                                        onChange={ (e) => { this.props.uploadImageHandler(e) } }
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className={ valid }
                                        id="inputGroupFile01"
                                        aria-describedby="inputGroupFileAddon01"
                                        disabled
                                    />
                                    <label className={ styles.upload + " custom-file-label" } htmlFor="inputGroupFile01">{ imageFileName }</label>
                                    { errorMsg }
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled>
                              <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"/>
                              Analyzing image...
                            </button>
                        </form>
                    )
                }
            </div>
        );
    }
}

Search.propTypes = {
    valid: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    searchHandler: PropTypes.func.isRequired,
    imageFileName: PropTypes.string.isRequired,
    uploadImageHandler: PropTypes.func.isRequired,
};

export default Search;