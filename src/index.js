module.exports = function solveSudoku(matrix) {
  
  ClassSudoku = function(arrSud) {
    
    var solvingArray = [];
    var step = 0;
  
    createSolvingArray(arrSud);
    solve();

    function createSolvingArray(arrSud) {
      step = 0;
      var candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for ( var i=0; i<9; i++) {
        solvingArray[i] = [];     //solvingArray[0]=[]
        for ( var j=0; j<9; j++ ) {
          if ( arrSud[i][j] ) {           //arrSud[0][0]
            solvingArray[i][j] = [arrSud[i][j], 'exist', []];
          }
          else {
            solvingArray[i][j] = [0, 'missing', candidates];
          }
        }
      }
    }; // end of method createSolvingArray()

    function solve() {
      var alter = 0;
      do {
        alter = updateCandidates();
        step++;
        if ( 81 < step ) {
          break;
        }
      } while (alter);

      if ( !isSolved() && !isFailed() ) {
        goback();
      }
    }; // end of method solve()

    function updateCandidates() {
      var alter = 0;
      
      for ( var i=0; i<9; i++) {
        for ( var j=0; j<9; j++) {
          if ( 'missing' != solvingArray[i][j][1] ) {
            continue;
          }
          alter += solveSingle(i, j);
        }
      }
      return alter;
    }; // end of methos updateCandidates()

    function solveSingle(i, j) {
      solvingArray[i][j][2] = differ(solvingArray[i][j][2], inRow(i));
      solvingArray[i][j][2] = differ(solvingArray[i][j][2], inColumn(j));
      solvingArray[i][j][2] = differ(solvingArray[i][j][2], inSection(i, j));
      if ( 1 == solvingArray[i][j][2].length ) {
        markSolved(i, j, solvingArray[i][j][2][0]);
        return 1;
      }
      return 0;
    }; // end of method solveSingle()

    function markSolved(i, j, solve) {
      solvingArray[i][j][0] = solve;
      solvingArray[i][j][1] = 'solved';
    }; // end of method markSolved()

    function inRow(i) {
      var content = [];
      for ( var j=0; j<9; j++ ) {
        if ( 'missing' != solvingArray[i][j][1] ) {
          content[content.length] = solvingArray[i][j][0];
        }
      }
      return content;
    }; // end of method inRow()

    function inColumn(j) {
      var content = [];
      for ( var i=0; i<9; i++ ) {
        if ( 'missing' != solvingArray[i][j][1] ) {
          content[content.length] = solvingArray[i][j][0];
        }
      }
      return content;
    }; // end of method inColumn()

    function inSection(i, j) {
      var content = [];
      var offset = sectionOffset(i, j);
      for ( var k=0; k<3; k++ ) {
        for ( var l=0; l<3; l++ ) {
          if ( 'missing' != solvingArray[offset.i+k][offset.j+l][1] ) {
            content[content.length] = solvingArray[offset.i+k][offset.j+l][0];
          }
        }
      }
      return content;
    }; // end of method inSection()

    function differ (array1, array2) {
      var arrays_differ = [];
      for ( var i=0; i<array1.length; i++ ) {
        var is_found = false;
        for ( var j=0; j<array2.length; j++ ) {
          if ( array1[i] == array2[j] ) {
            is_found = true;
            break;
          }
        }
        if ( !is_found ) {
          arrays_differ[arrays_differ.length] = array1[i];
        }
      }
      return arrays_differ;
    }; // end of method differ()

    function sectionOffset(i, j) {
      var obj = {
        j: Math.floor(j/3)*3,
        i: Math.floor(i/3)*3
      };
      return obj;
    }; // end of method sectionOffset()

    function isSolved() {
      var is_solved = true;
      for ( var i=0; i<9; i++) {
        for ( var j=0; j<9; j++ ) {
          if ( 'missing' == solvingArray[i][j][1] ) {
            is_solved = false;
          }
        }
      }
      return is_solved;
    }; // end of method isSolved()

    this.isSolved = function() {
      return isSolved();
    }; // end of public method isSolved()

    function isFailed() {
      var is_failed = false;
      for ( var i=0; i<9; i++) {
        for ( var j=0; j<9; j++ ) {
          if ( 'missing' == solvingArray[i][j][1] && !solvingArray[i][j][2].length ) {
            is_failed = true;
          }
        }
      }
      return is_failed;
    }; // end of method isFailed()

    this.isFailed = function() {
      return isFailed();
    }; // end of public method isFailed()

    function goback() {
      goback_call++;
      var arrSud = [[], [], [], [], [], [], [], [], []];
      var i_min=-1, j_min=-1, numberOfCandidates=0;
      for ( var i=0; i<9; i++ ) {
        arrSud[i].length = 9;
        for ( var j=0; j<9; j++ ) {
        arrSud[i][j] = solvingArray[i][j][0];
          if ( 'missing' == solvingArray[i][j][1] && (solvingArray[i][j][2].length < numberOfCandidates || !numberOfCandidates) ) {
            numberOfCandidates = solvingArray[i][j][2].length;
            i_min = i;
            j_min = j;
          }
        }
      }

      for ( var k=0; k<numberOfCandidates; k++ ) {
        arrSud[i_min][j_min] = solvingArray[i_min][j_min][2][k];
          
        var sudoku2Back = new ClassSudoku(arrSud);
        if ( sudoku2Back.isSolved() ) {
            
          out_val = sudoku2Back.solved();
          
          for ( var i=0; i<9; i++ ) {
            for ( var j=0; j<9; j++ ) {
              if ( 'missing' == solvingArray[i][j][1] ) {
                markSolved(i, j, out_val[i][j][0])
              }
            }
          }
          return;
        }
      }
    }; // end of function goback)(

    this.solved = function() {
      return solvingArray;
    }; // end of solved()

  }; // end of class

  var goback_call = 0;
  var sudoku1 = new ClassSudoku(matrix);
  var arr = sudoku1.solved();
  var result = [[],[],[],[],[],[],[],[],[]];
  for(var i=0; i < 9; i++) {
    for(var j = 0; j < 9; j++) {
      result[i][j] = arr[i][j][0];
    }
  }  
  return result;
}
