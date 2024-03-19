const sample_url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
//default dataset and make it a global variable
let dataset = "940";
//make data a global to only fetch it once
let all_data;

//funtion main()
d3.json(sample_url).then(function(data) {
  //console.log(data);
  all_data = data;
  createMenu(all_data.names);
  choseDataset(all_data);
});

function createMenu(names)
{
  //reference to dropdown menu
    const dropdown = document.getElementById("selDataset");

    //iterate through the name list to populate dropdown menu 
    names.forEach(name => 
    {
      //create an option for each id
      let option = document.createElement("option");
      option.value = name;
      option.text = name;
      //populate the dropdown with options
      dropdown.appendChild(option);
    });
}

//update the chosen dataset
function optionChanged(value)
{
  //update the data
  dataset = value;
  //used the global all_data variable instead of calling main() again, so I only need to fetch it once
  choseDataset(all_data);
}

//i can merge it with sample_process maybe? but seperate it would make debugging easier
  function choseDataset(data)
  {
    //is there a better way than looping it?
    for (sample of data.samples)
    {
      if (dataset === sample.id)
      {
        //need the index here to help find the metadata part
        let idx = data.samples.indexOf(sample);
        sampleProcess(sample);
        //console.log(data.metadata[idx]);
        //using data.names to find the index would be more fair, but I did samples first
        createTable(data.metadata[idx]);
        gaugePlot(data.metadata[idx]);
      }
    }
  }

  //this function only handles data.samples
  function sampleProcess(data)
  {
    //combine ids, labels, and values
    let combined = data.otu_ids.map((x,idx) => ({"ids": x, "labels": data.otu_labels[idx], "values": data.sample_values[idx]}));

    //process ploting logics in its own methods
    top10Plot(combined);
    bubble(combined);
  }

  function top10Plot(combined)
  {
     //sort them and find top 10 based on sample_values
     let top10 = combined.sort((a, b) => b.values - a.values).slice(0, 10);
     //console.log(top10)
     //reverse it
     top10.reverse();

    //just ploting stuff
    let trace = 
    {
        y: top10.map(x => "OTU " + x.ids),
        x: top10.map(x => x.values),
        text: top10.map(x => x.labels),
        type: "bar",
        orientation: "h"
    };

    //make the bars look nicer
    let layout = 
    {
        margin: 
        {
            l: 100,
            r: 100,
            t: 50,
            b: 50
        }
    };

    // Render the plot
    Plotly.newPlot("bar", [trace], layout);
  }

function bubble(data)
{
  //sacrifice some memories to make it run slightly faster, since each of the looping map() will be called twice
    let ids = data.map(x => x.ids);
    let values = data.map(x => x.values);

  //ploting stuff
    let trace = 
    {
        x: ids,
        y: values,
        text: data.map(x => x.labels),
        mode: 'markers',
        marker: 
        {
            color: ids,
            size: values
        },
    };

    //no layout looks the best
    let layout = {};
    //render the plot
    Plotly.newPlot('bubble', [trace], layout);
}

function createTable(data)
{
  //reference to the div block from html codes
  let demoCard = document.getElementById("sample-metadata");
  //clear everything every time a new id is selected
  demoCard.innerHTML = ""; 
  //I tried to make a table instead of div at first, but the table looks ugly
  let card = document.createElement("div");

  //for loop to add data
  for (const key in data) 
  {
    //create rows
    let row = document.createElement("p");

    //Add the class to each row. Well I comment it out because it makes it even uglier
    //row.classList.add("card-body"); 

    //add data to each row
    row.textContent = key + ": " + data[key];

    //append row to the div
    card.appendChild(row);
  }
  //append the whole thing to the designed div block
  demoCard.appendChild(card);
}

function gaugePlot(data)
{
  //console.log(data.wfreq)
  let trace = [
  {
    value: data.wfreq, // Replace with the actual frequency value (1-8)
    domain: { x: [0, 1], y: [0, 1] },
    title: { text: "Belly Button Washing Frequency" },
    type: "indicator",
    mode: "gauge+number", // Display only the current value
    gauge: {
      axis: {
        range: [0, 9], // Minimum and maximum values (0-8 for frequency)
        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8], // Values for ticks
        ticktext: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"] // Text labels for ticks (adjusted based on image)
      },
      steps: [
      { range: [0, 2], color: "#D3D3D3" }, // Light gray for 0-2
      { range: [2, 4], color: "#A9A9A9" }, // Dark gray for 2-4
      { range: [4, 6], color: "#7F7F7F" }, // Light black for 4-6
      { range: [6, 8], color: "#595959" }  // Black for 6-8
      ],
    }
  }];
    
  let layout = {
    width: 500, // Gauge width
    height: 500, // Gauge height
    margin: { // Adjust margins around the gauge
      l: 50,
      r: 50,
      t: 50,
      b: 50
    }
  };
    Plotly.newPlot('gauge', trace, layout);
}