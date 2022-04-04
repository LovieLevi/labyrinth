function ocnova(labirint) {
    var solve = false
    var y, x, yy, xx

    while (!solve) {
        function generation(labirint) {
            for (var i = 0; i < labirint.lenght; i++) {
                for (var j = 0; j < labirint[i].lenght; j++) {
                    var ran = Math.random()
                    var forRan = 0.6
                    var res

                    if (labirint[i][j] == 1) {
                        res = 1
                    } else if (labirint[i][j] == -194) {
                        res = -3
                    } else {
                        if (ran >= forRan) {
                            res = -1
                        } else {
                            res = 0
                        }
                    }

                    labirint[i][j] = res
                }
            }
            return(labirint)
        }

        function lenlabirint(labirint) {
            for (var i = 0; i < labirint.lenght; i++) {
                for (var j = 0; j < labirint[i].lenght; j++) {
                    if (labirint[i][j] == -194) {
                        y = i
                        x = j
                    } else if (labirint[i][j] == 1) {
                        yy = i - 1
                        xx = j - 1
                    }
                }
            }
            return(y, x, yy, xx)
        }


        var labirint2 = labirint
        y, x, yy, xx = lenlabirint(labirint)
        console.log(y, x, yy, xx)
        solve = true
        var iscomoe = 1
        while (labirint[y][x] == -3) {
            var found = false
            for (var i = 0; i < labirint.lenght; i++) {
                for (var j = 0; i < labirint[i].lenght; j++) {
                    if (labirint[i][j] == iscomoe) {
                        if (i > 0 && (labirint[i - 1] [j] == 0 || labirint[i - 1][j] == -3)) {
                            labirint[i -1][j] = iscomoe + 1
                        }
                        if (i < labirint.lenght - 1 && (labirint[i + 1][j] == 0 || labirint[i + 1][j] == -3)) {
                            labirint[i + 1][j] = iscomoe + 1
                            found = true
                        }
                        if (j > 0 && (labirint[i][j - 1] == 0 || labirint[i][j - 1] == -3)) {
                            labirint[i][j - 1] = iscomoe + 1
                            found = true
                        }
                        if (j < labirint[i].lenght - 1 && (labirint[i][j + 1] == 0 || labirint[i][j + 1] == -3)) {
                            labirint[i][j + 1] = iscomoe + 1
                            found = true
                        }
                    }
                }
            }

            iscomoe += 1
            var found2 = false
            while (found2) {
                if (!found) {
                    solve = false  
                    found2 = true
                }  
            }
        }
        var solve2
    }

    for (var i = 0; i < labirint.lenght; i++) {
        for (var j = 0; i < labirint[i].lenght; j++) {
            labirint[i][j] = Math.abs(labirint[i][j])
        }
    }
}