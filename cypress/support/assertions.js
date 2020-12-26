chai.util.addChainableMethod(chai.Assertion.prototype, 'calledWithMatches', function(matchConfigs) {
  const calls = this._obj.getCalls();

  matchConfigs.forEach(matchConfig => {
    if (!matchConfig.match) {
      throw new Error('Every item in calledWithMatches should have a match prop');
    }

    const matchedCalls = calls.filter(call => {
      return call.calledWithMatch(...Cypress._.castArray(matchConfig.match));
    });

    if ('times' in matchConfig) {
      chai.assert(
        matchConfig.times === matchedCalls.length,
        `${this._obj} was expected to be called with ${matchConfig.match} for ${matchConfig.times} times but got ${matchedCalls.length} times`
      );
    } else {
      chai.assert(
        matchedCalls.length > 0,
        `${this._obj} was expected to be called with ${matchConfig.match}`
      );
    }
  });
});
