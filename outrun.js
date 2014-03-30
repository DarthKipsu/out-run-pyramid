var fs = require('fs')

fs.readFile(process.argv[2], {'encoding': 'UTF-8'}, function (err, data) {
	if (err) throw err
	
	var dataArray = createDataArray(data)
	var sumArray = createSumArray(dataArray)
	var route = backtrackRoute(sumArray)
	
	console.log(summingItUp(route, dataArray), '=', mostLikes)

	var mostLikes = returnMostLikes(sumArray)[0]
	console.log('Eniten tykkäyksiä:', mostLikes)
})

function createDataArray(data) {
	var dataArray = []
	var lines = data.split('\n')
	for (var i=1; i<lines.length; i++) {
		var lineArrayStrings = lines[i].split(' ')
		var lineArrayDecimals = lineArrayStrings.map(function(value) {
			return parseInt(value, 10)
		})
		dataArray.push(lineArrayDecimals)
	}
	return dataArray
}

function createSumArray(dataArray) {
	var sumArray = []
	sumArray.push(dataArray[0])
	for (var i=1; i<dataArray.length; i++) {
		var map = dataArray[i].map(function(value, index) {
			if (index==0) {
				value += sumArray[i-1][0]
			} else if (index==dataArray[i].length-1) {
				value += sumArray[i-1][index-1]
			} else {
				var sum1 = sumArray[i-1][index-1]
				var sum2 = sumArray[i-1][index]
				value += Math.max(sum1, sum2)
			}
			return value
		})
		sumArray.push(map)
	}
	return sumArray
}

function backtrackRoute(sumArray) {
	var route = []
	var index = returnMostLikes(sumArray)[1]
	route.unshift(index)
	for (var i=sumArray.length-2; i>=0; i--) {
		if (index==0) route.unshift(index)
		else if (index==sumArray[i].length) {
			route.unshift(index-1)
			index -= 1
		} else {
			var sum1 = sumArray[i][index-1]
			var sum2 = sumArray[i][index]
			if (sum1>sum2) {
				route.unshift(index-1)
				index -= 1
			} else route.unshift(index)
		}
	}
	return route
}

function summingItUp(route, dataArray) {
	var sum = ''
	for (var i=0; i<route.length; i++) {
		sum += dataArray[i][route[i]]
		if (i==route.length-1) break
		sum += ' + '
	}
	return sum
}

function returnMostLikes(sumArray) {
	var biggestNumber = 0
	var index = 0
	var sumArrayLastLine = sumArray[sumArray.length-1]
	for (var i=0; i<sumArrayLastLine.length; i++) {
		if (sumArrayLastLine[i]>biggestNumber) {
			biggestNumber = sumArrayLastLine[i]
			index = i
		}
	}
	return [biggestNumber, index]
}
