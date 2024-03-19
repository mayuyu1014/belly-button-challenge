# belly-button-challenge (Bonus codes added in app.js)

# Data inspection and logic design

* Inspect the data by doing an API call
* Found out the categories that are needed for each duty
* The top 10 chart and bubble charted need the data.samples
* The demographic info and gauge chart need the data.metadata
* Values in data.names are also include in data.samples and data.metadata as IDs
* The very first task should be creating a drop down list that contains all the IDs

# Drop down menu creation

* Pass the data.names to createMenu function
* Iterate through the data.names to create an option for each of the name
* And append each option to the dropdown menu

# Define dataset and implement optionChanged()

* Define a global dataset variable and hold "940" as the default ID
* Define a global variable to hold the data so it is only needed to be fetched once
* Implement the optionChanged() from html code
* Everytime the optionChanged() is called, reset the dataset value to the user's selection
* We pass the global data variable in this function to reuse the data instead of fetching them again

# Choose the correct data based on the chosen dataset

* Using a loop to find the match dataset
* Find the index of the corresponding name and use that index to find out the corresponding data from data.metadata
* Pass the selected data to the next functions

# Processing data

* Since the data.samples contains three lists of data, they need to be combined to an object to be useful
* Pass the combined data to ploting functions

# Ploting

* Using the received data to plot things.
* The demographic info is a newly creatly div to display all the data.
* The demographic info can be further modified with better styling.
* The gauge plot can be further improved.