# trim-body

[![Build Status](https://travis-ci.org/samora/trim-body.svg)](https://travis-ci.org/samora/trim-body)

Trim parsed request body or any object with strings that needs trimming in one go.

__Note__: Modifies object in place.

## Installation

```
npm install trim-body
```

## Usage

```javascript
var trimBody = require('trim-body');

var body = {
  name: {
    first: ' First    ',
    last: '   Last'
  },

  email: '  user@example.com  '
};

trimBody(body);

// body === {
//   name: {
//     first: 'First',
//     last: 'Last'
//   },
//
//   email: 'user@example.com'
// }
```

## Tests

```
npm install -g mocha
```

Then,

```
npm test
```

## License
MIT