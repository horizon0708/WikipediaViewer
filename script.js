// User Story: I can search Wikipedia entries in a search box and see the resulting Wikipedia entries.
// User Story: I can click a button to see a random Wikipedia entry.


// $.ajax({
//     url: '//en.wikipedia.org/w/api.php',
//     data: { action: 'query', list: 'search', srsearch: 'Richard Feynman', format: 'json' },
//     dataType: 'jsonp',
//     success: function (x) {
//         ;
//     }
// });

class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            query: "",
            result: ""
        };
    }

    render() {
        return (

            <SearchInput />
        );
    }

}

class SearchInput extends React.Component {
    constructor() {
        super();
        this.state = {
            query: "",
            result: ""
        }
    }

    handleChange(e) {
        let y = e.target.value;
        this.setState({ query: e.target.value },
            () => {
                $.ajax({
                    url: '//en.wikipedia.org/w/api.php',
                    data: { action: 'query', list: 'search', srsearch: this.state.query, format: 'json' },
                    dataType: 'jsonp',
                    success: (x) => {
                        if (this.state.query == ""){
                            this.setState({result: ""});
                        }
                        if (this.state.query == y) { // without this, typing too fast may make wrong result come up due to async loading of results.
                            this.setState({result: x.query});
                        }
                    }
                });
            });
    }

    getResultList() {
        if (this.state.result) {
            let searchResult = this.state.result.search;
            return searchResult.map(x => <SearchResult query={x} />);
        } else {
            return;
        }
    }

    render() {
        return <div id="container">

            <div className="row">
                <div className="col l6 m8 s12 offset-m2 offset-l3">
                    <div className="col s12">
                        <div className="card white">
                            <div className ="card-content">
                                <div className="row">
                                    <input className="col s8 offset-s2" onChange={(e) => this.handleChange(e)} value={this.state.query} placeholder="Start Typing Here!" />
                                    <a href="https://en.wikipedia.org/wiki/Special:Random" target="_blank"><i className="material-icons col m1 s1">shuffle</i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col s12">
                        {this.getResultList()}
                    </div>
                </div>
            </div>
        </div>
    }
}

class SearchResult extends React.Component {

    createMarkup(text) {
        return { __html: text };
    }

    render() {
        return <a href={"https://en.wikipedia.org/wiki/" + this.props.query.title} target="_blank">

                        <div className="card white">
                            <div className="card-content">
                                <span className="card-title">{this.props.query.title}</span>
                                <span className="search-snippet" dangerouslySetInnerHTML={this.createMarkup(this.props.query.snippet)}></span>
                            </div>
                        </div>
                   </a>
    }
}

ReactDOM.render(<SearchInput />, document.getElementById("root"));