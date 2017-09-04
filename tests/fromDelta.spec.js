var render = require('../src/fromDelta'),
  expect = require('chai').expect;

describe('fromDelta', function() {

  it('renders inline format', function() {

    expect(render([
      {
        "insert": "Hi "
      },
      {
        "attributes": {
          "bold": true
        },
        "insert": "mom"
      }
    ]))
    .to.equal('Hi **mom**\n');

  });

  it('renders embed format', function() {

    expect(render([
      {
        "insert": "LOOK AT THE KITTEN!\n"
      },
      {
        "insert": "\n",
        "attributes": {
          "type": "image",
          "data": {
            "url": "https://placekitten.com/g/200/300",
          }
        },
      }
    ]))
    .to.equal('LOOK AT THE KITTEN!\n![](https://placekitten.com/g/200/300)\n');

  });

  it('renders block format', function() {

    expect(render([
      {
        "insert": "Headline"
      },
      {
        "attributes": {
          "type": "header-one"
        },
        "insert": "\n"
      }
    ]))
    .to.equal('# Headline\n');
  });

  it('renders lists with inline formats correctly', function() {

    expect(render([
      {
        "attributes": {
          "italic": true
        },
        "insert": "Glenn v. Brumby"
      },
      {
        "insert": ", 663 F.3d 1312 (11th Cir. 2011)"
      },
      {
        "attributes": {
          "type": 'ordered-list-item'
        },
        "insert": "\n"
      },
      {
        "attributes": {
          "italic": true
        },
        "insert": "Barnes v. City of Cincinnati"
      },
      {
        "insert": ", 401 F.3d 729 (6th Cir. 2005)"
      },
      {
        "attributes": {
          "type": 'ordered-list-item'
        },
        "insert": "\n"
      }
    ]))
    .to.equal('1. *Glenn v. Brumby*, 663 F.3d 1312 (11th Cir. 2011)\n2. *Barnes v. City of Cincinnati*, 401 F.3d 729 (6th Cir. 2005)\n');

  });

  it('renders adjacent lists correctly', function() {

    expect(render([
      {
        "insert": "Item 1"
      },
      {
        "insert": "\n",
        "attributes": {
          "type": 'ordered-list-item'
        }
      },
      {
        "insert": "Item 2"
      },
      {
        "insert": "\n",
        "attributes": {
          "type": 'ordered-list-item'
        }
      },
      {
        "insert": "Item 3"
      },
      {
        "insert": "\n",
        "attributes": {
          "type": 'ordered-list-item'
        }
      },
      {
        "insert": "Intervening paragraph\nItem 4"
      },
      {
        "insert": "\n",
        "attributes": {
          "type": 'ordered-list-item'
        }
      },
      {
        "insert": "Item 5"
      },
      {
        "insert": "\n",
        "attributes": {
          "type": 'ordered-list-item'
        }
      },
      {
        "insert": "Item 6"
      },
      {
        "insert": "\n",
        "attributes": {
          "type": 'ordered-list-item'
        }
      }
    ]))
    .to.equal('1. Item 1\n2. Item 2\n3. Item 3\n\nIntervening paragraph\n1. Item 4\n2. Item 5\n3. Item 6\n');

  });

  it('renders adjacent inline formats correctly', function() {
    expect(render([
      {
        "attributes" : {
          "italic" : true
        },
        "insert" : "Italics! "
      },
      {
        "attributes": {
          "italic": true,
          "entity": {
            "type": "LINK",
            "data": {
              "url": "http://example.com"
            }
          }
        },
        "insert": "Italic link"
      },
      {
        "attributes": {
          "entity": {
            "type": "LINK",
            "data": {
              "url": "http://example.com"
            }
          }
        },
        "insert": " regular link"
      }

    ]))
    .to.equal('*Italics! [Italic link](http://example.com)*[ regular link](http://example.com)'+"\n");
  })

  it('render an inline link', function () {
    expect(render([
      {
        "insert" : "Go to Google",
        "attributes": {
          "entity": {
            "type": "LINK",
            "data": {
              "url": "https://www.google.fr",
            }
          }
        }
      }
    ]))
    .to.equal(
      '[Go to Google](https://www.google.fr)' + "\n"
    )
  })

 it('renders todo block', function() {
    expect(render([
      {
        "insert" : "First todo"
      },
      {
        "attributes": {
          "type": "todo-block",
          "data": {
            "checked": false,
          }
        },
        "insert": "\n"
      },
      {
        "insert" : "Second todo"
      },
      {
        "attributes": {
          "type": "todo-block",
          "data": {
            "checked": true,
          }
        },
        "insert": "\n"
      },
    ]))
    .to.equal(
      '- [ ] First todo' + "\n" +
      '- [x] Second todo' + "\n"
    )
  })

   it('renders a separator block', function() {
      expect(render([
        {
          "insert" : "Before\n"
        },
        {
          "attributes": {
            "type": "separator",
          },
          "insert": "\n"
        },
        {
          "insert" : "After\n"
        },
      ]))
      .to.equal(
        'Before' + "\n" +
        '---' + "\n" +
        'After' + "\n"
      )
    })
})
