class BlotterPage {

    getAllTradeTableHeader() { 
     return cy.get('caption[id=trades-table-heading]+thead th div')
    }
    
    getOneTradeTableData(pos) { 
        return cy.get('caption[id=trades-table-heading]+thead+tbody tr td:nth-child(' + pos + ')')
       }
    getOneTableHeader(pos) {
        return cy.get('caption[id=trades-table-heading]+thead th:nth-child(' + pos + ') div')
    }
    
    getCheckboxFilterIcon(pos) {
        return cy.get('caption[id=trades-table-heading]+thead th:nth-child(' + pos + ') div svg')
    }
    
    getListOfSearchCriteria(pos) {
        return cy.get('caption[id=trades-table-heading]+thead th:nth-child(' + pos + ') div span:nth-child(3) div div')
    }
    
    getSearchFieldUnderDropDown(pos){
        return cy.get('caption[id=trades-table-heading]+thead th:nth-child(' + pos + ') div span:nth-child(3) div input')
    }
    
    getSelectOptionForCheckBox(pos){
        return cy.get('caption[id=trades-table-heading]+thead th:nth-child(' + pos + ') div span:nth-child(3) div select')
    }
    
    }
    export default BlotterPage