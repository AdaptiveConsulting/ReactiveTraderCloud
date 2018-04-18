module.exports = {
  valNumberOfElements: (browser, elemVals) => {
    return function iter(elems) {
      elems.value.map((element, index) => {
        browser.elementIdText(element.ELEMENT, function(result) {
          console.log(result.value);
          browser.assert.equal(result.value, elemVals[index]);
        });
      });
    };
  }
};
