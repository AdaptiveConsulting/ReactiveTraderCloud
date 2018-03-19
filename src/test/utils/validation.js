module.exports = {
  valNumberOfElements: function(browser, elemVals) {
    return function iter(elems) {
      let i = 0;
      elems.value.forEach(function(element) {
        browser.elementIdText(element.ELEMENT, function(result) {
          browser.assert.equal(result.value, elemVals[i]);
          i++;
        });
      });
    };
  }
};
