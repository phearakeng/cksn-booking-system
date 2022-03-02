import { Position } from '@angular/compiler';
import { Directive, DoCheck, ElementRef, HostListener, OnChanges, Renderer2, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Positioning } from '@ng-bootstrap/ng-bootstrap/util/positioning';
import { NgEventBus } from 'ng-event-bus';
import { element } from 'protractor';
import { MetaData } from 'ng-event-bus/lib/meta-data';


export class DataPosition {
  col: any
  row: any
}

export class Range {
  cursor: DataPosition | undefined
  start: DataPosition | undefined
  topLeft: DataPosition | undefined
  bottomRight: DataPosition | undefined
}

@Directive({
  selector: '[cellCursor]'
})
export class CellCursorDirective implements DoCheck, OnChanges {

  table: any
  @Output()
  selected: Range = new Range()
  hasFocus: boolean
  @Output() onDataPaste = new EventEmitter();
  @Output() onKeyPressEvent = new EventEmitter();
  shiftKey: boolean
  startPos: DataPosition

  mdclick: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2, private eventBus: NgEventBus) {
    this.table = this.el.nativeElement
    this.selected = new Range()
    this.hasFocus = false
    this.setCopyEvent();
    this.setPastEvent();
    this.eventBus.on('cellCursor').subscribe((meta: MetaData) => {
      this.hasFocus = meta.data.hasFocus
      this.mdclick = meta.data.mdclick
      console.log("meta", meta.data); // will receive 'started' only
    });

    //focus listener
    document.addEventListener('click', e => {
      console.log("mdclick", this.mdclick)
      if (this.mdclick == true) return;
      let htmleL = e.target as HTMLElement
      let tbElement = htmleL.parentElement.tagName
      if (tbElement == "TABLE" || tbElement == "TBODY" || tbElement == "TD" || tbElement == "TR") {
        this.hasFocus = true;
      }
      else {
        this.hasFocus = false;
      }

      console.log(this.hasFocus)
    });

    document.addEventListener('keyup', e => {
      if (!this.hasFocus) return;
      if (e.code == "ShiftLeft" || e.code == "ShiftRight") {
        this.shiftKey = false
      }

    })

    // key press listener
    document.addEventListener('keydown', e => {
      if (!this.hasFocus) return;
      // console.log(e.code)
      switch (e.code) {
        case 'ShiftRight':
        case 'ShiftLeft':
          this.shiftKey = e.shiftKey
          this.startPos = this.selected.start
          break;
        case 'ArrowUp':
          try {
            if (this.selected.cursor.row <= 1) return;

            this.selected.cursor.row = this.selected.cursor.row - 1
            this.setCurrent(this.selected.cursor, false)
            this.onKeyPress(e.code);
          } catch (error) {
            console.log(error)
          }
          break;
        case 'ArrowDown':
          try {
            if (this.rowLen() - 1 <= this.selected.cursor.row) return;
            this.selected.cursor.row = this.selected.cursor.row + 1
            this.setCurrent(this.selected.cursor, false)
            this.onKeyPress(e.code);
          } catch (error) {
            console.log(error)
          }
          break;

        case 'Tab':
          try {
            //  console.log(this.colLen())
            if (this.colLen() - 1 > this.selected.cursor.col) {
              this.selected.cursor.col = this.selected.cursor.col + 1
            }
            else if (this.colLen() - 1 <= this.selected.cursor.col) {
              this.selected.cursor.row = this.selected.cursor.row + 1
              this.selected.cursor.col = 1
            }
            this.setCurrent(this.selected.cursor, false)
            this.onKeyPress(e.code);
          } catch (error) {
            console.log(error)
          }
          break;
        case 'Enter':
          this.onKeyPress(e.code);
          break
      }
    })
  }


  // key move listener
  onKeyPress(key: string) {
    var b = this.getTBody();
    var cell = b.rows[this.selected.cursor.row].cells[1];
    this.onKeyPressEvent.emit({ key: key, cellVal: cell.innerText });
  }

  // copy/past event
  setCopyEvent() {
    document.addEventListener('copy', e => {
      if (!this.hasFocus) return;
      let data = this.tsvBuild(this.getSelectedCellValues(this.selected))
      //   console.log(data)
      var cd = (e.clipboardData);
      if (cd) {
        cd.setData('text/plain', data);
        e.preventDefault();
      }
    });
  }

  setPastEvent() {
    document.addEventListener('paste', e => {
      if (!this.hasFocus) return;
      var cd = (e.clipboardData), data;
      if (cd) {
        data = cd.getData('text/plain');
        this.readDataPasted(data)
      }
    });
  }
  // end 

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes)
    let v = this.selected && { topLeft: this.selected.topLeft, bottomRight: this.selected.bottomRight };

    this.drawAreaClass("area", v);
  }

  ngDoCheck(): void {
    this.drawCursorClass("cursor", this.selected.cursor)
    let v: any
    this.isShiftKeyPress()
    v = this.selected && { topLeft: this.selected.topLeft, bottomRight: this.selected.bottomRight };
    this.drawAreaClass("area", v);
  }

  @HostListener('keypress') onClick() {
    this.hasFocus = true
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
  }


  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    let selectedTD = event.target as HTMLElement;
    // console.log(event)
    // console.log("mousedown", selectedTD)
    this.select(this.getPosition(selectedTD), false);

    this.hasFocus = true;
    this.mousemove(event)
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    this.mousemove(event)
  }


  @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent) {
    this.hasFocus = false
  }

  @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent) {
    this.hasFocus = true
  }


  mousemove(event: MouseEvent) {
    let td = event.target as HTMLElement;
    this.select(this.getPosition(td), true);
  }


  /// get row, col index
  getPosition(td: any) {
    //   console.log(td.parentNode.parentNode.sectionRowIndex)
    //   console.log(this.el)
    // console.log("getPosition 1",td.localName=="td")
    // console.log("getPosition 2",td.querySelectorAll("div")[0].parentNode.parentNode.sectionRowIndex)
    // console.log("getPosition 3","row: " ,td.parentNode.parentNode.sectionRowIndex,
    //   "col: ",td.parentNode.cellIndex)

    if (td.localName == "td") {
      return {
        row: td.parentNode.sectionRowIndex,
        col: td.cellIndex
      }
    }
    else {
      return {
        row: td.parentNode.parentNode.sectionRowIndex,
        col: td.parentNode.cellIndex
      }
    }
  }

  select(pos: any, expanding: any) {
    if (!pos) return;

    var size = this.getTBodySize();
    if (!size || !size.row || !size.col) {
      return;
    }
    this.setCurrent(pos, expanding)
  }

  /*
      size of table
      row count,
      col count
  */
  getTBodySize() {
    let body = this.table.tBodies[0]
    let rowSize = body.childElementCount
    let colSize = body.firstChild.cells.length
    let tbSize = { row: rowSize, col: colSize }

    return tbSize;
  }



  Range(pos: any, expanding: any) {
    if (!pos) {
      // this.deselect();
    } else {
      this.setCurrent(pos, expanding);
    }
  }

  // set current position
  setCurrent(pos: any, expanding: any) {
    //console.log(pos)
    this.selected.cursor = this.ifMoving(this.selected.cursor, {
      row: pos.row,
      col: pos.col
    });
    if (typeof (expanding) == 'object') {
      this.selected.start = this.ifMoving(this.selected.start, {
        row: expanding.row,
        col: expanding.col
      });
    }
    if (!expanding || !this.selected.start) {
      this.selected.start = this.selected.topLeft = this.selected.bottomRight = this.selected.cursor;
    } else {
      this.selected.topLeft = this.ifMoving(this.selected.topLeft, {
        row: Math.min(this.selected.start.row, this.selected.cursor.row),
        col: Math.min(this.selected.start.col, this.selected.cursor.col)
      });
      this.selected.bottomRight = this.ifMoving(this.selected.bottomRight, {
        row: Math.max(this.selected.start.row, this.selected.cursor.row),
        col: Math.max(this.selected.start.col, this.selected.cursor.col)
      });
    }
    // console.log(this.selected)
  };

  // deselect () {
  //   this.cursor = this.start = this.topLeft = this.bottomRight = undefined;
  // };

  /** if old == pos, return old (for object reference-level equality) */
  ifMoving(old: any, pos: any) {
    return (!old || old.row != pos.row || old.col != pos.col) ? pos : old;
  }

  /**
 * set class for tr as `tr.area`, `tr.area-t` (top), `tr.area-b` (bottom),
 * and set class for td as `td.area`, `td.area-l` (left), `td.area-r` (right).
 * @param klass:string area class name
 * @param v:{bottomRight:{row,col},bottomRight:{row,col}} new area range
 */
  drawAreaClass(klass: any, v: any) {

    if (this.selected.cursor == undefined || this.selected.cursor.col == this.colLen() - 1) return;

    try {
      var b, r, td, tr, c;
      b = this.getTBody();
      if (b == undefined) return;
      $(this.el.nativeElement.querySelectorAll("tbody>tr>td." + klass))
        .removeClass(klass + " " + klass + "-l " + klass + "-r");
      $(this.el.nativeElement.querySelectorAll("colgroup>col." + klass))
        .removeClass(klass + " " + klass + "-l " + klass + "-r");
      $(this.el.nativeElement.querySelectorAll("tbody>tr." + klass))
        .removeClass(klass + " " + klass + "-t " + klass + "-b");
      if (v && v.topLeft) {
        for (r = v.topLeft.row, tr = b.rows[r]; r <= v.bottomRight.row && tr; r++, tr = b.rows[r]) {
          $(tr).addClass(klass);
          if (r == v.topLeft.row) {
            $(tr).addClass(klass + "-t");
          }
          if (r == v.bottomRight.row) {
            $(tr).addClass(klass + "-b");
          }
          for (c = v.topLeft.col, td = tr.cells[c]; c <= v.bottomRight.col && td; c++, td = tr.cells[c]) {
            $(td).addClass(klass);
            if (c == v.topLeft.col) {
              $(td).addClass(klass + "-l");
            }
            if (c == v.bottomRight.col) {
              $(td).addClass(klass + "-r");
            }
          }
        }
      }
    }
    catch (e) {
      console.log(e)
    }

  }
  /**
   * set class for tr and td as `.cursor`,
   * @param klass:string area class name
   * @param v:{bottomRight:{row,col},bottomRight:{row,col}} new area range
   */
  drawCursorClass(klass: any, pos: any) {

    $(this.el.nativeElement.querySelectorAll("tbody>tr>td." + klass)).removeClass(klass);
    $(this.el.nativeElement.querySelectorAll("colgroup>col." + klass)).removeClass(klass);
    $(this.el.nativeElement.querySelectorAll("tbody>tr." + klass)).removeClass(klass);
    if (pos) {
      let td = this.getTD(pos)
      if (td) {
        //   $(this.selectedTD).addClass(klass);
        //   $(this.selectedTD.parentNode).addClass(klass);
        // this.renderer.addClass(this.selectedTD.childNodes,klass)
        this.renderer.addClass(td, klass)
      }
      //   $(this.col(v.col)).addClass(klass);
    }
  }

  // if shift is pressed for holding, it's mean user try multi selected
  isShiftKeyPress() {
    if (this.shiftKey) {
      if (this.startPos.row == this.selected.start.row) {
        if (this.selected.start.col < this.startPos.col) {
          let tmpObj = Object.create(this.startPos)
          this.startPos = this.selected.start
          this.selected.start = tmpObj
          this.selected.topLeft = tmpObj
        }
        else if (this.selected.start.col > this.startPos.col) {
          this.selected.start = this.startPos
          this.selected.topLeft = this.startPos
        }
      }
      else if (this.startPos.row < this.selected.start.row) {
        this.selected.start = this.startPos
      }
      else if (this.startPos.row > this.selected.start.row) {
        let tmObj = Object.create(this.startPos)
        this.selected.start = tmObj
        this.selected.bottomRight = tmObj
      }
    }
  }


  getTD(pos: DataPosition) {
    if (!pos) return;
    // this.el.nativeElement.tBodies[0].rows[1].cells[1].focus()
    var b = this.getTBody()
    if (b) {
      var tr = b.rows[pos.row];
      if (tr && tr.cells) {
        return tr.cells[pos.col];
      }
    }
  };

  public rowLen() {
    var b = this.getTBody();
    return b.rows.length;
  }

  public colLen() {
    var b = this.getTBody();
    if (b == undefined || b.rows == undefined || b.rows[1] == undefined) return 0;

    return b.rows[1].cells.length;
  }

  public getTBody() {
    return this.el.nativeElement.tBodies[0];
  }

  /**
   * @param selected:Range|undefined  if selected is undefined, set for cursor selected range
   * @return values:[[v:Any,v:Any,....]] selected area values
   */
  public getSelectedCellValues(selected: any) {
    var ret = [];
    var rows = this.getSelectedCells(selected);
    for (var r = 0; r < rows.length; r++) {
      var cells = rows[r].cells;
      var vals = [];
      for (var c = 0; c < cells.length; c++) {
        vals.push(this.getCellViewValue(cells[c].cell));
      }
      ret.push(vals);
    }
    return ret;
  };

  getCellViewValue(td: any) {
    if (td) {
      return td.textContent
    }
  }

  getSelectedCells(selected: any) {
    if (typeof (selected) == 'undefined') selected = this.selected;
    var rows = this.getSelectedRows(selected);
    var ret = [];
    for (var i = 0, l = rows.length; i < l; i++) {
      var tdlist = rows[i].tr.cells;
      var r = rows[i].row;
      var cells = [];
      for (var j = selected.topLeft.col, jl = selected.bottomRight.col; j <= jl; j++) {
        cells.push({ row: r, col: j, cell: tdlist[j] });
      }
      ret.push({ row: r, cells: cells });
    }
    return ret;
  }

  getSelectedRows(selected: any) {
    //  console.log(this.el.nativeElement.tBodies[0])
    if (typeof (selected) == 'undefined') selected = this.selected;
    var ret: any = [];
    if (!selected.cursor) return ret;
    let rows = this.getTBody().rows;
    for (var i = selected.topLeft.row, l = selected.bottomRight.row; i <= l; i++) {
      if (!rows[i]) break;
      ret.push({ row: i, tr: rows[i] });
    }
    return ret;
  }

  getCellViewValuefunction(td: any) {
    var e = this.el.nativeElement.element(td);
    var c = e.controller("cellCursorOptions") || e.controller("cellCursorCell");
    if (c) {
      var r = c.getValueOpt();
      if (r) {
        return r[0];
      }
    }
    c = e.controller("ngModel");
    if (c) {
      return c.$viewValue;
    }
  };

  tsvBuild(arr: any) {
    if (arr && arr.length) {
      var str = [];
      for (var i = 0; i < arr.length; i++) {
        var a = arr[i];
        var r = [];
        for (var j = 0; j < a.length; j++) {
          var v = a[j];
          if (typeof (v) == 'string') {
            if (v.indexOf("\n") > -1) {
              r.push('"' + v.replace(/"/g, '""') + '"');
            } else {
              r.push(v);
            }
          } else {
            r.push((v === null || v === undefined) ? "" : v);
          }
        }
        str.push(r.join("\t"));
      }
      return str.join("\n");
    }
    return arr;
  }

  // read pasted data 
  readDataPasted(vals: any) {
    if (vals == undefined) return;
    let data = vals.split('\n');
    let row: any = []
    data.forEach((element: any) => {
      row.push(element.split("\t"))
    });
    //this.parseToTb(row)
    //  this.onDataPaste.emit({dataPaste:row,position:this.selected})
    this.onDataPaste.emit({ dataPaste: row })
  }


  stopEvent(e: any) {
    e.stopPropagation();
    e.preventDefault();
    e.stopImmediatePropagation();
  }

}


