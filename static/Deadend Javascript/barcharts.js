

  //Support and helper functions
  /////////////////////////////////////////////////////////////

  /*Create base objects for more controlled data manipulation on the fly
  via a container object and an object to simulate a database for querying*/


  //Container object for JSON records
  function DataBaseObj() {
    this.records = [];
  }


  //Update and aggregation methods added to create an 'array factory'
  DataBaseObj.prototype.add = function(record) {
    this.records.push(record);
  }
  DataBaseObj.prototype.count = function() {
    let recordCount = 0;
    this.records.forEach(function(item, index, array) {
      recordCount += 1;
    })
    return recordCount
  }

  DataBaseObj.prototype.toArray = function(item, unique=false) {

    function createDistint(array) {
      let distinctItems = [...new Set(array)];
      return distinctItems;
    }
    
    let result = this.records.map(function(obj) {
      return obj[item]
    })

    if(unique) {
     let  uniqueResult = createDistint(result);
      return uniqueResult;
    } else {
    return result;
    }
  }

   DataBaseObj.prototype.filterBy = function(prop, condition) {
     if(prop.toUpperCase() !== 'ALL') {
    let result = this.records.filter(function(obj, index) {
      if(obj[prop] === condition) {
        return true;
      }
    })
    return result;
  } else {
    return this.records;
  }
  }
  
  

  //Constructor function to establish schema for all records added to simulated database. This creates a record set with more generalized properties
  function GDP_per_Year(Year, State, GDP_Change, Personal_Dist_Income_Change, Personal_Dist_Income_Per_Capita_Change, Population_Change) {
    this.Year = parseInt(Year);
    this.State = State;
    this.GDP_Change = GDP_Change;
    this.Personal_Dist_Income_Change = Personal_Dist_Income_Change;
    this.Personal_Dist_Income_Per_Capita_Change = Personal_Dist_Income_Per_Capita_Change;
    this.Population_Change = Population_Change;
  }

  GDP_per_Year.prototype.getYearandState = function () {
    return `{ ${this.Year}: ${this.State}}`
  }

  GDP_per_Year.prototype.getState = function () {
    return this.State;
  }

  GDP_per_Year.prototype.getYear = function () {
    return this.Year;
  }

  GDP_per_Year.prototype.convertToArray = function () {
    let items = [];
    for(let item in this) {
      items.push(item);
    }
    return items
  }


  //utility functions for array property management
  function iterArray(array) {
    let arrayItems = [];

    array.forEach(function(item, index, array) {
      arrayItems.push(item, index, array);
    })
      return arrayItems;
  }

  //...
  function createDistint(array) {
    let distinctItems = [];
    distinctItems = [...new Set(array)];
    return distinctItems;
  }

      
//Initial JSON data wrangler executed after successful API response to coerce records into D3 'friendly' structure
function convertPlotData(data){
  var convertedData = [];
  for(var i in data[Object.keys(data)[0]]){
    var convertedDatum = {};
    for(var key in data){
      convertedDatum[`${i}: ${key}`] = data[key][i];
    }
    convertedData.push(convertedDatum);
  }
  return convertedData;
}

//factory function to dynamically create and output arrays needed for chart visuals 
function xyMetrics(xMetric, yMetric, stateRegion, startYear, endYear, dbObj) {
  let legalXMetric = xMetric.replace(' ', '_');
  let legalYMetric = yMetric.replace(' ', '_');

  let yearArray = dbObj.filterBy('all', true);
  let startArray = yearArray.filter(function(year, index) {
    if(yearArray[index].Year >= startYear) {
      return true;
    }
  })
  let period = startArray.filter(function(year, index) {
    if(startArray[index].Year <= endYear) {
      return true;
    }
  })
  let regionPeriod = period.filter(function(state, index) {
    if(period[index].State === stateRegion) {
      return true;
    }
  })
  let finalXMetrics = regionPeriod.map(function(metrics, index, array) {
    return array[index][legalXMetric]
  })

  let finalYMetrics = regionPeriod.map(function(metrics, index, array) {
    return array[index][legalYMetric];

  })

  let  metricPeriod = regionPeriod.map(function(metrics, index, array) {
    return array[index]['Year'];
  })

  let  metricRegion = regionPeriod.map(function(metrics, index, array) {
    return  array[index]['State'];
  })



  return [finalXMetrics, finalYMetrics, metricPeriod, metricRegion];
};

//tinker function, not used in chart 
function getScale(finalMetrics) {
  let length = finalMetrics.length;
  finalMetrics.sort(function(a, b) {
    return a - b;
  });
 
  let firstQuartile = (length % 2 !== 0) ? d3.min(finalMetrics.slice(0, (length-1)/2)): d3.min(finalMetrics.slice(0, (length-1)/2)-1);
  let secondQuartile = (length % 2 !== 0) ? d3.max(finalMetrics.slice(0, (length-1)/2)): d3.max(finalMetrics.slice(0, (length-1)/2)-1);
  let thirdQuartile = (length % 2 !== 0) ? d3.min(finalMetrics.slice((length-1)/2, length)): d3.min(finalMetrics.slice((length-1)/2)-1, length);
  let fourthQuartile = (length % 2 !== 0) ? d3.max(finalMetrics.slice((length-1)/2, length)): d3.max(finalMetrics.slice((length-1)/2)-1, length);
  let scale = [firstQuartile, secondQuartile, thirdQuartile, fourthQuartile];
  return scale
};

//API Call and Plotting Logic
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

//Primary API call
var url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3058724/main.json';
d3.json(url).then(function(data) {
  console.log(data);

  //convert raw JSON to a more manageable structure
  let cvtData = convertPlotData(data);


  //Capture primary and secondary keys of data set
  let yearKeys = Object.keys(data);
  let stateKeys = [];
  for(let prop in Object.values(data)[0]) {
    stateKeys.push(prop)
  }

  let metricItems = [
    'GDP Change',
    'Personal Dist Income Change',
    'Personal Dist Income Per Capita Change',
    'Population Change'
  ]
  




  //Initialize Database object in preparation data record submission
  let gdpDB = new DataBaseObj();

  //Looping JSON to capture data elements in predefined schema
  stateKeys.forEach(function(stateItem, stateIndex) {
    let state = stateItem
    yearKeys.forEach(function(yearItem) {
      let year = yearItem
      let gdp_Change;
      let personal_Dist_Income_Change;
      let personal_Dist_Income_Per_Capita_Change;
      let population_Change;

      gdp_Change = cvtData[stateIndex][`${stateItem}: ${yearItem}`]['GDP Change'];
      personal_Dist_Income_Change = cvtData[stateIndex][`${stateItem}: ${yearItem}`]['Personal Dist Income Change'];
      personal_Dist_Income_Per_Capita_Change = cvtData[stateIndex][`${stateItem}: ${yearItem}`]['Personal Dist Income Per Capita Change'];
      population_Change = cvtData[stateIndex][`${stateItem}: ${yearItem}`]['Population Change'];

      //Instantiate a data record object to submit to our database
      let gdpRecord = new GDP_per_Year(year, state, gdp_Change, personal_Dist_Income_Change, personal_Dist_Income_Per_Capita_Change, population_Change);


      //Using freeze method to prevent object mutability side-effects during 'Extract and Transform' process priopr to adding record to database
      gdpRecord = Object.freeze(gdpRecord);
      gdpDB.add(gdpRecord);

        
      })


  
})



let [myXMetric, myYMetric, timeLbls, regionLbls] = xyMetrics('Population Change','GDP Change', 'Wyoming', 2004, 2013, gdpDB);



console.log(myXMetric);
console.log(myYMetric);
console.log(timeLbls);
console.log(regionLbls);
let charts = [];
 charts.push(new CreateXYScatter(myXMetric, myYMetric, 'Population Change', 'GDP Change',
 'yellow', 'blue', timeLbls, '#chart', width=1000, height=700, mTop=30, mRight=40,
  mBottom=100, mLeft=100, xyMetrics, gdpDB, gdpDB, [yearKeys, stateKeys], metricItems));
  console.log(charts)

xyScatter
CreateXYScatter
////Plotting Set-Up and Drawing Functions
/////////////////////////////////////////

function CreateXYScatter(xData, yData, xMetric, yMetric, xColor, yColor, toolTipData, elemID, width=1000, height=700, mTop=30, mRight=40, mBottom=100, mLeft=100, supportFunc, dbObj, schema, keyArray, metricArray) {
// Set up our chart
this.xData = xData
this.yData = yData;
this.xMetric = xMetric;
this.yMetric = yMetric;
this.xColor = xColor;
this.yColor = yColor;
this.toolTipData = toolTipData;
this.elemID = elemID;
this.margin = {
  top : mTop,
  right: mRight,
  bottom: mBottom,
  left: mLeft
}
this.width = width;
this.height = height;
this.supportFunc =supportFunc;
this.dbObj = dbObj;
this.schema = schema;
this.keyArray = keyArray;
this.metricArray = metricArray;
this.isSelected = false;

}


CreateXYScatter.prototype.getXData = function(xMetric, yMetric, stateRegion, startYear, endYear) {
  let [xArray, yArray] = xyMetrics(xMetric, yMetric, stateRegion, startYear, endYear, this.dbObj)
  return [xArray, yArray];
}


// Create an SVG wrapper, append an svg that will hold our chart and shift the latter by left and top margins
CreateXYScatter.prototype.createWrapper = function() {
  let svg;
 svg = d3.select(this.elemID)
        .append('svg')
        .attr('height', this.height)
        .attr('width', this.width)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})` );

  let chart = svg.append('g');
  return chart;
} 


CreateXYScatter.prototype.dataTip = function(opacity=0) {
  let labelData = this.toolTipData
  d3.select(this.elemID)
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", opacity);

  d3.tip(labelData)
    .attr("class", "tooltip")
    // Define position
    .offset([20, -40])
    .html(function(d) {
      return d;
  });
  
}


CreateXYScatter.prototype.xScale = function() {
  d3.scaleLinear().range([0, CreateXYScatter.prototype.width]);
}


CreateXYScatter.prototype.yScale = function() {
  d3.scaleLinear().range([CreateXYScatter.prototype.height, 0]);
}


CreateXYScatter.prototype.xAxis = function() {
  d3.axisBottom().scale(this.xScale);
}


CreateXYScatter.prototype.yAxis = function() {
  d3.axisLeft().scale(this.yScale);
}


CreateXYScatter.prototype.xMin = function() {
 let xMin = d3.min(this.xData, function(d)
   {return d * 0.8;})
  return xMin; 
}


CreateXYScatter.prototype.xMax = function() {
  let xMax =d3.max(this.xData, function(d)
   {return d * 0.2;})
   return xMax;
}


CreateXYScatter.prototype.yMin = function() {
  let yMin = d3.min(this.yData, function(d) {
    return d;
  })
  return yMin;
}


CreateXYScatter.prototype.yMax = function() {
  let yMax = d3.max(this.yData, function(d) {
    return d;
  })
  return yMax;
}


CreateXYScatter.prototype.setDefaultXMetric = function() {
  let defaultXMetric = 'Population Change';
  if(!(this.xMetric) || !(this.yMetric) || !(this.yData) || !(this.xData)) {
     defaultXMetric
  }
}


CreateXYScatter.prototype.setDefaultYMetric = function() {
  let defaultXMetric = 'GDP Change';
  if(!(this.xMetric) || !(this.yMetric)) {
    return defaultXMetric;
  }
}

CreateXYScatter.prototype.setDomain = function() {
  this.xScale.domain([this.xMin, this.xMax]);
  this.yScale.domain([this.yMin, this.yMax])
}


CreateXYScatter.prototype.defineChart = function() {
  d3.selectAll("circle")
        .data(this.dbObj) 
        .enter()
        .append("circle")
        .attr('id', 'marker')
        .attr("cx", function (d) {
            return xScale(d['Population Change']);
        })
        .attr("cy", function (d) {
            return yScale(d['GDP Change']);
        })
        .attr("r", 12)
        // display tooltip on click
        .on("mouseover", function (d) {
            toolTip.show(d);
        })
        // hide tooltip on mouseout
        .on("mouseout", function (d) {
            toolTip.hide(d);
        });
}

 CreateXYScatter.prototype.createText = function() {
    d3.selectAll("text")
        .data(this.keyArray)
        .enter()
        .append("text")
        .text(function (d) {
            return d.abbr;
        })
        .attr("x", function (d) {
            return xScale(d[defaultAxisLabelX]);
        })
        .attr("y", function (d) {
            return yScale(d[defaultAxisLabelY]);
        })
        .attr("font-size", "8px")
        .attr("font-weight", "600")
        .attr("text-anchor", "middle")
        .attr("class","stateText")

        // display tooltip on click
        .on("mouseover", function (d) {
            toolTip.show(d);
        })
        // hide tooltip on mouseout
        .on("mouseout", function (d, i) {
            toolTip.hide(d);
        });
 }

 CreateXYScatter.prototype.createXAxis = function() {
   d3.append("g")
   .attr("class", "x-axis")
   .attr("transform", `translate(0,${this.height})`)
   .attr("stroke-width", "thick")
   .call(this.xAxis);
 }



CreateXYScatter.prototype.createYAxis = function() {
d3.append("g")
   .attr("class", "y-axis")
   .attr("stroke-width", "thick")
   .call(this.yAxis);
} 


CreateXYScatter.prototype.createXAxisTitles = function() {
    d3.append("text")
        .attr("transform", `translate(${width / 2},${height + 40})`)
        // This axis label is active by default
        .attr("class", "axis-text-x active")
        .attr("data-axis-name", `${this.xMetric}`)
        //.text("Median Poverty Level %");
}


    // add y-axis titles 
CreateXYScatter.prototype.createXAxisTitles = function() {
      d3.append('text')
        .attr("transform", `translate(-40,${height / 2})rotate(270)`)
        .attr("class", "axis-text-y active")
        .attr("data-axis-name", `${this.yMetric}`)
        //.text("Median Obesity Level %");
    }
CreateXYScatter.prototype.xAxisOnClick = function() {
  d3.selectAll(".axis-text-x").on("click", function () {

    // assign the variable to the current axis
    var clickedSelection = d3.select(this);
    var isClickedSelectionInactive = clickedSelection.classed("inactive");
    console.log("this axis is inactive", isClickedSelectionInactive);
    var clickedAxis = clickedSelection.attr("data-axis-name");
    console.log("current axis: ", clickedAxis);

    if (isClickedSelectionInactive) {
        currentAxisLabelX = clickedAxis;

        findMinAndMaxX(currentAxisLabelX);

        xScale.domain([xMin, xMax]);

        // create x-axis
        svg.select(".x-axis")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(xAxis);

        d3.selectAll("circle")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .on("start", function () {
                d3.select(this)
                    .attr("r", 18);

            })
            .attr("cx", function (d) {
                return xScale(d[currentAxisLabelX]);
            })
            .on("end", function () {
                d3.select(this)
                    .transition('fade')
                    .duration(500)
                    .attr("r", 12)
                    .style("fill", "#1f77b4");
            });

        d3.selectAll(".stateText")
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("x", function (d) {
                    return xScale(d[currentAxisLabelX]);
                });
                
        

        labelChangeX(clickedSelection);
    }
});
}

CreateXYScatter.prototype.yAxisOnClick = function() {

  d3.selectAll(".axis-text-y").on("click", function () {

    // assign the variable to the current axis
    var clickedSelection = d3.select(this);
    var isClickedSelectionInactive = clickedSelection.classed("inactive");
    var clickedAxis = clickedSelection.attr("data-axis-name");
    if (isClickedSelectionInactive) {
        currentAxisLabelY = clickedAxis;

        findMinAndMaxY(currentAxisLabelY);

        yScale.domain([yMin, yMax]);

        // create y-axis
        svg.select(".y-axis")
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .call(yAxis);

        d3.selectAll("circle")
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .on("start", function () {
                d3.select(this)
                    .attr("r", 18);

            })
            .attr("cy", function (data) {
                return yScale(data[currentAxisLabelY]);
            })
            .on("end", function () {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("r", 12);
            });

        d3.selectAll(".stateText")
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attr("y", function (d) {
                return yScale(d[currentAxisLabelY]);
            });

        labelChangeY(clickedSelection);

    }

});

}

CreateXYScatter.prototype.renderChart = function () {

  this.createWrapper();
  this.dataTip();
  this.xScale();
  this.yScale();
  this.xAxis();
  this.yAxis();
  this.xMin();
  this.xMax();
  this.yMin();
  this.yMax();
  this.setDomain();
  this.defineChart();
  this.createText();
  this.createXAxis();
  this.createYAxis();
  this.createXAxisTitles();
  this.xAxisOnClick();
  this.yAxisOnClick();
}


});
