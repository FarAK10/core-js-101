/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  const obj = {};
  obj.width = width;
  obj.height = height;
  obj.getArea = () => width * height;
  return obj;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.create(proto, Object.getOwnPropertyDescriptors(JSON.parse(json)));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class CssSelector {
  constructor(arg = '') {
    this.position = 0;
    this.hasElement = false;
    this.hasId = false;
    this.hasClass = false;
    this.hasAttribute = false;
    this.hasPseudoClass = false;
    this.hasPseudoEl = false;
    this.str = arg;
  }

  isValidPosition(index) {
    this.error1 = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
    if (this.position > index) {
      throw new Error(this.error1);
    }
  }

  isValidRepeat(isRepeated) {
    this.error2 = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    if (isRepeated) {
      throw new Error(this.error2);
    }
  }


  element(value) {
    this.isValidRepeat(this.hasElement);
    this.hasElement = true;
    this.isValidPosition(1);
    this.position = 1;
    this.str += `${value}`;
    return this;
  }

  id(value) {
    this.isValidRepeat(this.hasId);
    this.hasId = true;
    this.isValidPosition(2);
    this.position = 2;
    this.str += `#${value}`;
    return this;
  }

  class(value) {
    this.isValidPosition(3);
    this.position = 3;
    this.str += `.${value}`;
    return this;
  }

  attr(value) {
    this.isValidPosition(4);
    this.position = 4;
    this.str += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    this.isValidPosition(5);
    this.position = 5;
    this.str += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    this.isValidRepeat(this.hasPseudoEl);
    this.hasPseudoEl = true;
    this.isValidPosition(6);
    this.position = 6;
    this.str += `::${value}`;
    return this;
  }


  stringify() {
    return this.str;
  }
}
const cssSelectorBuilder = {
  element(value) {
    return new CssSelector().element(value);
  },

  id(value) {
    return new CssSelector().id(value);
  },

  class(value) {
    return new CssSelector().class(value);
  },

  attr(value) {
    return new CssSelector().attr(value);
  },

  pseudoClass(value) {
    return new CssSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CssSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new CssSelector(`${selector1.stringify()} ${combinator} ${selector2.stringify()}`);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
