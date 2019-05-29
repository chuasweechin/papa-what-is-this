import React from 'react';
import { hot } from 'react-hot-loader';

import Search from './components/search/search';
import Upload from './components/upload/upload';
import Result from './components/result/result';

import styles from './styles.scss'

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            result: [],
            valid: true,
            imageSrc: "",
            loading: false,
            imageFileName: ""
        };
    }

    uploadImageHandler(e) {
        if (e.target.value !== "") {
            const reactState = this;
            const fileReader = new FileReader();

            fileReader.addEventListener("load", function () {
                reactState.setState({ "imageSrc": fileReader.result });
            }, false);

            this.setState({ "valid": true , imageFileName: e.target.value.replace('C:\\fakepath\\','') });
            fileReader.readAsDataURL(e.target.files[0]);

            this.setState({ "result": [] });
        }
    }

    async searchHandler(e) {
        e.preventDefault();

        this.setState({ "result": [] });

        if (e.target.image.files.length === 0) {
            this.setState({ "valid": false });
        } else {
            this.setState({ "loading": true });

            const formData = new FormData();
            formData.append("file", e.target.image.files[0]);

            const response = await fetch("/analyzeImage", {
                'method': 'POST',
                'mode': 'cors',
                'credentials': 'same-origin',
                'referrer': 'no-referrer',
                'body': formData
            });

            if (response.status === 200) {
                const data = await response.json();
                this.setState({ "result": [data], "loading": false  });
            } else {
                alert("There is an internal server error. Please try again.");
                this.setState({ "result": [], "loading": false  });
            }
        }
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className={ styles.search + " col-md-5" }>
                            <Search
                                valid={ this.state.valid }
                                loading={ this.state.loading }
                                imageFileName={ this.state.imageFileName }
                                searchHandler={ (e) => { this.searchHandler(e); } }
                                uploadImageHandler={ (e) => { this.uploadImageHandler(e); } }
                            />
                            <br/>
                            <Upload
                                imageSrc={ this.state.imageSrc }
                            />
                        </div>
                        <div className={ styles.result + " col-md-7" }>
                            <Result
                                result={ this.state.result }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default hot(module)(App);