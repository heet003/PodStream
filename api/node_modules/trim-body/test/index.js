var trimBody = require('..');

describe('trim-body', function() {
  it('should work', function() {
    var body = {
      name: {
        first: ' First    ',
        last: '   Last'
      },

      email: '  user@example.com  '
    };

    trimBody(body);

    body.name.first.should.be.equal('First');
    body.name.last.should.be.equal('Last');
    body.email.should.be.equal('user@example.com');
  });

  it('should not work', function () {
    var body = [1, 2, 3]

    trimBody(body)

    body.length.should.equal(3)
  })
});