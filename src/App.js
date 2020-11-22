import React, { Component } from 'react';
import Papa from 'papaparse';
import books from './data/books.csv'
import magazines from './data/magazines.csv'

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            allMaterials: []
        };

        this.setAllMaterials = this.setAllMaterials.bind(this);
        this.searchByisbn = this.searchByisbn.bind(this);
    }

    componentWillMount() {
        this.getCsvData();
    }

    fetchCsv(material) {
        return fetch(material).then(function (response) {
            let reader = response.body.getReader();
            let decoder = new TextDecoder('utf-8');

            return reader.read().then(function (result) {
                return decoder.decode(result.value);
            });
        });
    }

    setAllMaterials(result) {
        this.setState({allMaterials: result.data.filter(
            c => c.isbn !== 'isbn'
        )});
    }
    

    async getCsvData() {
        let booksCSV = await this.fetchCsv(books);
        let magazinesCSV = await this.fetchCsv(magazines);
        let allCSV = booksCSV+magazinesCSV
        
        Papa.parse(allCSV, {
                complete: this.setAllMaterials,
                header: true,
                skipEmptyLines: true
            });
        
    }

    searchByisbn = () =>{
        
        const isbn=document.getElementById("searchByisbn").value

        if(isbn !== ''){
            const allMaterials = this.state.allMaterials.filter(
                c => c.isbn === isbn
            )
            if(allMaterials.length >0){this.setState({allMaterials})}else{
                alert('Not found please try again!')
            }

        }else{
            window.location.reload();
        }
    }

    searchByEmail = () =>{
        
        const email=document.getElementById("searchByEmail").value

        if(email !== ''){
            const allMaterials = this.state.allMaterials.filter(
                c => c.authors.includes(email)
            )
            if(allMaterials.length >0){this.setState({allMaterials})}else{
                alert('Not found please try again!')
            }

        }else{
            window.location.reload();
        }
    }

    sortByTitle = () =>{
        this.setState({allMaterials: this.state.allMaterials.sort((a, b) => a.title > b.title ? 1 : -1)})
    }

    render() {

        return (
            <React.Fragment>
            <label>
              Search by ISBN:
              <input type="text" id="searchByisbn" />
            </label>
            <button  type="button" onClick={this.searchByisbn}>Search</button>
            
            <label>
              Search by Author Email:
              <input type="text" id="searchByEmail" />
            </label>
            <button  type="button" onClick={this.searchByEmail}>Search</button>

            <label>Sorting:</label>
            <button  type="button" onClick={this.sortByTitle}>Sort by title</button>
            



            <table border="1">
            <tr>
                <th>title</th>
                <th>isbn</th>
                <th>authors</th>
                <th>description</th>
            </tr>
            {this.state.allMaterials.map(row=>
                <tr key={row.isbn}>
                    <th>{row.title}</th>
                    <th>{row.isbn}</th>
                    <th>{row.authors}</th>
                    <th>{row.description}</th>
                </tr>
                )}
            
            </table>
            <div>
</div>
            </React.Fragment>

        );
    }
}

export default App;