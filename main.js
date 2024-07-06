// 計算機の機能
class Calculator {
  constructor() {
    this.arr = [];
    this.result = undefined;
    this.formula = '';
    this.number = '';
    this.operator = '';
    this.keep = undefined;
    this.isOperator = false;
    this.board = new Board(this);
  }

  numBtn(num) {
    if ((this.number === '' && Number(num) === 0 && !this.isOperator) || this.number.length > 10) return;
    Btn.operatorClassReset();
    if (this.result) this.result = undefined;
    if (this.number === '') this.operatorPush();
    this.isOperator = false;
    this.number += num;
    this.board.display(this.number);
  }

  // 項の確定
  numberPush() {
    if (this.isOperator) return;
    if (this.number.length === 0) this.number = 0;
    if (this.result) {
      this.number = this.result;
      this.result = undefined;
    }

    this.number = Number(this.number);
    this.formula += this.number;
    if (this.keep) this.mulOrDiv();
    this.arr.push(this.number);
    this.number = '';
    this.keep = undefined;
  }

  // 演算子の確定
  operatorPush() {
    if (this.operator === '') return;
    this.formula += this.operator;
    if (this.operator === '×' || this.operator === '÷') {
      this.keep = this.arr.pop();
      this.isMul = this.operator === '×';
      return this.operator = '';
    }
    this.arr.push(this.operator);
    this.operator = '';
  }

  operatorSelect(operator) {
    this.isOperator = true;
    this.operator = operator;
    let num = 0;
    if (this.arr.length === 0) {
      num = 0;
    } else if (operator === '+' || operator === '-') {
      num = this.evaluate();
    } else {
      num = this.arr[this.arr.length - 1];
    }
    this.board.display(num);
  }


  mulOrDiv() {
    if (this.isMul) {
      return this.number = this.keep * this.number;
    }
    this.number = this.keep / this.number;
  }

  evaluate() {
    let isplus = true;
    let total = 0;

    this.arr.forEach(a => {
      if (typeof a === 'number') {
        isplus ? total += a : total -= a;
      } else {
        isplus = a === '+';
      }
    });
    return total;
  }

  // =ボタン
  total() {
    if(!this.keep && this.arr.length === 0) return
    if (this.number === '') return;
    this.numberPush();
    this.t = this.evaluate();
    this.board.display(this.t);
    this.result = `${this.t}`;
    this.memoPush(this.t);
    this.clear2();
  }

  memoPush() {
    const memo = document.getElementById('memo');
    const p = document.createElement('p');
    p.textContent = `${this.formula} = ${this.t}`;
    memo.appendChild(p);
    const memoBtn = document.getElementById('memo-clear');
    memoBtn.hidden = false;
  }

  // +/-ボタン
  change() {
    if (this.number === '') return;
    this.number = `${Number(this.number) * -1}`;
    this.board.display(this.number);
  }

  // Cボタン
  clear() {
    this.number = '';
    this.board.display(this.number);
    const lastType = this.keep ? (this.operator === '×' ? '×' : '÷') : this.arr[this.arr.length - 1];
    if (typeof lastType !== 'string') return;
    const opeBtns = document.querySelectorAll('.operator');
    const part = ['÷', '×', '-', '+'].indexOf(lastType);
    opeBtns[part].classList.add('select')
  }

  // CAボタン
  clearAll() {
    this.arr = [];
    this.result = undefined;
    this.formula = '';
    this.number = '';
    this.operator = '';
    this.keep = undefined;
    this.isOperator = false;
    this.board.display(this.number);
    Btn.operatorClassReset();
  }

  clear2() {
    this.arr = [];
    this.number = '';
    this.formula = '';
    this.operator = '';
    this.keep = undefined;
    this.isOperator = false;
    Btn.operatorClassReset();
  }
}

class Board {
  constructor(calculator) {
    const board = document.getElementById('control');
    const texts = ['CA', 'C', '+/-', '÷', 7, 8, 9, '×', 4, 5, 6, '-', 1, 2, 3, '+', 0, '00', '='];
    texts.forEach(text => {
      const btn = new Btn(text, calculator);
      board.appendChild(btn.getBtn());
    });
    this.memoClearBtn = document.getElementById('memo-clear');
    this.memoClearBtn.addEventListener('click', () => this.memoClear());
  }

  memoClear() {
    const memo = document.getElementById('memo');
    while(memo.firstChild) {
      memo.removeChild(memo.firstChild);
    }
    this.memoClearBtn.hidden = true;
  }

  display(num) {
    const input = document.getElementById('result');
    input.textContent = Number(num);
  }
}

class Btn {
  constructor(text, calculator) {
    this.calculator = calculator;
    this.btn = document.createElement('button');
    this.btn.textContent = text;
    this.btn.classList.add('btn');
    if (text === '00') this.btn.classList.add('flex2');
    if (['+', '-', '×', '÷'].includes(text)) this.btn.classList.add('operator');
    this.btn.addEventListener('click', () => this.sorting());
  }

  sorting() {
    const value = this.btn.textContent;
    if (value === 'C') {
      this.calculator.clear();
    } else if (value === 'CA') {
      this.calculator.clearAll();
    } else if (!isNaN(Number(value))) {
      this.calculator.numBtn(value);
    } else if (value === '+/-') {
      this.calculator.change();
    } else if (value === '=') {
      this.calculator.total();
    } else {
      this.calculator.numberPush();
      this.calculator.operatorSelect(value);
      this.operatorClass();
    }
  }

  operatorClass() {
    Btn.operatorClassReset();
    this.btn.classList.add('select');
  }

  static operatorClassReset() {
    const operatorBtns = document.querySelectorAll('.operator');
    operatorBtns.forEach(opbtn => {
      opbtn.classList.remove('select');
    });
  }

  getBtn() {
    return this.btn;
  }
}

new Calculator();