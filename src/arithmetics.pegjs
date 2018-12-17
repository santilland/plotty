/*
 * Simple Arithmetics Grammar
 * ==========================
 *
 * Accepts expressions like "2 * (3 + 4)" and computes their value.
 */

{
    function makeNode(lhs, rhs, op) {
      if (typeof lhs === 'number' && typeof rhs === 'number') {
        switch(op) {
          case '+':
            return lhs + rhs;
          case '-':
            return lhs - rhs;
          case '*':
            return lhs * rhs;
          case '/':
            return lhs / rhs;
          default:
            break;
        }
      }

      return {
        lhs: lhs,
        rhs: rhs,
        op: op
      };
    }
}

Expression
  = head:Term tail:(_ ("+" / "-") _ Term)* {
      var lhs = head;
      var i, op;

      for (i = 0; i < tail.length; i++) {
        op = tail[i][1];
        lhs = makeNode(lhs, tail[i][3], op);
      }

      return lhs;
    }

Term
  = head:Factor tail:(_ ("*" / "/") _ Factor)* {
      var lhs = head;
      var i, op;

      for (i = 0; i < tail.length; i++) {
        op = tail[i][1];
        lhs = makeNode(lhs, tail[i][3], op);
      }

      return lhs;
    }

Factor
  = "(" _ expr:Expression _ ")" { return expr; }
  / Float
  / Integer
  / Identifier

Float "float"
  = [0-9]+.[0-9]+ { return parseFloat(text(), 10); }

Integer "integer"
  = [0-9]+ { return parseInt(text(), 10); }

Identifier "identifier"
  = [a-zA-Z_$][a-zA-Z_$0-9]* { return text(); }

_ "whitespace"
  = [ \t\n\r]*
